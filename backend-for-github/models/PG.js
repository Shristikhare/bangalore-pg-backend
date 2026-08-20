const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const pgSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },

    // Core filters
    genderType: {
      type: String,
      enum: ['boys', 'girls', 'unisex'],
      required: true,
    },
    locality: { type: String, required: true, trim: true }, // e.g. Koramangala, HSR Layout
    city: { type: String, default: 'Bangalore' },
    fullAddress: { type: String, required: true },
    landmark: { type: String },

    // Pricing
    priceMonthly: { type: Number, required: true },
    securityDeposit: { type: Number, required: true },

    // Room config
    roomTypes: [
      {
        type: { type: String, enum: ['single', 'double', 'triple', 'dormitory'] },
        price: Number,
        availableBeds: { type: Number, default: 0 },
      },
    ],

    amenities: [
      {
        type: String,
        enum: [
          'wifi',
          'ac',
          'food',
          'laundry',
          'housekeeping',
          'parking',
          'power_backup',
          'cctv',
          'geyser',
          'fridge',
          'tv',
          'gym',
          'lift',
          'attached_bathroom',
        ],
      },
    ],

    foodIncluded: { type: Boolean, default: false },
    foodType: { type: String, enum: ['veg', 'non-veg', 'both', 'none'], default: 'none' },

    images: [{ type: String }], // URLs / base64
    coordinates: {
      lat: Number,
      lng: Number,
    },

    contactPhone: { type: String, required: true },

    totalBeds: { type: Number, required: true },
    availableBeds: { type: Number, required: true },

    rules: [{ type: String }],

    reviews: [reviewSchema],
    avgRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

pgSchema.index({ locality: 'text', name: 'text', description: 'text' });
pgSchema.index({ genderType: 1, locality: 1, priceMonthly: 1 });

module.exports = mongoose.model('PG', pgSchema);
