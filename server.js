const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');
const app = express();

const server = http.createServer(app);

const io = socketio(server);
//Set static folder
app.use(express.static(path.join(__dirname,'public')));


//Run when client connects
io.on('connection',socket=>{
    console.log('New WS connection');

    socket.emit('message','Welcome to Chatcord');

    //Broadcast when a user joins

    socket.broadcast.emit('message','A user has joined the chat');

    //Runs when clien disconnects

    socket.on('disconnect',()=>{
        io.emit('message','A user has left the chat');

    });

    //Listen for chat message
    socket.on('chatMessage',(msg)=>{
        io.emit('message',msg);
    });

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT,()=>console.log(`Server running on ${PORT}`));