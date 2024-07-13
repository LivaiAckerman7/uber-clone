import client from './database';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { userId } = req.body;
        const query = `
            SELECT ST_X(location::geometry) AS lng, ST_Y(location::geometry) AS lat
            FROM user_locations
            WHERE user_id = $1
        `;
        const values = [userId];

        try {
            const result = await client.query(query, values);
            if (result.rows.length > 0) {
                res.status(200).json(result.rows[0]);
            } else {
                res.status(404).send('Utilisateur non trouvé.');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de la position de l\'ami:', error);
            res.status(500).send('Erreur lors de la récupération de la position.');
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
