// --- KLOK LOGICA ---
function updateClock() {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString();
}
setInterval(updateClock, 1000); 
updateClock();

// --- APPARATUUR INFO OPHALEN ---
document.getElementById('sys-platform').innerText = navigator.userAgent.split(' ')[0] || "Web-omgeving";

// --- WINDOWS BEHEER ---
function openWindow(id) {
    const win = document.getElementById(`window-${id}`);
    win.classList.add('open');
    bringToFront(win);
    updateTaskbar();
}

function closeWindow(id) {
    document.getElementById(`window-${id}`).classList.remove('open');
    updateTaskbar();
}

function closeAllWindows() {
    document.querySelectorAll('.window').forEach(w => w.classList.remove('open'));
    updateTaskbar();
}

function openWindowFromStart(id) {
    openWindow(id);
    toggleStartMenu();
}

function bringToFront(windowElement) {
    document.querySelectorAll('.window').forEach(w => w.style.zIndex = 10);
    windowElement.style.zIndex = 100;
}

// --- STARTMENU LOGICA ---
const startMenu = document.getElementById('startMenu');
function toggleStartMenu(e) {
    if(e) e.stopPropagation();
    startMenu.style.display = (startMenu.style.display === 'flex') ? 'none' : 'flex';
}
window.addEventListener('click', () => startMenu.style.display = 'none');
startMenu.addEventListener('click', (e) => e.stopPropagation());

// --- TAAKBALK UPDATE ---
function updateTaskbar() {
    const container = document.getElementById('taskbarApps');
    container.innerHTML = '';
    document.querySelectorAll('.window').forEach(win => {
        if(win.classList.contains('open')) {
            const title = win.querySelector('.window-title').innerText;
            const appBtn = document.createElement('div');
            appBtn.className = 'taskbar-app-icon';
            appBtn.innerText = title;
            appBtn.onclick = () => bringToFront(win);
            container.appendChild(appBtn);
        }
    });
}

// --- TOETSENBORD SNELTOETSEN ---
window.addEventListener('keydown', function(e) {
    if (e.key === "Escape") closeAllWindows();
    if (e.key === "Meta" || e.key === "OS") {
        e.preventDefault();
        toggleStartMenu();
    }
});

// --- RECHTERMUISKNOP (CUSTOM MENU) ---
const desktopMenu = document.getElementById('desktopMenu');
window.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    desktopMenu.style.left = e.clientX + "px";
    desktopMenu.style.top = e.clientY + "px";
    desktopMenu.style.display = "block";
});
window.addEventListener('click', () => desktopMenu.style.display = "none");

function changeWallpaper(theme) {
    const b = document.getElementById('desktop-body');
    if(theme === 'dark') b.style.background = "linear-gradient(135deg, #0f172a, #1e1b4b)";
    if(theme === 'neon') b.style.background = "linear-gradient(135deg, #2e0854, #ff007f)";
    if(theme === 'matrix') b.style.background = "linear-gradient(135deg, #051605, #001100)";
}

// --- SLEPEN VAN VENSTERS ---
let currentWindow = null;
let offsetX = 0, offsetY = 0;
function startDrag(e, id) {
    currentWindow = document.getElementById(id);
    bringToFront(currentWindow);
    offsetX = e.clientX - currentWindow.offsetLeft;
    offsetY = e.clientY - currentWindow.offsetTop;
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
}

function drag(e) {
    if (!currentWindow) return;
    currentWindow.style.left = (e.clientX - offsetX) + 'px';
    currentWindow.style.top = (e.clientY - offsetY) + 'px';
}

function stopDrag() {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
    currentWindow = null;
}

// --- KLADBLOK ADVANCED FUNCTIES ---
const notepadText = document.getElementById('notepad-text');
function updateWordCount() {
    const text = notepadText.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    document.getElementById('notepad-counter').innerText = `Woorden: ${words}`;
}

function changeTextFormat(type) {
    if(type === 'uppercase') notepadText.value = notepadText.value.toUpperCase();
    if(type === 'lowercase') notepadText.value = notepadText.value.toLowerCase();
    updateWordCount();
}

function clearNotepad() {
    notepadText.value = '';
    updateWordCount();
}

// --- REKENMACHINE FUNCTIES ---
const calcScreen = document.getElementById('calc-screen');
function pressCalc(val) {
    if(calcScreen.value === '0' && val !== '.') calcScreen.value = '';
    calcScreen.value += val;
}

function clearCalc() { 
    calcScreen.value = '0'; 
}

function calculateResult() {
    try {
        // eval voert de rekensom uit die als tekst op het scherm staat
        calcScreen.value = eval(calcScreen.value);
    } catch(e) {
        calcScreen.value = 'Fout';
    }
}

// --- BESTANDSBEHEER GENERATOR ---
const mockFiles = [
    { name: "Project.txt", icon: "📄" },
    { name: "Vakantie.jpg", icon: "🖼️" },
    { name: "Muziek.mp3", icon: "🎵" },
    { name: "Huiswerk", icon: "📁" }
];
const fileViewer = document.getElementById('file-viewer');
mockFiles.forEach(file => {
    const fDiv = document.createElement('div');
    fDiv.style.cssText = "display:flex; flex-direction:column; align-items:center; gap:5px; text-align:center; padding:5px; cursor:pointer; font-size:0.8rem;";
    fDiv.innerHTML = `<div style="font-size:1.8rem;">${file.icon}</div><div>${file.name}</div>`;
    fDiv.ondblclick = () => alert(`Bestand geopend: ${file.name}`);
    fileViewer.appendChild(fDiv);
});
