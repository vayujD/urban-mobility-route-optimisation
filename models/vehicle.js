import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  availableVehicles: {
    type: Number,
    required: true,
    unique: true,
  },
});

const availableVehicles = mongoose.model("availableVehicles", routeSchema);

export default availableVehicles;
