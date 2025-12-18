import express from 'express';
import {
  createNotification,
  deleteNotification,
  getUserNotifications,
  markAsRead,
} from '../controllers/notificationController.js';


const router = express.Router();

// Créer une notification
router.post('/', createNotification);

// Récupérer les notifications d’un utilisateur
router.get('/', getUserNotifications);
router.delete("/:id", deleteNotification);



export default router;
