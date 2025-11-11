// services/journalService.js
import JournalAction from "../models/Jounalisation.js";

export const createJournal = async ({
  userId,
  typeAction,
  module,
  targetId,
  description,
  oldValue,
  newValue,
}) => {
  try {
    await JournalAction.create({
      userId,
      typeAction,
      module,
      targetId,
      description,
      oldValue,
      newValue,
    });
  } catch (err) {
    console.error(" Erreur création journal :", err.message);
  }
};

// Récupérer tous les logs
export const getAllLogs = async (req, res) => {
  try {
    const logs = await JournalAction.find().sort({ createdAt: -1 }) // tri décroissant par date
    .populate("userId", "name");
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur récupération logs", error: error.message });
  }
};

