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
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { addOutline } from "ionicons/icons";

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
 * Die Komponente RandomSearch zeigt einen zufälligen Film oder Serie nach Genre an.
 *
 * @return {*}
 */
const RandomSearch: React.FC = () => {
  const [type, setType] = useState<string | null>("action");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [randomMovie, setRandomMovie] = useState<{
    title: string;
    cast: string[];
    overview: string;
    nextCursor?: string | null;
  } | null>(null);

  const fetchData = async (
    country: string,
    genres: string[],
    orderBy: string = "rating",
    orderDirection: string = "desc",
    nextCursor: string | null = null
  ) => {
    // Erstelle die Basis-URL
    const baseUrl =
      "https://streaming-availability.p.rapidapi.com/shows/search/filters";

    const params = new URLSearchParams({
      country: country,
      genres: genres.join(","),
      order_by: orderBy,
      order_direction: orderDirection,
      rating_min: "60",
    });

    const url = `${baseUrl}?${params.toString()}`;

    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": import.meta.env.VITE_TMDB_API_KEY,
        "x-rapidapi-host": "streaming-availability.p.rapidapi.com",
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        return data;
      } else {
        console.error(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    return null;
  };

  const showRandomMovie = () => async () => {
    try {
      const data = await fetchData("DE", selectedGenres);
      if (data && data.shows && Array.isArray(data.shows)) {
        const randomIndex = Math.floor(Math.random() * data.shows.length);
        const randomShow = data.shows[randomIndex];
        setRandomMovie({
          title: randomShow.title,
          cast: randomShow.cast,
          overview: randomShow.overview,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const addGenre = () => {
    if (type && selectedGenres.length < 3) {
      setSelectedGenres([...selectedGenres, type]);
      setType(null);
    }
  };

  const removeGenre = (genre: string) => {
    setSelectedGenres(selectedGenres.filter((g) => g !== genre));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Random</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonLabel>
            <IonItem>
              Select Genre
              <IonItem>
                <IonSelect
                  value={type}
                  onIonChange={(e: CustomEvent) => setType(e.detail.value!)}
                >
                  {genres
                    .filter((genre) => !selectedGenres.includes(genre))
                    .toSorted()
                    .map((genre) => (
                      <IonSelectOption key={genre} value={genre}>
                        {genre.charAt(0).toUpperCase() + genre.slice(1)}
                      </IonSelectOption>
                    ))}
                </IonSelect>
              </IonItem>
            </IonItem>
          </IonLabel>
          <IonButton
            shape="round"
            fill="outline"
            onClick={addGenre}
            disabled={!type || selectedGenres.length >= 3} // Button deaktivieren, wenn keine Genres mehr ausgewählt werden können
            slot="end"
          >
            <IonIcon slot="icon-only" icon={addOutline} />
          </IonButton>
        </IonItem>
        {selectedGenres.length > 0 && (
          <IonItem>
            <IonLabel>Selected Genres:</IonLabel>
            {selectedGenres.map((genre) => (
              <IonButton
                key={genre}
                shape="round"
                fill="outline"
                onClick={() => removeGenre(genre)}
              >
                {genre}
              </IonButton>
            ))}
          </IonItem>
        )}
        {randomMovie ? (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{randomMovie?.title}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonCardSubtitle>{randomMovie?.cast}</IonCardSubtitle>
              {randomMovie?.overview}
            </IonCardContent>
          </IonCard>
        ) : (
          <IonItem>
            <IonSpinner />
            <IonItem>
              <IonText>
                <p>Versuche es mit einer anderen Suche</p>
              </IonText>
            </IonItem>
          </IonItem>
        )}
        <IonButton shape="round" fill="outline" onClick={showRandomMovie()}>
          Search
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default RandomSearch;
