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

//User List Updated sent by Server

socket.on('listusers',list=>{
    const userNameList= Object.values(list);
    console.log(userNameList);
    updateUserNamesList(userNameList);
});

//Message submit

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    //Get message text
    const msg = e.target.elements.msg.value;

    //Emit message to server
    socket.emit('chatMessage',{
        sender: username,
        message: msg});
    //Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});



//Render received message to the DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');

    if(message.sender==username)
    {
        div.classList.add('user-message');
    } else {
        div.classList.add('friend-message');
    }

    if(message.messageType=='image'){

        //Write code to render image in the application
        console.log('Image received');

        div.innerHTML= `<p class="meta">${message.sender} <span>${getLocalTime()}</span></p>${message.message.startsWith('data:image') ? `<img src="${message.message}" alt="Image" />` : `<p class="text">${message.message}</p>`}`;
        document.querySelector('.chat-messages').appendChild(div);

    }
    else{
        console.log('Text Received');
        div.innerHTML=`<p class="meta">${message.sender} <span>${getLocalTime()}</span></p>
        <p class="text">${message.message}</p>`;

        document.querySelector('.chat-messages').appendChild(div);

    }


}

function outputServerMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.classList.add('server-message');
    div.innerHTML=`<p class="meta">Server <span>${getLocalTime()}</span></p>
<p class="text">${message}</p>`;

    document.querySelector('.chat-messages').appendChild(div);
}



//function to update list of usernames
function updateUserNamesList(list){

    const userList = document.getElementById("users");
    userList.textContent='';

    for (const name of list)
    {
        console.log('name in array is',name);
        const li = document.createElement('li');
        li.textContent=name;
        userList.appendChild(li);
    }
}

//function to update the username to the other person

//function to get local time
function getLocalTime() {
    const now = new Date();
    const options = { hour: 'numeric', minute: 'numeric'};
    return now.toLocaleTimeString(undefined, options);
}



// Event listener for capturing a photo and sending to server
document.getElementById('capture-photo').addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const track = stream.getVideoTracks()[0];

        // Create a video element to display the live camera feed
        const video = document.createElement('video');
        video.id='camera-feed';
        video.srcObject = new MediaStream([track]);
        video.play();

        // Create a canvas element to capture the image
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // Append the video element to the DOM so the user can see the camera feed
        document.body.appendChild(video);

        // Wait for the video to be loaded (you may want to add an event listener)
        await new Promise((resolve) => (video.onloadedmetadata = resolve));

        // Display the video feed to the user
        video.style.display = 'block';

        // Create a "Capture" button
        const captureButton = document.createElement('button');
        captureButton.id='captureButton';
        captureButton.classList.add('leavebtn');
        captureButton.textContent = 'Capture';
        document.body.appendChild(captureButton);

        // Event listener for capturing the image
        captureButton.addEventListener('click', () => {
            // Set the canvas dimensions to match the video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw the current video frame onto the canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert the captured image to a data URL
            const imageDataURL = canvas.toDataURL('image/jpeg'); // Adjust format as needed

            // Send the image as a chat message
            socket.emit('chatMessage', {
                sender: username,
                message: imageDataURL,
                messageType: 'image',
            });

            //Stops the camera after the click takes place
            stream.getTracks().forEach((track) => track.stop());
            video.style.display='none';


            // Remove the video and capture button (optional)
            video.remove();
            captureButton.remove();
        });
    } catch (error) {
        console.error('Error accessing the camera:', error);
    }
});


//Event listener for GIFs button
document.getElementById('gif').addEventListener('click', function () {
    console.log('gif click listener worked');
    // Call the createGiphyComponents function from giphy.js
    // createGiphyComponents();
    // console.log(document.getElementById('dynamic-content'));
    document.getElementById('giphy-components').style.display='flex';



});