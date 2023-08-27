const chatForm = document.getElementById('chat-form');

const chatMessages = document.querySelector('.chat-messages');
console.log("trying to bring username");

// var username = "";
// document.getElementById("submitbutton").addEventListener('click',function (e){
//     username = document.getElementById("username").value;
//     console.log("username fetched", username);
// });


const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');

console.log(username);

const socket = io();

//Message from server
socket.on('message',message=>{
    console.log(message);
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight;

});


//Message submit

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    //Get message text
    const msg = e.target.elements.msg.value;

    //Emit message to server
    socket.emit('chatMessage',msg);

    //Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});



//Render received message to the DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${username} <span>${getLocalTime()}</span></p>
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