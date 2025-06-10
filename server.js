require('dotenv').config();
const express = require('express');
const jsonServer = require('json-server');
const cors = require('cors');

const server = jsonServer.create();
const router = jsonServer.router('db.json');

// Configuration des limites de taille
server.use(express.json({limit: process.env.MAX_PAYLOAD_SIZE}));
server.use(express.urlencoded({
    extended: true,
    limit: process.env.MAX_PAYLOAD_SIZE
}));

// Configuration CORS
server.use(cors({
    origin: process.env.CORS_ORIGINS.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware de logging et debug
server.use((req, res, next) => {
    if (req.method === 'PUT' && req.url.includes('/chats/')) {
        console.log('PUT request payload:', req.body);
    }
    next();
});

// Gestion des erreurs
server.use((error, req, res, next) => {
    console.error('Erreur serveur:', error);
    res.status(500).json({
        error: 'Erreur serveur',
        message: error.message
    });
});

// Routes
server.use('/api', router);

const PORT = process.env.PORT || 3000; // Changement de 5001 à 3000 pour Render
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});