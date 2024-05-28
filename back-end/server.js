const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/taxi-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a Taxi schema
const taxiSchema = new mongoose.Schema({
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number],
  },
  label: String,
});

taxiSchema.index({ location: '2dsphere' });

const Taxi = mongoose.model('Taxi', taxiSchema);

// API endpoint to get nearby taxis
app.post('/nearby-taxis', async (req, res) => {
  const { latitude, longitude } = req.body;

  try {
    const taxis = await Taxi.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], 5 / 6378.1], // 5 km radius
        },
      },
    });

    res.json(taxis);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching nearby taxis' });
  }
});

// Seed some taxis
app.get('/seed', async (req, res) => {
  const taxis = [
    { location: { coordinates: [14.695, -17.444], type: 'Point' }, label: 'Taxi 1' },
    { location: { coordinates: [14.700, -17.450], type: 'Point' }, label: 'Taxi 2' },
    { location: { coordinates: [14.710, -17.460], type: 'Point' }, label: 'Taxi 3' },
  ];

  await Taxi.insertMany(taxis);
  res.send('Seeded');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
