import mongoose from "mongoose";
const ligneSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantite: { type: Number, required: true },
  prixUnitaire: { type: Number, required: true },
  totalLigne: { type: Number, required: true }
});


const devisSchema = new mongoose.Schema({
  codeUnique: { type: String, required: true, unique: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["brouillon", "envoyé", "accepté", "refusé"],
    default: "brouillon"
  },
    lignes: [ligneSchema],
  totalHT: { type: Number, required: true },
  tva: { type: Number, required: true },
  totalTTC: { type: Number },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

devisSchema.pre("save", function(next) {
  this.totalTTC = this.totalHT + (this.totalHT * this.tva / 100);
  next();
});

export default mongoose.model("Devis", devisSchema);
