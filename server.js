require('dotenv').config();
const jsonServer = require('json-server');
const express = require('express');
const cors = require('cors');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Configuration CORS
server.use(cors({
    origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configuration des limites
server.use(express.json({limit: '50mb'}));
server.use(express.urlencoded({limit: '50mb', extended: true}));

// Middlewares par défaut
server.use(middlewares);

// Routes
server.use('/', router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});