import React, { useContext, useState, useEffect, createContext } from "react";

// Allgemeine Schnittstelle für Listenelemente
interface ListItem {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

// Liste-Typen für Local Storage Schlüssel
export type ListType = "favorites" | "watchlist";

// Allgemeine Schnittstelle für den Listen-Status
interface ListState {
  favorites: ListItem[];
  watchlist: ListItem[];
  isInList: (imdbID: string, typeOfList: ListType) => boolean;
  toggleItem: (item: ListItem, typeOfList: ListType) => void;
}

// Erstelle einen generischen Listen-Kontext
const ListContext = createContext<ListState>({
  favorites: [],
  watchlist: [],
  isInList: () => false,
  toggleItem: () => {},
});

// Verwende den Kontext in deinen Komponenten
export const useList = () => {
  return useContext(ListContext);
};

// Provider für den Listen-Kontext
export const ListProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Favoriten und Watchlist getrennt speichern
  const [favorites, setFavorites] = useState<ListItem[]>(() => {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  const [watchlist, setWatchlist] = useState<ListItem[]>(() => {
    const storedWatchlist = localStorage.getItem("watchlist");
    return storedWatchlist ? JSON.parse(storedWatchlist) : [];
  });

  // Überprüfe, ob ein Element in einer bestimmten Liste ist
  const isInList = (imdbID: string, typeOfList: ListType) => {
    if (typeOfList === "favorites") {
      return favorites.some((item) => item.imdbID === imdbID);
    } else if (typeOfList === "watchlist") {
      return watchlist.some((item) => item.imdbID === imdbID);
    }
    return false;
  };

  // Toggle-Funktion zum Hinzufügen/Entfernen von Elementen
  const toggleItem = (item: ListItem, typeOfList: ListType) => {
    if (typeOfList === "favorites") {
      if (isInList(item.imdbID, "favorites")) {
        setFavorites((prev) => {
          const newFavorites = prev.filter(
            (listItem) => listItem.imdbID !== item.imdbID
          );
          localStorage.setItem("favorites", JSON.stringify(newFavorites));
          return newFavorites;
        });
      } else {
        setFavorites((prev) => {
          const newFavorites = [...prev, item];
          localStorage.setItem("favorites", JSON.stringify(newFavorites));
          return newFavorites;
        });
      }
    } else if (typeOfList === "watchlist") {
      if (isInList(item.imdbID, "watchlist")) {
        setWatchlist((prev) => {
          const newWatchlist = prev.filter(
            (listItem) => listItem.imdbID !== item.imdbID
          );
          localStorage.setItem("watchlist", JSON.stringify(newWatchlist));
          return newWatchlist;
        });
      } else {
        setWatchlist((prev) => {
          const newWatchlist = [...prev, item];
          localStorage.setItem("watchlist", JSON.stringify(newWatchlist));
          return newWatchlist;
        });
      }
    }
  };

  return (
    <ListContext.Provider
      value={{ favorites, watchlist, isInList, toggleItem }}
    >
      {children}
    </ListContext.Provider>
  );
};
