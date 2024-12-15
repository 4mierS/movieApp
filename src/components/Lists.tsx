import React, { useContext, useState, useEffect, createContext } from "react"

export interface ListItem {
  [x: string]: any
  imdbID: string
  Title: string
  Year: string
  Poster: string
  Type: string
  EpisodeCounter: number
  SeasonCounter: number
  stoppedOn: string
}

export type ListType = "favorites" | "watchlist"
export type CounterType = "EpisodeCounter" | "SeasonCounter"
export type count = "increment" | "decrement"

interface ListState {
  favorites: ListItem[]
  watchlist: ListItem[]
  isInList: (imdbID: string, typeOfList: ListType) => boolean
  toggleItem: (item: ListItem, typeOfList: ListType) => void
  handleCounterClick: (
    list: ListItem,
    cType: CounterType,
    count: count,
    num: number
  ) => void
}

const ListContext = createContext<ListState>({
  favorites: [],
  watchlist: [],
  isInList: () => false,
  toggleItem: () => {},
  handleCounterClick: () => {},
})

export const useList = () => {
  return useContext(ListContext)
}

// Provider für den Listen-Kontext
export const ListProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showMap, setShowMap] = useState(false)

  // Favoriten und Watchlist getrennt speichern
  const [favorites, setFavorites] = useState<ListItem[]>(() => {
    const storedFavorites = localStorage.getItem("favorites")
    return storedFavorites ? JSON.parse(storedFavorites) : []
  })

  const [watchlist, setWatchlist] = useState<ListItem[]>(() => {
    const storedWatchlist = localStorage.getItem("watchlist")
    return storedWatchlist ? JSON.parse(storedWatchlist) : []
  })

  // Überprüfe, ob ein Element in einer bestimmten Liste ist
  const isInList = (imdbID: string, typeOfList: ListType) => {
    if (typeOfList === "favorites") {
      return favorites.some((item) => item.imdbID === imdbID)
    } else if (typeOfList === "watchlist") {
      return watchlist.some((item) => item.imdbID === imdbID)
    }
    return false
  }

  // Toggle-Funktion zum Hinzufügen/Entfernen von Elementen
  const toggleItem = (item: ListItem, typeOfList: ListType) => {
    if (typeOfList === "favorites") {
      if (isInList(item.imdbID, "favorites")) {
        setFavorites((prev) => {
          const newFavorites = prev.filter(
            (listItem) => listItem.imdbID !== item.imdbID
          )
          localStorage.setItem("favorites", JSON.stringify(newFavorites))
          return newFavorites
        })
      } else {
        setFavorites((prev) => {
          const newFavorites = [...prev, item]
          localStorage.setItem("favorites", JSON.stringify(newFavorites))
          return newFavorites
        })
      }
    } else if (typeOfList === "watchlist") {
      if (isInList(item.imdbID, "watchlist")) {
        setWatchlist((prev) => {
          const newWatchlist = prev.filter(
            (listItem) => listItem.imdbID !== item.imdbID
          )
          localStorage.setItem("watchlist", JSON.stringify(newWatchlist))
          return newWatchlist
        })
      } else {
        setWatchlist((prev) => {
          const newWatchlist = [...prev, item]
          localStorage.setItem("watchlist", JSON.stringify(newWatchlist))
          return newWatchlist
        })
      }
    }
  }

  const SeasonCounter = (item: ListItem, num: number) => {
    if (item.SeasonCounter === undefined) {
      item.SeasonCounter = 1
      localStorage.setItem("watchlist", JSON.stringify(watchlist))
    } else {
      item.SeasonCounter = num
      localStorage.setItem("watchlist", JSON.stringify(watchlist))
    }
  }

  const EpisodeCounter = (item: ListItem, num: number) => {
    if (item.EpisodeCounter === undefined) {
      item.EpisodeCounter = 1
      localStorage.setItem("watchlist", JSON.stringify(watchlist))
    } else {
      item.EpisodeCounter = num
      localStorage.setItem("watchlist", JSON.stringify(watchlist))
    }
  }

  const handleCounterClick = (
    list: ListItem,
    cType: CounterType,
    count: count,
    num: number
  ) => {
    if (count === "increment") {
      if (cType === "EpisodeCounter") {
        EpisodeCounter(list, num)
      } else {
        SeasonCounter(list, num)
      }
    }

    setShowMap(true)
    toggleShowMap()
  }

  const toggleShowMap = () => {
    setShowMap(!showMap)
  }

  return (
    <ListContext.Provider
      value={{
        favorites,
        watchlist,
        handleCounterClick,
        isInList,
        toggleItem,
      }}
    >
      {children}
    </ListContext.Provider>
  )
}
