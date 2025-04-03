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
    res.render('users/login');
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
        req.session.user = user;
        res.redirect('/');
    } else {
        res.redirect('/users/login?error=Mot de passe incorrect.');
    }
};

// Déconnexion de l'utilisateur
export const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};
