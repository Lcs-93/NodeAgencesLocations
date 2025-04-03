import express from 'express';
import { 
    getAllVehicles, 
    renderCreateVehicleForm, 
    renderCreateVehicleWithAgencyForm, 
    addVehicle, 
    renderEditVehicleForm, 
    editVehicle, 
    deleteVehicle 
} from '../controllers/vehiculesController.js';

const router = express.Router();

// Afficher tous les véhicules
router.get('/', getAllVehicles);

// Formulaire de création de véhicule global
router.get('/new', renderCreateVehicleForm);

// Formulaire de création de véhicule pour une agence spécifique
router.get('/new/:agenceId', renderCreateVehicleWithAgencyForm);

// Ajouter un nouveau véhicule
router.post('/', addVehicle);

// Formulaire d'édition d'un véhicule
router.get('/:id/edit', renderEditVehicleForm);

// Modifier un véhicule
router.post('/:id/edit', editVehicle);

// Supprimer un véhicule
router.post('/:id/delete', deleteVehicle);

export default router;
