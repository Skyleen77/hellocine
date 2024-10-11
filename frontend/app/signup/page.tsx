"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/schemas/auth";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";

export default function SignupPage() {
	const [error, setError] = useState<string | null>(null);

	const router = useRouter();

	const form = useForm<z.infer<typeof signupSchema>>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	function onSubmit(values: z.infer<typeof signupSchema>) {
		setError(null);

		const { email, username, password } = values;

		const existingUser = localStorage.getItem(email);

		if (existingUser) {
			setError("Email already in use");
			return;
		}

		localStorage.setItem(
			email,
			JSON.stringify({
				id: nanoid(),
				email,
				username,
				favoriteMovies: [],
				password,
			}),
		);

		router.push("/login?signup=true");
	}

	return (
		<AuthLayout
			title="Signup"
			subtitle="Enter your email and password below to create an account"
			back={{
				label: "Already have an account?",
				button: "Login",
				href: "/login",
			}}
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="username">Username</FormLabel>
								<FormControl>
									<Input
										id="username"
										type="text"
										placeholder="johndoe"
										required
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="email">Email</FormLabel>
								<FormControl>
									<Input
										id="email"
										type="email"
										placeholder="john.doe@example.com"
										required
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="password">Password</FormLabel>
								<FormControl>
									<Input
										id="password"
										type="password"
										placeholder="•••••••••••••"
										required
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="confirmPassword">
									Confirm Password
								</FormLabel>
								<FormControl>
									<Input
										id="confirmPassword"
										type="password"
										placeholder="•••••••••••••"
										required
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{error && (
						<p className="text-sm font-medium text-destructive">{error}</p>
					)}

					<Button type="submit" className="w-full">
						Submit
					</Button>
				</form>
			</Form>
		</AuthLayout>
	);
}
