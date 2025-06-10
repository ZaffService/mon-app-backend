const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({
  static: './'
});

// Configuration CORS améliorée
server.use(cors({
  origin: '*', // Permettre temporairement toutes les origines
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Middleware pour logger les requêtes
server.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middleware json-server
server.use(middlewares);

// Route racine
server.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Routes API
server.use('/api', router);

// Route explicite pour les chats avec gestion d'erreur
server.get('/api/chats', (req, res) => {
  try {
    const db = router.db;
    const chats = db.get('chats').value() || [];
    res.json(chats);
  } catch (error) {
    console.error('Erreur lors de la récupération des chats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Backend est en cours d'exécution sur http://localhost:${PORT}`);
});