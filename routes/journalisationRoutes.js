import express from "express";

import { createJournal, getAllLogs} from "../controllers/journalisationController.js";

const router = express.Router();

router.post("/create", createJournal);
router.get("/getall", getAllLogs);

export default router;