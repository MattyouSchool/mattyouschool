// INITIALISATIE
let xp = parseInt(localStorage.getItem('user_xp')) || 0;

function updateStats() {
    // XP Opslaan
    localStorage.setItem('user_xp', xp);
    
    // UI Updaten
    const xpDisplay = document.getElementById('xp-counter');
    const rankDisplay = document.getElementById('rank-tag');
    
    if(xpDisplay) xpDisplay.innerText = `XP: ${xp}`;
    
    // RANK BEREKENING
    let rank = "ROOKIE";
    if (xp >= 100) rank = "AGENT";
    if (xp >= 500) rank = "ELITE";
    if (xp >= 1000) rank = "MASTER";
    if (xp >= 5000) rank = "LEGEND";
    
    if(rankDisplay) rankDisplay.innerText = `RANK: ${rank}`;
}

// ELKE MINUUT 10 XP GEVEN
setInterval(() => {
    xp += 10;
    console.log("10 XP verdiend voor online zijn!");
    updateStats();
}, 60000); // 60.000 ms = 1 minuut

// DIRECT LADEN BIJ OPENEN PAGINA
updateStats();
