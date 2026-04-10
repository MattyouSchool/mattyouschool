const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'S3cr3t!1234';
const PORT = 4000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

let users = []; // demo-data. Gebruik een echte DB voor productie.

// Helpers
function findUser(username) {
  return users.find(u => u.username === username);
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.sendStatus(401);
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.sendStatus(401);
  }
}

// Auth endpoints
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  if (findUser(username)) return res.status(400).json({ error: 'Gebruiker bestaat al' });
  const hash = await bcrypt.hash(password, 10);
  users.push({ username, password: hash, coins: 100, xp: 0 });
  res.json({ success: true });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = findUser(username);
  if (!user) return res.status(401).json({ error: 'Onbekende gebruiker' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Verkeerd wachtwoord' });
  const token = jwt.sign({ username }, JWT_SECRET);
  res.json({ token });
});

// Profiel & Coins/XP
app.get('/api/profile', authMiddleware, (req, res) => {
  const user = findUser(req.user.username);
  res.json({ username: user.username, coins: user.coins, xp: user.xp });
});

// Simpele XP/coin update (bijvoorbeeld na mini-game)
app.post('/api/game/reward', authMiddleware, (req, res) => {
  const user = findUser(req.user.username);
  const { coins, xp } = req.body;
  user.coins += coins;
  user.xp += xp;
  res.json({ coins: user.coins, xp: user.xp });
});

// Leaderboard (top 10 op XP)
app.get('/api/leaderboard', (req, res) => {
  const top = users
    .map(u => ({ username: u.username, coins: u.coins, xp: u.xp }))
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 10);
  res.json(top);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));