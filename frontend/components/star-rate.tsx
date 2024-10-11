import { FC } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";

interface StarRateProps {
	rate: number;
	stars: number;
	count: number;
	className?: string;
}

const StarRate: FC<StarRateProps> = ({ rate, stars, count, className }) => {
	const fullStars = Math.floor(rate);
	const decimalPart = rate % 1;
	const emptyStars = stars - Math.ceil(rate);

	return (
		<div className={cn("flex flex-row gap-x-1.5 mt-3", className)}>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div className="flex items-center justify-start">
							{Array.from({ length: fullStars }).map((_, index) => (
								<Star
									key={`full-${index}`}
									className="w-4 h-4 text-yellow-400 fill-current"
								/>
							))}

							{decimalPart > 0 && (
								<div className="relative">
									<Star className="w-4 h-4 fill-current text-neutral-600" />
									<div
										className="absolute top-0 left-0 h-full overflow-hidden"
										style={{ width: `${decimalPart * 100}%` }}
									>
										<Star className="w-4 h-4 text-yellow-400 fill-current" />
									</div>
								</div>
							)}

							{Array.from({ length: emptyStars }).map((_, index) => (
								<Star
									key={`empty-${index}`}
									className="w-4 h-4 fill-current text-neutral-600"
								/>
							))}
						</div>
					</TooltipTrigger>

					<TooltipContent>
						<p>{rate?.toFixed(1)} / 10</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<span className="text-xs text-neutral-400">({count})</span>
		</div>
	);
};

export default StarRate;
