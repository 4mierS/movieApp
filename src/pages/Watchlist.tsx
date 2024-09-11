import React, { useEffect, useState, useRef } from "react";
import {
  IonAvatar,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {  sadOutline } from "ionicons/icons";

interface WatchlistProps {
    imdbID: string;
    Title: string;
    Year: string;
    Poster: string;
    Type: string;
    }

interface WatchlistState {
    watchlist: WatchlistProps[];
    isWatchlist: (imdbID: string) => boolean;
    toggleWatchlist: (watchlist: WatchlistProps) => void;
}

const WatchlistContext = React.createContext<WatchlistState>({
    watchlist: [],
    isWatchlist: () => false,
    toggleWatchlist: () => {},
});

export const useWatchlist = () => {
    return React.useContext(WatchlistContext);
};

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [watchlist, setWatchlist] = React.useState<WatchlistProps[]>(() => {
        const storedWatchlist = localStorage.getItem("watchlist");
        return storedWatchlist ? JSON.parse(storedWatchlist) : [];
    });

    const isWatchlist = (imdbID: string) => {
        return watchlist.some((fav) => fav.imdbID === imdbID);
    };

    const toggleWatchlist = (watchlist: WatchlistProps) => {
        if (isWatchlist(watchlist.imdbID)) {
            setWatchlist((prev) => {
                const newWatchlist = prev.filter(
                    (fav) => fav.imdbID !== watchlist.imdbID
                );
                localStorage.setItem("watchlist", JSON.stringify(newWatchlist));
                return newWatchlist;
            });
        } else {
            setWatchlist((prev) => {
                const newWatchlist = [...prev, watchlist];
                localStorage.setItem("watchlist", JSON.stringify(newWatchlist));
                return newWatchlist;
            });
        }
    };

    return (
        <WatchlistContext.Provider value={{ watchlist, isWatchlist, toggleWatchlist }}>
            {children}
        </WatchlistContext.Provider>
    );
};

const Watchlist: React.FC = () => {
    const { watchlist, toggleWatchlist } = useWatchlist();
  
    const contentRef = useRef<IonContent>(null);
    const [isContentScrollable, setIsContentScrollable] = useState(false);
  
    const scrollToTop = () => {
      contentRef.current?.scrollToTop(500); 
    };
  
    const checkScrollable = () => {
      if (contentRef.current) {
        contentRef.current.getScrollElement().then((el) => {
          const scrollHeight = el.scrollHeight;
          const offsetHeight = el.offsetHeight;
          setIsContentScrollable(scrollHeight - 1 > offsetHeight); 
        });
      }
    };
  
    useEffect(() => {
    
      const timer = setTimeout(() => {
        checkScrollable();
      }, 200);
  
      return () => clearTimeout(timer); 
    }, []);
  
    useEffect(() => {
      checkScrollable(); 
    }, [watchlist]);
  

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Watchlist</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    {watchlist.length > 0 ? (
                        watchlist.map((watchlist, index) => (
                            <IonItem key={index}>
                                <IonAvatar slot="start">
                                    <IonImg src={watchlist.Poster}></IonImg>
                                </IonAvatar>
                                <IonLabel className="ion-text-wrap">
                                    {watchlist.Title}
                                </IonLabel>
                            </IonItem>
                        ))
                    ) : (
                        <IonItem>
                            <IonIcon icon={sadOutline} slot="start" />
                            <IonLabel>No movies in your watchlist</IonLabel>
                        </IonItem>
                    )}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Watchlist;