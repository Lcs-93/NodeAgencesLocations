import bcrypt from 'bcrypt';
import { db } from '../app.js';

// Afficher le formulaire d'inscription
export const showSignup = (req, res) => {
    res.render('users/signup');
};

// Inscription d'un nouvel utilisateur
export const signup = async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

    res.redirect('/users/login');
};

// Afficher le formulaire de connexion
export const showLogin = (req, res) => {
    res.render('users/login', { errorMessage: req.query.error || null });
};

// Connexion de l'utilisateur
export const login = async (req, res) => {
    const { email, password } = req.body;
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
        return res.redirect('/users/login?error=Utilisateur non trouvé.');
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (validPassword) {
        req.session.user = { id: user.id, username: user.username, email: user.email }; // Ne pas stocker le mot de passe en session
        res.redirect('/');
    } else {
        res.redirect('/users/login?error=Mot de passe incorrect.');
    }
};

// Déconnexion de l'utilisateur
export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Erreur lors de la déconnexion : ", err);
            return res.redirect('/');
        }
        res.clearCookie('connect.sid'); // Supprime le cookie côté client

        // Redirige vers la page de connexion sans paramètres dans l'URL
        return res.redirect('/users/login');
    });
};