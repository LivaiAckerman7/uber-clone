const sdk = require('node-appwrite');

module.exports = async function (req, res) {
    const client = new sdk.Client();
    const database = new sdk.Databases(client);
    const { latitude, longitude } = JSON.parse(req.payload);

    client
        .setEndpoint('http://localhost/v1') // Votre endpoint Appwrite
        .setProject('6654b6a70034899dcdf4') // Votre projet ID
        .setKey('b58d5db9d102e25eca21c1adad4ccea34680e8af454d51e5cd668cafbc0acd41b3085e01d327d506330e7c13f39cf152767035ed1ed2c891d935eec0834b569bf096c56333e23c6eb738c6bd252f54c65324201af110990fca922ff33bb1b49b9c4b7924094e03794c9d4efc149da4c71bc2488f965ea4a0534a7a505acd040c'); // Votre clé API

    try {
        const taxis = await database.listDocuments('6654b643003090dbd830git add .git add .', 'taxis', [
            sdk.Query.near('latitude', latitude, longitude, 5000), // Requête géospatiale à 5 km
        ]);

        res.json(taxis);
    } catch (error) {
        res.json({ error: error.message });
    }
};
