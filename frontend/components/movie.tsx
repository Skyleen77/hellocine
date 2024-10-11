"use client";

import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { MovieDetails } from "./movie-details";
import { cn } from "@/lib/utils";

export const Movie = ({
	movie,
	children,
	asChild,
}: {
	movie: Movie;
	children: React.ReactNode;
	asChild?: boolean;
}) => {
	const [truncate, setTruncate] = useState(true);

	return (
		<Dialog>
			<DialogTrigger asChild={asChild}>{children}</DialogTrigger>
			<DialogContent className="lg:max-w-[700px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="truncate">{movie?.title}</DialogTitle>
					<DialogDescription
						className={cn("pt-2 cursor-pointer", truncate && "line-clamp-3")}
						onClick={() => setTruncate((prev) => !prev)}
					>
						{movie?.overview}
					</DialogDescription>
				</DialogHeader>
				<MovieDetails id={movie?.id} />
			</DialogContent>
		</Dialog>
	);
};
