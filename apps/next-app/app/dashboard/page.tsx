"use client"

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function Dashboard() {
    const router = useRouter()
    const roomName = useRef("")

    return <div className="flex flex-col w-full min-h-screen">
        <Navbar />
        
        <div className="flex flex-col items-center justify-center mt-36" >
        <Card>
        <CardHeader>
            <CardTitle>Join a room</CardTitle>
            <CardDescription>
            Enter room name to join a room
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form>
            <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="roomName">Room Name</Label>
                    <Input
                        onChange={(e) => roomName.current = e.target.value}
                        id="roomName"
                        type="text"
                        placeholder="Enter room name"
                        required
                    />
                </div>
            </div>
            </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
            <Button onClick={() => {
                router.push(`/canvas/${roomName.current}`)
            }} type="submit" className="w-full">
                Join
            </Button>
        </CardFooter>
        </Card>
        </div>    

    </div>
}