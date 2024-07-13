import { connectToDatabase } from '../../lib/database'; // Assurez-vous d'avoir un fichier database.js pour la connexion

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, lat, lng } = req.body;
    if (!userId || !lat || !lng) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { db } = await connectToDatabase();

    try {
      await db.collection('userLocations').updateOne(
        { userId },
        { $set: { lat, lng } },
        { upsert: true }
      );
      res.status(200).json({ message: 'Location updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error updating location' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
