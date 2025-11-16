import express from "express"
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import jwt, { JwtPayload } from "jsonwebtoken"

const app = express()
const server = createServer(app)
const io = new Server(server);
const PORT = 8080

io.use((socket,next) => {
    const token:string = socket.handshake.auth.token; 
    const decoded = jwt.verify(token,"Secret") as JwtPayload
    if (!decoded.userId) {
        const err = new Error("Error while authenticating user in ws-server")
        next(err)  
    }
    next() 
})

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(PORT,() => {
    console.log(`listening on port ${PORT}...`)
})
