const jsonServer = require('json-server');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const fs = require('fs');

const server = jsonServer.create();
const dbPath = path.join(__dirname, 'db.json');

// Vérifier si db.json existe, sinon le créer
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({
        "chats": [],
        "notifications": [],
        "calls": [],
        "status": []
    }, null, 2));
}

const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

// Configuration CORS optimisée
const corsOptions = {
    origin: ['https://mon-app-frontend.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200
};

server.use(compression());
server.use(cors(corsOptions));
server.use(middlewares);

// Middleware de validation JSON
server.use(jsonServer.bodyParser);
server.use((err, req, res, next) => {
    if (err) {
        console.error('Erreur parsing JSON:', err);
        return res.status(400).json({ error: 'Invalid JSON format' });
    }
    next();
});

// Route de test/santé
server.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// Routes API avec validation
server.get('/chats', (req, res) => {
    try {
        const db = router.db;
        const chats = db.get('chats').value();
        res.json(Array.isArray(chats) ? chats : []);
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json([]);
    }
});

server.use(router);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});