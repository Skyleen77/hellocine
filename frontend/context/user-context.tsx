"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
	id: string;
	email: string;
	username: string;
	favoriteMovies: number[];
	password: string;
}

interface UserContextProps {
	user: User | null;
	update: (userUpdate: Partial<User>) => void;
	toggleFavorite: (movieId: number) => void;
	isFavorite: (movieId: number) => boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const email = localStorage.getItem("auth_session");
		if (!email) return;
		const storedUser = localStorage.getItem(email);
		if (!storedUser) return;
		const user = JSON.parse(storedUser);
		setUser(user);
	}, []);

	const update = (userUpdate: Partial<User>) => {
		if (!user?.email) return;

		const newUser = {
			...user,
			...userUpdate,
		};

		localStorage.setItem(user.email, JSON.stringify(newUser));
		setUser(newUser);
	};

	const toggleFavorite = (movieId: number) => {
		if (!user) return;

		const favoriteMovies = user.favoriteMovies.includes(movieId)
			? user.favoriteMovies.filter((id) => id !== movieId)
			: [...user.favoriteMovies, movieId];

		update({ favoriteMovies });
	};

	const isFavorite = (movieId: number) => {
		if (!user) return false;
		return user.favoriteMovies.includes(movieId);
	};

	return (
		<UserContext.Provider value={{ user, update, toggleFavorite, isFavorite }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
};
