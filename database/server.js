const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();
const port = 3030;

app.use(cors());
app.use(require('cors')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let mongoServer;

async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';

  try {
    await mongoose.connect(mongoUri, { dbName: 'dealershipsDB' });
    console.log(`Connected to MongoDB at ${mongoUri}`);
  } catch (error) {
    console.warn('MongoDB not available at the configured URI. Starting in-memory MongoDB instead.');
    mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();
    await mongoose.connect(memoryUri, { dbName: 'dealershipsDB' });
    console.log(`Connected to in-memory MongoDB at ${memoryUri}`);
  }
}

const Reviews = require('./review');
const Dealerships = require('./dealership');

async function seedDatabase() {
  try {
    const reviewsData = JSON.parse(require('fs').readFileSync('./data/reviews.json', 'utf8'));
    const dealershipsData = JSON.parse(require('fs').readFileSync('./data/dealerships.json', 'utf8'));

    await Reviews.deleteMany({});
    await Reviews.insertMany(reviewsData.reviews);
    await Dealerships.deleteMany({});
    await Dealerships.insertMany(dealershipsData.dealerships);
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

app.get('/', async (req, res) => {
  res.send('Welcome to the Dealership Reviews API');
});

// Task 9: get all dealers
app.get('/fetchDealers', async (req, res) => {
  const dealerships = await Dealerships.find();
  res.json(dealerships);
});

// Task 11: get dealers by state
app.get('/fetchDealers/:state', async (req, res) => {
  const dealerships = await Dealerships.find({ state: req.params.state });
  res.json(dealerships);
});

// Task 10: get dealer by id
app.get('/fetchDealer/:id', async (req, res) => {
  const dealer = await Dealerships.find({ id: req.params.id });
  res.json(dealer);
});

// Task 8: get reviews for a dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  const documents = await Reviews.find({ dealership: req.params.id });
  res.json(documents);
});

// insert a new review (used by the "Post Review" flow)
app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
  const data = JSON.parse(req.body);
  const documents = await Reviews.find().sort({ id: -1 });
  let new_id = documents.length > 0 ? documents[0].id + 1 : 1;

  const review = new Reviews({
    id: new_id,
    name: data.name,
    dealership: data.dealership,
    review: data.review,
    purchase: data.purchase,
    purchase_date: data.purchase_date,
    car_make: data.car_make,
    car_model: data.car_model,
    car_year: data.car_year,
  });

  try {
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

async function startServer() {
  await connectToDatabase();
  await seedDatabase();

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
