(function() {
    let xp = parseInt(localStorage.getItem('dyloki_total_xp')) || 0;
    const XP_PER_MINUTE = 10; 

    function updateRankSystem() {
        const rankLabel = document.getElementById('rank-name');
        const xpCounter = document.getElementById('xp-counter');
        const xpBar = document.getElementById('xp-bar');
        const xpPerc = document.getElementById('xp-percentage');
        
        // Beloningen elementen
        const feat100 = document.getElementById('feat-100');
        const feat500 = document.getElementById('feat-500');
        const feat1000 = document.getElementById('feat-1000');

        let currentRank = "Kijker";
        let nextGoal = 100;
        
        // Rank Logica & Beloningen
        if (xp >= 1000) {
            currentRank = "Dyloki VIP 👑";
            nextGoal = 2500; // Volgend doel na VIP
            if(feat1000) {
                feat1000.style.opacity = "1";
                feat1000.style.borderColor = "var(--cyan)";
                feat1000.innerHTML = "🌟 <strong>VIP Alpha:</strong> Code: <span style='color: var(--cyan);'>mattyou studios styles</span>";
            }
        } 
        
        if (xp >= 500) {
            if (xp < 1000) { currentRank = "Pro Gamer"; nextGoal = 1000; }
            if(feat500) {
                feat500.style.opacity = "1";
                feat500.style.borderColor = "var(--cyan)";
                feat500.innerHTML = "🔓 <a href='https://discord.gg/error' target='_blank' style='color: var(--cyan); font-weight: bold;'>Discord Server Link</a>";
            }
        }

        if (xp >= 100) {
            if (xp < 500) { currentRank = "Abonnee"; nextGoal = 500; }
            if(feat100) {
                feat100.style.opacity = "1";
                feat100.style.borderColor = "var(--cyan)";
                feat100.innerHTML = "✅ <strong>Supporter Badge</strong> | Kleur: #ff0000";
            }
        }

        // Update de UI (als de elementen bestaan op de pagina)
        if(rankLabel) rankLabel.innerText = currentRank;
        if(xpCounter) xpCounter.innerText = xp + " XP";
        
        if(xpBar && xpPerc) {
            let progress = (xp / nextGoal) * 100;
            if (progress > 100) progress = 100;
            xpBar.style.width = progress + "%";
            xpPerc.innerText = Math.floor(progress) + "% naar " + nextGoal + " XP";
        }
    }

    // Admin Code Functie
    window.checkAdminCode = function() {
        const input = document.getElementById('admin-code-input');
        if(!input) return;
        const code = input.value.toLowerCase().trim();
        
        if (code === "mattyou studios xp") {
            xp += 100; 
            localStorage.setItem('dyloki_total_xp', xp);
            updateRankSystem();
            alert("Admin XP Toegevoegd! (+100 XP)");
            input.value = "";
        } else {
            alert("Code onjuist.");
        }
    };

    // Elke minuut XP erbij
    setInterval(function() {
        xp += XP_PER_MINUTE;
        localStorage.setItem('dyloki_total_xp', xp);
        updateRankSystem();
    }, 60000);

    // Initialiseer bij laden
    document.addEventListener('DOMContentLoaded', updateRankSystem);
})();
