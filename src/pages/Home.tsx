import { useEffect, useState } from "react";
import useApi, { SearchResult, SearchType, SearchError } from "../hooks/imdbAPI";
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
  IonMenu,
  IonMenuButton,
  IonButtons,
  IonListHeader,
  IonToggle,
} from "@ionic/react";
import { videocamOutline, tvOutline, gameControllerOutline, glassesOutline, heart, heartOutline, glasses, menuOutline } from "ionicons/icons";
import { useList } from "../components/Lists";
import { useTranslation } from "react-i18next";
import './../theme/variables.css';

/**
 * Hier kann man nach Filmen und Serien suchen.
 * Die Komponente Home zeigt die Suchergebnisse an.
 */
const Home: React.FC = () => {
  const { searchData } = useApi();
  const { toggleItem, isInList } = useList();
  const { t, i18n } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState<SearchType>(SearchType.all);
  const [results, setResults] = useState<SearchResult[] | SearchError | null>(null);
  const [presentAlert] = useIonAlert();
  const [loading, dismiss] = useIonLoading();
  const [darkMode, setDarkMode] = useState(false);

  // Dark Mode beim Laden aus localStorage holen
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

  // Dark Mode umschalten und speichern
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const isDark = !prev;
      document.body.classList.toggle("dark", isDark);
      localStorage.setItem("theme", isDark ? "dark" : "light"); // Speichern des Modus in localStorage
      return isDark;
    });
  };

  useEffect(() => {
    if (searchTerm === "") {
      setResults([]);
      return;
    }
    const loadData = async () => {
      await loading();

      try {
        const result = await searchData(searchTerm, type);

        await dismiss();
        if (result.Response === "False") {
          presentAlert({
            header: "Error",
            message: result.Error,
            buttons: ["OK"],
          });
        } else {
          setResults(result.Search);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        setResults({
          Error: "An unexpected error occurred",
          Response: "False",
        });
      }
    };
    loadData();
  }, [searchTerm, type]);


  return (
    <>
      {/* Menü für Hamburger */}
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>{t("menu")}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList lines="none" className="watchlist-list">
            <IonListHeader>{t("settings")}</IonListHeader>
            <IonItem lines="none">
              <IonToggle
                checked={darkMode}
                onIonChange={(e: CustomEvent) => toggleDarkMode()}
                slot="end"
              />
            </IonItem>
            <IonItem>
              <IonLabel>{t("language")}</IonLabel>
              <IonSelect
                value={i18n.language}
                onIonChange={(e: CustomEvent) => i18n.changeLanguage(e.detail.value)}
              >
                <IonSelectOption value="en">{t("en")}</IonSelectOption>
                <IonSelectOption value="de">{t("de")}</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

      {/* Hauptseite */}
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton>
                <IonIcon icon={menuOutline} />
              </IonMenuButton>
            </IonButtons>
            {isPlatform("desktop") ? (
              <IonGrid>
                <IonRow className="ion-justify-content-center ion-padding">
                  <h1 id="desktop-header-1">{t("home")}</h1>
                </IonRow>
              </IonGrid>
            ) : (
              <IonTitle>{t("home")}</IonTitle>
            )}
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonSearchbar
            onIonChange={(e: CustomEvent) => setSearchTerm(e.detail.value!)}
            debounce={300}
            value={searchTerm}
            animated={true}
            placeholder={t("search")}
          ></IonSearchbar>

          <IonItem>
            <IonLabel>
              <h2>{t("type")}</h2>
              <IonSelect value={type} onIonChange={(e: CustomEvent) => setType(e.detail.value!)}>
                <IonSelectOption value="">{t("all")}</IonSelectOption>
                <IonSelectOption value="movie">{t("movies")}</IonSelectOption>
                <IonSelectOption value="series">{t("series")}</IonSelectOption>
                <IonSelectOption value="episode">{t("episodes")}</IonSelectOption>
              </IonSelect>
            </IonLabel>
          </IonItem>

          <IonList>
            {results && Array.isArray(results)
              ? results.map((result: SearchResult, index: number) => (
                <IonItemSliding key={index}>
                  <IonItem button routerLink={`/movies/${result.imdbID}`}>
                    <IonAvatar slot="start">
                      <IonImg src={result.Poster}></IonImg>
                    </IonAvatar>
                    <IonLabel className="ion-text-wrap">{result.Title}</IonLabel>
                    {result.Type === "movie" && <IonIcon slot="end" icon={videocamOutline} />}
                    {result.Type === "series" && <IonIcon slot="end" icon={tvOutline} />}
                    {result.Type === "game" && <IonIcon slot="end" icon={gameControllerOutline} />}
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
                      <IonIcon slot="top" size="small" icon={isInList(result.imdbID, "favorites") ? heart : heartOutline}></IonIcon>
                      {t("favorites")}
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
                      <IonIcon slot="top" size="small" icon={isInList(result.imdbID, "watchlist") ? glasses : glassesOutline}></IonIcon>
                      {t("watchlist")}
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
    </>
  );
};

export default Home;
