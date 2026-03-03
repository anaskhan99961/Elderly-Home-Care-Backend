import Notification from '../models/Notification.js';

export const createNotification = async (req, res) => {
  try {
    const { user, title, message, type } = req.body;
    if (!user || !title || !message || !type) return res.status(400).json({ message: 'User, title, message and type required' });
    const validTypes = ['info', 'warning', 'danger', 'success'];
    if (!validTypes.includes(type)) return res.status(400).json({ message: 'Type must be info, warning, danger or success' });
    const notification = await Notification.create({ user, title, message, type });
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyNotifications = async (req, res) => {
  try {
    const list = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id }, { is_read: true });
    res.json({ message: 'Marked all as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ user: req.user._id, is_read: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const list = await Notification.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
