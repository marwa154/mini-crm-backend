import Devis from "../models/Devis.js";
import { createJournal } from "./journalisationController.js"; 
        import Notification from '../models/notification.js';



export const createDevis = async (req, res) => {
  try {
    // Générer un codeUnique  
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const codeUnique = `DEV-${new Date().getFullYear()}-${randomPart}`;

    // Créer le devis avec le codeUnique déjà défini
    const devis = await Devis.create({
      codeUnique,
      codeUnique: codeUnique,
      clientId: req.body.clientId,
      userId: req.body.userId,
      status: req.body.status || "brouillon",
      lignes: req.body.lignes,
      totalHT: req.body.totalHT,
      tva: req.body.tva,
      notes: req.body.notes
    });


     await createJournal({
      userId: req.body.userId,
      typeAction: "CREATE",
      module: "DEVIS",
      targetId: devis._id,
      description: `Création du devis ${devis.codeUnique}`,
      newValue: devis
    });



  
 

    
    await new Notification({
      userId: req.body.userId,
      message: `Une nouvelle devis a été créée (${codeUnique})`,
      type: 'SUCCESS',
    }).save();
    
     
        return res.status(201).json(devis);



  } catch (error) {
    res.status(500).json({ message: " Erreur création devis", error: error.message });
  }
};
//  Récupérer tous les devis
export const getAllDevis = async (req, res) => {
  try {
    const devisList = await Devis.find().populate("clientId userId").sort({ createdAt: -1 });; 
    res.status(200).json(devisList);
  } catch (error) {
    res.status(500).json({ message: " Erreur lors de la récupération des devis", error: error.message });
  }
};

// Récupérer un devis par ID
export const getDevisById = async (req, res) => {
  try {
    const devis = await Devis.findById(req.params.id).populate("clientId userId");

    if (!devis) {
      return res.status(404).json({ message: " Devis non trouvé" });
    }

    res.status(200).json(devis);
  } catch (error) {
    res.status(500).json({ message: " Erreur récupération devis", error: error.message });
  }
};

//  Modifier un devis
export const updateDevis = async (req, res) => {
  try {
    const updatedDevis = await Devis.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          codeUnique: req.body.codeUnique,
          clientId: req.body.clientId,
          userId: req.body.userId,
          totalHT: req.body.totalHT,
          tva: req.body.tva,
          notes: req.body.notes,
          status: req.body.status,
          updatedAt: Date.now()
        }

        
      },
      { new: true, runValidators: true } // retourne le devis mis à jour
    );

    if (!updatedDevis) {
      return res.status(404).json({ message: " Devis non trouvé" });
    }

    // recalcul automatique du totalTTC si HT ou TVA changés
    updatedDevis.totalTTC = updatedDevis.totalHT + (updatedDevis.totalHT * updatedDevis.tva / 100);
    await updatedDevis.save();
      await createJournal({
      userId: req.body.userId,
      typeAction: "UPDATE",
      module: "DEVIS",
      targetId: updatedDevis._id,
      description: `Mise à jour du devis ${updatedDevis.codeUnique}`,
      newValue: updatedDevis,
    });
    

    res.status(200).json({
      message: " Devis mis à jour avec succès",
      devis: updatedDevis
    });
  } catch (error) {
    res.status(500).json({ message: " Erreur mise à jour devis", error: error.message });
  }
};
export const deleteDevis = async (req, res) => {
  try {




    const deleted = await Devis.findByIdAndDelete(req.params.id);

    
 //  console.log("req" +req.body)
   
     await createJournal({
      userId:deleted.userId, 
      typeAction: "DELETE",
      module: "DEVIS",
      targetId: deleted._id,
      description: `Suppression du devis ${deleted.codeUnique}`,
      oldValue: deleted,
    });
  

    if (!deleted) {
      return res.status(404).json({ message: " Devis non trouvé" });
    }

    res.status(200).json({ message: "Devis supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression devis", error: error.message });
  }
};
