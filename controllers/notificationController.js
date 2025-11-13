import Notification from '../models/notification.js';

// ➕ Créer une notification
export const createNotification = async (req, res) => {
  try {
    const { message, type, userId } = req.body;

    const notif = new Notification({
      message,
      type,
      userId,
    });

    await notif.save();
    res.status(201).json(notif);
  } catch (error) {
    console.error("Erreur création notification:", error);
    res.status(500).json({ message: "Erreur création notification" });
  }
};

// 🔔 Récupérer toutes les notifications d’un utilisateur
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.query.userId; // <<== vient du frontend

    if (!userId) {
      return res.status(400).json({ message: "userId est requis" });
    }

    const notifs = await Notification.find({ userId })
      .sort({ createdAt: -1 });

    res.json(notifs);
  } catch (error) {
    console.error("Erreur récupération notifications:", error);
    res.status(500).json({ message: "Erreur récupération notifications" });
  }
};


// ✅ Marquer une notification comme lue
export const markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notif) {
      return res.status(404).json({ message: "Notification non trouvée" });
    }

    res.json(notif);
  } catch (error) {
    console.error("Erreur mise à jour notification:", error);
    res.status(500).json({ message: "Erreur mise à jour notification" });
  }
};
