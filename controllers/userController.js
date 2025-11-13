import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createJournal } from "./journalisationController.js";


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({ name, email, password, role });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    await createJournal({
      userId: req.user._id,
      typeAction: "CREATE",
      module: "USER",
      targetId: user._id,
      description: `Création de l'utilisateur ${user.name}`,
      newValue: user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
     await createJournal({
      userId: req.user._id,
      typeAction: "UPDATE",
      module: "USER",
      targetId: user._id,
      description: `Mise à jour de l'utilisateur ${user.name}`,
      newValue: user,
    });
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
     await createJournal({
      userId: req.user._id,
      typeAction: "DELETE",
      module: "USER",
      targetId: user._id,
      description: `Suppression de l'utilisateur ${user.name}`,
      oldValue:user,
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👤 Get logged-in user's profile (authenticated)
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
