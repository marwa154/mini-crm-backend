import Client from "../models/Client.js";
import { createJournal } from "./journalisationController.js";

export const createClient = async (req, res) => {
  try {
    const { fullName, company, email, phone, address, city, postalCode } =
      req.body;

    if (
      !fullName ||
      !company ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !postalCode
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const client = await Client.create({
      fullName,
      company,
      email,
      phone,
      address,
      city,
      postalCode,
      createdBy: req.user._id,
    });
    await createJournal({
      userId: req.user._id,
      typeAction: "CREATE",
      module: "CLIENT",
      targetId: client._id,
      description: `create client ${client.fullName}`,
      newValue: client,
    });

    res.status(201).json({
      message: "Client created successfully",
      client,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllClients = async (req, res) => {
  try {
    let clients;

    // if (req.user.role === "admin") {
    //   clients = await Client.find().populate("createdBy", "name email");
    // } else {
    //   clients = await Client.find({ createdBy: req.user._id });
    // }
       clients = await Client.find().populate("createdBy", "name email");

    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!client) return res.status(404).json({ message: "Client not found" });

    // Only admin or creator can access
    if (
      req.user.role !== "admin" &&
      client.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Update a client
export const updateClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });

    if (
      req.user.role !== "admin" &&
      client.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    Object.assign(client, req.body);
    await client.save();
    await createJournal({
      userId: req.user._id,
      typeAction: "UPDATE",
      module: "CLIENT",
      targetId: client._id,
      description: `Mise à jour du client ${client.fullName}`,
      newValue: client,
    });

    res.status(200).json({ message: "Client updated successfully", client });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a client (only admin or creator)
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });

    if (
      req.user.role !== "admin" &&
      client.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await client.deleteOne();
    await createJournal({
      userId: req.user._id,
      typeAction: "DELETE",
      module: "CLIENT",
      targetId: client,
      description: `Suppression du client ${client.fullName}`,
      oldValue: client,
    });

    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
