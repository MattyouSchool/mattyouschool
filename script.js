// --- DYLOKI CLOUD ENGINE v3.1 ---
// Made by mattyou studios™ x Dylano

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// FIREBASE CONFIG (Zelf invullen vanuit Firebase Console)
const firebaseConfig = {
    apiKey: "JOUW_API_KEY",
    authDomain: "JOUW_PROJECT.firebaseapp.com",
    databaseURL: "https://JOUW_PROJECT-default-rtdb.firebaseio.com",
    projectId: "JOUW_PROJECT",
    storageBucket: "JOUW_PROJECT.appspot.com",
    messagingSenderId: "ID",
    appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentUser = JSON.parse(localStorage.getItem('dyloki_session')) || null;

// --- AUTH FUNCTIES ---
window.register = async function() {
    const user = document.getElementById('reg-user').value.trim().toLowerCase();
    const pass = document.getElementById('reg-pass').value;
    if (!user || !pass) return alert("Vul alles in!");

    const userRef = ref(db, 'users/' + user);
    const snapshot = await get(userRef);
    if (snapshot.exists()) return alert("Naam is al bezet!");

    await set(userRef, { username: user, password: pass, xp: 0, coins: 0 });
    alert("Account aangemaakt! Scroll naar 'Inloggen'.");
};

window.login = async function() {
    const user = document.getElementById('log-user').value.trim().toLowerCase();
    const pass = document.getElementById('log-pass').value;

    const userRef = ref(db, 'users/' + user);
    const snapshot = await get(userRef);

    if (snapshot.exists() && snapshot.val().password === pass) {
        currentUser = snapshot.val();
        localStorage.setItem('dyloki_session', JSON.stringify(currentUser));
        location.reload(); 
    } else {
        alert("Foutieve gegevens!");
    }
};

window.logout = function() {
    localStorage.removeItem('dyloki_session');
    location.reload();
};

// --- XP & UI ---
function startPassiveEarning() {
    if (!currentUser) return;
    setInterval(async () => {
        currentUser.xp += 1;
        currentUser.coins += 5;
        const userRef = ref(db, 'users/' + currentUser.username);
        await update(userRef, { xp: currentUser.xp, coins: currentUser.coins });
        localStorage.setItem('dyloki_session', JSON.stringify(currentUser));
        updateUI();
    }, 6000);
}

function updateUI() {
    if (currentUser) {
        if (document.getElementById('auth-section')) document.getElementById('auth-section').style.display = 'none';
        if (document.getElementById('main-content')) document.getElementById('main-content').style.display = 'block';
        
        const ids = {
            'nav-xp': `XP: ${currentUser.xp}`,
            'nav-coins': `🪙 ${currentUser.coins}`,
            'xp-display': currentUser.xp,
            'coin-display': currentUser.coins,
            'user-welcome': currentUser.username.toUpperCase()
        };

        for (let id in ids) {
            let el = document.getElementById(id);
            if (el) el.innerText = ids[id];
        }

        let rank = "Novice";
        if (currentUser.xp >= 5000) rank = "Dyloki Legend";
        else if (currentUser.xp >= 1000) rank = "Elite Gamer";
        else if (currentUser.xp >= 500) rank = "Pro Player";

        if (document.getElementById('rank-display')) document.getElementById('rank-display').innerText = rank;
        if (document.getElementById('progress-bar')) {
            document.getElementById('progress-bar').style.width = (currentUser.xp % 500) / 5 + "%";
        }
    }
}

updateUI();
if (currentUser) startPassiveEarning();
