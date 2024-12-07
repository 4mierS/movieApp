import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonSkeletonText,
  IonSpinner,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react"
import React, { useState } from "react"
import { addOutline, removeOutline } from "ionicons/icons"
import SkeletonItem from "../components/SkeletonItem"

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
]

const RandomSearch: React.FC = () => {
  const [type, setType] = useState<string | null>("action")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [randomMovie, setRandomMovie] = useState<
    {
      title: string
      cast: string[]
      overview: string
      rating: number
    }[]
  >([])
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [loaded, setLoaded] = useState<boolean>(false)

  const MAX_LENGTH = 100

  const truncateText = (text: string, isExpanded: boolean) => {
    if (isExpanded || text.length <= MAX_LENGTH) {
      return text
    }
    return `${text.substring(0, MAX_LENGTH)}...`
  }

  /**
   * Ruft die Daten für die zufällige Suche ab
   * @param country Land, für das die Suche durchgeführt werden soll
   * @param genres Genres, die für die Suche verwendet werden sollen
   * @param orderBy Sortierkriterium
   * @param orderDirection Sortierreihenfolge
   * @returns void
   * */
  const fetchData = async (
    country: string,
    genres: string[],
    orderBy: string = "rating",
    orderDirection: string = "desc"
  ) => {
    const baseUrl =
      "https://streaming-availability.p.rapidapi.com/shows/search/filters"

    const params = new URLSearchParams({
      country,
      genres: genres.join(","),
      order_by: orderBy,
      order_direction: orderDirection,
      rating_min: "60",
    })

    const url = `${baseUrl}?${params.toString()}`

    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": import.meta.env.VITE_TMDB_API_KEY,
        "x-rapidapi-host": "streaming-availability.p.rapidapi.com",
        "Content-Type": "application/json",
      },
    }

    try {
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        console.error(`Error: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error("An error occurred:", error)
    }
    return null
  }

  /**
   * Sucht einen zufälligen Film basierend auf den ausgewählten Genres
   * @returns void
   * */
  const showRandomMovie = async () => {
    setLoaded(false)
    try {
      const data = await fetchData("DE", selectedGenres)
      if (data && data.shows && Array.isArray(data.shows)) {
        setRandomMovie(data.shows)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
    setLoaded(true)
  }

  /**
   * Fügt ein Genre zur Liste der ausgewählten Genres hinzu
   * @param genre Genre, das hinzugefügt werden soll
   * @returns void
   * */
  const addGenre = (genre: string) => {
    if (genre && selectedGenres.length < 3) {
      setSelectedGenres([...selectedGenres, genre])
    }
  }

  /**
   * Behandelt die Auswahl eines Genres
   * @param e CustomEvent
   * @returns void
   * */
  const handleGenreChange = (e: CustomEvent) => {
    const selectedGenre = e.detail.value
    setType(selectedGenre)
    addGenre(selectedGenre)
  }

  /**
   * Entfernt ein Genre aus der Liste der ausgewählten Genres
   * @param genre Genre, das entfernt werden soll
   * @returns void
   * */

  const removeGenre = (genre: string) => {
    setSelectedGenres(selectedGenres.filter((g) => g !== genre))
  }

  const ratingColor = (rating: number) => {
    if (rating >= 80) {
      return "success"
    } else if (rating >= 60) {
      return "warning"
    } else {
      return "danger"
    }
  }

  const ratingTo10 = (rating: number) => {
    return (rating / 10).toFixed(1)
  }

  const randomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {isPlatform("desktop") ? (
            <IonGrid>
              <IonRow className="ion-justify-content-center">
                <h1 id="desktop-header-1">Random</h1>
              </IonRow>
            </IonGrid>
          ) : (
            <IonTitle>Random</IonTitle>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonSelect
            value={type}
            onIonChange={handleGenreChange}
            placeholder="Select Genre"
            disabled={selectedGenres.length >= 3}
          >
            {genres
              .filter((genre) => !selectedGenres.includes(genre))
              .sort()
              .map((genre) => (
                <IonSelectOption key={genre} value={genre}>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </IonSelectOption>
              ))}
          </IonSelect>
        </IonItem>
        {selectedGenres.length > 0 && (
          <IonItem>
            {selectedGenres.map((genre) => (
              <IonButton
                key={genre}
                shape="round"
                fill="outline"
                onClick={() => removeGenre(genre)}
              >
                <IonLabel>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </IonLabel>
                <IonLabel>
                  <IonIcon color="danger" icon={removeOutline} />
                </IonLabel>
              </IonButton>
            ))}
          </IonItem>
        )}
        <IonButton
          className="ion-padding"
          expand="block"
          shape="round"
          fill="outline"
          onClick={showRandomMovie}
        >
          Search
        </IonButton>

        {!loaded ? (
          <IonList>
            {[...Array(5)].map((_, index) => (
              <React.Fragment key={index}>
                <IonListHeader>
                  <IonSkeletonText
                    animated={true}
                    style={{ width: `${randomNumber(40, 80)}px` }}
                  />
                </IonListHeader>
                <SkeletonItem
                  width1={`${randomNumber(0, 100)}%`}
                  width2={`${randomNumber(0, 100)}%`}
                  width3={`${randomNumber(0, 100)}%`}
                />
              </React.Fragment>
            ))}
          </IonList>
        ) : randomMovie.length > 0 ? (
          randomMovie.map((movie, index) => {
            const isExpanded = expandedCard === movie.title
            return (
              <IonCard
                key={`${movie.title}-${index}`}
                onClick={() => setExpandedCard(isExpanded ? null : movie.title)}
              >
                <IonGrid>
                  <IonCardHeader>
                    <IonRow className="ion-align-items-start ion-justify-content-between">
                      <IonCol size="8">
                        <IonCardTitle>{movie.title}</IonCardTitle>
                      </IonCol>
                      <IonCol>
                        <IonText color={ratingColor(movie.rating)}>
                          {ratingTo10(movie.rating)}
                        </IonText>
                      </IonCol>
                    </IonRow>
                  </IonCardHeader>
                </IonGrid>
                <IonCardContent>
                  <IonCardSubtitle>{movie.cast.join(", ")}</IonCardSubtitle>
                  <p>{truncateText(movie.overview, isExpanded)}</p>
                  {!isExpanded && <IonText color="primary">Read more</IonText>}
                </IonCardContent>
              </IonCard>
            )
          })
        ) : (
          <IonItem>
            <IonText>No results found. Try another search.</IonText>
          </IonItem>
        )}
      </IonContent>
    </IonPage>
  )
}

export default RandomSearch
