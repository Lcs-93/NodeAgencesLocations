import { db } from '../app.js';

// Afficher toutes les agences avec nombre de véhicules et prix moyen
export const getAllAgences = async (req, res) => {
    const [agences] = await db.query(`
        SELECT agences.id, agences.nom, agences.adresse, agences.telephone, agences.email,
               COUNT(vehicules.id) AS nombre_vehicules,
               IFNULL(ROUND(AVG(vehicules.prix_par_jour), 2), 0) AS prix_moyen
        FROM agences
        LEFT JOIN vehicules ON agences.id = vehicules.agence_id
        GROUP BY agences.id;
    `);
    res.render('agences/index', { agences });
};

// Formulaire d'ajout d'une nouvelle agence
export const renderCreateAgenceForm = (req, res) => {
    res.render('agences/create');
};

// Ajouter une agence
export const addAgence = async (req, res) => {
    const { nom, adresse, telephone, email } = req.body;
    await db.query('INSERT INTO agences (nom, adresse, telephone, email) VALUES (?, ?, ?, ?)', 
        [nom, adresse, telephone, email]);
    res.redirect('/agences');
};

// Formulaire de modification d'une agence
export const renderEditAgenceForm = async (req, res) => {
    const [result] = await db.query('SELECT * FROM agences WHERE id = ?', [req.params.id]);
    const agence = result[0];
    res.render('agences/edit', { agence });
};

// Modifier une agence
export const editAgence = async (req, res) => {
    const { nom, adresse, telephone, email } = req.body;
    await db.query('UPDATE agences SET nom = ?, adresse = ?, telephone = ?, email = ? WHERE id = ?', 
        [nom, adresse, telephone, email, req.params.id]);
    res.redirect('/agences');
};

// Supprimer une agence
export const deleteAgence = async (req, res) => {
    await db.query('DELETE FROM agences WHERE id = ?', [req.params.id]);
    res.redirect('/agences');
};

// Voir les véhicules d'une agence spécifique
export const viewAgenceVehicles = async (req, res) => {
    const { id } = req.params;

    // Récupère l'agence
    const [agenceResult] = await db.query('SELECT * FROM agences WHERE id = ?', [id]);
    const agence = agenceResult[0];

    if (!agence) {
        return res.status(404).send("Agence non trouvée.");
    }

    // Récupère les véhicules associés à cette agence
    const [vehicules] = await db.query('SELECT * FROM vehicules WHERE agence_id = ?', [id]);

    res.render('agences/vehicules', { agence, vehicules });
};

// Formulaire pour ajouter un véhicule à une agence spécifique
export const renderAddVehicleForm = async (req, res) => {
    const { id } = req.params;

    // Récupérer l'agence sélectionnée
    const [agenceResult] = await db.query('SELECT * FROM agences WHERE id = ?', [id]);
    const agence = agenceResult[0];

    if (!agence) {
        return res.status(404).send("Agence non trouvée.");
    }

    res.render('vehicules/create_with_agence', { agence });
};
