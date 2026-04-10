// Data laden
let xp = parseInt(localStorage.getItem('dyloki_xp')) || 0;
let coins = parseInt(localStorage.getItem('dyloki_coins')) || 0;

function updateUI() {
    // XP & Coins weergeven
    document.getElementById('xp-display').innerText = xp;
    document.getElementById('nav-xp').innerText = "XP: " + xp;
    document.getElementById('coin-display').innerText = coins;
    document.getElementById('nav-coins').innerText = "🪙 " + coins;

    // Rank systeem
    let rank = "Beginner";
    let progress = (xp / 100) * 100;

    if (xp >= 5000) { rank = "Dyloki Legend"; progress = 100; }
    else if (xp >= 1000) { rank = "Elite Gamer"; progress = (xp / 5000) * 100; }
    else if (xp >= 500) { rank = "Pro Player"; progress = (xp / 1000) * 100; }
    else if (xp >= 100) { rank = "Advanced"; progress = (xp / 500) * 100; }

    document.getElementById('rank-display').innerText = rank;
    document.getElementById('progress-bar').style.width = progress + "%";
}

// Elke 6 seconden (dus 10 keer per minuut)
setInterval(() => {
    xp += 1;      // Totaal 10 XP per minuut
    coins += 5;   // Totaal 50 Coins per minuut
    
    localStorage.setItem('dyloki_xp', xp);
    localStorage.setItem('dyloki_coins', coins);
    updateUI();
}, 6000);

updateUI();
