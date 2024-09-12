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
import { useList } from "../components/Lists";

const Watchlist: React.FC = () => {
    const { watchlist, toggleItem, isInList } = useList();
  
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
                        watchlist.map((list, index) => (
                            <IonItem key={index}>
                                <IonAvatar slot="start">
                                    <IonImg src={list.Poster}></IonImg>
                                </IonAvatar>
                                <IonLabel className="ion-text-wrap">
                                    {list.Title}
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