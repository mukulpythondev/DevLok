import http from "http"
import express from "express"
import { Server, Socket } from "socket.io"
const app= express()
const PORT= 3000
app.get("/", (req,res)=>{
       res.send("Server is running")
} )
const server= http.createServer(app)
const io= new Server(server,{
       cors:{
              origin:"*"
       }
})
io.on("connection",(socket)=>{
          console.log("Connected"+socket.id)
          socket.emit("Welcome",`welcome to the chat server ${socket.id}`)
})

server.listen(PORT, ()=>{
    console.log(`server is running at ${PORT} `)
})
