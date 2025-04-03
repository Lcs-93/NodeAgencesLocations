import express from 'express';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import agencesRouter from './routes/agences.js';
import vehiculesRouter from './routes/vehicules.js';
import usersRouter from './routes/users.js'; // Nouveau routeur pour les utilisateurs
import session from 'express-session'; // Pour gérer les sessions
import dotenv from 'dotenv';

dotenv.config(); // Charger les variables d'environnement depuis .env

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Configuration des sessions
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key', 
    resave: false,
    saveUninitialized: false
}));

// Middleware pour vérifier si l'utilisateur est connecté
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/users/login');
    }
}

// Configuration de la base de données
const db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'gestion_agences',
    port: process.env.DB_PORT || 3306
});

console.log('✅ Connecté à la base de données MySQL');

// Routes
app.use('/users', usersRouter); // Routes pour l'authentification

// Protège les routes principales avec le middleware `isAuthenticated`
app.use('/agences', isAuthenticated, agencesRouter);
app.use('/vehicules', isAuthenticated, vehiculesRouter);

app.get('/', isAuthenticated, (req, res) => {
    res.render('index', { user: req.session.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});

export { db };
