// models/JournalAction.js
import mongoose from "mongoose";

const journalActionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  typeAction: {
    type: String,
    required: true, // exemple : CREATE, UPDATE, DELETE, SEND, PAY...
  },
  module: {
    type: String,
    enum: ["DEVIS", "FACTURE", "CLIENT", "AUTRE"],
    required: true,
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false, // id du document concerné
  },
  description: { type: String },
  oldValue: { type: Object },
  newValue: { type: Object },
  dateAction: { type: Date, default: Date.now },
});

export default mongoose.model("JournalAction", journalActionSchema);
