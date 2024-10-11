"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/schemas/auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

export default function LoginPage() {
	const [signupMessage, setSignupMessage] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const router = useRouter();
	const searchParams = useSearchParams();

	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	function onSubmit(values: z.infer<typeof loginSchema>) {
		setError(null);

		const { email, password } = values;

		const existingUser = JSON.parse(localStorage.getItem(email));

		if (!existingUser) {
			setError("User does not exist");
			return;
		}

		if (password !== existingUser.password) {
			setError("Incorrect password");
			return;
		}

		localStorage.setItem("auth_session", email);

		router.push("/");
	}

	useEffect(() => {
		if (searchParams.has("signup")) {
			setSignupMessage(true);
		}
	}, [searchParams]);

	return (
		<AuthLayout
			title="Login"
			subtitle="Enter your email below to login to your account"
			back={{
				label: "Don't have an account?",
				button: "Sign up",
				href: "/signup",
			}}
		>
			{signupMessage && (
				<div className="flex items-center justify-center p-4 rounded-lg bg-green-950">
					<p className="text-sm font-medium text-center text-green-400">
						Account created successfully!
					</p>
				</div>
			)}

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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
