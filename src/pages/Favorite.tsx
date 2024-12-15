import React, { useEffect, useState, useRef } from "react"
import {
  IonAvatar,
  IonButton,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react"
import { heart, sadOutline } from "ionicons/icons"
import { useList } from "../components/Lists"
import { isPlatform } from "@ionic/react"
import "./Home.css"

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
          {isPlatform("desktop") ? (
            <IonGrid>
              <IonRow className="ion-justify-content-center">
                <h1 id="desktop-header-1">Favorite</h1>
              </IonRow>
            </IonGrid>
          ) : (
            <IonTitle>Favorite</IonTitle>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {favorites.length > 0 ? (
            favorites.map((fav) => (
              <IonItem
                button
                routerLink={`/movies/${fav.imdbID}`}
                key={fav.imdbID}
              >
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
            <IonGrid className="ion-align-items-end" fixed={true}>
              <IonRow className="ion-justify-content-center ion-padding">
                <IonIcon
                  icon={sadOutline}
                  color="danger"
                  style={{ fontSize: "60px" }}
                />
              </IonRow>
              <IonRow className="ion-justify-content-center ion-padding">
                <IonLabel>
                  <h2>No favorites added yet</h2>
                </IonLabel>
              </IonRow>
            </IonGrid>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default Favorite
