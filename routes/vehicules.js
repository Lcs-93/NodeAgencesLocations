import express from 'express';
import { db } from '../app.js';
const router = express.Router();

// Afficher tous les véhicules avec recherche et filtrage
router.get('/', async (req, res) => {
    const { keyword, statut, agenceId, minPrix, maxPrix, annee } = req.query;

    let query = `
        SELECT vehicules.*, agences.nom AS agence_nom
        FROM vehicules
        LEFT JOIN agences ON vehicules.agence_id = agences.id
        WHERE 1 = 1
    `;

    const filters = [];

    if (keyword) {
        query += ` AND (vehicules.marque LIKE ? OR vehicules.modele LIKE ? OR vehicules.immatriculation LIKE ?)`;
        filters.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    if (statut) {
        query += ` AND vehicules.statut = ?`;
        filters.push(statut);
    }

    if (agenceId) {
        query += ` AND vehicules.agence_id = ?`;
        filters.push(agenceId);
    }

    if (minPrix) {
        query += ` AND vehicules.prix_par_jour >= ?`;
        filters.push(minPrix);
    }

    if (maxPrix) {
        query += ` AND vehicules.prix_par_jour <= ?`;
        filters.push(maxPrix);
    }

    if (annee) {
        query += ` AND vehicules.annee = ?`;
        filters.push(annee);
    }

    const [vehicules] = await db.query(query, filters);
    const [agences] = await db.query('SELECT * FROM agences');

    res.render('vehicules/all', { vehicules, agences, keyword, statut, agenceId, minPrix, maxPrix, annee, successMessage: req.query.success, errorMessage: req.query.error });
});

// Formulaire de création de véhicule global (sans agence spécifique)
router.get('/new', async (req, res) => {
    const [agences] = await db.query('SELECT * FROM agences');
    res.render('vehicules/create_general', { agences });
});

// Formulaire de création de véhicule pour une agence spécifique
router.get('/new/:agenceId', async (req, res) => {
    const { agenceId } = req.params;

    const [agenceResult] = await db.query('SELECT * FROM agences WHERE id = ?', [agenceId]);
    const agence = agenceResult[0];

    if (!agence) {
        return res.status(404).send("Agence non trouvée.");
    }

    res.render('vehicules/create_with_agence', { agence });
});

// Ajouter un nouveau véhicule
router.post('/', async (req, res) => {
    const { agenceId, marque, modele, immatriculation, annee, statut, prix_par_jour } = req.body;

    if (!agenceId) {
        return res.redirect('/vehicules?error=Vous devez sélectionner une agence pour ce véhicule.');
    }

    try {
        await db.query(
            'INSERT INTO vehicules (agence_id, marque, modele, immatriculation, annee, statut, prix_par_jour) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [agenceId, marque, modele, immatriculation, annee, statut, prix_par_jour]
        );
        res.redirect('/vehicules?success=Véhicule ajouté avec succès !');
    } catch (error) {
        res.redirect('/vehicules?error=Erreur lors de l\'ajout du véhicule.');
    }
});

// Formulaire d'édition d'un véhicule
router.get('/:id/edit', async (req, res) => {
    const [result] = await db.query('SELECT * FROM vehicules WHERE id = ?', [req.params.id]);
    const [agences] = await db.query('SELECT * FROM agences');
    const vehicule = result[0];
    res.render('vehicules/edit', { vehicule, agences });
});

// Modifier un véhicule
router.post('/:id/edit', async (req, res) => {
    const { agenceId, marque, modele, immatriculation, annee, statut, prix_par_jour } = req.body;

    if (!agenceId) {
        return res.redirect('/vehicules?error=Vous devez sélectionner une agence pour ce véhicule.');
    }

    try {
        await db.query(
            'UPDATE vehicules SET agence_id = ?, marque = ?, modele = ?, immatriculation = ?, annee = ?, statut = ?, prix_par_jour = ? WHERE id = ?', 
            [agenceId, marque, modele, immatriculation, annee, statut, prix_par_jour, req.params.id]
        );
        res.redirect('/vehicules?success=Véhicule modifié avec succès !');
    } catch (error) {
        res.redirect('/vehicules?error=Erreur lors de la modification du véhicule.');
    }
});

// Supprimer un véhicule
router.post('/:id/delete', async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM vehicules WHERE id = ?', [id]);
        res.redirect('/vehicules?success=Véhicule supprimé avec succès !');
    } catch (error) {
        res.redirect('/vehicules?error=Erreur lors de la suppression du véhicule.');
    }
});

export default router;
