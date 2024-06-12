import client from './database';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { lat, lng, radius } = req.body;
        const query = `
            SELECT driver_id, name, ST_AsText(location) AS location
            FROM taxis
            WHERE ST_DWithin(location, ST_GeogFromText($1), $2)
        `;
        const values = [`SRID=4326;POINT(${lng} ${lat})`, radius];

        try {
            const result = await client.query(query, values);
            res.status(200).json(result.rows);
        } catch (error) {
            console.error('Erreur lors de la récupération des taxis à proximité:', error);
            res.status(500).send('Erreur lors de la récupération des taxis à proximité.');
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
