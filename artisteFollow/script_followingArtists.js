import { getAccessToken } from "../config.js";

const clientId = "32009ef468f344e8dbe1fdbb0d1b85372";


// Déclaration de refreshToken avec une valeur par défaut (par exemple, vide)
let refreshToken = "";

// Récupération du refreshToken depuis le local storage
const storedRefreshToken = localStorage.getItem("refreshToken");
if (storedRefreshToken) {
    refreshToken = storedRefreshToken;
}

const accessToken = localStorage.getItem("accessToken");

const newAccessToken = await getAccessToken(clientId, null, refreshToken, "followingArtist.html");

// Utilisez directement le nouveau jeton d'accès ici
const followingArtists = await fetchFollowingArtist(newAccessToken);

// Stockez le nouveau token d'accès si nécessaire
localStorage.setItem("accessToken", newAccessToken);


if (!newAccessToken && !refreshToken) {
    document.location.href="./accueil.html";
} else {
    followingArtists.artists.items.forEach(displayFollowingArtists);
    console.log(followingArtists);
    
}



async function fetchFollowingArtist(token) {
    const result = await fetch(`https://api.spotify.com/v1/me/following?type=artist`, {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Response from Spotify API:", result);

    return await result.json();
    
} 


function displayFollowingArtists(artist) {
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
    
        document.getElementById("artistes").appendChild(artisteDiv);

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
