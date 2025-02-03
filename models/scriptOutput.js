import mongoose from "mongoose";

const scriptOutputSchema = new mongoose.Schema({
    routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: true
    },
    outputData: {
        type: Object,
        required: true
    }
});

const ScriptOutput = mongoose.model('ScriptOutput', scriptOutputSchema);
export default ScriptOutput;