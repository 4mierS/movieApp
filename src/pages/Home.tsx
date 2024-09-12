import { useEffect, useState } from "react";
import useApi, { SearchResult, SearchType, SearchError } from "../hooks/useApi";
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
  IonButton,
} from "@ionic/react";
import {
  videocamOutline,
  tvOutline,
  gameControllerOutline,
  glassesOutline,
  heart,
  heartOutline,
  glasses,
} from "ionicons/icons";
import { useList } from "../components/Lists";

const Home: React.FC = () => {
  const { searchData } = useApi();

  //
  const {favorites, watchlist, toggleItem, isInList } = useList();

  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState<SearchType>(SearchType.all);
  const [results, setResults] = useState<SearchResult[] | SearchError | null>(
    null
  );

  const [presentAlert] = useIonAlert();
  const [loading, dismiss] = useIonLoading();

  useEffect(() => {
    if (searchTerm === "") {
      setResults(null);
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
          console.log(`Error: ` + result.Error);
        } else {
          setResults(result.Search);
          console.log(`Search is: `, result);
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
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Search your Movie</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Hello World</IonTitle>
          </IonToolbar>
        </IonHeader>

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
                  <IonItem
                    button
                    routerLink={`/movies/${result.imdbID}`}
                  >
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
                    <IonItemOption onClick={() => toggleItem(result, "favorites")}>
                        <IonIcon
                          slot="top"
                          size="small"
                          icon={
                            isInList(result.imdbID, "favorites") ? heart : heartOutline
                          }
                        ></IonIcon>
                        Favorite
                    </IonItemOption>
                    <IonItemOption color="success" onClick={() => toggleItem(result, "watchlist")}>
                        <IonIcon
                          slot="top"
                          size="small"
                          icon={isInList(result.imdbID, "watchlist") ? glasses : glassesOutline}
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
  );
};

export default Home;
