import "./globals.css";
import Providers from "./providers";

export const metadata = {
	title: "HelloCine",
	description:
		"View the latest movies and TV shows, watch trailers, and read reviews.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="dark">
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
