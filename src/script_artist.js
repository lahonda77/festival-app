import { getAccessToken } from "./config.js";

const clientId = "33c2366304a1438db1ff72675608d71e";

// Récupérer l'ID de l'artiste depuis les paramètres de l'URL
const urlParams = new URLSearchParams(window.location.search);
const artistId = urlParams.get('id');

// Déclaration de refreshToken avec une valeur par défaut (par exemple, vide)
let refreshToken = "";

// Récupération du refreshToken depuis le local storage
const storedRefreshToken = localStorage.getItem("refreshToken");
if (storedRefreshToken) {
    refreshToken = storedRefreshToken;
}

const accessToken = localStorage.getItem("accessToken");

const newAccessToken = await getAccessToken(clientId, null, refreshToken, "artist.html");

// Utilisez directement le nouveau jeton d'accès ici
const artist = await fetchArtist(newAccessToken, artistId);

// Utilisez directement le nouveau jeton d'accès ici
const relatedArtists = await fetchrelatedArtist(newAccessToken, artistId);

const festivals = await fetchFestivals(artist);

// Stockez le nouveau token d'accès si nécessaire
localStorage.setItem("accessToken", newAccessToken);


if (!newAccessToken && !refreshToken) {
    document.location.href="./index.html";
} else {
    displayArtist(artist);
    relatedArtists.artists.forEach(displayrelatedartists);
    console.log(artist);
    
}


async function fetchArtist(token, id) {
    const result = await fetch(`https://api.spotify.com/v1/artists/${id} `, {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Response from Spotify API:", result);
    return await result.json();
    
} 

async function fetchrelatedArtist(token, id) {
    const result = await fetch(`https://api.spotify.com/v1/artists/${id}/related-artists`, {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
    
} 


function fetchFestivals(artist) {
    // Get the artist name from the input field
    var artistName = artist.name;

    // Make an API request to Ticketmaster to get the festivals of the artist
    var apiKey = 'v7edrNAe492Fy3QtGC0bbnvFGL6ak4GT';
    var apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${encodeURIComponent(artistName)}&apikey=${apiKey}`; //&classificationName='festival'

    // Make the API request using fetch
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Extract relevant information from the API response
            var festivals = data._embedded ? data._embedded.events : [];
            
            // Display the festival list
            displayFestivals(festivals);
        })
        .catch(error => {
            console.error('Error fetching festival data:', error);
        });
}


function displayArtist(artist) {
    const artistId = artist.id;
    const artistName = artist.name;
    const artistImage = new Image(200, 200);
    artistImage.src = artist.images[0].url;
    
    artistImage.onload = function () {
        // Créer des éléments pour chaque artiste
        const artisteDiv = document.createElement("div");
        artisteDiv.id = artistId;
    
        const imageDiv = document.createElement("div");
        imageDiv.style.backgroundImage = `url(${artistImage.src})`;
        imageDiv.className = "image";
    
        const nameParagraph = document.createElement("h2");
        nameParagraph.textContent = artistName;
    
        // Ajouter les éléments à la div "artistes"
        artisteDiv.appendChild(imageDiv);
        artisteDiv.appendChild(nameParagraph);
    
        document.getElementById("artiste").appendChild(artisteDiv);
        

        // Gestion des erreurs pour l'image
        artistImage.onerror = function () {
            console.error("Erreur de chargement de l'image pour l'artiste", artistName);
        };
    };
}


function displayrelatedartists(artist) {
    const artistId = artist.id;
    const artistName = artist.name;
    const artistImage = new Image(200, 200);
    artistImage.src = artist.images[0].url;
    
    artistImage.onload = function () {
        // Créer des éléments pour chaque artiste
        const artisteDiv = document.createElement("div");
        artisteDiv.id = artistId;
    
        const imageDiv = document.createElement("div");
        imageDiv.style.backgroundImage = `url(${artistImage.src})`;
        imageDiv.className = "image";
    
        const nameParagraph = document.createElement("p");
        nameParagraph.textContent = artistName;
    
        // Ajouter les éléments à la div "artistes"
        artisteDiv.appendChild(imageDiv);
        artisteDiv.appendChild(nameParagraph);
    
        document.getElementById("related-artistes").appendChild(artisteDiv);

        // Ajouter un gestionnaire d'événements de clic pour rediriger vers artiste.html
        artisteDiv.addEventListener("click", function () {
            window.location.href = `artist.html?id=${artistId}`;
        });
        

        // Gestion des erreurs pour l'image
        artistImage.onerror = function () {
            console.error("Erreur de chargement de l'image pour l'artiste", artistName);
        };
    };
}



function displayFestivals(festivals) {
    var festivalListDiv = document.getElementById('festivalList');
    
    // Clear previous results
    festivalListDiv.innerHTML = '';

    // Display each festival in the list
    festivals.forEach(festival => {
        console.log(festival);
        var festivalItem = document.createElement('div');
        festivalItem.textContent = festival.name;
        festivalListDiv.appendChild(festivalItem);
    });
}
