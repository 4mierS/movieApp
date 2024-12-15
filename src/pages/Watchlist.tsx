import React, { useState } from "react"
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
import { glasses, sadOutline, pencil } from "ionicons/icons"
import { useList, ListItem } from "../components/Lists"
import { isPlatform } from "@ionic/react"

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
                <h1 id="desktop-header-1">Watchlist</h1>
              </IonRow>
            </IonGrid>
          ) : (
            <IonTitle>Watchlist</IonTitle>
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
                      <IonLabel>Seasons: {list.SeasonCounter || 0}</IonLabel>
                    </IonCol>
                    <IonCol>
                      <IonLabel>Episodes: {list.EpisodeCounter || 0}</IonLabel>
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
                    <IonCol size="auto">
                      <IonItem
                        button
                        routerLink={`/movies/${list.imdbID}`}
                      ></IonItem>
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
                  <h2>No favorites added yet</h2>
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
            <h2 style={{ textAlign: "center" }}>Edit Watched Progress</h2>

            <IonItem>
              <IonLabel>Seasons Watched</IonLabel>
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
              <IonLabel>Episodes Watched</IonLabel>
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
              <IonLabel>Stopped on:</IonLabel>
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
                Cancel
              </IonButton>
              <IonButton expand="block" onClick={saveChanges} color="primary">
                Save
              </IonButton>
            </div>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  )
}

export default Watchlist
