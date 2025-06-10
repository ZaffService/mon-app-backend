const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({
  static: './'
});

// Middleware pour logger les requêtes avant CORS
server.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Configuration CORS mise à jour
server.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

server.use(middlewares);

// Route de test pour vérifier que le serveur fonctionne
server.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Montage du routeur JSON Server à la racine
server.use('/', router);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Backend est en cours d'exécution sur http://localhost:${PORT}`);
  console.log('Routes disponibles:', Object.keys(router.db.__wrapped__));
});