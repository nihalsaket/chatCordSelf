// Replace 'YOUR_API_KEY' with your actual GIPHY API key

// require("dotenv").config();
// const giphyApiKey = process.env.GIPHY_API_KEY;
const giphyApiKey='kfROCKTKguiDAaSfl40ynCQ3Jvy5EnFH';

console.log('updated giphy.js loaded')
//Function to render giphy components
// function createGiphyComponents() {
//     // Create the main container
//     const container = document.createElement('div');
//     container.id = 'giphy-components';
//
//     // Create and append the H3 element
//     const h3 = document.createElement('h3');
//     h3.id = 'banner';
//     h3.textContent = 'Giphy JS Components';
//     container.appendChild(h3);
//
//     // Create the section element
//     const section = document.createElement('section');
//
//     // Create and append the H4 element
//     const h4 = document.createElement('h4');
//     h4.textContent = 'Search Gif';
//     section.appendChild(h4);
//
//     // Create and append the div element for the GIF
//     const gifDiv = document.createElement('div');
//     gifDiv.id = 'gif';
//     section.appendChild(gifDiv);
//
//     // Create a div container for search input and button
//     const searchContainer = document.createElement('div');
//     searchContainer.id = 'search-container';
//
//     // Create and append the input element
//     const input = document.createElement('input');
//     input.type = 'text';
//     input.id = 'search-input';
//     input.placeholder = 'Enter your search term';
//     input.required = true;
//
//
//     // Create and append the search button
//     const button = document.createElement('button');
//     button.id = 'search';
//     button.textContent = 'Search';
//
//     // Append input and button to the search container
//     searchContainer.appendChild(input);
//     searchContainer.appendChild(button);
//     console.log('input appended to searchContainer')
//
//     section.appendChild(searchContainer);
//
//     // Create line breaks
//     section.appendChild(document.createElement('br'));
//     section.appendChild(document.createElement('br'));
//
//     // Create and append the div element for the result
//     const resultDiv = document.createElement('div');
//     resultDiv.id = 'result';
//     section.appendChild(resultDiv);
//
//     // Append the section to the container
//     container.appendChild(section);
//
//     // Append the container to the placeholder element in your source HTML
//     const placeholder = document.getElementById('dynamic-content');
//     placeholder.appendChild(container);
// }




//GIPHY Finder
document.body.addEventListener('click', function (event)

{

    if(event.target.id=='searchbtn')
    {

    console.log('search button clicked');

    var searchInput = document.getElementById("search-input").value;
    console.log(searchInput);

    const apiUrl = `https://api.giphy.com/v1/gifs/search?q=${searchInput}&api_key=${giphyApiKey}`;
    console.log(apiUrl);

    searchGIPHY(apiUrl, function (gifs){
        console.log(gifs);

        //Clear up the grid of the search result page
        document.getElementById('result').innerHTML="";

        gifs.forEach((gif,index) => {
            const gifUrl = gif.images.fixed_height.url;
            const embedUrl = gif.embed_url;

            // Create a DOM element to display the GIF (e.g., an <img> element)
            const gifLink = document.createElement('a');
            gifLink.href=embedUrl;
            gifLink.target="_blank";

            const gifElement = document.createElement('img');
            gifElement.src = gifUrl;

            // Set a data attribute to store the unique identifier or index
            gifElement.dataset.gifIndex = index;


            gifLink.appendChild(gifElement);

            // Add a click event listener to the GIF element
            gifElement.addEventListener('click', function (event) {

                //Prevent from opening another tab in the browser
                event.preventDefault();
                document.getElementById('giphy-components').style.display='none';



                // Get the clicked GIF's index from the data attribute
                const clickedIndex = this.dataset.gifIndex;

                //Clear the results pane and search field
                document.getElementById('search-input').value='';
                document.getElementById('result').innerHTML="";

                // Send the selected GIF as a chat message
                sendSelectedGif(gifs[clickedIndex]);
            });



            // Add the GIF element to your chat interface
            // (You might want to append it to a specific container)
            document.getElementById('result').appendChild(gifLink);
        });


        //Function to send the important data to server when a gif is clicked upon
        function sendSelectedGif(selectedGIF){
            socket.emit('chatMessage', {
                sender: username,
                message: selectedGIF.images.fixed_height.url,
                messageType: 'gif',
            });
        }
    });

    //Function to search GIPHY and send back JSON
    function searchGIPHY(apiURL, callback)
    {
        const xhr = new XMLHttpRequest();

// Configure the request
        xhr.open('GET', apiUrl, true);

// Set up a callback function to handle the response
        xhr.onload = function () {
            if (xhr.status === 200) {
                // Parse the JSON response
                const data = JSON.parse(xhr.responseText);
                const gifs = data.data; // An array of GIF objects

                callback(gifs);

            } else {
                console.error('Error fetching GIFs:', xhr.statusText);
            }
        };

        // Handle network errors
        xhr.onerror = function () {
            console.error('Network error while fetching GIFs.');
        };

// Send the AJAX request
        xhr.send();

    }



}});






