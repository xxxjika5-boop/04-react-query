import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMovies } from "../../services/api";

import SearchBar from "../SearchBar/SearchBar";
import MovieList from "../MovieList/MovieList";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import css from "./App.module.css";

import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

type ModuleWithDefault<T> = { default: T };
const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.trim().length > 0,
  });

  const totalPages = data?.total_pages ?? 0;

  return (
    <div>

      <SearchBar
        onSearch={(value) => {
          setQuery(value);
        }}
      />

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

      {isLoading && <ErrorMessage text="Loading..." />}
      {isError && <ErrorMessage text="Error loading movies" />}

      {data && data.results.length === 0 && (
        <ErrorMessage text="There was an error, please try again..." />
      )}

      {data && data.results.length > 0 && (
        <MovieList movies={data.results} />
      )}
    </div>
  );
}
