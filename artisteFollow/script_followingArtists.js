const clientId = "33c2366304a1438db1ff72675608d71e";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    const accessToken = await getAccessToken(clientId, code);
    const profil = await fetchProfile(accessToken);
    console.log(accessToken);
    const followingartists = await fetchFollowingArtists(accessToken);
    console.log(followingartists);
    populateUI(profil);
     // Parcourir les artistes et appeler la fonction pour afficher les détails
    followingartists.artists.items.forEach(displayfollowingartists);
   const  artist = await fetchArtist(accessToken);
    console.log(artist);
    const  relatedartist = await fetchrelatedArtist(accessToken);
    console.log(relatedartist);
      console.log(profil); // Profile data logs to console
}

export async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://127.0.0.1:5500/followingArtists.html");
    params.append("scope", "user-read-private user-read-email user-follow-read");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}


export async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://127.0.0.1:5500/followingArtists.html");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}

async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
    
} 
async function fetchFollowingArtists(token) {
    const result = await fetch("https://api.spotify.com/v1/me/following?type=artist&offset=0&limit=10", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
    
} 

function populateUI(profile) {
    document.getElementById("displayName").innerText = profile.display_name;
    if (profile.images[0]) {
        const profileImage = new Image(200, 200);
        profileImage.src = profile.images[0].url;
        document.getElementById("avatar").appendChild(profileImage);
        document.getElementById("imgUrl").innerText = profile.images[0].url;
    }
    document.getElementById("id").innerText = profile.id;
    document.getElementById("email").innerText = profile.email;
    document.getElementById("uri").innerText = profile.uri;
    document.getElementById("uri").setAttribute("href", profile.external_urls.spotify);
    document.getElementById("url").innerText = profile.href;
    document.getElementById("url").setAttribute("href", profile.href);
}

function displayfollowingartists(artist) {
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


async function fetchArtist(token) {
    const result = await fetch("https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
    
} 


async function fetchrelatedArtist(token) {
    const result = await fetch("https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg/related-artists", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
    
} 
