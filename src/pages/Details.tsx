import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApi, { DetailsResult } from "../hooks/useApi";
import { starHalfOutline, starOutline, star } from "ionicons/icons";

interface RouteParams {
  id: string;
}

const Details: React.FC = () => {
  const { id } = useParams<RouteParams>(); // Hier holen wir uns den imdbID Parameter
  const { getDetails } = useApi();
  const [movie, setMovie] = useState<DetailsResult | null>(null);

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
            <IonLabel>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle color="secondary">{movie.Title}</IonCardTitle>
                  <IonCardSubtitle>{movie.Year}</IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonImg src={movie.Poster} className="ion-padding-bottom" />
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
                          // Voller Stern
                          return (
                            <IonIcon
                              key={index}
                              icon={star}
                              slot="start"
                              color="warning"
                            />
                          );
                        } else if (index === fullStars && halfStar) {
                          // Halber Stern
                          return (
                            <IonIcon
                              key={index}
                              icon={starHalfOutline}
                              slot="start"
                              color="warning"
                            />
                          );
                        } else {
                          // Leerer Stern
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
            </IonLabel>
          </IonItem>
        ) : (
          <p>Loading...</p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Details;
