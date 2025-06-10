const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({
  static: './'
});

// Configuration CORS améliorée
server.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Middleware pour logger les requêtes
server.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Route racine pour vérifier que le serveur fonctionne
server.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

server.use(middlewares);
server.use('/api', router); // Préfixe toutes les routes de l'API avec /api

// Route pour les chats
server.get('/chats', (req, res) => {
  const db = router.db;
  res.json(db.get('chats').value() || []);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Backend est en cours d'exécution sur http://localhost:${PORT}`);
});