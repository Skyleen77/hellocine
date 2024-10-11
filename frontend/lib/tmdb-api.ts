import axios from "axios";

export const tmdbApi = axios.create({
	baseURL: "https://api.themoviedb.org/3",
	params: {
		api_key: process.env.NEXT_PUBLIC_MOVIE_API_KEY,
	},
});
