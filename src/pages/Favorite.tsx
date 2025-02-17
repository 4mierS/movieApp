import React, { useEffect, useState, useRef } from "react"
import {
  IonAvatar,
  IonButton,
  IonCol,
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
import { useTranslation } from "react-i18next"
import './../theme/variables.css';

/**
 * Die Komponente Favorite zeigt die favorisierten Filme an.
 *
 * @return {*}
 */
const Favorite: React.FC = () => {
  const { favorites, toggleItem } = useList()
  const { t, i18n } = useTranslation()


  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("theme");
    if (savedMode === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark");
    } else {
      setDarkMode(false);
      document.body.classList.remove("dark");
    }
  }, []);


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {isPlatform("desktop") ? (
            <IonGrid>
              <IonRow className="ion-justify-content-center">
                <h1 id="desktop-header-1">{t("favorites")}</h1>
              </IonRow>
            </IonGrid>
          ) : (
            <IonTitle>{t("favorites")}</IonTitle>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList className="watchlist-list">
          {favorites.length > 0 ? (
            favorites.map((fav) => (
              <IonItem
                className="watchlist-item"
                key={fav.imdbID}
                button
                routerLink={`/movies/${fav.imdbID}`}
              >
                <IonAvatar slot="start">
                  <IonImg alt="MovieImage" src={fav.Poster} />
                </IonAvatar>
                <IonGrid>
                  <IonRow>
                    <IonCol size="10">
                      <h3>{fav.Title}</h3>
                    </IonCol>
                    <IonCol size="2">
                      <IonLabel slot="end">{fav.Year}</IonLabel>
                    </IonCol>
                  </IonRow>
                </IonGrid>
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
                  <h2>{t("no_favorites")}</h2>
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
