import { API_URL, WS_URL } from "@/config/config"
import axios from "axios"
import { io, Socket } from "socket.io-client"

type Shape = {
    type:"rect"
    x:number
    y:number
    width: number
    height: number
} | {
    type:"circle";
    centerX:number;
    centerY:number;
    radius:number
}

export async function draw(canvas:HTMLCanvasElement,roomId:string,socket:Socket,theme:string) {
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let strokeStyle = "";
    (theme === "dark") ? strokeStyle = "rgb(255, 255, 255)" : strokeStyle = "rgb(0, 0, 0)"
    ctx.strokeStyle = strokeStyle
    
    const shapes = await fetchShapes(roomId)
    if (!shapes) return // toast error
    const existingShapes:Shape[] = shapes

    socket.on("message",(data) => {
        console.log("the data is: ",data)
        const shape:Shape = JSON.parse(data)
        existingShapes.push(shape)
        ctx.clearRect(0,0,canvas.width,canvas.height)
        existingShapes.map((shape) => {
            if (shape.type === "rect") {
                ctx.strokeRect(shape.x,shape.y,shape.width,shape.height)
            }
        })
    })

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
            existingShapes.map((shape) => {
                if (shape.type === "rect") {
                    ctx.strokeRect(shape.x,shape.y,shape.width,shape.height)
                }
            })
            ctx.strokeRect(coordinates.x,coordinates.y,coordinates.w,coordinates.h)  
        }   
    })

    canvas.addEventListener("mouseup",(e) => {
        console.log("mouseup")
        mouseDown = false
        const newShape:Shape = {
            type:"rect",
            x: coordinates.x,
            y: coordinates.y,
            width: e.clientX - coordinates.x,
            height: e.clientY - coordinates.y
        }
        existingShapes.push(newShape)
        socket.emit("sendMessage",{roomName:roomId,message:JSON.stringify(newShape)})
    })
}

async function fetchShapes(roomId:string):Promise<null | Shape[]> {
    const res = await axios.get(`${API_URL}/chats/${roomId}`,{
        headers: {
            Authorization: localStorage.getItem("token")
        }
    })
    if (!res.data.success) return null
    const messages = res.data.chats
    const shapes = messages.map((message:string) => {
        const shapeDetails = JSON.parse(message)
        return shapeDetails
    })
    return shapes
}