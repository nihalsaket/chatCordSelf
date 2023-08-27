const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');
const app = express();

const server = http.createServer(app);

const io = socketio(server);
//Set static folder
app.use(express.static(path.join(__dirname,'public')));

const connectedUsers={};


//Run when client connects
//'connection' is a predefined event in socket.io library
io.on('connection',socket=>{
    console.log('New WS connection');

    socket.on('username',receivedUsername=>{
        console.log('Received Username: ',receivedUsername);
        connectedUsers[socket.id] = receivedUsername;

        //'servermessage' is an arbitrary event defined by coder

        socket.emit('servermessage',`Welcome to Chatcord, ${receivedUsername}!`);

        //Broadcast when a user joins
        socket.broadcast.emit('servermessage',`${receivedUsername} has joined the chat`);
        console.log(connectedUsers);

    });


    //Runs when clien disconnects

    socket.on('disconnect',()=>{
        // Remove the username from the connected users object
        const username = connectedUsers[socket.id];
        delete connectedUsers[socket.id];
        if (username) {
            io.emit('message', `${username} has left the chat`);
        }

    });



    //Listen for chat message
    socket.on('chatMessage',(msg)=>{
        io.emit('message',msg);
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT,()=>console.log(`Server running on ${PORT}`));