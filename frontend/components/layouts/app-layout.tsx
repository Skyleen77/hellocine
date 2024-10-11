"use client";

import { cn } from "@/lib/utils";
import {
	LogOut,
	LogOutIcon,
	Menu,
	SearchIcon,
	StarIcon,
	UserIcon,
	XIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useUser } from "@/context/user-context";
import { useSearch } from "@/context/search-context";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const menuItems = [
	{
		title: "Browse",
		icon: SearchIcon,
		href: "/",
	},
	{
		title: "Favorites",
		icon: StarIcon,
		href: "/favorites",
	},
] as const;

export const AppLayout = ({
	children,
	page,
}: {
	children: React.ReactNode;
	page?: (typeof menuItems)[number]["title"];
}) => {
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(true);
	const [isSideBarOpen, setIsSideBarOpen] = useState(false);

	//! Not the best way to check if user is authenticated but I need to verify that in the client because I'm using localStorage
	useEffect(() => {
		if (localStorage.getItem("auth_session") === null) {
			return router.push("/login");
		}

		setIsLoading(false);
	}, []);

	const logout = useCallback(() => {
		localStorage.removeItem("auth_session");
		router.push("/login");
	}, [router]);

	const { user } = useUser();
	const { searchQuery, setSearchQuery } = useSearch();

	return (
		!isLoading && (
			<main>
				{isSideBarOpen && (
					<div
						className="fixed inset-0 z-30 block lg:hidden bg-black/50"
						onClick={() => setIsSideBarOpen(false)}
					/>
				)}
				<div
					className={cn(
						"fixed z-40 bg-background lg:translate-x-0 top-0 left-0 transition-all duration-150 ease-in-out bottom-0 w-[300px] border-r border-neutral-800 flex flex-col justify-between",
						isSideBarOpen ? "translate-x-0" : "-translate-x-full",
					)}
				>
					<div className="relative">
						<Button
							size="icon-xs"
							variant="gray"
							className="absolute flex top-3 right-3 lg:hidden"
							onClick={() => setIsSideBarOpen(false)}
						>
							<XIcon className="w-5 h-5" />
						</Button>

						<img className="pl-8 mt-9 h-9" src="/logo.png" />

						<div className="mt-10">
							<p className="pl-8 text-sm text-neutral-500">News Feed</p>

							<div className="flex flex-col mt-4 gap-y-1">
								{menuItems.map((item) => (
									<Link
										key={item.title}
										href={item.href}
										className={cn(
											"flex items-center justify-start h-12 text-start",
											page === item.title
												? "text-white font-medium"
												: "text-neutral-400",
										)}
									>
										<div
											className={cn(
												"w-1.5 h-full rounded-r-full",
												page === item.title ? "bg-white" : "bg-transparent",
											)}
										/>
										<div className="flex items-center ml-6 gap-x-3">
											<item.icon /> <span>{item.title}</span>
										</div>
									</Link>
								))}
							</div>
						</div>
					</div>

					<div className="w-full px-4 pb-8">
						<Button
							variant="ghost"
							size="lg"
							className="justify-start w-full px-4 gap-x-3"
							onClick={logout}
						>
							<LogOut />
							<span className="text-neutral-400">Log Out</span>
						</Button>
					</div>
				</div>
				<div className="lg:pl-[300px] w-full">
					<div className="flex justify-between w-full p-8 pb-0 gap-x-6">
						<Button
							onClick={() => setIsSideBarOpen((prev) => !prev)}
							variant="gray"
							size="icon"
							className="flex shrink-0 lg:hidden"
						>
							<Menu />
						</Button>

						<div className="hidden lg:block"></div>

						<div className="flex flex-row gap-x-6">
							{page && (
								<div className="relative">
									<Input
										className="rounded-full w-full sm:w-[400px] pl-5 pr-12"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
									/>

									{searchQuery?.length > 0 ? (
										<button
											onClick={() => setSearchQuery("")}
											className="absolute p-1 transition transform -translate-y-1/2 rounded-full top-1/2 right-2.5 hover:bg-neutral-700"
										>
											<XIcon className="w-5 h-5 text-neutral-400" />
										</button>
									) : (
										<SearchIcon className="absolute w-5 h-5 transform -translate-y-1/2 text-neutral-400 top-1/2 right-4" />
									)}
								</div>
							)}

							<DropdownMenu>
								<DropdownMenuTrigger>
									<Avatar className="size-11">
										<AvatarFallback className="size-11">
											{user?.username?.slice(0, 2)}
										</AvatarFallback>
									</Avatar>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									sideOffset={10}
									className="w-auto min-w-[200px]"
								>
									<DropdownMenuLabel>
										<div className="flex flex-col gap-y-0.5">
											<p className="text-sm font-medium">{user?.username}</p>
											<p className="text-xs text-neutral-400">{user?.email}</p>
										</div>
									</DropdownMenuLabel>

									<DropdownMenuSeparator />

									<DropdownMenuGroup>
										<DropdownMenuItem asChild>
											<Link href="/profile">
												<UserIcon className="w-4 h-4 mr-2" />
												<span>Profile</span>
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem onClick={logout}>
											<LogOutIcon className="w-4 h-4 mr-2" />
											<span>Log Out</span>
										</DropdownMenuItem>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					<div className="p-8">{children}</div>
				</div>
			</main>
		)
	);
};
