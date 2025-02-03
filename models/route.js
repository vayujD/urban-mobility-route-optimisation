import mongoose from "mongoose";

const coordinatesSchema = new mongoose.Schema({
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
});

const routeSchema = new mongoose.Schema({
    departureTime: {
        type: Date,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    source: {
        type: String,
        requried: true
    },
    destination: {
        type: String,
        required: true
    },
    stopPoints: [coordinatesSchema],
    sourceCoords: coordinatesSchema,
    destCoords: coordinatesSchema,
    // points: [coordinatesSchema]
});



const Route = mongoose.model('Route', routeSchema);
export default Route;