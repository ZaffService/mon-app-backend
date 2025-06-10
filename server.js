const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Utiliser les middlewares par défaut de json-server
server.use(middlewares);

server.use(cors({
  origin: '*', // Permettre toutes les origines en développement
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}));

// Middleware pour parser le body
server.use(jsonServer.bodyParser);

// Routes par défaut de json-server
server.use(router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Backend est en cours d'exécution sur http://localhost:${PORT}`);
});