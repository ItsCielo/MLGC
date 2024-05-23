const { Firestore } = require('@google-cloud/firestore');
require('dotenv').config();

const firestore = new Firestore({
    projectId: process.env.GCLOUD_PROJECT_ID,
    keyFilename: process.env.GCLOUD_KEY_FILE,
});

const storeData = async (id, data) => {
    try {
        const predictCollection = firestore.collection('predictions');
        await predictCollection.doc(id).set(data);
        console.log(`Stored data with id ${id} in Firestore.`);
    } catch (error) {
        console.error('Error storing data in Firestore:', error);
        throw new Error('Failed to store data in Firestore');
    }
};

module.exports = storeData;