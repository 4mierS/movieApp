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
} from "@ionic/react"
import { heart, heartOutline, glasses, sadOutline } from "ionicons/icons"
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
  const [seasonCounter, setSeasonCounter] = useState<number>(0)
  const [episodeCounter, setEpisodeCounter] = useState<number>(0)

  const openModal = (item: ListItem) => {
    setSelectedItem(item)
    setSeasonCounter(item.SeasonCounter || 0)
    setEpisodeCounter(item.EpisodeCounter || 0)
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
                <h1 id="desktop-header-1">Home</h1>
              </IonRow>
            </IonGrid>
          ) : (
            <IonTitle>Home</IonTitle>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList lines="inset">
          {watchlist.length > 0 ? (
            watchlist
              .map((list, index) => (
                <IonItem key={index}>
                  <IonAvatar slot="start">
                    <IonImg src={list.Poster}></IonImg>
                  </IonAvatar>
                  <IonGrid>
                    <IonRow>
                      <IonCol>
                        <IonLabel className="ion-text-wrap">
                          {list.Title}
                        </IonLabel>
                      </IonCol>
                      <IonCol size="auto">
                        <IonButton
                          shape="round"
                          onClick={() => toggleItem(list, "watchlist")}
                        >
                          <IonIcon slot="icon-only" icon={glasses}></IonIcon>
                        </IonButton>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol size="auto">
                        <IonLabel>
                          {list.SeasonCounter !== undefined
                            ? `Seasons: ${list.SeasonCounter}`
                            : ""}
                        </IonLabel>
                      </IonCol>
                      <IonCol>
                        <IonLabel>
                          {list.EpisodeCounter !== undefined
                            ? `Episodes: ${list.EpisodeCounter}`
                            : ""}
                        </IonLabel>
                      </IonCol>
                      <IonCol size="auto">
                        <IonButton onClick={() => openModal(list)}>
                          Edit
                        </IonButton>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonItem>
              ))
              .toReversed()
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
                type="number"
                value={seasonCounter}
                //TODO: better to commit with enter or without?
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
                type="number"
                value={episodeCounter}
                //TODO: better to commit with enter or without?
                onIonInput={(e) =>
                  setEpisodeCounter(
                    Math.max(0, parseInt(e.detail.value || "0", 10))
                  )
                }
              />
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
