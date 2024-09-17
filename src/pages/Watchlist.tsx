import React, { useEffect, useState, useRef } from "react";
import {
  IonAlert,
  IonAvatar,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { heart, heartOutline, sadOutline } from "ionicons/icons";
import { useList } from "../components/Lists";
import { Style } from "@capacitor/status-bar";

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

  //FIXME: Github Issue #7
  //TODO: Implement the incrementSeasonCounter and incrementEpisodeCounter functions
  // Function to handle season counter increment
  const incrementSeasonCounter = (item: any) => {
    if (item.SeasonCounter === undefined) {
      item.SeasonCounter = 1;
    } else {
      item.SeasonCounter += 1;
    }
    // You might need to update the state here if necessary
  };

  // Function to handle episode counter increment
  const incrementEpisodeCounter = (item: any) => {
    if (item.EpisodeCounter === undefined) {
      item.EpisodeCounter = 1;
    } else {
      item.EpisodeCounter += 1;
    }
    // You might need to update the state here if necessary
  };

  const handleIonSwipe = () => {
    console.log("Swiped");
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Watchlist</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList lines="inset">
          {watchlist.length > 0 ? (
            watchlist.map((list, index) => (
              <IonItemSliding key={index}>
                <IonItemOptions  side="start" onIonSwipe={() => {handleIonSwipe()}}>
                  <IonItemOption
                    expandable
                    onClick={() => {
                      incrementSeasonCounter(list);
                    }}
                  >
                    <IonIcon
                      slot="icon-only"
                      size="small"
                      icon={
                        isInList(list.imdbID, "favorites")
                          ? heart
                          : heartOutline
                      }
                    />
                  </IonItemOption>
                </IonItemOptions>
                <IonItem>
                  <IonAvatar slot="start">
                    <IonImg src={list.Poster}></IonImg>
                  </IonAvatar>
                  <IonGrid>
                    <IonRow>
                      <IonCol>
                        <IonLabel className="ion-text-wrap">
                          {list.Title}
                        </IonLabel>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol size="auto">
                        <IonLabel>
                          {list.SeasonCounter !== undefined
                            ? `Seasons: ${list.SeasonCounter}`
                            : ""}
                        </IonLabel>
                      </IonCol>
                      <IonCol size="auto">
                        <IonLabel>
                          {list.EpisodeCounter !== undefined
                            ? `Episodes: ${list.EpisodeCounter}`
                            : ""}
                        </IonLabel>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonItem>
                <IonItemOptions>
                  <IonItemOption
                    expandable
                    onClick={() => {
                      incrementEpisodeCounter(list);
                    }}
                  >
                    <IonIcon
                      slot="icon-only"
                      size="small"
                      icon={
                        isInList(list.imdbID, "favorites")
                          ? heart
                          : heartOutline
                      }
                    />
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            )).toReversed()
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