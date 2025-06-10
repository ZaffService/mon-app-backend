const jsonServer = require('json-server');
const cors = require('cors');
const path = require('path');
const compression = require('compression');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Configuration CORS optimisée
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'https://mon-app-frontend.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Range'],
    exposedHeaders: ['Content-Range', 'Content-Length', 'Accept-Ranges'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Compression gzip
server.use(compression());
server.use(cors(corsOptions));
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Initialisation de la base de données si elle n'existe pas
const db = router.db;
if (!db.has('chats').value()) {
    db.set('chats', []).write();
}

// Routes API améliorées
server.get('/chats', (req, res) => {
    try {
        const chats = router.db.get('chats').value();
        res.json(chats || []);
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

server.post('/chats', (req, res) => {
    try {
        const newMessage = req.body;
        const chats = router.db.get('chats');
        
        // Ajouter le nouveau message
        const result = chats.push(newMessage).write();
        
        // Émettre un événement pour la mise à jour en temps réel
        res.json(result);
    } catch (error) {
        console.error('Error adding message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route pour récupérer les messages d'un chat spécifique
server.get('/chats/:chatId', (req, res) => {
    try {
        const { chatId } = req.params;
        const chat = router.db.get('chats')
            .find({ id: chatId })
            .value();
            
        res.json(chat || { messages: [] });
    } catch (error) {
        console.error('Error fetching chat:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Gestion des fichiers audio
server.post('/audio', (req, res) => {
    res.header('Content-Type', 'application/json');
    // Logique de traitement audio ici
    res.json({ success: true });
});

// Route par défaut
server.use('/api', router);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});