import Facture from "../models/Facture.js";
import { createJournal } from "./journalisationController.js"; 
        import Notification from '../models/notification.js';
export const createFacture = async (req, res) => {
  try {
   
console.log(req.body);
    const {
      invoiceNumber,
      clientId,
      userId,
      devisId,
      invoiceDate,
      dueDate,
      tva = 19,
      lignes,
      description,
      status
    } = req.body;

    if (!clientId || !lignes || lignes.length === 0) {
      return res.status(400).json({ message: "Client et lignes de facture obligatoires" });
    }

    // Calcul des totaux
    const totalHT = lignes.reduce((acc, ligne) => acc + (ligne.quantite * ligne.prixUnitaire), 0);
    const totalTTC = totalHT + (totalHT * (tva / 100));

    // Création de la facture
    const facture = await Facture.create({
      invoiceNumber,
      clientId,
      userId,
      devisId: devisId || null,
      lignes: lignes.map(l => ({
        description: l.description,
        quantite: l.quantite,
        prixUnitaire: l.prixUnitaire,
        totalLigne: l.quantite * l.prixUnitaire
      })),
      tva,
      totalHT,
      totalTTC,
      issueDate: invoiceDate,
      dueDate,
      status: status?.toLowerCase() || "non payée",
      description: description || ""
    });
     await createJournal({
          userId: req.body.userId,
          typeAction: "CREATE",
          module: "FACTURE",
          targetId: facture._id,
          description: `Création du facture ${facture.invoiceNumber}`,
          newValue: facture
        });
       


await new Notification({
  userId: userId,
  message: `Une nouvelle facture a été créée (${facture.invoiceNumber})`,
  type: 'SUCCESS',
}).save();

 
    return res.status(201).json(facture);

  } catch (error) {
    console.error(" Erreur création facture :", error.message);
    return res.status(500).json({ message: "Erreur lors de la création de la facture", error: error.message });
  }
};



//  Récupérer toutes les factures (avec filtre)
export const getAllFactures = async (req, res) => {
  try {
    const { status, clientId } = req.query;
    let filtre = {};

    if (status) filtre.status = status;
    if (clientId) filtre.clientId = clientId;

    const factures = await Facture.find(filtre)
      .populate("clientId userId devisId")
      .sort({ createdAt: -1 });

    res.status(200).json(factures);
  } catch (error) {
    res.status(500).json({ message: " Erreur récupération factures", error: error.message });
  }
};


//  Récupérer une facture par ID
export const getFactureById = async (req, res) => {
  try {
    const facture = await Facture.findById(req.params.id).populate("clientId userId devisId");
    if (!facture) return res.status(404).json({ message: "Facture non trouvée" });
    res.status(200).json(facture);
  } catch (error) {
    res.status(500).json({ message: " Erreur récupération facture", error: error.message });
  }
};


//  Modifier une facture
export const updateFacture = async (req, res) => {
  try {
    const updated = await Facture.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: " Facture non trouvée" });

    // recalcul des totaux
    updated.totalHT = updated.lignes.reduce((acc, l) => acc + l.totalLigne, 0);
    updated.totalTTC = updated.totalHT + (updated.totalHT * updated.tva / 100);
    await updated.save();

       await createJournal({
          userId: req.body.userId,
          typeAction: "UPDATE",
          module: "Facture",
          targetId: updated._id,
          description: `Mise à jour du facture ${updated.invoiceNumber}`,
          newValue: updated,
        });
        

    res.status(200).json({ message: "Facture mise à jour", facture: updated });
  } catch (error) {
    res.status(500).json({ message: "Erreur modification facture", error: error.message });
  }
};


//  Supprimer une facture
export const deleteFacture = async (req, res) => {
  try {
    const deleted = await Facture.findByIdAndDelete(req.params.id);

     await createJournal({
          userId:deleted.userId, 
          typeAction: "DELETE",
          module: "FACTURE",
          targetId: deleted._id,
          description: `Suppression du facture ${deleted.invoiceNumber}`,
          oldValue: deleted,
        });
    if (!deleted) return res.status(404).json({ message: " Facture non trouvée" });
    res.status(200).json({ message: " Facture supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: " Erreur suppression facture", error: error.message });
  }
};


