import Client from "../models/Client.js";

// ✅ Create a client (authenticated user)
export const createClient = async (req, res) => {
  try {
    const { fullName, company, email, phone, address, city, postalCode } = req.body;

    if (!fullName || !company || !email || !phone || !address || !city || !postalCode) {
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

    res.status(201).json({
      message: "Client created successfully",
      client,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all clients
// - Admins see all clients
// - Users see only their own
export const getAllClients = async (req, res) => {
  try {
    let clients;

    if (req.user.role === "admin") {
      clients = await Client.find().populate("createdBy", "name email");
    } else {
      clients = await Client.find({ createdBy: req.user._id });
    }

    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get a single client by ID
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate("createdBy", "name email");

    if (!client) return res.status(404).json({ message: "Client not found" });

    // Only admin or creator can access
    if (req.user.role !== "admin" && client.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update a client (only admin or creator)
export const updateClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });

    // check permissions
    if (req.user.role !== "admin" && client.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    Object.assign(client, req.body);
    await client.save();

    res.status(200).json({ message: "Client updated successfully", client });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete a client (only admin or creator)
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });

    if (req.user.role !== "admin" && client.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    await client.deleteOne();
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
