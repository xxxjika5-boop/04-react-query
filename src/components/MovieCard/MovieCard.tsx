import css from "./MovieCard.module.css";
import type { Movie } from "../../types/movie";

export interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
const img = movie.poster_path
  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
  : "https://via.placeholder.com/300x450?text=No+Image";


  return (
    <li className={css.card}>
      <img src={img} alt={movie.title} className={css.img} />
      <p className={css.title}>{movie.title}</p>
    </li>
  );
}
