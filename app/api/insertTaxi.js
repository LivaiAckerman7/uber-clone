import client from './database';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { driverId, lat, lng } = req.body;
        const query = `
            INSERT INTO taxis (driver_id, location, updated_at)
            VALUES ($1, ST_GeogFromText($2), NOW())
            ON CONFLICT (driver_id) DO UPDATE
            SET location = EXCLUDED.location, updated_at = EXCLUDED.updated_at
        `;
        const values = [driverId, `SRID=4326;POINT(${lng} ${lat})`];

        try {
            await client.query(query, values);
            res.status(200).send('Position insérée avec succès.');
        } catch (error) {
            console.error('Erreur lors de l\'insertion de la position:', error);
            res.status(500).send('Erreur lors de l\'insertion de la position.');
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
