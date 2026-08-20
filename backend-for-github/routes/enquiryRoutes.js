const express = require('express');
const Enquiry = require('../models/Enquiry');
const PG = require('../models/PG');
const { protect, isOwnerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// @route  POST /api/enquiries
router.post('/', protect, async (req, res) => {
  try {
    const { pgId, name, phone, message, moveInDate } = req.body;

    const pg = await PG.findById(pgId);
    if (!pg) return res.status(404).json({ message: 'PG not found' });

    const enquiry = await Enquiry.create({
      pg: pgId,
      user: req.user._id,
      name,
      phone,
      message,
      moveInDate,
    });

    res.status(201).json(enquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route  GET /api/enquiries/mine  (user's own enquiries)
router.get('/mine', protect, async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ user: req.user._id })
      .populate('pg', 'name locality priceMonthly images')
      .sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  GET /api/enquiries/received  (owner's received enquiries)
router.get('/received', protect, isOwnerOrAdmin, async (req, res) => {
  try {
    const myPGs = await PG.find({ owner: req.user._id }).select('_id');
    const pgIds = myPGs.map((p) => p._id);

    const enquiries = await Enquiry.find({ pg: { $in: pgIds } })
      .populate('pg', 'name locality')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  PUT /api/enquiries/:id/status
router.put('/:id/status', protect, isOwnerOrAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });

    enquiry.status = status;
    await enquiry.save();
    res.json(enquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
