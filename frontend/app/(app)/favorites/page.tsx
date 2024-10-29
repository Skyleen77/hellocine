"use client";

import { AppLayout } from "@/components/layouts/app-layout";
import { Movie } from "@/components/movie";
import { MoviePreview } from "@/components/movie-preview";
import { useSearch } from "@/context/search-context";
import { useUser } from "@/context/user-context";
import { fetchMovies } from "@/queries/movies";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";

const FavoritesPage = () => {
	const { user } = useUser();
	const { searchQuery } = useSearch();

	// Fetch movies marked as favorites by the user.
	const {
		data: movies,
		isLoading,
		isError,
	} = useQuery({
		queryKey: [user?.favoriteMovies || [], "favorites"], // Cache key based on the user's favorite movies.
		queryFn: async () => {
			return await fetchMovies(user.favoriteMovies); // Asynchronous function to fetch favorite movies.
		},
	});

	// Display a loading spinner if the data is still being fetched.
	if (isLoading) {
		return (
			<AppLayout page="Browse">
				<p className="flex items-center justify-center py-32 text-center text-neutral-300">
					<LoaderCircle className="w-9 h-9 animate-spin" />{" "}
					{/* Loading spinner */}
				</p>
			</AppLayout>
		);
	}

	// Display an error message if there was an issue fetching the data.
	if (isError) {
		return (
			<AppLayout page="Browse">
				<p className="text-center text-red-500">
					Error loading your favorite movies{" "}
				</p>
			</AppLayout>
		);
	}

	// Main content of the page, showing a list of favorite movies.
	return (
		<AppLayout page="Favorites">
			<h1 className="text-3xl font-semibold">Favorites</h1>

			{/* Grid layout to display each movie in a flexible grid with responsive columns */}
			<div className="flex flex-col gap-5 mt-5 sm:grid sm:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3">
				{movies
					?.filter(
						(m) =>
							m.title.toLowerCase().includes(searchQuery.trim().toLowerCase()), // Filter movies based on the search query.
					)
					?.map((movie: Movie) => (
						<Movie key={movie.id} movie={movie}>
							<MoviePreview movie={movie} />
						</Movie>
					))}
			</div>
		</AppLayout>
	);
};

export default FavoritesPage;
