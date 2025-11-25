const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
    date: { type: Date, default: Date.now },
    type: { type: String, required: true }, // e.g., 'growth', 'soil', 'pest', 'fertilizer'
    description: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed }, // Flexible data (pH, height, etc.)
});

const harvestSchema = mongoose.Schema({
    date: { type: Date, default: Date.now },
    quantity: { type: Number, required: true }, // in kg or units
    revenue: { type: Number, default: 0 },
    notes: { type: String },
});

const cropSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    variety: {
        type: String,
    },
    fieldLocation: {
        type: String,
        required: true,
    },
    plantingDate: {
        type: Date,
        required: true,
    },
    expectedHarvestDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['planted', 'growing', 'harvested', 'failed'],
        default: 'planted',
    },
    logs: [logSchema],
    harvests: [harvestSchema],
}, {
    timestamps: true,
});

const Crop = mongoose.model('Crop', cropSchema);

module.exports = Crop;
