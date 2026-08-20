// Run with: node seed.js
// Populates DB with sample Bangalore PG owner + listings for quick testing.

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const PG = require('./models/PG');

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bangalore_pg');

  await User.deleteMany({});
  await PG.deleteMany({});

  const owner = await User.create({
    name: 'Ramesh Gowda',
    email: 'owner@example.com',
    phone: '9876543210',
    password: 'password123',
    role: 'owner',
    gender: 'male',
  });

  const listings = [
    {
      owner: owner._id,
      name: 'Sunrise PG for Girls',
      description: 'Fully furnished PG for working women, walking distance to metro station.',
      genderType: 'girls',
      locality: 'Koramangala',
      fullAddress: '5th Block, Koramangala, Bangalore',
      landmark: 'Near Forum Mall',
      priceMonthly: 9500,
      securityDeposit: 9500,
      roomTypes: [
        { type: 'single', price: 14000, availableBeds: 2 },
        { type: 'double', price: 9500, availableBeds: 4 },
        { type: 'triple', price: 7500, availableBeds: 6 },
      ],
      amenities: ['wifi', 'ac', 'food', 'laundry', 'housekeeping', 'cctv', 'power_backup', 'geyser'],
      foodIncluded: true,
      foodType: 'both',
      images: [],
      coordinates: { lat: 12.9352, lng: 77.6245 },
      contactPhone: '9876543210',
      totalBeds: 12,
      availableBeds: 12,
      rules: ['No smoking', 'No alcohol', 'Gate closes at 10:30 PM', 'Visitors allowed till 8 PM'],
      isVerified: true,
    },
    {
      owner: owner._id,
      name: 'Elite Stay Boys PG',
      description: 'Premium PG for boys near tech parks, spacious rooms with AC.',
      genderType: 'boys',
      locality: 'HSR Layout',
      fullAddress: 'Sector 2, HSR Layout, Bangalore',
      landmark: 'Near HSR BDA Complex',
      priceMonthly: 8500,
      securityDeposit: 10000,
      roomTypes: [
        { type: 'single', price: 13000, availableBeds: 1 },
        { type: 'double', price: 8500, availableBeds: 3 },
      ],
      amenities: ['wifi', 'ac', 'food', 'gym', 'parking', 'cctv', 'lift', 'tv'],
      foodIncluded: true,
      foodType: 'both',
      images: [],
      coordinates: { lat: 12.9116, lng: 77.6412 },
      contactPhone: '9876543211',
      totalBeds: 8,
      availableBeds: 4,
      rules: ['No smoking inside rooms', 'ID proof mandatory', 'Monthly rent due by 5th'],
      isVerified: true,
    },
    {
      owner: owner._id,
      name: 'Green Nest Unisex PG',
      description: 'Affordable unisex PG with separate floors for boys and girls, near IT corridor.',
      genderType: 'unisex',
      locality: 'Electronic City',
      fullAddress: 'Phase 1, Electronic City, Bangalore',
      landmark: 'Near Infosys Gate 4',
      priceMonthly: 6500,
      securityDeposit: 6500,
      roomTypes: [
        { type: 'double', price: 6500, availableBeds: 5 },
        { type: 'triple', price: 5500, availableBeds: 8 },
      ],
      amenities: ['wifi', 'food', 'laundry', 'power_backup', 'parking'],
      foodIncluded: true,
      foodType: 'veg',
      images: [],
      coordinates: { lat: 12.8452, lng: 77.6602 },
      contactPhone: '9876543212',
      totalBeds: 20,
      availableBeds: 13,
      rules: ['Separate floors for boys/girls', 'No overnight guests', 'Curfew 11 PM'],
      isVerified: false,
    },
    {
      owner: owner._id,
      name: 'Comfort Zone Girls PG',
      description: 'Cozy and secure PG for girls with home-cooked food and CCTV surveillance.',
      genderType: 'girls',
      locality: 'Indiranagar',
      fullAddress: '100 Feet Road, Indiranagar, Bangalore',
      landmark: 'Near Indiranagar Metro',
      priceMonthly: 11000,
      securityDeposit: 11000,
      roomTypes: [
        { type: 'single', price: 16000, availableBeds: 1 },
        { type: 'double', price: 11000, availableBeds: 2 },
      ],
      amenities: ['wifi', 'ac', 'food', 'housekeeping', 'cctv', 'geyser', 'fridge', 'attached_bathroom'],
      foodIncluded: true,
      foodType: 'both',
      images: [],
      coordinates: { lat: 12.9719, lng: 77.6412 },
      contactPhone: '9876543213',
      totalBeds: 6,
      availableBeds: 3,
      rules: ['Guests not allowed after 9 PM', 'Keep common areas clean'],
      isVerified: true,
    },
    {
      owner: owner._id,
      name: 'Budget Bunk Boys PG',
      description: 'No-frills budget PG for students and freshers near colleges.',
      genderType: 'boys',
      locality: 'BTM Layout',
      fullAddress: '2nd Stage, BTM Layout, Bangalore',
      landmark: 'Near BTM Water Tank',
      priceMonthly: 5500,
      securityDeposit: 5000,
      roomTypes: [{ type: 'triple', price: 5500, availableBeds: 9 }],
      amenities: ['wifi', 'food', 'power_backup'],
      foodIncluded: true,
      foodType: 'veg',
      images: [],
      coordinates: { lat: 12.9166, lng: 77.6101 },
      contactPhone: '9876543214',
      totalBeds: 15,
      availableBeds: 9,
      rules: ['Basic house rules apply', 'No loud music after 10 PM'],
      isVerified: false,
    },
  ];

  await PG.insertMany(listings);

  console.log('Seed data inserted successfully');
  console.log(`Owner login -> email: owner@example.com | password: password123`);
  process.exit();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
