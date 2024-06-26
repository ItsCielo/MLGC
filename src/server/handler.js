const ClientError = require("../exceptions/ClientError");
const InputError = require("../exceptions/InputError");
const { makePrediction } = require('../services/inferenceService');
const storePrediction = require('../services/storeData');
const { v4: uuidv4 } = require('uuid');

const predictHandler = async (request, h) => {
    const { image } = request.payload;

    if (!image) {
        return h.response({
            status: 'fail',
            message: 'Image is required',
        }).code(400);
    }

    if (image.bytes > 1_000_000) {
        return h.response({
            status: 'fail',
            message: 'Payload content length greater than maximum allowed: 1000000',
        }).code(413);
    }

    try {
        const model = request.server.app.model;
        const predictionResult = await makePrediction(model, image._data);
        console.log('Prediction result:', predictionResult);

        const result = predictionResult === 1 ? 'Cancer' : 'Non-cancer';
        const suggestion = result === 'Cancer' ? 'Segera periksa ke dokter!' : 'Tetap jaga kesehatan kulit Anda.';

        const prediction = {
            id: uuidv4(),
            result: result,
            suggestion: suggestion,
            createdAt: new Date().toISOString(),
        };

        await storePrediction(prediction.id, prediction);

        return h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data: prediction,
        }).code(201);
    } catch (error) {
        if (error instanceof InputError) {
            console.error('Input error:', error.message);
            return h.response({
                status: 'fail',
                message: error.message,
            }).code(400);
        } else {
            console.error('Prediction error:', error.message);
            return h.response({
                status: 'fail',
                message: 'Terjadi kesalahan dalam melakukan prediksi',
            }).code(400);
        }
    }
};

module.exports = {predictHandler};