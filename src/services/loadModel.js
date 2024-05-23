const tf = require('@tensorflow/tfjs-node');
require('dotenv').config();

let model;

const loadModel = async () => {
    if (!model) {
        try {
            const modelUrl = process.env.MODEL_URL;
            console.log(`Attempting to load model from: ${modelUrl}`);
            model = await tf.loadGraphModel(modelUrl);
            console.log('Model loaded successfully');
        } catch (error) {
            console.error('Error loading model:', error);
            throw new Error('Failed to load model');
        }
    }
    return model;
};

module.exports = loadModel;