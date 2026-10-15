const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3030;
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dealershipsDB';

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

const dataDir = path.join(__dirname, 'data');
const reviewsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'reviews.json'), 'utf8'));
const dealershipsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'dealerships.json'), 'utf8'));

const Reviews = require('./review');
const Dealerships = require('./dealership');

const parseBoolean = (value) => (
  value === true || ['true', '1', 'yes'].includes(String(value).toLowerCase())
);

const seedDatabase = async () => {
  try {
    await Promise.all([
      ...((dealershipsData.dealerships || []).map((dealer) => (
        Dealerships.updateOne({ id: dealer.id }, { $setOnInsert: dealer }, { upsert: true })
      ))),
      ...((reviewsData.reviews || []).map((review) => (
        Reviews.updateOne({ id: review.id }, { $setOnInsert: review }, { upsert: true })
      ))),
    ]);
    console.log('Database seed complete');
  } catch (error) {
    throw new Error(`Seed error: ${error.message}`);
  }
};

mongoose.set('strictQuery', false);

mongoose.connect(mongoUri)
  .then(() => {
    console.log(`Connected to MongoDB at ${mongoUri}`);
    return seedDatabase();
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exitCode = 1;
  });

app.get('/', async (req, res) => {
  res.send('Welcome to the Mongoose API');
});

app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find().sort({ time: -1, id: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const dealerId = Number(req.params.id);
    const documents = await Reviews.find({ dealership: dealerId }).sort({ time: -1, id: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.get('/fetchDealers', async (req, res) => {
  try {
    const documents = await Dealerships.find().sort({ id: 1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const stateName = req.params.state;
    const documents = await Dealerships.find({
      state: { $regex: new RegExp(`^${stateName}$`, 'i') }
    }).sort({ id: 1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const dealerId = Number(req.params.id);
    const documents = await Dealerships.find({ id: dealerId });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.post('/insert_review', async (req, res) => {
  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!data || !data.review || !data.dealership || !data.name) {
      return res.status(400).json({ error: 'Missing review payload' });
    }

    const documents = await Reviews.find().sort({ id: -1 }).limit(1);
    const newId = documents.length ? documents[0].id + 1 : 1;

    const review = new Reviews({
      id: newId,
      name: data.name || 'Customer',
      dealership: Number(data.dealership),
      review: data.review,
      purchase: parseBoolean(data.purchase),
      purchase_date: data.purchase_date || '',
      car_make: data.car_make || '',
      car_model: data.car_model || '',
      car_year: Number(data.car_year || 2023),
      time: data.time || new Date().toISOString(),
      user_id: data.user_id || 0,
      sentiment: data.sentiment || 'neutral',
    });

    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
