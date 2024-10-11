"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import StarRate from "./star-rate";
import { cn } from "@/lib/utils";
import { FavoriteButton } from "./favorite-button";
import { fetchMovie, fetchMovieVideos } from "@/queries/movies";

const MovieDetailSection = ({
	label,
	children,
	className,
}: {
	label: string;
	children: React.ReactNode;
	className?: string;
}) => (
	<div className={cn("flex flex-row items-center gap-x-2", className)}>
		<span className="text-sm text-neutral-300">{label}:</span>
		{children}
	</div>
);

export const MovieDetails = ({ id }) => {
	const [isVideoSet, setIsVideoSet] = useState(false);

	const { data: movie } = useQuery<MovieDetails>({
		queryKey: ["movie", id],
		queryFn: async () => fetchMovie(id),
	});

	const { data: video } = useQuery<string>({
		queryKey: ["videos", id],
		queryFn: async () => {
			const videos = await fetchMovieVideos(id);
			const trailer =
				videos?.results?.find((v) => v?.type === "Trailer")?.key || null;

			setIsVideoSet(true);
			return trailer;
		},
	});

	return (
		<div className="flex flex-col gap-y-2">
			<div className="w-full bg-neutral-800 rounded-xl aspect-video">
				{isVideoSet && !video ? (
					<div className="flex items-center justify-center w-full h-full italic">
						<p>No trailer available</p>
					</div>
				) : (
					<iframe
						width="100%"
						className="aspect-video rounded-xl"
						src={`https://www.youtube.com/embed/${video}`}
						title="YouTube video player"
						frameBorder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					/>
				)}
			</div>

			<MovieDetailSection label="Rate">
				<StarRate
					stars={10}
					rate={movie?.vote_average}
					count={movie?.vote_count}
					className="pb-3"
				/>
			</MovieDetailSection>

			<MovieDetailSection label="Release date" className="-mt-2">
				<span className="text-sm italic">{movie?.release_date}</span>
			</MovieDetailSection>

			<MovieDetailSection label="Genres">
				<span className="flex flex-wrap gap-1 text-sm">
					{movie?.genres.map((genre) => (
						<span className="px-2.5 py-1 rounded-full bg-neutral-800">
							{genre.name}
						</span>
					))}
				</span>
			</MovieDetailSection>

			<div className="flex justify-end w-full mt-4">
				<FavoriteButton id={movie?.id} />
			</div>
		</div>
	);
};
