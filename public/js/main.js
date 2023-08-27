const chatForm = document.getElementById('chat-form');

const chatMessages = document.querySelector('.chat-messages');
console.log("trying to bring username");


const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');


const socket = io();


socket.emit('username',username);
//Message from server
socket.on('message',message=>{
    console.log(message);
    outputMessage(message);
    //scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight;

});

socket.on('servermessage',message=>{
    console.log(message);
    outputServerMessage(message);
    //scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight;

});

//Message submit

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    //Get message text
    const msg = e.target.elements.msg.value;

    //Emit message to server
    socket.emit('chatMessage',{sender: username, message: msg});
    //Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});



//Render received message to the DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.sender} <span>${getLocalTime()}</span></p>
<p class="text">${message.message}</p>`;

    document.querySelector('.chat-messages').appendChild(div);
}

function outputServerMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">Server <span>${getLocalTime()}</span></p>
<p class="text">${message}</p>`;

    document.querySelector('.chat-messages').appendChild(div);
}



//function to pull username from form



//function to update the username to the other person

//function to get local time

function getLocalTime() {
    const now = new Date();
    const options = { hour: 'numeric', minute: 'numeric'};
    return now.toLocaleTimeString(undefined, options);
}