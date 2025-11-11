import express from "express";

import { getFactureById,createFacture ,getAllFactures,updateFacture,deleteFacture} from "../controllers/factureController.js";

const router = express.Router();

router.post("/create", createFacture);
router.get("/getallfacture", getAllFactures);
router.get("/:id", getFactureById);
router.put("/:id", updateFacture);
router.delete("/:id", deleteFacture);

export default router;