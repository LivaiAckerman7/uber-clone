const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const port = 5000; // Assure-toi que ce port est libre et non utilisé par une autre application
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'https://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'taxi_db',
  password: 'abdallah2003', // Remplace par ton mot de passe PostgreSQL
  port: 5432,
});

app.use(cors({
  origin: 'https://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(bodyParser.json());

app.post('/update-location', async (req, res) => {
  const { driver_id, name, latitude, longitude } = req.body;
  console.log('Received request:', req.body);

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

app.post('/nearby-taxis', async (req, res) => {
  const { latitude, longitude, radius } = req.body;
  console.log('Received request:', req.body);

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

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('ride-request', (data) => {
    console.log('Received ride request:', data);
    // Logique pour traiter la demande de course
    // Notifier le chauffeur ou mettre à jour la base de données, par exemple
    const driverRoom = `driver_${data.driver_id}`;
    io.to(driverRoom).emit('ride-request', data);
    console.log(`Ride request sent to driver ${data.driver_id}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Utilisez server.listen au lieu de app.listen
server.listen(port, () => {
  console.log(`Express server started on http://localhost:${port}`);
<<<<<<< HEAD
});
=======
});
>>>>>>> d445bb0682b14c580c6cc62accd3663ed835fd5b
