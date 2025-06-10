const express = require('express');
const jsonServer = require('json-server');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const compression = require('compression');
const fs = require('fs');

const app = express();
const dbPath = path.join(__dirname, 'db.json');
const router = jsonServer.router(dbPath);

// Vérifier si db.json existe, sinon le créer
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({
        "chats": [],
        "notifications": [],
        "calls": [],
        "status": []
    }, null, 2));
}

// Logging
app.use(morgan('dev'));

// Configuration CORS optimisée
app.use(cors({
    origin: ['https://mon-app-frontend.vercel.app', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(compression());

// Middleware de validation JSON
app.use(jsonServer.bodyParser);
app.use((err, req, res, next) => {
    if (err) {
        console.error('Erreur parsing JSON:', err);
        return res.status(400).json({ error: 'Invalid JSON format' });
    }
    next();
});

// Route de test/santé
app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// Routes API avec validation
app.get('/chats', (req, res) => {
    try {
        const db = router.db;
        const chats = db.get('chats').value();
        res.json(Array.isArray(chats) ? chats : []);
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json([]);
    }
});

app.use('/api', router);

// Démarrer le serveur
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});