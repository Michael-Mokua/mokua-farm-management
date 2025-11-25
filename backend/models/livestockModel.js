const mongoose = require('mongoose');

const healthRecordSchema = mongoose.Schema({
    date: { type: Date, default: Date.now },
    type: { type: String, required: true }, // vaccination, treatment, checkup
    description: { type: String, required: true },
    cost: { type: Number, default: 0 },
    nextDueDate: { type: Date }, // For recurring vaccinations
});

const productionLogSchema = mongoose.Schema({
    date: { type: Date, default: Date.now },
    type: { type: String, required: true }, // milk, eggs, weight, wool
    quantity: { type: Number, required: true },
    unit: { type: String, required: true }, // liters, count, kg
    revenue: { type: Number, default: 0 },
});

const livestockSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    tagId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
    },
    type: {
        type: String,
        required: true,
        enum: ['cow', 'goat', 'sheep', 'chicken', 'other'],
    },
    breed: {
        type: String,
    },
    dob: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['active', 'sold', 'deceased'],
        default: 'active',
    },
    healthRecords: [healthRecordSchema],
    productionLogs: [productionLogSchema],
}, {
    timestamps: true,
});

const Livestock = mongoose.model('Livestock', livestockSchema);

module.exports = Livestock;
