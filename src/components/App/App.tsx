import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

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

const API_KEY = "b460356f399ded092a20e81497054552";

const fetchMovies = async (query: string, page: number) => {
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
      {/* Search */}
      <SearchBar
        onSearch={(value) => {
          setQuery(value);
        }}
      />

      {/* Pagination ABOVE movie list */}
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
        <ErrorMessage text="No movies found for your request." />
      )}

      {data && data.results.length > 0 && (
        <MovieList movies={data.results} />
      )}
    </div>
  );
}
