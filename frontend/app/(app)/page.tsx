"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AppLayout } from "@/components/layouts/app-layout";
import { tmdbApi } from "@/lib/tmdb-api";
import { LoaderCircle } from "lucide-react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Movie } from "@/components/movie";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/favorite-button";
import { MoviePreview } from "@/components/movie-preview";
import { useSearch } from "@/context/search-context";
import {
	fetchMovieGenres,
	fetchMovieLanguages,
	fetchMoviesDiscover,
	fetchMoviesQuery,
} from "@/queries/movies";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const BrowsePage = () => {
	const observerRef = useRef<HTMLDivElement | null>(null);
	const observerInstance = useRef<IntersectionObserver | null>(null);

	const { searchQuery } = useSearch();

	const [randomMovie, setRandomMovie] = useState<Movie | null>(null);
	const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
		return localStorage.getItem("selectedLanguage") || "";
	});
	const [selectedGenre, setSelectedGenre] = useState<string>(() => {
		return localStorage.getItem("selectedGenre") || "";
	});
	const [selectedYear, setSelectedYear] = useState<string>(() => {
		return localStorage.getItem("selectedYear") || "";
	});

	const [debouncedSearchQuery, setDebouncedSearchQuery] =
		useState<string>(searchQuery);

	const {
		data: genres,
		isLoading: isGenresLoading,
		isError: isGenresError,
	} = useQuery({
		queryKey: ["genres"],
		queryFn: fetchMovieGenres,
	});

	const {
		data: languages,
		isLoading: isLanguagesLoading,
		isError: isLanguagesError,
	} = useQuery({
		queryKey: ["languages"],
		queryFn: fetchMovieLanguages,
	});

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);
		}, 500);

		return () => {
			clearTimeout(handler);
		};
	}, [searchQuery]);

	const {
		data,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		isLoading,
		isError,
	} = useInfiniteQuery({
		queryKey: [
			"movies",
			debouncedSearchQuery,
			selectedLanguage,
			selectedGenre,
			selectedYear,
		],
		queryFn: async ({ pageParam = 1 }) => {
			if (debouncedSearchQuery) {
				return await fetchMoviesQuery({
					pageParam,
					searchQuery: debouncedSearchQuery,
				});
			}
			return await fetchMoviesDiscover({
				pageParam,
				language: selectedLanguage,
				genre: selectedGenre ? Number(selectedGenre) : undefined,
				year: selectedYear ? Number(selectedYear) : undefined,
			});
		},
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.page < lastPage.total_pages) {
				return lastPage.page + 1;
			}
			return undefined;
		},
		initialPageParam: 1,
	});

	const observeElement = () => {
		if (observerInstance.current) {
			observerInstance.current.disconnect();
		}

		observerInstance.current = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage) {
					fetchNextPage();
				}
			},
			{ threshold: 1.0 },
		);

		if (observerRef.current) {
			observerInstance.current.observe(observerRef.current);
		}
	};

	useEffect(() => {
		observeElement();

		return () => {
			if (observerInstance.current) {
				observerInstance.current.disconnect();
			}
		};
	}, [observeElement]);

	useEffect(() => {
		if (!data || randomMovie) return;

		const allMovies = data.pages.flatMap((page) => page.results);
		const randomIndex = Math.floor(Math.random() * allMovies.length);
		setRandomMovie(allMovies[randomIndex]);
	}, [data]);

	useEffect(() => {
		localStorage.setItem("selectedLanguage", selectedLanguage);
		localStorage.setItem("selectedGenre", selectedGenre);
		localStorage.setItem("selectedYear", selectedYear);
	}, [selectedLanguage, selectedGenre, selectedYear]);

	if (isLoading || isGenresLoading || isLanguagesLoading) {
		return (
			<AppLayout page="Browse">
				<p className="flex items-center justify-center py-32 text-center text-neutral-300">
					<LoaderCircle className="w-9 h-9 animate-spin" />
				</p>
			</AppLayout>
		);
	}

	if (isError || isGenresError || isLanguagesError) {
		return (
			<AppLayout page="Browse">
				<p className="text-center text-red-500">
					Error loading movies. Please try again later.
				</p>
			</AppLayout>
		);
	}

	return (
		<AppLayout page="Browse">
			{!searchQuery && (
				<div className="relative hidden mb-8 md:block rounded-2xl">
					<img
						className="w-full aspect-[1200/500] object-cover rounded-2xl"
						src={`https://image.tmdb.org/t/p/original/${randomMovie?.backdrop_path}`}
					/>

					<div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 to-transparent rounded-2xl" />

					<div className="absolute z-20 bottom-8 left-8 right-8 w-[90%] max-w-[700px]">
						<h2 className="mb-3 text-2xl font-semibold text-white">
							{randomMovie?.title}
						</h2>
						<p className="line-clamp-3 text-neutral-300">
							{randomMovie?.overview}
						</p>

						<div className="flex flex-row mt-5 gap-x-2">
							<Movie movie={randomMovie} asChild>
								<Button>View details</Button>
							</Movie>
							<FavoriteButton id={randomMovie?.id} />
						</div>
					</div>
				</div>
			)}

			<div className="flex flex-col justify-between gap-4 sm:items-center sm:flex-row">
				<h1 className="text-3xl font-semibold">Browse</h1>

				<div className="flex flex-row gap-x-2">
					<Select value={selectedYear} onValueChange={setSelectedYear}>
						<SelectTrigger className="w-[120px]">
							<SelectValue placeholder="Year" />
						</SelectTrigger>
						<SelectContent>
							{Array.from({ length: 50 }, (_, i) => (
								<SelectItem key={i} value={(2024 - i).toString()}>
									{2024 - i}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select value={selectedGenre} onValueChange={setSelectedGenre}>
						<SelectTrigger className="w-[120px]">
							<SelectValue placeholder="Genre" />
						</SelectTrigger>
						<SelectContent>
							{genres?.map((genre) => (
								<SelectItem
									key={genre?.id?.toString()}
									value={genre?.id?.toString()}
								>
									{genre?.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
						<SelectTrigger className="w-[120px]">
							<SelectValue placeholder="Language" />
						</SelectTrigger>
						<SelectContent>
							{languages?.map((language) => (
								<SelectItem
									key={language?.iso_639_1}
									value={language?.iso_639_1}
								>
									{language?.english_name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="flex flex-col gap-5 mt-5 sm:grid sm:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3">
				{data?.pages.flatMap((page) =>
					page.results.map((movie: Movie) => (
						<Movie key={movie.id} movie={movie}>
							<MoviePreview movie={movie} />
						</Movie>
					)),
				)}
			</div>

			<div ref={observerRef} className="h-10 bg-transparent"></div>

			{isFetchingNextPage && (
				<p className="flex items-center justify-center py-3 text-center text-neutral-300">
					<LoaderCircle className="w-9 h-9 animate-spin" />
				</p>
			)}
		</AppLayout>
	);
};

export default BrowsePage;
