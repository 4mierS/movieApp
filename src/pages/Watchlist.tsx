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

/**
 * Die Komponente Watchlist zeigt die Filme in der Watchlist an.
 *
 * @return {*}
 */
const Watchlist: React.FC = () => {
  const { watchlist, handleCounterClick, isInList } = useList();

  const contentRef = useRef<IonContent>(null);
  const [isContentScrollable, setIsContentScrollable] = useState(false);

  /**
   * Scrollt zum Anfang der Liste.
   *
   * @returns {void}
   */
  const scrollToTop = () => {
    contentRef.current?.scrollToTop(500);
  };

  /**
   * Überprüft, ob die Liste scrollbar ist.
   *
   * @returns {void}
   */
  const checkScrollable = () => {
    if (contentRef.current) {
      contentRef.current.getScrollElement().then((el: HTMLElement) => {
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
  /**
   * Funktion zum Behandeln des IonSwipe-Events.
   *
   */
  const handleIonSwipe = () => {
    console.log("Swiped");
  };

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
            watchlist
              .map((list, index) => (
                <IonItemSliding key={index}>
                  <IonItemOptions
                    side="start"
                    onIonSwipe={() => {
                      handleCounterClick(list, "SeasonCounter", "decrement");
                    }}
                  >
                    <IonItemOption
                      expandable
                      onClick={() => {
                        handleCounterClick(list, "SeasonCounter", "increment");
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
                  <IonItemOptions
                    onIonSwipe={() => {
                      handleCounterClick(list, "EpisodeCounter", "decrement");
                    }}
                  >
                    <IonItemOption
                      expandable
                      onClick={() => {
                        handleCounterClick(list, "EpisodeCounter", "increment");
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
              ))
              .toReversed()
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
