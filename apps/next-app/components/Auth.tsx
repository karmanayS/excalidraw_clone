"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { useRef } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export function Auth({isSignin}:{isSignin:boolean}) {
    const usernameRef = useRef<string | null>(null)
    const emailRef = useRef<string | null>(null)
    const passwordRef = useRef<string | null>(null)
    const router = useRouter()

    return <div className="flex justify-center items-center w-full min-h-screen" > 
        <Card>
        <CardHeader>
            <CardTitle>{ (isSignin) ? "Signin" : "Signup" }</CardTitle>
            <CardDescription> { (isSignin) ? "Signin to your account" : "Create an account" } </CardDescription>
        </CardHeader>
        <CardContent>
            <form>
            <div className="flex flex-col gap-6">
                { (isSignin) ? null : 
                <div className="grid gap-2">
                    <Label htmlFor="password">Username</Label>
                    <Input onChange={(e) => usernameRef.current = e.target.value} id="username" type="text" placeholder="Username" required />
                </div> 
                }
                <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    onChange={(e) => emailRef.current = e.target.value}
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input onChange={(e) => passwordRef.current = e.target.value} id="password" type="password" placeholder="Password" required />
                </div>
            </div>
            </form>            
        </CardContent>
        <CardFooter>
            <Button onClick={async() => {
                let url = "";
                (isSignin) ? url = "http://localhost:3001/signin" : url = "http://localhost:3001/signup"
                if (isSignin) {
                    const response = await axios.post(url,{
                        email: emailRef.current,
                        password: passwordRef.current
                    })
                    if (!response.data.success) return // toast message with error
                    localStorage.setItem("token",response.data.token)
                    router.push("/dashboard")
                    return
                }
                const response = await axios.post(url,{
                    username: usernameRef.current,
                    email: emailRef.current,
                    password: passwordRef.current
                })
                if (!response.data.success) return // toast message with error
                //toast success message
                router.push("/signin") 
                return
            }} type="submit" className="w-full">
                { (isSignin) ? "Signin" : "Signup" }
            </Button>
        </CardFooter>
    </Card>
    </div>
}