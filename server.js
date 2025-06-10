const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({
  static: '../'  // Permet d'accéder aux fichiers depuis la racine du projet
});

// Configuration CORS
server.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

server.use(middlewares);
server.use(router);

const PORT = 5001;
server.listen(PORT, () => {
  console.log(`Backend est en cours d'exécution sur http://localhost:${PORT}`);
});