const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Configuration du stockage avec vérification des types MIME
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Vérification du type MIME
        const mimeType = file.mimetype;
        let type = 'other';
        
        if (mimeType.startsWith('image/')) type = 'images';
        if (mimeType.startsWith('video/')) type = 'videos';
        if (mimeType.startsWith('audio/')) type = 'audios';
        
        const dir = path.join(__dirname, 'public', type);
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname) || '.' + file.mimetype.split('/')[1];
        cb(null, `${uniqueSuffix}${ext}`);
    }
});

// Configuration Multer avec filtres
const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        'image/jpeg', 'image/png', 'image/gif',
        'audio/mpeg', 'audio/wav', 'audio/ogg',
        'video/mp4', 'video/webm'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Type de fichier non supporté'), false);
    }
};

const limits = {
    fileSize: 50 * 1024 * 1024, // 50MB max
    files: 1
};

const upload = multer({ 
    storage,
    fileFilter,
    limits
});

module.exports = upload;