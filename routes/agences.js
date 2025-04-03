import express from 'express';
import { 
    getAllAgences,
    renderCreateAgenceForm,
    addAgence,
    renderEditAgenceForm,
    editAgence,
    deleteAgence,
    viewAgenceVehicles,
    renderAddVehicleForm
} from '../controllers/agencesController.js';

const router = express.Router();

// Afficher toutes les agences
router.get('/', getAllAgences);

// Formulaire d'ajout d'une nouvelle agence
router.get('/new', renderCreateAgenceForm);

// Ajouter une nouvelle agence
router.post('/', addAgence);

// Formulaire de modification d'une agence
router.get('/:id/edit', renderEditAgenceForm);

// Modifier une agence
router.post('/:id/edit', editAgence);

// Supprimer une agence
router.post('/:id/delete', deleteAgence);

// Voir les véhicules d'une agence spécifique
router.get('/:id/vehicules', viewAgenceVehicles);

// Formulaire pour ajouter un véhicule à une agence spécifique
router.get('/:id/vehicules/new', renderAddVehicleForm);

export default router;
