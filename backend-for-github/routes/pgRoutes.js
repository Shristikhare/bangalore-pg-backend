const express = require('express');
const PG = require('../models/PG');
const { protect, isOwnerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// @route  GET /api/pgs
// @desc   Get all PGs with filters (gender, locality, price range, amenities, search)
router.get('/', async (req, res) => {
  try {
    const {
      genderType,
      locality,
      minPrice,
      maxPrice,
      amenities,
      foodIncluded,
      search,
      sortBy,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isActive: true };

    if (genderType && genderType !== 'all') {
      query.genderType = genderType === 'unisex' ? 'unisex' : { $in: [genderType, 'unisex'] };
    }

    if (locality) {
      query.locality = { $regex: locality, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.priceMonthly = {};
      if (minPrice) query.priceMonthly.$gte = Number(minPrice);
      if (maxPrice) query.priceMonthly.$lte = Number(maxPrice);
    }

    if (amenities) {
      const amenityList = amenities.split(',');
      query.amenities = { $all: amenityList };
    }

    if (foodIncluded === 'true') {
      query.foodIncluded = true;
    }

    if (search) {
      query.$text = { $search: search };
    }

    let sort = { createdAt: -1 };
    if (sortBy === 'price_low') sort = { priceMonthly: 1 };
    if (sortBy === 'price_high') sort = { priceMonthly: -1 };
    if (sortBy === 'rating') sort = { avgRating: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [pgs, total] = await Promise.all([
      PG.find(query).sort(sort).skip(skip).limit(Number(limit)).populate('owner', 'name phone'),
      PG.countDocuments(query),
    ]);

    res.json({
      pgs,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  GET /api/pgs/localities
// @desc   Get distinct list of localities (for filter dropdown)
router.get('/localities', async (req, res) => {
  try {
    const localities = await PG.distinct('locality', { isActive: true });
    res.json(localities.sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  GET /api/pgs/:id
router.get('/:id', async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id).populate('owner', 'name phone email');
    if (!pg) return res.status(404).json({ message: 'PG not found' });

    pg.views += 1;
    await pg.save();

    res.json(pg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  POST /api/pgs
// @desc   Create a new PG listing (owner/admin only)
router.post('/', protect, isOwnerOrAdmin, async (req, res) => {
  try {
    const pg = await PG.create({ ...req.body, owner: req.user._id });
    res.status(201).json(pg);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route  PUT /api/pgs/:id
router.put('/:id', protect, isOwnerOrAdmin, async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) return res.status(404).json({ message: 'PG not found' });

    if (pg.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this listing' });
    }

    Object.assign(pg, req.body);
    await pg.save();
    res.json(pg);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route  DELETE /api/pgs/:id
router.delete('/:id', protect, isOwnerOrAdmin, async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) return res.status(404).json({ message: 'PG not found' });

    if (pg.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await pg.deleteOne();
    res.json({ message: 'PG listing removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  POST /api/pgs/:id/reviews
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const pg = await PG.findById(req.params.id);
    if (!pg) return res.status(404).json({ message: 'PG not found' });

    const alreadyReviewed = pg.reviews.find((r) => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You already reviewed this PG' });
    }

    const review = {
      user: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      comment,
    };

    pg.reviews.push(review);
    pg.numReviews = pg.reviews.length;
    pg.avgRating = pg.reviews.reduce((acc, r) => acc + r.rating, 0) / pg.reviews.length;

    await pg.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  GET /api/pgs/owner/mine
router.get('/owner/mine', protect, isOwnerOrAdmin, async (req, res) => {
  try {
    const pgs = await PG.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(pgs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
