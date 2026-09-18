import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Toaster, toast } from "react-hot-toast";

import { movieService } from "../../services/movieService";
import type { Movie } from "../../types/movie";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

import css from "./App.module.css";

type ModuleWithDefault<T> = { default: T };
const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const {
    data,
    isPending,
    isFetching,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => movieService(query, page),
    enabled: query.trim().length > 0,
    placeholderData: (prev) => prev,
  });

  const totalPages = data?.total_pages ?? 0;

  function handleSearch(value: string) {
    setQuery(value);
    setPage(1); // важливо: скидаємо сторінку при новому пошуку
  }

useEffect(() => {
  if (isSuccess && data.results.length === 0) {
    toast.error("No movies found for your request.");
  }
}, [isSuccess, data]);


  return (
    <>
      <Toaster position="top-right" />

      <div className={css.center}>
        <SearchBar onSubmit={handleSearch} />
      </div>


      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {query && isPending && <Loader />}
      {query && isFetching && <Loader />}
      {isError && <ErrorMessage text="Error loading movies" />}

      {isSuccess && data.results.length > 0 && (
        <MovieGrid movies={data.results} onSelect={setSelectedMovie} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </>
  );
}
