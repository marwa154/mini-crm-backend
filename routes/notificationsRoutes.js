import express from 'express';
import {
  createNotification,
  getUserNotifications,
  markAsRead,
} from '../controllers/notificationController.js';


const router = express.Router();

// Créer une notification
router.post('/', createNotification);

// Récupérer les notifications d’un utilisateur
router.get('/', getUserNotifications);



export default router;
