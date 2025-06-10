const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Configuration de base
server.use(middlewares);

// Configuration CORS spécifique
server.use(cors({
  origin: ['https://mon-app-frontend.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}));

// Middleware pour parser le body
server.use(jsonServer.bodyParser);

// Route de test pour vérifier que le serveur fonctionne
server.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Routes de l'API
server.use('/api', router); // Ajout du préfixe /api

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Backend est en cours d'exécution sur http://localhost:${PORT}`);
});