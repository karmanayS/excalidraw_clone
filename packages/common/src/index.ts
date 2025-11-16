import { error } from "console"
import * as z from "zod"

export const JWT_SECRET = process.env.JWT_SECRET as string

export const signupSchema = z.object({
    username: z.string().min(6,{error: "Username should be atleast 6 charachters long"}),
    email: z.email({error: "Invalid email"}),
    password: z.string().min(6,{error: "Password should be atleast 6 charachters long"})
})

export const signinSchema = z.object({
    email: z.email({error: "Invalid email"}),
    password: z.string().min(6,{error: "Password should be atleast 6 charachters long"})
})

export const roomSchema = z.object({
    name: z.string().min(4,{error: "Room name should be atleast 4 charachters long"})
})

