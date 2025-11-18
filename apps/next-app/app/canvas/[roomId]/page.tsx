"use client"

import { draw } from "@/app/draw"
import { WS_URL } from "@/config/config"
import { useTheme } from "next-themes"
import { useParams } from "next/navigation"
import { useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const {roomId} = useParams()
    const socketRef = useRef<Socket>(null)
    const { theme } = useTheme()

    useEffect(() => {
        socketRef.current = io(WS_URL, {
            auth: {
                token: localStorage.getItem("token")
            }   
        })
        
        if (!socketRef.current) return //toast error

        socketRef.current.on("connect" , () => {
            console.log("Connected to socket io server")
        })
        
        socketRef.current.emit("join",roomId)    

        if (canvasRef.current) {
            
            draw(canvasRef.current,(roomId as string),socketRef.current,theme as string)
        }

        socketRef.current.on("disconnect" , () => {
            console.log("Disconnected from the socket io server")
        })

        return () => {
            socketRef.current?.emit("leave",roomId)
            socketRef.current?.disconnect()
        }

    },[canvasRef])

    return <div>
        <canvas ref={canvasRef} width={1396} height={648}></canvas>
    </div>
}