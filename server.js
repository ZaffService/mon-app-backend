const jsonServer = require('json-server');
const cors = require('cors');
const path = require('path');
const compression = require('compression');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Configuration CORS optimisée
const corsOptions = {
    origin: ['https://mon-app-frontend.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware personnalisé pour les en-têtes CORS
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

server.use(compression());
server.use(cors(corsOptions));
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Route de test pour vérifier la connexion
server.get('/test', (req, res) => {
    res.json({ status: 'ok' });
});

// Routes principales
server.use('/api', router);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});