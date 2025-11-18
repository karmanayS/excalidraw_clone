"use client"

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
import axios from "axios"
import { API_URL } from "@/config/config"

export function RoomCard({isJoin}:{isJoin:boolean}) {
    const router = useRouter()
    const roomName = useRef("")

    return <Card>
        <CardHeader>
            <CardTitle>{(isJoin) ? "Join" : "Create"} a room</CardTitle>
            <CardDescription>
            Enter room name to {(isJoin) ? "join" : "create"} a room
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
            <Button onClick={async() => {
                if (isJoin) {
                    router.push(`/canvas/${roomName.current}`)
                    return
                }
                console.log("clicked")
                const res = await axios.post(`${API_URL}/create-room`, {
                    roomName : roomName.current
                }, {
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                })
                if (!res.data.success) return //toast error
                router.push(`/canvas/${roomName.current}`)
            }} type="submit" className="w-full">
                {(isJoin) ? "Join" : "Create"}
            </Button>
        </CardFooter>
        </Card>
}