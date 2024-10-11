"use client";

import React, { createContext, useContext, useState } from "react";

interface SearchContextProps {
	searchQuery: string;
	setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<SearchContext.Provider
			value={{
				searchQuery,
				setSearchQuery,
			}}
		>
			{children}
		</SearchContext.Provider>
	);
};

export const useSearch = () => {
	const context = useContext(SearchContext);
	if (context === undefined) {
		throw new Error("useSearch must be used within a SearchProvider");
	}
	return context;
};
