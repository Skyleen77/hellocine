"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<QueryClientProvider client={queryClient}>
			{children}

			<ProgressBar
				height="4px"
				color="#FFF"
				options={{ showSpinner: false }}
				shallowRouting
			/>
		</QueryClientProvider>
	);
};

export default Providers;
