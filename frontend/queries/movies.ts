import { tmdbApi } from "@/lib/tmdb-api";

export const fetchMoviesDiscover = async ({
	pageParam = 1,
	language,
	genre,
	year,
}: {
	pageParam: number;
	language?: string;
	genre?: number;
	year?: number;
}) => {
	const response = await tmdbApi.get("/discover/movie", {
		params: { page: pageParam, language, with_genres: genre, year },
	});
	return response.data;
};

export const fetchMoviesQuery = async ({
	pageParam = 1,
	searchQuery,
}: {
	pageParam: number;
	searchQuery: string;
}) => {
	const response = await tmdbApi.get("/search/movie", {
		params: { page: pageParam, query: searchQuery },
	});
	return response.data;
};

export const fetchMovie = async (movieId: number) => {
	const response = await tmdbApi.get(`/movie/${movieId}`);
	return response.data;
};

export const fetchMovieVideos = async (movieId: number) => {
	const response = await tmdbApi.get(`/movie/${movieId}/videos`);
	return response.data;
};

export const fetchMovies = async (movieIds: number[]) => {
	try {
		return await Promise.all(movieIds.map(fetchMovie));
	} catch (error) {
		console.error("Error fetching movies:", error);
	}
};

export const fetchMovieGenres = async () => {
	const response = await tmdbApi.get("/genre/movie/list");
	return response.data.genres;
};

export const fetchMovieLanguages = async () => {
	const response = await tmdbApi.get("/configuration/languages");
	return response.data;
};
