import {
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
} from "@ionic/react"
import React, { useState } from "react"
import { addOutline, removeOutline } from "ionicons/icons"

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
    }[]
  >([])
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  const MAX_LENGTH = 100 // Maximale Textlänge für die Vorschau

  const truncateText = (text: string, isExpanded: boolean) => {
    if (isExpanded || text.length <= MAX_LENGTH) {
      return text // Zeige vollständigen Text
    }
    return `${text.substring(0, MAX_LENGTH)}...` // Text abschneiden
  }

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

  const showRandomMovie = async () => {
    try {
      const data = await fetchData("DE", selectedGenres)
      if (data && data.shows && Array.isArray(data.shows)) {
        setRandomMovie(data.shows)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const addGenre = (genre: string) => {
    if (genre && selectedGenres.length < 3) {
      setSelectedGenres([...selectedGenres, genre])
    }
  }

  const handleGenreChange = (e: CustomEvent) => {
    const selectedGenre = e.detail.value
    setType(selectedGenre)
    addGenre(selectedGenre)
  }

  const removeGenre = (genre: string) => {
    setSelectedGenres(selectedGenres.filter((g) => g !== genre))
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Random</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonSelect
            value={type}
            onIonChange={handleGenreChange}
            placeholder="Select Genre"
            disabled={selectedGenres.length >= 3}
            interface="action-sheet"
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

        {randomMovie.length > 0 ? (
          randomMovie.map((movie, index) => {
            const isExpanded = expandedCard === movie.title
            return (
              <IonCard
                key={`${movie.title}-${index}`}
                onClick={() => setExpandedCard(isExpanded ? null : movie.title)}
              >
                <IonCardHeader>
                  <IonCardTitle>{movie.title}</IonCardTitle>
                </IonCardHeader>
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
            <IonSpinner />
            <IonText>Try another search</IonText>
          </IonItem>
        )}
      </IonContent>
    </IonPage>
  )
}

export default RandomSearch
