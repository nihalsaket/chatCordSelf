const chatForm = document.getElementById('chat-form');

const chatMessages = document.querySelector('.chat-messages');
const chatHeader = document.querySelector('.chat-header');

const chat_form_container = document.querySelector('.chat-form-container');


console.log("trying to bring username");


const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');


const socket = io();

// let video; // Declare the video element at a higher scope


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

//Adjust size of chat-messages block
function adjustChatMessagesSize() {

    console.log('Height of chatHeader ',chatHeader.offsetHeight);
    console.log('Height of chat Form container',chat_form_container.offsetHeight);

        const formHeight = (2.5*chat_form_container.offsetHeight)+chatHeader.offsetHeight;
    chatMessages.style.minHeight = `calc(100vh - ${formHeight}px)`;
    chatMessages.style.maxHeight = `calc(100vh - ${formHeight}px)`;

    console.log(chatMessages.style.minHeight);


    console.log('chatMessageHeight Adjusted');
}

adjustChatMessagesSize();





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





function updateVideoSize() {
    console.log('In Update Video Size function');
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    console.log(viewportWidth);
    console.log(viewportHeight);

    // Calculate the aspect ratio of the video
    const videoAspectRatio = video.videoWidth / video.videoHeight;

    // Calculate the new width and height based on the viewport size
    let newWidth, newHeight;

    if (viewportWidth / viewportHeight > videoAspectRatio) {
        // The viewport is wider than the video's aspect ratio
        newWidth = viewportHeight * videoAspectRatio;
        newHeight = viewportHeight;
    } else {
        // The viewport is taller than the video's aspect ratio
        newWidth = viewportWidth;
        newHeight = viewportWidth / videoAspectRatio;
    }

    // Apply the new size to the video element
    video.videoWidth = newWidth + 'px';
    video.videoHeight = newHeight + 'px';
    console.log(video.videoWidth);
    console.log(video.videoHeight);
}


//Render received message to the DOM
function outputMessage(message){
    //Create new div element for rendering the message unit
    const div = document.createElement('div');
    div.classList.add('message');

    if(message.sender==username)
    {
        div.classList.add('user-message');
    } else {
        div.classList.add('friend-message');
    }
    //Check If image received is a gif
    if(message.messageType=='gif'){

        console.log('gif received');
        div.innerHTML = `<p class="meta">${message.sender} <span>${getLocalTime()}</span></p><img src="${message.message}" alt="Image" />`;
        document.querySelector('.chat-messages').appendChild(div);
    }
    //Else check if the message type is image
    else if(message.messageType=='image') {

            //Write code to render image in the application
            console.log('Image received');

            div.innerHTML = `<p class="meta">${message.sender} <span>${getLocalTime()}</span></p>${message.message.startsWith('data:image') ? `<img src="${message.message}" alt="Image" />` : `<p class="text">${message.message}</p>`}`;
            document.querySelector('.chat-messages').appendChild(div);
        }

    //Else its neither both
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

let video;

// Event listener for capturing a photo and sending to server
document.getElementById('capture-photo').addEventListener('click', async () => {
    try {
        // Request access to the user's camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        // Get the video track from the stream
        const track = stream.getVideoTracks()[0];


        // Create a div element to contain the video and buttons
        const videoDiv = document.createElement('div');
        videoDiv.id='video-div';

        // Create a video element to display the live camera feed
        video = document.createElement('video');
        video.id='camera-feed';

        // updateVideoSize();


        video.srcObject = new MediaStream([track]);
        video.play();


        // Create a canvas element to capture the image
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // Append the video element to the DOM so the user can see the camera feed
        // document.body.appendChild(video);





// Initial call to set the video size based on the current viewport

        // Wait for the video to be loaded (you may want to add an event listener)
        await new Promise((resolve) =>
        {video.onloadedmetadata = resolve
        });


        // Display the video feed to the user
        videoDiv.style.display = 'inline-block';


        video.style.width=window.innerWidth + 'px';
        video.style.height=window.innerHeight+ 'px';

        console.log(video);



        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;


        videoDiv.appendChild(video);

        console.log(videoDiv);
        console.log(video);


        // Create a "Capture" button
        const captureButton = document.createElement('button');
        captureButton.id='captureButton';
        captureButton.classList.add('leavebtn', 'capture-btn');
        captureButton.innerHTML = '<i class="fas fa-camera"></i>'; // Add the camera icon
        document.body.appendChild(captureButton);

        // Event listener for capturing the image
        captureButton.addEventListener('click', () => {
            // Set the canvas dimensions to match the video
            console.log('Video html height ='+video.height);


            console.log('Canvas height ='+canvas.height);

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
            videoDiv.remove();
            video.remove();
            captureButton.remove();
            dismissButton.remove();
        });

        // Create a "Dismiss" button (close icon)
        const dismissButton = document.createElement('i');
        dismissButton.classList.add('fas', 'fa-times', 'close-button');
        dismissButton.addEventListener('click', () => {
            // Handle dismiss button click (e.g., close the camera feed)
            stream.getTracks().forEach((track) => track.stop());
            videoDiv.remove();
            video.remove();
            captureButton.remove();
            dismissButton.remove();

        });

        // Append video, captureButton, and dismissButton to videoDiv
        videoDiv.appendChild(video);
        videoDiv.appendChild(captureButton);
        videoDiv.appendChild(dismissButton);

        // Append videoDiv to the body
        document.body.appendChild(videoDiv);
    }

    catch (error) {
        console.error('Error accessing the camera:', error);
    }
});


//Event listener for GIFs button
document.getElementById('gif').addEventListener('click', function (event) {
    console.log('gif click listener worked');
    event.preventDefault();

    // Call the createGiphyComponents function from giphy.js
    // createGiphyComponents();
    // console.log(document.getElementById('dynamic-content'));
    document.getElementById('giphy-components').style.display='flex';




});


//Close feature for the gif-popup sheet
document.getElementById('close-gif-popup').addEventListener('click',()=>{
    //Clear the results pane and search field
    document.getElementById('search-input').value='';
    document.getElementById('result').innerHTML="";

    //Make the sheet invisible
    document.getElementById('giphy-components').style.display='none';


});



// Listen for window resize and orientation change events
window.addEventListener('resize', adjustChatMessagesSize);
window.addEventListener('orientationchange', adjustChatMessagesSize);

