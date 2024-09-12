import {
  IonBackButton,
  IonButton,
  IonButtons,
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
  IonImg,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApi, { DetailsResult } from "../hooks/useApi";
import {
  starHalfOutline,
  starOutline,
  star,
  heart,
  heartOutline,
} from "ionicons/icons";

interface RouteParams {
  id: string;
}

const Details: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const { getDetails } = useApi();
  const [movie, setMovie] = useState<DetailsResult | null>(null);
  const { isFavorite, toggleFavorite } = useFavorite();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (id) {
        const movieDetails = await getDetails(id);
        setMovie(movieDetails);
      }
    };
    fetchMovieDetails();
  }, [id]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>{movie?.Title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {movie ? (
          <IonItem>
              <IonCard>
                <IonCardHeader >
                  <IonItem>
                    <IonCardTitle  color="secondary">{movie.Title}</IonCardTitle>
                    <IonButton
                      shape="round"
                      size="small"
                      slot="end"
                      onClick={() => toggleFavorite(movie)}
                    >
                      <IonIcon
                        slot="icon-only"
                        size="small"
                        icon={isFavorite(movie.imdbID) ? heart : heartOutline}
                      ></IonIcon>
                    </IonButton>
                  </IonItem>
                  <IonItem>
                  <IonCardSubtitle>{movie.Year}</IonCardSubtitle>
                  </IonItem>
                </IonCardHeader>
                <IonCardContent>
                  <IonImg src={movie.Poster}/>
                  <IonItem>
                    {Array.from({ length: 5 }, (_, index) => {
                      if (movie.imdbRating === "N/A") {
                        return (
                          <IonIcon
                            key={index}
                            icon={starOutline}
                            slot="start"
                            color="medium"
                          />
                        );
                      } else {
                        const fullStars = Math.floor(
                          Number(movie.imdbRating) / 2
                        );
                        const halfStar =
                          Number(movie.imdbRating) % 2 >= 1 ? true : false;

                        if (index < fullStars) {
                          return (
                            <IonIcon
                              key={index}
                              icon={star}
                              slot="start"
                              color="warning"
                            />
                          );
                        } else if (index === fullStars && halfStar) {
                          return (
                            <IonIcon
                              key={index}
                              icon={starHalfOutline}
                              slot="start"
                              color="warning"
                            />
                          );
                        } else {
                          return (
                            <IonIcon
                              key={index}
                              icon={starOutline}
                              slot="start"
                              color="medium"
                            />
                          );
                        }
                      }
                    })}
                    <IonLabel>{movie.imdbRating}</IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <IonText color="primary">Genre:</IonText> {movie.Genre}
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <IonText color="primary">Director:</IonText>{" "}
                      {movie.Director}
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <IonText color="primary">Actors:</IonText> {movie.Actors}
                    </IonLabel>
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel>
                      <IonText color="primary">Plot:</IonText> {movie.Plot}
                    </IonLabel>
                  </IonItem>
                </IonCardContent>
              </IonCard>
          </IonItem>
        ) : (
          <p>Loading...</p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Details;
