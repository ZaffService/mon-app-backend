require('dotenv').config();
const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Middlewares
server.use(middlewares);

// Configuration CORS personnalisée
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// Configuration des limites de taille
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        if (req.body && Object.keys(req.body).length > 0) {
            console.log(`${req.method} request body:`, req.body);
        }
    }
    next();
});

// Routes
server.use('/api', router);

// Gestion des erreurs
server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Erreur serveur',
        message: err.message
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});