import Emergency from '../models/Emergency.js';

export const createEmergency = async (req, res) => {
  try {
    const emergency = new Emergency(req.body);
    const saved = await emergency.save();
    res.status(201).json({
      ...saved.toObject(),
      message: '🚨 Emergency alert sent! Help is on the way. Stay safe.'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getActiveEmergencies = async (req, res) => {
  try {
    const emergencies = await Emergency.find({ status: 'Active' }).sort({ createdAt: -1 });
    res.json(emergencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEmergencyStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const update = { status };
    if (status === 'Responded') update.respondedAt = new Date();
    if (status === 'Resolved') update.resolvedAt = new Date();
    const emergency = await Emergency.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!emergency) return res.status(404).json({ message: 'Emergency not found' });
    res.json(emergency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
