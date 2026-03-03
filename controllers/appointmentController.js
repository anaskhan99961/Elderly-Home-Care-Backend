import Appointment from '../models/Appointment.js';
import Notification from '../models/Notification.js';

export const getAppointments = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'family') filter.family_user = req.user._id;
    if (req.query.elderly_id) filter.elderly = req.query.elderly_id;
    const list = await Appointment.find(filter)
      .populate('family_user', 'name email')
      .populate('elderly', 'name room_number')
      .sort({ appointment_date: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create({
      ...req.body,
      family_user: req.user._id,
      status: 'Pending',
    });
    await Notification.create({
      user: req.user._id,
      title: 'New Appointment Request',
      message: `Family member requested to visit on ${req.body.appointment_date}.`,
      type: 'info',
    });
    const populated = await Appointment.findById(appointment._id).populate('elderly');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('family_user').populate('elderly');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
