import { error } from "console"
import * as z from "zod"

export const JWT_SECRET = process.env.JWT_SECRET as string

export const userAuthSchema = z.object({
    email: z.email({error: "Invalid email"}),
    password: z.string().min(6,{error: "Password should be atleast 6 charachters long"})
})

