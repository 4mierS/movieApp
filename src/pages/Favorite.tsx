import React, { useEffect, useState, useRef } from "react"
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
} from "@ionic/react"
import { heart, sadOutline } from "ionicons/icons"
import { useList } from "../components/Lists"

/**
 * Die Komponente Favorite zeigt die favorisierten Filme an.
 *
 * @return {*}
 */
const Favorite: React.FC = () => {
  const { favorites, toggleItem } = useList()

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Favorites</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
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
            <div className="centered-div">
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
      </IonContent>
    </IonPage>
  )
}

export default Favorite
