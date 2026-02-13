import { z } from 'zod';

export const signUpSchema = z.object({
   body:  z.object({
    username: z.string().min(3).max(30),
    password: z.string().min(6).max(100),
    email: z.string().email()})
})

type SignUpInput = z.infer<typeof signUpSchema>;


export const loginSchema = z.object({
   body:  z.object ({
    username: z.string().min(3).max(30),
    password: z.string().min(6).max(100)
})
})

type loginInput = z.infer<typeof loginSchema>
export type { SignUpInput, loginInput };