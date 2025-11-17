"use client"

import { useEffect, useRef } from "react"

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {

        if (canvasRef.current) {
            const canvas = canvasRef.current
            const ctx = canvas.getContext("2d")
            if (!ctx) return

            let mouseDown = false
            const coordinates = {
                x:0,
                y:0,
                w:0,
                h:0
            }
            
            canvas.addEventListener("mousedown",(e) => {
                console.log("mousedown")
                mouseDown = true
                coordinates.x = e.clientX
                coordinates.y = e.clientY
            })

            canvas.addEventListener("mousemove",(e) => {
                if (mouseDown) {
                    coordinates.w = e.clientX - coordinates.x
                    coordinates.h = e.clientY - coordinates.y
                    ctx.clearRect(0,0,canvas.width,canvas.height)
                    ctx.strokeRect(coordinates.x,coordinates.y,coordinates.w,coordinates.h)  
                }   
            })

            canvas.addEventListener("mouseup",(e) => {
                console.log("mouseup")
                mouseDown = false
            })

        }

    },[canvasRef])

    return <div>
        <canvas ref={canvasRef} width={1396} height={648}></canvas>
    </div>
}