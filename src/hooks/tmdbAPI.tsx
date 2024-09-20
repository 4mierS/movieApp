import * as streamingAvailability from "streaming-availability";

const RAPID_API_KEY = "afd7c1451fmsh9ae644bc4c677f1p13832ajsn6c391d8c88c9";
const client = new streamingAvailability.Client(
  new streamingAvailability.Configuration({
    apiKey: RAPID_API_KEY,
  })
);

export const useTMDBApi = () => {
  const getMoviesByTitle = async (
    Title: string,
    Country: string,
    Outputlanguage?: streamingAvailability.SearchShowsByTitleOutputLanguageEnum,
    ShowType?: streamingAvailability.ShowType,
    SeriesGranularity?: streamingAvailability.GetShowSeriesGranularityEnum
  ) => {
    const data = await client.showsApi.searchShowsByTitle({
      title: Title,
      country: Country,
      outputLanguage: Outputlanguage,
      showType: ShowType,
      seriesGranularity: SeriesGranularity,
    });
    console.log(data);
  };

  const getMoviesByFilter = async (
    Country: string,
    Catalogs?: string[],
    Language?: streamingAvailability.SearchShowsByTitleOutputLanguageEnum,
    ShowType?: streamingAvailability.ShowType,
    Genre?: string[],
    GenreRelations?: streamingAvailability.SearchShowsByFiltersGenresRelationEnum,
    ShowOriginalLanguage?: "en" | "es",
    YearMin?: number,
    YearMax?: number,
    RatingMin?: number,
    RatingMax?: number,
    Keyword?: string,
    SeriesGranularity?: streamingAvailability.GetShowSeriesGranularityEnum,
    OrderBy?: streamingAvailability.SearchShowsByFiltersOrderByEnum,
    OrderDirection?: streamingAvailability.OrderDirection
  ) => {
    const data = await client.showsApi.searchShowsByFilters({
      country: Country,
      catalogs: Catalogs,
      outputLanguage: Language,
      showType: ShowType,
      genres: Genre,
      genresRelation: GenreRelations,
      showOriginalLanguage: ShowOriginalLanguage,
      yearMin: YearMin,
      yearMax: YearMax,
      ratingMin: RatingMin,
      ratingMax: RatingMax,
      keyword: Keyword,
      seriesGranularity: SeriesGranularity,
      orderBy: OrderBy,
      orderDirection: OrderDirection,
    });
    console.log(data);
  };

  const getRandomMovie = async (
    Country: string,
    ShowType?: streamingAvailability.ShowType,
    Genre?: string[],
    GenreRelations?: streamingAvailability.SearchShowsByFiltersGenresRelationEnum,
    Keyword?: string,
    SeriesGranularity?: streamingAvailability.GetShowSeriesGranularityEnum,
    RatingMin?: number,
  ) => {
    const data = await client.showsApi.searchShowsByFilters({
        country: Country,
        showType: ShowType,
        genres: Genre,
        genresRelation: GenreRelations,
        ratingMin: RatingMin,
        keyword: Keyword,
        seriesGranularity: SeriesGranularity,
        });
    console.log(data);
    };

  return {
    getMoviesByTitle,
    getMoviesByFilter,
    getRandomMovie,
  };
};
