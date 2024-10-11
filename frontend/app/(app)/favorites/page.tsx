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

	const {
		data: movies,
		isLoading,
		isError,
	} = useQuery({
		queryKey: [user?.favoriteMovies || [], "favorites"],
		queryFn: async () => {
			return await fetchMovies(user.favoriteMovies);
		},
	});

	if (isLoading) {
		return (
			<AppLayout page="Browse">
				<p className="flex items-center justify-center py-32 text-center text-neutral-300">
					<LoaderCircle className="w-9 h-9 animate-spin" />
				</p>
			</AppLayout>
		);
	}

	if (isError) {
		return (
			<AppLayout page="Browse">
				<p className="text-center text-red-500">
					Error loading your favorite movies
				</p>
			</AppLayout>
		);
	}

	return (
		<AppLayout page="Favorites">
			<h1 className="text-3xl font-semibold">Favorites</h1>

			<div className="flex flex-col gap-5 mt-5 sm:grid sm:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3">
				{movies
					?.filter((m) =>
						m.title.toLowerCase().includes(searchQuery.trim().toLowerCase()),
					)
					?.map((movie: Movie) => (
						<Movie movie={movie}>
							<MoviePreview movie={movie} />
						</Movie>
					))}
			</div>
		</AppLayout>
	);
};

export default FavoritesPage;
