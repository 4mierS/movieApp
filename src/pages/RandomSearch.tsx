import {
  IonAlert,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { Genre } from "../hooks/imdbAPI";

export const genres = [
  "action",
  "adventure",
  "animation",
  "comedy",
  "drama",
  "horror",
  "romance",
  "sci-fi",
  "thriller",
  "western",
  "fantasy",
  "crime",
  "documentary",
  "family",
  "history",
  "mystery",
  "music",
  "war",
  "news",
  "reality",
  "talk",
];

/**
 * Die Komponente RandomSearch zeigt einen zufälligen Film nach Genre an.
 *
 * @return {*}
 */
const RandomSearch: React.FC = () => {
  const [randomMovie, setRandomMovie] = useState<{
    title: string;
    cast: string[];
    description: string;
  } | null>(null);

  const [type, setType] = useState<string>("action");


  const alerted = (type: string) => () => {
    console.log(type);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Random</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {randomMovie ? (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{randomMovie?.title}</IonCardTitle>
              <IonCardSubtitle>{randomMovie?.cast}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>{randomMovie?.description}</IonCardContent>
          </IonCard>
        ) : (
          <IonSpinner />
        )}
        <IonItem>
          <IonLabel>
            Select Genre
            <IonSelect value={type} onIonChange={(e: CustomEvent) => setType(e.detail.value!)}>
              {genres.toSorted().map((genre) => (
                <IonSelectOption key={genre} value={genre}>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonLabel>
        </IonItem>
        <IonButton shape="round" fill="outline" onClick={alerted(type)}>
          Search
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default RandomSearch;
