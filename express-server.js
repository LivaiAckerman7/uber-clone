const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 5000; // Port pour le serveur Express

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'taxi_db',
  password: 'abdallah2003',
  port: 5432,
});

// Utiliser le middleware CORS
app.use(cors()); // Ajouter cette ligne

app.use(bodyParser.json());

app.use(bodyParser.json());

// Mettre à jour la position du chauffeur
app.post('/update-location', async (req, res) => {
  const { driver_id, name, latitude, longitude } = req.body;
  console.log('Received request:', req.body); // Ajout du log pour débogage

  try {
    await pool.query(
      `INSERT INTO taxis (driver_id, name, location, updated_at)
       VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326), NOW())
       ON CONFLICT (driver_id)
       DO UPDATE SET name = $2, location = ST_SetSRID(ST_MakePoint($3, $4), 4326), updated_at = NOW()`,
      [driver_id, name, longitude, latitude]
    );
    res.status(200).json({ success: true, message: 'Location updated successfully' });
  } catch (error) {
    console.error('Error updating location', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Récupérer les taxis à proximité
app.post('/nearby-taxis', async (req, res) => {
  const { latitude, longitude, radius } = req.body;
  console.log('Received request:', req.body); // Ajout du log pour débogage

  try {
    const result = await pool.query(
      `SELECT driver_id, name, ST_X(location::geometry) AS longitude, ST_Y(location::geometry) AS latitude, updated_at
       FROM taxis
       WHERE ST_DWithin(
         location,
         ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
         $3
       )`,
      [longitude, latitude, radius]
    );
    console.log('Nearby taxis response:', result.rows); // Ajout du log pour débogage
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching nearby taxis:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Express server started on http://localhost:${port}`);
});
