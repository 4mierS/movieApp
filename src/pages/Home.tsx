import { useEffect, useState } from "react"
import useApi, { SearchResult, SearchType, SearchError } from "../hooks/imdbAPI"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonList,
  useIonAlert,
  useIonLoading,
  IonAvatar,
  IonImg,
  IonIcon,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  isPlatform,
  IonGrid,
  IonRow,
  IonButton,
} from "@ionic/react"
import {
  videocamOutline,
  tvOutline,
  gameControllerOutline,
  glassesOutline,
  heart,
  heartOutline,
  glasses,
} from "ionicons/icons"
import { useList } from "../components/Lists"
import { useTranslation } from "react-i18next"

/**
 * Hier kann man nach Filmen und Serien suchen.
 *
 * Die Komponente Home zeigt die Suchergebnisse an.
 *
 * @return {*}
 */
const Home: React.FC = () => {
  const { searchData } = useApi()
  const { toggleItem, isInList } = useList()
  const { t, i18n } = useTranslation()

  /**
   * State für die Suchbegriffe und den Suchtyp.
   *
   * @param {string} searchTerm
   * @param {SearchType} type
   * @param {(SearchResult[] | SearchError | null)} results
   */
  const [searchTerm, setSearchTerm] = useState("")
  const [type, setType] = useState<SearchType>(SearchType.all)
  const [results, setResults] = useState<SearchResult[] | SearchError | null>(
    null
  )

  const [presentAlert] = useIonAlert()
  const [loading, dismiss] = useIonLoading()

  useEffect(() => {
    if (searchTerm === "") {
      setResults([])
      return
    }
    const loadData = async () => {
      await loading()

      try {
        const result = await searchData(searchTerm, type)

        await dismiss()
        if (result.Response === "False") {
          presentAlert({
            header: "Error",
            message: result.Error,
            buttons: ["OK"],
          })
        } else {
          setResults(result.Search)
        }
      } catch (error) {
        console.error("Error fetching data: ", error)
        setResults({
          Error: "An unexpected error occurred",
          Response: "False",
        })
      }
    }
    loadData()
  }, [searchTerm, type])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {isPlatform("desktop") ? (
            <IonGrid>
              <IonRow className="ion-justify-content-center">
                <h1 id="desktop-header-1">{t("home")}</h1>
              </IonRow>
            </IonGrid>
          ) : (
            <IonTitle>{t("home")}</IonTitle>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton onClick={() => i18n.changeLanguage("en")}>English</IonButton>
        <IonButton onClick={() => i18n.changeLanguage("de")}>Deutsch</IonButton>
        <IonSearchbar
          onIonChange={(e: CustomEvent) => setSearchTerm(e.detail.value!)}
          debounce={300}
          value={searchTerm}
          animated={true}
          placeholder="Search"
        ></IonSearchbar>

        <IonItem>
          <IonLabel>
            Select SearchType
            <IonSelect
              value={type}
              onIonChange={(e: CustomEvent) => setType(e.detail.value!)}
            >
              <IonSelectOption value="">All</IonSelectOption>
              <IonSelectOption value="movie">Movie</IonSelectOption>
              <IonSelectOption value="series">Series</IonSelectOption>
              <IonSelectOption value="episode">Episode</IonSelectOption>
            </IonSelect>
          </IonLabel>
        </IonItem>

        <IonList>
          {/* Überprüfe zuerst, ob results ein Array ist */}
          {results && Array.isArray(results)
            ? results.map((result: SearchResult, index: number) => (
                <IonItemSliding key={index}>
                  <IonItem button routerLink={`/movies/${result.imdbID}`}>
                    <IonAvatar slot="start">
                      <IonImg src={result.Poster}></IonImg>
                    </IonAvatar>
                    <IonLabel className="ion-text-wrap">
                      {result.Title}
                    </IonLabel>
                    {result.Type === "moive" && (
                      <IonIcon slot="end" icon={videocamOutline} />
                    )}
                    {result.Type === "series" && (
                      <IonIcon slot="end" icon={tvOutline} />
                    )}
                    {result.Type === "game" && (
                      <IonIcon slot="end" icon={gameControllerOutline} />
                    )}
                    <IonIcon slot="end" icon={videocamOutline} />
                  </IonItem>
                  <IonItemOptions>
                    <IonItemOption
                      onClick={() =>
                        toggleItem(
                          {
                            ...result,
                            EpisodeCounter: 1,
                            SeasonCounter: 1,
                            stoppedOn: "",
                          },
                          "favorites"
                        )
                      }
                    >
                      <IonIcon
                        slot="top"
                        size="small"
                        icon={
                          isInList(result.imdbID, "favorites")
                            ? heart
                            : heartOutline
                        }
                      ></IonIcon>
                      Favorite
                    </IonItemOption>
                    <IonItemOption
                      color="success"
                      onClick={() =>
                        toggleItem(
                          {
                            ...result,
                            EpisodeCounter: 1,
                            SeasonCounter: 1,
                            stoppedOn: "",
                          },
                          "watchlist"
                        )
                      }
                    >
                      <IonIcon
                        slot="top"
                        size="small"
                        icon={
                          isInList(result.imdbID, "watchlist")
                            ? glasses
                            : glassesOutline
                        }
                      ></IonIcon>
                      Watched
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              ))
            : results &&
              (results as SearchError).Response === "False" && (
                <IonItem>
                  <IonLabel>{(results as SearchError).Error}</IonLabel>
                </IonItem>
              )}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default Home
