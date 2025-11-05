import Client from "../models/Client.js";

/**
 * GET /api/clients
 * Tous les employés peuvent voir tous les clients.
 * Ajoute les indicateurs : can_edit, is_owner
 */
export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find()
      .populate("created_by", "name email role")
      .populate("primary_owner", "name email role");

    const result = clients.map((client) => {
      const is_owner = client.primary_owner?._id.toString() === req.user_id.toString();
      const can_edit =
        req.user.role === "admin" ||
        client.created_by?._id.toString() === req.user_id.toString();

      return {
        _id: client._id,
        fullName: client.fullName,
        company: client.company,
        email: client.email,
        phone: client.phone,
        address: client.address,
        city: client.city,
        postalCode: client.postalCode,
        created_by: client.created_by,
        primary_owner: client.primary_owner,
        is_shared: client.is_shared,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,

        // 👇 Indicateurs de permission
        permissions: {
          can_edit,
          is_owner,
        },
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/clients
 * Seul un utilisateur authentifié peut créer un client.
 * created_by & primary_owner = utilisateur connecté
 */
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
      created_by: req.user_id,
      primary_owner: req.user_id,
    });

    res.status(201).json({
      message: "Client created successfully",
      client,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /api/clients/:id
 * Seul le créateur ou un admin peut modifier
 */
export const updateClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });

    const isAdmin = req.user.role === "admin";
    const isCreator = client.created_by.toString() === req.user_id.toString();

    if (!isAdmin && !isCreator) {
      return res.status(403).json({ message: "Access denied: cannot edit this client" });
    }

    Object.assign(client, req.body);
    await client.save();

    res.status(200).json({
      message: "Client updated successfully",
      client,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/clients/:id
 * Seul le créateur ou un admin peut supprimer
 */
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });

    const isAdmin = req.user.role === "admin";
    const isCreator = client.created_by.toString() === req.user_id.toString();

    if (!isAdmin && !isCreator) {
      return res.status(403).json({ message: "Access denied: cannot delete this client" });
    }

    await client.deleteOne();
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/clients/:id
 * Tous les employés peuvent voir tous les clients
 * Ajoute les indicateurs can_edit, is_owner
 */
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate("created_by", "name email role")
      .populate("primary_owner", "name email role");

    if (!client) return res.status(404).json({ message: "Client not found" });

    const is_owner = client.primary_owner?._id.toString() === req.user_id.toString();
    const can_edit =
      req.user.role === "admin" ||
      client.created_by?._id.toString() === req.user_id.toString();

    res.status(200).json({
      ...client.toObject(),
      permissions: {
        can_edit,
        is_owner,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
