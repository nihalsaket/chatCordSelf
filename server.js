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


    //Runs when username is received from the client
    socket.on('username',receivedUsername=>{
        console.log('Received Username: ',receivedUsername);
        connectedUsers[socket.id] = receivedUsername;

        //'servermessage' is an arbitrary event defined by coder

        socket.emit('servermessage',`Welcome to Huppu+Ranu chat, ${receivedUsername}!`);

        //Broadcast when a user joins
        socket.broadcast.emit('servermessage',`${receivedUsername} has joined the chat`);
        console.log(connectedUsers);

        //function to send updated list of users
        io.emit('listusers',connectedUsers);

    });


    //Runs when client disconnects
    socket.on('disconnect',()=>{
        // Remove the username from the connected users object

        //below code extracts username from the socket id which got disconnected
        const username = connectedUsers[socket.id];

        //below code deletes the socket id from the connected users
        delete connectedUsers[socket.id];
        //This checks if there was an associated username with the socket
        if (username) {
            io.emit('servermessage', `${username} has left the chat`);
        }

        //This sends the updated list of connected clients to all the connected clients
        io.emit('listusers',connectedUsers);

    });


    //Listen for chat message
    socket.on('chatMessage',(msg)=>{
        io.emit('message',msg);
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT,()=>console.log(`Server running on ${PORT}`));