const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({
  static: './'
});

// Configuration CORS améliorée
server.use(cors({
  origin: ['https://mon-app-frontend.vercel.app', 'http://localhost:5173'],
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

// Route racine
server.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

server.use(middlewares);

// Routes API
server.use('/api', router);

// Route explicite pour les chats
server.get('/api/chats', (req, res) => {
  const db = router.db;
  res.json(db.get('chats').value() || []);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Backend est en cours d'exécution sur http://localhost:${PORT}`);
});