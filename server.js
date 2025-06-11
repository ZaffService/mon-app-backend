require('dotenv').config();
const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Middlewares
server.use(middlewares);

// Configuration des limites
server.use(jsonServer.bodyParser);

// Configuration CORS
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// Logging middleware
server.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Routes - Montage direct du router json-server
server.use('/', router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📁 Base de données chargée depuis ${path.join(__dirname, 'db.json')}`);
});