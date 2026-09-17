import MovieCard from "../MovieCard/MovieCard";
import css from "./MovieList.module.css";
import type { Movie } from "../../types/movie";

export interface MovieListProps {
  movies: Movie[];
}

export default function MovieList({ movies }: MovieListProps) {
  return (
    <ul className={css.list}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </ul>
  );
}
