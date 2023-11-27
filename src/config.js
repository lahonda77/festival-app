
export async function redirectToAuthCodeFlow(clientId, page) {
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
    params.append("redirect_uri", `http://127.0.0.1:5500/${page}`);
    params.append("scope", "user-read-private user-read-email user-follow-read");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function getAccessToken(clientId, code, refreshToken, page) {
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
        params.append("redirect_uri", `http://127.0.0.1:5500/"${page}`);
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

    // Ajouter une console.log pour vérifier si le code atteint ce point
    console.log("Rafraîchissement du jeton d'accès");

     // Stockez le nouveau refresh token, s'il est renvoyé
     if (refresh_token) {
        localStorage.setItem("refreshToken", refresh_token);
        // Ajouter une console.log pour vérifier si le refresh token est stocké correctement
        console.log("Nouveau refresh token : ", refresh_token);
    }

    // Stockez également le jeton d'accès dans localStorage
    localStorage.setItem("accessToken", access_token);
    console.log("Access token : ", access_token);

    console.log("Params for token request:", params.toString());
    console.log("Token request response:", result);
    
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
