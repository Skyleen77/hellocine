import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import StarRate from "./star-rate";
import { useUser } from "@/context/user-context";

export const MoviePreview = ({ movie }: { movie: Movie }) => {
	const { toggleFavorite, isFavorite } = useUser();

	return (
		<div className="justify-start w-full h-full transition-all duration-150 ease-in-out cursor-pointer text-start rounded-xl bg-neutral-800 hover:scale-105">
			<img
				className="object-cover w-full h-52 rounded-t-xl bg-neutral-700"
				src={`https://image.tmdb.org/t/p/original/${movie?.backdrop_path || movie?.poster_path}`}
				alt={movie?.title}
			/>

			<div className="p-5 overflow-hidden">
				<div>
					<div className="flex flex-row items-center gap-x-1">
						<p className="w-full font-semibold truncate">{movie?.title}</p>

						<button
							className="-mr-1.5 cursor-pointer"
							onClick={(e) => {
								e.preventDefault();
								toggleFavorite(movie?.id);
							}}
						>
							<StarIcon
								className={cn(
									"w-5 h-5 hover:scale-110 transition-all duration-150 ease-in-out",
									isFavorite(movie?.id)
										? "fill-yellow-400 text-yellow-400"
										: "fill-neutral-500 text-neutral-500",
								)}
							/>
						</button>
					</div>
					<p className="pt-1 text-sm line-clamp-2 text-neutral-300">
						{movie?.overview}
					</p>
				</div>

				<StarRate
					stars={10}
					rate={movie?.vote_average}
					count={movie?.vote_count}
				/>
			</div>
		</div>
	);
};
