import React, { useEffect, useState } from "react"
import {
  IonAvatar,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  IonDatetime,
  IonDatetimeButton,
} from "@ionic/react"
import { glasses, sadOutline, pencil, informationOutline } from "ionicons/icons"
import { useList, ListItem } from "../components/Lists"
import { isPlatform } from "@ionic/react"
import { useTranslation } from "react-i18next"
import './../theme/variables.css';

/**
 * Die Komponente Watchlist zeigt die Filme in der Watchlist an.
 *
 * @return {*}
 */
const Watchlist: React.FC = () => {
  const { watchlist, toggleItem, handleCounterClick } = useList()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ListItem | null>(null)
  const [seasonCounter, setSeasonCounter] = useState<number>(1)
  const [episodeCounter, setEpisodeCounter] = useState<number>(1)
  const [stoppedOn, setStoppedOn] = useState<string>("")
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


  const openModal = (item: ListItem) => {
    setSelectedItem(item)
    setSeasonCounter(item.SeasonCounter || 1)
    setEpisodeCounter(item.EpisodeCounter || 1)
    setStoppedOn(item.stoppedOn || "")
    setIsModalOpen(true)
  }

  const saveChanges = () => {
    if (selectedItem) {
      //increment and decrement
      handleCounterClick(
        selectedItem,
        "SeasonCounter",
        "increment",
        seasonCounter
      )
      handleCounterClick(
        selectedItem,
        "EpisodeCounter",
        "increment",
        episodeCounter
      )

      //update stoppedOn
      if (stoppedOn) {
        selectedItem.stoppedOn = stoppedOn
      }

      localStorage.setItem(
        "watchlist",
        JSON.stringify(
          watchlist.map((item) =>
            item.imdbID === selectedItem.imdbID
              ? {
                ...item,
                SeasonCounter: seasonCounter,
                EpisodeCounter: episodeCounter,
              }
              : item
          )
        )
      )
    }
    setIsModalOpen(false)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {isPlatform("desktop") ? (
            <IonGrid>
              <IonRow className="ion-justify-content-center">
                <h1 id="desktop-header-1">{t("watchlist")}</h1>
              </IonRow>
            </IonGrid>
          ) : (
            <IonTitle>{t("watchlist")}</IonTitle>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList lines="none" className="watchlist-list">
          {watchlist.length > 0 ? (
            watchlist.map((list, index) => (
              <IonItem key={index} className="watchlist-item">
                <IonAvatar slot="start">
                  <IonImg src={list.Poster} />
                </IonAvatar>
                <IonGrid>
                  {/* Titel */}
                  <IonRow className="ion-align-items-center">
                    <IonCol size="8">
                      <IonLabel className="title-label">{list.Title}</IonLabel>
                    </IonCol>
                  </IonRow>

                  {/* Details */}
                  <IonRow className="details-row ion-align-items-center">
                    <IonCol>
                      <IonLabel>{t("seasons")} {list.SeasonCounter || 0}</IonLabel>
                    </IonCol>
                    <IonCol>
                      <IonLabel>{t("episodes")} {list.EpisodeCounter || 0}</IonLabel>
                    </IonCol>
                    <IonCol>
                      <IonLabel>
                        {list.stoppedOn && list.stoppedOn != "00:00"
                          ? `Stopped on: ${list.stoppedOn}`
                          : ""}
                      </IonLabel>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol size="auto">
                      <IonButton onClick={() => openModal(list)} size="small">
                        <IonIcon slot="icon-only" icon={pencil}></IonIcon>
                      </IonButton>
                    </IonCol>
                    <IonCol size="4" className="ion-text-right">
                      <IonButton
                        shape="round"
                        onClick={() => toggleItem(list, "watchlist")}
                      >
                        <IonIcon slot="icon-only" icon={glasses}></IonIcon>
                      </IonButton>
                    </IonCol>
                    <IonCol size="4" className="ion-text-right">
                      <IonButton
                        routerLink={`/movies/${list.imdbID}`}
                      >
                        <IonIcon slot="icon-only" icon={informationOutline}></IonIcon>
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonItem>
            ))
          ) : (
            <IonGrid className="ion-align-items-center" fixed>
              <IonRow className="ion-justify-content-center ion-padding">
                <IonIcon
                  icon={sadOutline}
                  color="danger"
                  style={{ fontSize: "60px" }}
                />
              </IonRow>
              <IonRow className="ion-justify-content-center ion-padding">
                <IonLabel>
                  <h2>{t("no_watchlist")}</h2>
                </IonLabel>
              </IonRow>
            </IonGrid>
          )}
        </IonList>

        {/* Modal for editing seasons and episodes */}
        <IonModal
          isOpen={isModalOpen}
          onDidDismiss={() => setIsModalOpen(false)}
        >
          <div style={{ padding: "16px" }}>
            <h2 style={{ textAlign: "center" }}>{t("edit_watchlist")}</h2>

            <IonItem>
              <IonLabel>{t("season_watched")}</IonLabel>
              <IonInput
                slot="end"
                type="number"
                value={seasonCounter}
                onIonInput={(e) =>
                  setSeasonCounter(
                    Math.max(0, parseInt(e.detail.value || "0", 10))
                  )
                }
              />
            </IonItem>

            <IonItem>
              <IonLabel>{t("episode_watched")}</IonLabel>
              <IonInput
                slot="end"
                type="number"
                value={episodeCounter}
                onIonInput={(e) =>
                  setEpisodeCounter(
                    Math.max(0, parseInt(e.detail.value || "0", 10))
                  )
                }
              />
            </IonItem>

            <IonItem>
              <IonLabel>{t("stopped_on")}</IonLabel>
              <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
              <IonModal keepContentsMounted={true}>
                <IonDatetime
                  value={stoppedOn || "00:00"} // Standardwert nur, wenn `stoppedOn` leer ist
                  presentation="time"
                  id="datetime"
                  hourCycle="h23"
                  onIonChange={(e) => {
                    const newValue = e.detail.value
                    if (typeof newValue === "string") {
                      setStoppedOn(newValue)
                    }

                    if (selectedItem) {
                      const updatedWatchlist = watchlist.map((item) =>
                        item.imdbID === selectedItem.imdbID
                          ? { ...item, stoppedOn: newValue || "00:00" }
                          : item
                      )

                      localStorage.setItem(
                        "watchlist",
                        JSON.stringify(updatedWatchlist)
                      )
                    }
                  }}
                />
              </IonModal>
            </IonItem>

            <div
              style={{
                marginTop: "16px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <IonButton
                expand="block"
                onClick={() => setIsModalOpen(false)}
                color="medium"
              >
                {t("cancel")}
              </IonButton>
              <IonButton expand="block" onClick={saveChanges} color="primary">
                {t("save")}
              </IonButton>
            </div>
          </div>
        </IonModal>
      </IonContent>
    </IonPage >
  )
}

export default Watchlist
