const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 5000; // Assure-toi que ce port est libre et non utilisé par une autre application

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'taxi_db',
  password: 'abdallah2003', // Remplace par ton mot de passe PostgreSQL
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

app.post('/update-location', async (req, res) => {
  const { driver_id, name, latitude, longitude, status } = req.body;
  console.log('Received request:', req.body);

  try {
    await pool.query(
      `INSERT INTO taxis (driver_id, name, location, status, updated_at)
       VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326), $5, NOW())
       ON CONFLICT (driver_id)
       DO UPDATE SET name = $2, location = ST_SetSRID(ST_MakePoint($3, $4), 4326), status = $5, updated_at = NOW()`,
      [driver_id, name, longitude, latitude, status]
    );
    res.status(200).json({ success: true, message: 'Location and status updated successfully' });
  } catch (error) {
    console.error('Error updating location', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/nearby-taxis', async (req, res) => {
  const { latitude, longitude, radius } = req.body;
  console.log('Received request:', req.body);

  try {
    const result = await pool.query(
      `SELECT driver_id, name, ST_X(location::geometry) AS longitude, ST_Y(location::geometry) AS latitude, status, updated_at
       FROM taxis
       WHERE ST_DWithin(
         location,
         ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
         $3
       )`,
      [latitude, longitude, radius]
    );
    console.log('Nearby taxis response:', result.rows);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching nearby taxis:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/update-client-location', async (req, res) => {
  const { client_id, latitude, longitude } = req.body;
  console.log('Received client location request:', req.body);

  try {
    await pool.query(
      `INSERT INTO clients (client_id, location, updated_at)
       VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), NOW())
       ON CONFLICT (client_id)
       DO UPDATE SET location = ST_SetSRID(ST_MakePoint($2, $3), 4326), updated_at = NOW()`,
      [client_id, longitude, latitude]
    );
    res.status(200).json({ success: true, message: 'Client location updated successfully' });
  } catch (error) {
    console.error('Error updating client location', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/client-location/:client_id', async (req, res) => {
  const { client_id } = req.params;
  console.log('Received request for client location:', client_id);

  try {
    const result = await pool.query(
      `SELECT ST_X(location::geometry) AS longitude, ST_Y(location::geometry) AS latitude, updated_at
       FROM clients
       WHERE client_id = $1`,
      [client_id]
    );
    console.log('Client location response:', result.rows);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ success: false, message: 'Client not found' });
    }
  } catch (error) {
    console.error('Error fetching client location', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Express server started on http://localhost:${port}`);
});
