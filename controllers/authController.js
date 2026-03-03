import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Staff from '../models/Staff.js';
import Donor from '../models/Donor.js';
import FamilyMember from '../models/FamilyMember.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }
    const user = await User.findOne({ email, role });
    if (!user) return res.status(400).json({ message: 'No account found with these credentials' });
    const match = await user.matchPassword(password);
    if (!match) return res.status(400).json({ message: 'Invalid password' });

    let extra = {};
    if (role === 'staff') {
      const staff = await Staff.findOne({ user: user._id }).populate('user');
      if (!staff) return res.status(400).json({ message: 'Staff record not found' });
      extra.staffId = staff._id;
    }
    if (role === 'donor') {
      const donor = await Donor.findOne({ user: user._id });
      extra.donorId = donor?._id;
    }
    if (role === 'family') {
      const fam = await FamilyMember.findOne({ user: user._id });
      extra.familyMemberId = fam?._id;
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      token: generateToken(user._id),
      ...extra,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address, role, relationship, emergency_contact, occupation, organization } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, role, phone, address });
    if (role === 'staff') {
      await Staff.create({ user: user._id, designation: 'Staff Member', shift: 'Morning', salary: 0 });
    }
    if (role === 'donor') {
      await Donor.create({ user: user._id, occupation: occupation || '', organization: organization || '', total_donations: 0 });
    }
    if (role === 'family') {
      await FamilyMember.create({ user: user._id, relationship: relationship || '', emergency_contact: emergency_contact || phone || '' });
    }

    let extra = {};
    if (role === 'staff') {
      const staff = await Staff.findOne({ user: user._id });
      extra.staffId = staff._id;
    }
    if (role === 'donor') {
      const donor = await Donor.findOne({ user: user._id });
      extra.donorId = donor._id;
    }
    if (role === 'family') {
      const fam = await FamilyMember.findOne({ user: user._id });
      extra.familyMemberId = fam._id;
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      token: generateToken(user._id),
      ...extra,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const user = await User.findOne({ email, role: 'admin' });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await user.matchPassword(password);
    if (!match) return res.status(400).json({ message: 'Invalid password' });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: 'admin',
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    let extra = {};
    if (user.role === 'staff') {
      const staff = await Staff.findOne({ user: user._id }).populate('user');
      extra.staffId = staff?._id;
    }
    if (user.role === 'donor') {
      const donor = await Donor.findOne({ user: user._id }).populate('user');
      extra.donorId = donor?._id;
      extra.total_donations = donor?.total_donations;
    }
    if (user.role === 'family') {
      const fam = await FamilyMember.findOne({ user: user._id });
      extra.familyMemberId = fam?._id;
    }
    res.json({ ...user.toObject(), ...extra });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
