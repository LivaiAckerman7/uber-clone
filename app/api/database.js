const { Client } = require('pg');

const client = new Client({
    user: 'yourusername',
    host: 'localhost',
    database: 'taxi_db',
    password: 'yourpassword',
    port: 5432,
});

client.connect();

module.exports = client;
