import User from '../models/User.js';
import Staff from '../models/Staff.js';

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, address, designation, shift, salary } = req.body;
    if (!name || !email || !password || !role) return res.status(400).json({ message: 'Name, email, password and role required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, role, phone, address });
    if (role === 'staff') {
      const staff = await Staff.create({ user: user._id, designation: designation || 'Staff Member', shift: shift || 'Morning', salary: salary ?? 0 });
      return res.status(201).json({ ...user.toObject(), password: undefined, staffId: staff._id });
    }
    const u = user.toObject();
    delete u.password;
    res.status(201).json(u);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
