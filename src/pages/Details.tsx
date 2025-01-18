import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  IonCol,
  IonButton,
  IonText,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApi, { DetailsResult } from "../hooks/imdbAPI";
import { star, starHalfOutline, starOutline, heart, heartOutline } from "ionicons/icons";
import { useList } from "../components/Lists";
import { useTranslation } from "react-i18next";


interface RouteParams {
  id: string;
}

const Details: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const { getDetails } = useApi();
  const [movie, setMovie] = useState<DetailsResult | null>(null);
  const { toggleItem, isInList } = useList();
  const { t } = useTranslation();

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
          <IonTitle>{movie?.Title || t("details")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid className="details-grid">
          {movie ? (
            <IonRow className="ion-justify-content-center ion-padding">
              <IonCol size="12" sizeMd="8" sizeLg="6">
                <IonItem lines="none" className="ion-padding">
                  <IonImg src={movie.Poster} alt={movie.Title} className="details-poster" />
                </IonItem>
                <IonItem lines="none">
                  <IonText color="secondary">
                    <h1 className="details-title">{movie.Title}</h1>
                  </IonText>
                  <IonButton
                    fill="clear"
                    slot="end"
                    onClick={() => toggleItem(movie, "favorites")}
                  >
                    <IonIcon
                      icon={isInList(movie.imdbID, "favorites") ? heart : heartOutline}
                    />
                  </IonButton>
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>
                    <IonText color="medium">{movie.Year}</IonText>
                  </IonLabel>
                </IonItem>
                <IonItem lines="none">
                  {Array.from({ length: 5 }, (_, index) => {
                    const fullStars = Math.floor(Number(movie.imdbRating) / 2);
                    const halfStar = Number(movie.imdbRating) % 2 >= 1;

                    if (index < fullStars) {
                      return <IonIcon key={index} icon={star} color="warning" />;
                    } else if (index === fullStars && halfStar) {
                      return <IonIcon key={index} icon={starHalfOutline} color="warning" />;
                    } else {
                      return <IonIcon key={index} icon={starOutline} color="medium" />;
                    }
                  })}
                  <IonLabel>{movie.imdbRating}</IonLabel>
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>
                    <IonText color="primary">{t("genre")}:</IonText> {movie.Genre}
                  </IonLabel>
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>
                    <IonText color="primary">{t("director")}:</IonText> {movie.Director}
                  </IonLabel>
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>
                    <IonText color="primary">{t("actors")}:</IonText> {movie.Actors}
                  </IonLabel>
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>
                    <IonText color="primary">{t("plot")}:</IonText> {movie.Plot}
                  </IonLabel>
                </IonItem>
              </IonCol>
            </IonRow>
          ) : (
            <IonRow className="ion-justify-content-center ion-padding">
              <IonText>{t("loading")}...</IonText>
            </IonRow>
          )}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Details;
