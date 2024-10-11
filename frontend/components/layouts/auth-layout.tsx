import Link from "next/link";

export const AuthLayout = ({
	children,
	title,
	subtitle,
	back,
}: {
	children: React.ReactNode;
	title: string;
	subtitle: string;
	back: {
		label: string;
		button: string;
		href: string;
	};
}) => {
	return (
		<div className="w-full h-screen lg:grid lg:grid-cols-2">
			<div className="flex items-center justify-center h-full py-12">
				<div className="mx-auto grid w-[350px] gap-6">
					<div className="grid gap-2 text-center">
						<h1 className="text-3xl font-bold">{title}</h1>
						<p className="text-balance text-muted-foreground">{subtitle}</p>
					</div>
					{children}
					<div className="mt-4 text-sm text-center">
						{back.label}{" "}
						<Link href={back.href} className="underline">
							{back.button}
						</Link>
					</div>
				</div>
			</div>
			<div className="hidden bg-muted lg:block">
				<img
					src="/hellomovie-preview.jpg"
					alt="Image"
					width="1920"
					height="1080"
					className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
				/>
			</div>
		</div>
	);
};
