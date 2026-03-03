import FamilyElderly from '../models/FamilyElderly.js';
import Notification from '../models/Notification.js';

export const getPendingVerifications = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { verified: status } : { verified: 'Pending' };
    const links = await FamilyElderly.find(filter)
      .populate('family_user', 'name email')
      .populate('elderly', 'name age gender room_number medical_conditions')
      .sort({ createdAt: -1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const setVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;
    if (!['Approved', 'Rejected'].includes(verified)) {
      return res.status(400).json({ message: 'verified must be Approved or Rejected' });
    }
    const link = await FamilyElderly.findById(id).populate('family_user elderly');
    if (!link) return res.status(404).json({ message: 'Verification request not found' });
    link.verified = verified;
    await link.save();
    await Notification.create({
      user: link.family_user._id,
      title: verified === 'Approved' ? 'Elderly link approved' : 'Elderly link not approved',
      message: verified === 'Approved'
        ? `Your link to ${link.elderly?.name || 'elderly'} has been approved. You can now view their schedule and health.`
        : `Your request to link to ${link.elderly?.name || 'elderly'} was not approved. Contact the facility if you have questions.`,
      type: verified === 'Approved' ? 'success' : 'warning',
    });
    const populated = await FamilyElderly.findById(link._id).populate('family_user', 'name email').populate('elderly', 'name room_number');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
