// Replace 'YOUR_API_KEY' with your actual GIPHY API key
const apiKey = 'kfROCKTKguiDAaSfl40ynCQ3Jvy5EnFH';



//Function to render giphy components

function createGiphyComponents() {
    // Create the main container
    const container = document.createElement('div');
    container.id = 'giphy-components';

    // Create and append the H3 element
    const h3 = document.createElement('h3');
    h3.id = 'banner';
    h3.textContent = 'Giphy JS Components';
    container.appendChild(h3);

    // Create the section element
    const section = document.createElement('section');

    // Create and append the H4 element
    const h4 = document.createElement('h4');
    h4.textContent = 'Search Gif';
    section.appendChild(h4);

    // Create and append the div element for the GIF
    const gifDiv = document.createElement('div');
    gifDiv.id = 'gif';
    section.appendChild(gifDiv);

    // Create and append the input element
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'search-input';
    input.placeholder = 'Enter your search term';
    input.required = true;
    section.appendChild(input);

    // Create and append the search button
    const button = document.createElement('button');
    button.id = 'search';
    button.textContent = 'Search';
    section.appendChild(button);

    // Create line breaks
    section.appendChild(document.createElement('br'));
    section.appendChild(document.createElement('br'));

    // Create and append the div element for the result
    const resultDiv = document.createElement('div');
    resultDiv.id = 'result';
    section.appendChild(resultDiv);

    // Append the section to the container
    container.appendChild(section);

    // Append the container to the placeholder element in your source HTML
    const placeholder = document.getElementById('dynamic-content');
    placeholder.appendChild(container);
}




//GIPHY Finder
document.body.addEventListener('click', function (event)

{

    if(event.target.id=='search')
    {

    console.log('search button clicked');

    var searchInput = document.getElementById("search-input").value;
    console.log(searchInput);

    const apiUrl = `https://api.giphy.com/v1/gifs/search?q=${searchInput}&api_key=${apiKey}`;
    console.log(apiUrl);

    searchGIPHY(apiUrl, function (gifs){
        console.log(gifs);

        document.getElementById('result').innerHTML="";

        gifs.forEach((gif) => {
            const gifUrl = gif.images.fixed_height.url;
            const embedUrl = gif.embed_url;

            // Create a DOM element to display the GIF (e.g., an <img> element)
            const gifLink = document.createElement('a');
            gifLink.href=embedUrl;
            gifLink.target="_blank";

            const gifElement = document.createElement('img');
            gifElement.src = gifUrl;

            gifLink.appendChild(gifElement);
            console.log(gifLink);

            // Add the GIF element to your chat interface
            // (You might want to append it to a specific container)
            document.getElementById('result').appendChild(gifLink);
        });
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






