require('dotenv').config();
const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Middlewares
server.use(middlewares);

// Configuration CORS
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// Routes
server.use('/', router); // Notez le changement ici : de '/api' à '/'

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
    console.log(`📁 Base de données chargée depuis ${path.join(__dirname, 'db.json')}`);
});