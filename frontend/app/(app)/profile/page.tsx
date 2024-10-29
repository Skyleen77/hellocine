"use client";

import { AppLayout } from "@/components/layouts/app-layout";
import { useForm } from "react-hook-form";
import { settingsSchema } from "@/schemas/auth";
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
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/user-context";

const ProfilePage = () => {
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const { user, update } = useUser();

	// Initialize the form with validation schema and default values
	const form = useForm<z.infer<typeof settingsSchema>>({
		resolver: zodResolver(settingsSchema),
		defaultValues: {
			username: "",
			email: "",
			oldPassword: "",
			password: "",
			confirmPassword: "",
		},
	});

	// Set initial form values based on user data
	useEffect(() => {
		if (!user) return;
		form.setValue("username", user.username);
		form.setValue("email", user.email);
	}, [user]);

	// Handle form submission
	function onSubmit(values: z.infer<typeof settingsSchema>) {
		setError(null);

		const { email, username, oldPassword, password } = values;

		// Check if user exists in local storage
		const existingUser = localStorage.getItem(email);

		if (!existingUser) {
			setError("User does not exist");
			return;
		}

		// Verify current password
		let newPassword = user.password;

		if (oldPassword !== user.password) {
			setError("Incorrect password");
			return;
		}

		// Update password if a new one is provided
		if (password) {
			newPassword = password;
		}

		// Update user details
		update({
			email,
			username,
			password: newPassword,
		});

		// Reset password fields
		form.setValue("oldPassword", "");
		form.setValue("password", "");
		form.setValue("confirmPassword", "");

		// Show success message
		setSuccess("Profile updated successfully");
		setTimeout(() => setSuccess(null), 5000);
	}

	return (
		<AppLayout>
			<h1 className="text-3xl font-semibold text-center">Profile</h1>

			<div className="w-full max-w-xl mx-auto mt-10">
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
							name="oldPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="oldPassword">Current Password</FormLabel>
									<FormControl>
										<Input
											id="oldPassword"
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
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="password">New Password</FormLabel>
									<FormControl>
										<Input
											id="password"
											type="password"
											placeholder="•••••••••••••"
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
										Confirm New Password
									</FormLabel>
									<FormControl>
										<Input
											id="confirmPassword"
											type="password"
											placeholder="•••••••••••••"
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

						{success && (
							<div className="flex items-center justify-center p-4 rounded-lg bg-green-950">
								<p className="text-sm font-medium text-center text-green-400">
									{success}
								</p>
							</div>
						)}
					</form>
				</Form>
			</div>
		</AppLayout>
	);
};

export default ProfilePage;
