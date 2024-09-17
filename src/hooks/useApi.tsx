export enum SearchType {
    all = '',
    movie = 'movie',
    series = 'series',
    episode = 'episode',
}

export interface SearchResult {
    Title: string;
    Year: string;
    Poster: string;
    imdbID: string;  // Korrektur von "imbdID" zu "imdbID"
    Type: string;
}

export interface DetailsResult extends SearchResult {
    imdbRating: string;
    Genre: string;
    Director: string;
    Website: string;
    Actors: string;
    Plot: string;
}
export interface SearchError {
    Response: "False";
    Error: string;
}

// Typ der API-Antwort, wenn die Suche erfolgreich ist
export interface SearchResponse {
    Search: SearchResult[];
    totalResults: string;
    Response: "True";
}

//TODO: Need to be tested, if there are all genres or more in api
export type Genre = "Action" | "Adventure" | "Animation" | "Biography" | "Comedy" | "Crime" | "Documentary" | "Drama" | "Family" | "Fantasy" | "Film-Noir" | "Game-Show" | "History" | "Horror" | "Music" | "Musical" | "Mystery" | "News" | "Reality-TV" | "Romance" | "Sci-Fi" | "Sport" | "Talk-Show" | "Thriller" | "War" | "Western";

export const useApi = () => {
    const url = 'http://www.omdbapi.com/';
    const apiKey = import.meta.env.VITE_OMDB_API_KEY;

    // searchData gibt entweder ein Array von SearchResults oder einen Fehler zurück
    const searchData = async (title: string, type: SearchType): Promise<SearchResponse | SearchError> => {
        const response = await fetch(`${url}?apikey=${apiKey}&s=${encodeURI(title)}&type=${type}`);
        const result = await response.json();

        // Da die API entweder eine gültige Suche oder einen Fehler zurückgibt, können wir das Typenverhalten entsprechend umsetzen
        if (result.Response === "True") {
            return result as SearchResponse; // Cast zu SearchResponse
        } else {
            return result as SearchError; // Cast zu SearchError
        }
    };

    // getDetails gibt ein einzelnes Suchergebnis zurück
    const getDetails = async (id: string): Promise<DetailsResult> => {
        const response = await fetch(`${url}?apikey=${apiKey}&i=${id}&plot=full`);
        return await response.json();
    };

    //TODO: Handle Request
    const searchRandom = async (type: Genre) => {
        const response = await fetch(`${url}?apikey=${apiKey}&s=star&type=movie`);
        const result = await response.json();

        if (type !== result.Search[0].Type) {
            return searchRandom(type);
        }
        return result;
    };

    return {
        searchData,
        getDetails,
        searchRandom,
    };
};

export default useApi;
