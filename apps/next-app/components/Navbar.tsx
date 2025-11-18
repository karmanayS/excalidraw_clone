"use client"

import { Card } from "@/components/ui/card"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { ModeToggle } from "./DarkMode"

export function Navbar () {
    const router = useRouter()
    const token = localStorage.getItem('token')
    
    return <Card className="flex flex-row justify-between px-4 py-3 my-3 mx-6 bg-transparent" >
        <Label className="text-xl" > <a href="/">Excalidraw</a> </Label>
        {(token) ? <Label className="text-md" >Welcome,User</Label> : null}
        <div className="flex gap-8" >
            <ModeToggle />
            <Button size="sm" onClick={() => {
                if (!token) return router.push("/signin")
                localStorage.removeItem("token")
                router.push("/signin")
                return    
            }} > { (token) ? "Logout" : "Login" } </Button>
        </div>
    </Card>
}