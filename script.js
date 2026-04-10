// --- DYLOKI CENTRAL SYSTEM ---
// Made by mattyou studios™ x Dylano

let xp = parseInt(localStorage.getItem('dyloki_xp')) || 0;
let coins = parseInt(localStorage.getItem('dyloki_coins')) || 0;

function updateUI() {
    // XP & Coins weergeven op alle elementen die bestaan
    if(document.getElementById('xp-display')) document.getElementById('xp-display').innerText = xp;
    if(document.getElementById('nav-xp')) document.getElementById('nav-xp').innerText = "XP: " + xp;
    if(document.getElementById('coin-display')) document.getElementById('coin-display').innerText = coins;
    if(document.getElementById('nav-coins')) document.getElementById('nav-coins').innerText = "🪙 " + coins;

    // Rank systeem berekening
    let rank = "Beginner";
    let progress = 0;

    if (xp >= 5000) { 
        rank = "Dyloki Legend"; 
        progress = 100; 
    } else if (xp >= 1000) { 
        rank = "Elite Gamer"; 
        progress = ((xp - 1000) / 4000) * 100; 
    } else if (xp >= 500) { 
        rank = "Pro Player"; 
        progress = ((xp - 500) / 500) * 100; 
    } else if (xp >= 100) { 
        rank = "Advanced"; 
        progress = ((xp - 100) / 400) * 100; 
    } else {
        progress = (xp / 100) * 100;
    }

    if(document.getElementById('rank-display')) document.getElementById('rank-display').innerText = rank;
    if(document.getElementById('progress-bar')) document.getElementById('progress-bar').style.width = progress + "%";
}

// Elke 6 seconden krijgt de gebruiker 1 XP en 5 Coins (Totaal 10 XP / 50 Coins per minuut)
setInterval(() => {
    xp += 1;
    coins += 5;
    localStorage.setItem('dyloki_xp', xp);
    localStorage.setItem('dyloki_coins', coins);
    updateUI();
}, 6000);

// Shop Functie
function buyItem(itemName, price) {
    if (coins >= price) {
        coins -= price;
        localStorage.setItem('dyloki_coins', coins);
        updateUI();
        alert("Succes! Je hebt de " + itemName + " gekocht.");
    } else {
        alert("Helaas! Je hebt nog " + (price - coins) + " extra coins nodig voor de " + itemName);
    }
}

// Direct laden bij opstarten
window.onload = updateUI;
