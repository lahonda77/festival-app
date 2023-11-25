const clientId = "33c2366304a1438db1ff72675608d71e";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

console.log(localStorage.getItem("accessToken"));
const refreshToken = localStorage.getItem("refreshToken");
console.log(localStorage.getItem("refreshToken"));

if (!code && !refreshToken) {
    redirectToAuthCodeFlow(clientId);
} else {
    const accessToken = await getAccessToken(clientId, code, refreshToken);
    // Utilisez le jeton d'accès pour accéder aux ressources protégées
    console.log(accessToken);
    const profil = await fetchProfile(accessToken);
    populateUI(profil);

}

export async function redirectToAuthCodeFlow(clientId) {
    // Nettoyez l'ancien refresh token
    localStorage.removeItem("refreshToken");

    // Générer le code challenge et le vérifier
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    // Stocker le vérificateur dans localStorage
    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://127.0.0.1:5500/index.html");
    params.append("scope", "user-read-private user-read-email user-follow-read");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function getAccessToken(clientId, code, refreshToken) {
    let verifier = localStorage.getItem("verifier");

    if (!verifier) {
        verifier = generateCodeVerifier(128);
        localStorage.setItem("verifier", verifier);
    }

    const params = new URLSearchParams();
    params.append("client_id", clientId);

    if (code) {
        // Obtenir le jeton d'accès initial avec le code d'autorisation
        params.append("grant_type", "authorization_code");
        params.append("code", code);
        params.append("redirect_uri", "http://127.0.0.1:5500/index.html");
        params.append("code_verifier", verifier);
    } else if (refreshToken) {
        // Rafraîchir le jeton d'accès avec le jeton de rafraîchissement
        params.append("grant_type", "refresh_token");
        params.append("refresh_token", refreshToken);
    }

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token, refresh_token } = await result.json();

     // Stockez le nouveau refresh token, s'il est renvoyé
     if (refresh_token) {
        localStorage.setItem("refreshToken", refresh_token);
    }

    // Stockez également le jeton d'accès dans localStorage
    localStorage.setItem("accessToken", access_token);

    return access_token;
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



async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
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

const apiKey = 'VkNutL1Gq7GwTptGIONrGARZjbeAF0eg';
const apiUrl = 'https://app.ticketmaster.com/discovery/v2/events.json';

const query = {
    countryCode: 'US',
    classificationName: 'festival',
    apikey: apiKey,

};

const url = new URL(apiUrl);
url.search = new URLSearchParams(query).toString();

function fetchEvents(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP! Statut: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data from API:', data);

            const festivals = data._embedded && data._embedded.events ? data._embedded.events : [];
            console.log('Festivals:', festivals);

            const paginationLinks = data._links;
            console.log('Pagination Links:', paginationLinks);

            // Récupérer la prochaine page si elle existe
            const nextUrl = paginationLinks && paginationLinks.next ? paginationLinks.next.href : null;
            if (nextUrl) {
                // Récursivement appeler fetchEvents avec l'URL de la page suivante
                return fetchEvents(nextUrl);
            }

            // Récupérez le conteneur où vous souhaitez afficher les festivals
            const festivalsContainer = document.getElementById('festivals-container');

            // Parcourez la liste des festivals
            festivals.forEach(festival => {
                // Créez une div pour chaque festival
                const festivalDiv = document.createElement('div');
                festivalDiv.classList.add('festival');

                // Ajoutez l'image du festival
                const image = document.createElement('img');
                image.src = festival.images && festival.images.length > 0 ? festival.images[0].url : 'URL_PAR_DEFAUT';
                image.alt = festival.name;
                festivalDiv.appendChild(image);

                // Ajoutez le nom du festival
                const name = document.createElement('h2');
                name.textContent = festival.name;
                festivalDiv.appendChild(name);

                // Ajoutez les dates du festival
                const dates = document.createElement('p');
                dates.textContent = `Dates: ${festival.dates.start.localDate} - ${festival.dates.end.localDate}`;
                festivalDiv.appendChild(dates);

                // Ajoutez la div du festival au conteneur
                festivalsContainer.appendChild(festivalDiv);
        });
    })
    .catch(error => console.error('Erreur de requête:', error));
}

// Utilisez cette fonction avec l'URL de la première page
const initialUrl = new URL(apiUrl);
initialUrl.search = new URLSearchParams({ countryCode: 'FR', classificationName: 'festival', apikey: apiKey, page: 0, size: 20 }).toString();

fetchEvents(initialUrl.toString());