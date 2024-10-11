"use client";

import { SearchProvider } from "@/context/search-context";
import { UserProvider } from "@/context/user-context";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<UserProvider>
			<SearchProvider>{children}</SearchProvider>
		</UserProvider>
	);
};

export default AppLayout;
