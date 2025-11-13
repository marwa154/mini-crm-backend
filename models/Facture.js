import mongoose from "mongoose";
const ligneSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantite: { type: Number, required: true },
  prixUnitaire: { type: Number, required: true },
  totalLigne: { type: Number, required: true }
});
const FactureSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true }, // ex: FAC-2025-001
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    devisId: { type: mongoose.Schema.Types.ObjectId, ref: "Devis", default: null }, // si la facture vient d’un devis
    invoiceDate: { type: Date, default: Date.now },
    dueDate: { type: Date },

    status: {
      type: String,
      status: ["non payée", "partiellement payée", "payée"],
      default: "non payée"
    },
  // ✅ Ajout de ces champs manquants
    tva: { type: Number, default: 19 },
    totalHT: { type: Number, default: 0 },
    totalTTC: { type: Number, default: 0 },
      description: { type: String, default: ""  },
    lignes: [ligneSchema],
  },
  { timestamps: true }
);

// Calcul automatique du total HT/TTC
FactureSchema.methods.calculerTotal = function () {
  this.totalHT = this.lignes.reduce((acc, ligne) => acc + ligne.totalLigne, 0);
  this.totalTTC = this.totalHT + (this.totalHT * this.tva / 100);
  return { totalHT: this.totalHT, totalTTC: this.totalTTC };
};

//  Mise à jour du statut
FactureSchema.methods.changerStatut = function (nouveauStatut) {
  this.status = nouveauStatut;
  return this.save();
};

const Facture = mongoose.model("Facture", FactureSchema);
export default Facture;
