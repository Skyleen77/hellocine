import { StarIcon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/user-context";

export const FavoriteButton = ({ id }: { id: number }) => {
	const { toggleFavorite, isFavorite } = useUser();

	return (
		<Button
			variant={isFavorite(id) ? "starred" : "gray"}
			className={cn("w-fit gap-x-2 text-white")}
			onClick={() => toggleFavorite(id)}
		>
			<StarIcon className={cn("w-5 h-5", isFavorite(id) && "fill-white")} />
			<span>{isFavorite(id) ? "Remove from favorite" : "Add to favorite"}</span>
		</Button>
	);
};
