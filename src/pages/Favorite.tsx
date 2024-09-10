import React, { useEffect, useState } from "react";
import { IonAvatar, IonButton, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonItemDivider, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { heart, sadOutline } from "ionicons/icons";

interface FavoriteProps {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

interface FavoriteState {
  favorites: FavoriteProps[];
  isFavorite: (imdbID: string) => boolean;
  toggleFavorite: (favorite: FavoriteProps) => void;
}

const FavoriteContext = React.createContext<FavoriteState>({
  favorites: [],
  isFavorite: () => false,
  toggleFavorite: () => {},
});

export const useFavorite = () => {
  return React.useContext(FavoriteContext);
};

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = React.useState<FavoriteProps[]>(() => {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  const isFavorite = (imdbID: string) => {
    return favorites.some((fav) => fav.imdbID === imdbID);
  };

  const toggleFavorite = (favorite: FavoriteProps) => {
    if (isFavorite(favorite.imdbID)) {
      setFavorites((prev) => {
        const newFavorites = prev.filter((fav) => fav.imdbID !== favorite.imdbID);
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
        return newFavorites;
      });
    } else {
      setFavorites((prev) => {
        const newFavorites = [...prev, favorite];
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
        return newFavorites;
      });
    }
  };

  return (
    <FavoriteContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

const Favorite: React.FC = () => {
  const { favorites, toggleFavorite } = useFavorite(); // Hole toggleFavorite und favorites aus dem Kontext

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Favorites</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {favorites.length > 0 ? (
            favorites.map((fav) => (
              <IonItem key={fav.imdbID}>
                <IonAvatar slot="start"><IonImg alt="MovieImage" src={fav.Poster}/></IonAvatar>
                <IonLabel>{fav.Title}</IonLabel>
                <IonButton
                      shape="round"
                      slot="end"
                      onClick={() => toggleFavorite(fav)} // toggleFavorite aufrufen und das fav-Objekt übergeben
                    >
                      <IonIcon
                        slot="icon-only"
                        icon={heart}
                      ></IonIcon>
                    </IonButton>
              </IonItem>
            ))
          ) : (
            <div style={{ textAlign: "center", paddingTop: "50px", justifyContent: "center" }}>
              <IonIcon icon={sadOutline} color="danger" style={{ fontSize: "60px" }} />
              <IonLabel>
                <h2>No favorites added yet</h2>
              </IonLabel>
            </div>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Favorite;