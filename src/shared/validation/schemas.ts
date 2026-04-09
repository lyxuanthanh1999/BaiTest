import * as z from 'zod';

import { Errors } from '@/shared/constants';

export const usernameSchema = z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters');

export const passwordSchema = z.string().min(1, Errors.REQUIRED_PASSWORD_INPUT);

export const loginSchema = z.object({
    username: usernameSchema,
    password: passwordSchema,
});

export const accountFormSchema = z.object({
    username: usernameSchema,
    password: z.string().min(6, 'Password must be at least 6 characters'),
    email: z.string().optional(),
    fullName: z.string().optional(),
    phone: z.string().optional(),
    role: z.enum(['admin', 'user']).optional(),
});

export const updateAccountFormSchema = z.object({
    username: usernameSchema,
    password: z.string().optional(),
    email: z.string().optional(),
    fullName: z.string().optional(),
    phone: z.string().optional(),
    role: z.enum(['admin', 'user']).optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type AccountFormData = z.infer<typeof accountFormSchema>;
export type UpdateAccountFormData = z.infer<typeof updateAccountFormSchema>;
