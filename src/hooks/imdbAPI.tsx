/**
 * This file contains the hook for the OMDB API.
 * It provides functions to search for movies and series and to get details for a specific movie or series.
 *
 */

export enum SearchType {
  all = "",
  movie = "movie",
  series = "series",
  episode = "episode",
}

export interface SearchResult {
  Title: string
  Year: string
  Poster: string
  imdbID: string
  Type: string
}

export interface DetailsResult extends SearchResult {
  imdbRating: string
  Genre: string
  Director: string
  Website: string
  Actors: string
  Plot: string
}
export interface SearchError {
  Response: "False"
  Error: string
}

export interface SearchResponse {
  Search: SearchResult[]
  totalResults: string
  Response: "True"
}

/**
 * Hook to use the OMDB API.
 *
 * @returns searchData: Function to search for movies or series
 * @returns getDetails: Function to get details for a specific movie or series
 * @returns searchRandom: Function to search for a random movie or series
 */
export const useApi = () => {
  const url = "https://www.omdbapi.com/"
  const apiKey = import.meta.env.VITE_OMDB_API_KEY

  /**
   * Search for movies or series with the given title and type.
   *
   * @param {string} title
   * @param {SearchType} type
   * @return {*}  {(Promise<SearchResponse | SearchError>)}
   */
  const searchData = async (
    title: string,
    type: SearchType
  ): Promise<SearchResponse | SearchError> => {
    const response = await fetch(
      `${url}?apikey=${apiKey}&s=${encodeURI(title)}&type=${type}`
    )
    const result = await response.json()

    if (result.Response === "True") {
      return result as SearchResponse
    } else {
      return result as SearchError
    }
  }

  /**
   * Get details for a specific movie or series.
   *
   * @param {string} id
   * @return {*}  {Promise<DetailsResult>}
   */
  const getDetails = async (id: string): Promise<DetailsResult> => {
    const response = await fetch(`${url}?apikey=${apiKey}&i=${id}&plot=full`)
    return await response.json()
  }

  return {
    searchData,
    getDetails,
  }
}

export default useApi
