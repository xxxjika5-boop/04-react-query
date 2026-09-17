import axios from "axios";

const API_KEY = "b460356f399ded092a20e81497054552";

export const fetchMovies = async (query: string, page: number) => {
  const response = await axios.get(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        api_key: API_KEY,
        query,
        page,
      },
    }
  );

  return response.data;
};
