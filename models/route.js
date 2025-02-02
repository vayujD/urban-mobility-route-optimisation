import mongoose from "mongoose";

const destinationCoordinates = new mongoose.Schema({
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
    availableVehicles: {
        type: Number,
        required: true 
    },
    destination: [destinationCoordinates]
});



const Route = mongoose.model('Route', routeSchema);
export default Route;