import React, { useEffect, useState, useRef } from "react";
import {
  IonAvatar,
  IonButton,
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
import { chevronUpCircleOutline, heart, sadOutline } from "ionicons/icons";
import { useList } from "../components/Lists";

const Favorite: React.FC = () => {
  const { favorites, toggleItem, isInList } = useList();

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
  }, [favorites]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Favorites</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent ref={contentRef}>
        <IonList>
          {favorites.length > 0 ? (
            favorites.map((fav) => (
              <IonItem key={fav.imdbID}>
                <IonAvatar slot="start">
                  <IonImg alt="MovieImage" src={fav.Poster} />
                </IonAvatar>
                <h3>{fav.Title}</h3>
                <IonLabel slot="end">{fav.Year}</IonLabel>
                <IonButton
                  shape="round"
                  slot="end"
                  onClick={() => toggleItem(fav, "favorites")}
                >
                  <IonIcon slot="icon-only" icon={heart}></IonIcon>
                </IonButton>
              </IonItem>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                paddingTop: "50px",
                justifyContent: "center",
              }}
            >
              <IonIcon
                icon={sadOutline}
                color="danger"
                style={{ fontSize: "60px" }}
              />
              <IonLabel>
                <h2>No favorites added yet</h2>
              </IonLabel>
            </div>
          )}
        </IonList>
        {isContentScrollable == true ? (
          <IonItem>
            <IonButton onClick={scrollToTop} slot="end" color={"secondary"}>
              <IonIcon icon={chevronUpCircleOutline} slot="icon-only" />
            </IonButton>
          </IonItem>
        ) : null}
      </IonContent>
    </IonPage>
  );
};

export default Favorite;
