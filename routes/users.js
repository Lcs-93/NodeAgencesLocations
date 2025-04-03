import express from 'express';
import { showSignup, signup, showLogin, login, logout } from '../controllers/usersController.js';

const router = express.Router();

router.get('/signup', showSignup);
router.post('/signup', signup);

router.get('/login', showLogin);
router.post('/login', login);

router.get('/logout', logout);

export default router;
