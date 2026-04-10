// --- DYLOKI CLOUD ENGINE v4.0 ---
// Made by mattyou studios™ x Dylano

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Jouw Firebase Config uit de afbeelding
const firebaseConfig = {
    apiKey: "AIzaSyCi5LxXD-FGvdmLZGXPENYBWraWdDUNck0",
    authDomain: "dyloki-cloud.firebaseapp.com",
    databaseURL: "https://dyloki-cloud-default-rtdb.firebaseio.com",
    projectId: "dyloki-cloud",
    storageBucket: "dyloki-cloud.firebasestorage.app",
    messagingSenderId: "486650834826",
    appId: "1:486650834826:web:d5efeb0af6cc574d0c2273",
    measurementId: "G-40YRW3TTGR"
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
    if (snapshot.exists()) return alert("Deze naam is al bezet!");

    await set(userRef, { username: user, password: pass, xp: 0, coins: 0 });
    alert("Account succesvol aangemaakt! Je kunt nu inloggen.");
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
        alert("Gebruikersnaam of wachtwoord is onjuist.");
    }
};

window.logout = function() {
    localStorage.removeItem('dyloki_session');
    location.reload();
};

// --- XP & COIN EARNING ---
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
        if (currentUser.xp >= 5000) rank = "Dyloki Master";
        else if (currentUser.xp >= 1000) rank = "Elite";
        else if (currentUser.xp >= 500) rank = "Pro";

        if (document.getElementById('rank-display')) document.getElementById('rank-display').innerText = rank;
        if (document.getElementById('progress-bar')) {
            document.getElementById('progress-bar').style.width = (currentUser.xp % 1000) / 10 + "%";
        }
    }
}

updateUI();
if (currentUser) startPassiveEarning();
