import express from "express";
import {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
} from "../controllers/clientController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getAllClients)
  .post(createClient);

router.route("/:id")
  .get(getClientById)
  .put(updateClient)
  .delete(deleteClient);

export default router;
