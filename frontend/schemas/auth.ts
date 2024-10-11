"use client";

import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export const signupSchema = z
	.object({
		username: z.string().min(3),
		email: z.string().email(),
		password: z.string().min(8),
		confirmPassword: z.string().min(8),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const settingsSchema = z
	.object({
		username: z.string().min(3),
		email: z.string().email(),
		oldPassword: z.string(),
		password: z.string().optional(),
		confirmPassword: z.string().optional(),
	})
	.refine((data) => !data.password || data.password.length >= 8, {
		message: "Password must be at least 8 characters long",
		path: ["password"],
	})
	.refine((data) => !data.confirmPassword || data.confirmPassword.length >= 8, {
		message: "Confirm password must be at least 8 characters long",
		path: ["confirmPassword"],
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	})
	.refine((data) => data.password !== data.oldPassword, {
		message: "New password must be different from old password",
	});
