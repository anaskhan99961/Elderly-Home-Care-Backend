import Staff from '../models/Staff.js';
import User from '../models/User.js';

export const getStaff = async (req, res) => {
  try {
    const list = await Staff.find({}).populate('user', 'name email phone address').sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOneStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).populate('user', 'name email phone address');
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createStaff = async (req, res) => {
  try {
    const staff = await Staff.create(req.body);
    const populated = await Staff.findById(staff._id).populate('user', 'name email phone');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user', 'name email phone');
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json({ message: 'Staff deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
