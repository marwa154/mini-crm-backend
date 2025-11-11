import express from "express";
import { createDevis, deleteDevis, getAllDevis, getDevisById, updateDevis } from "../controllers/devisController.js";

const router = express.Router();

router.post("/create", createDevis);
router.get("/", getAllDevis);
router.get("/:id", getDevisById);
router.put("/:id", updateDevis);
router.delete("/:id", deleteDevis);

export default router;
