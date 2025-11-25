const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
    date: { type: Date, default: Date.now },
    action: { type: String, required: true }, // turned_on, turned_off, maintenance
    description: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const houseActivitySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true, // e.g., 'Main Water Pump', 'Generator', 'Security Lights'
    },
    type: {
        type: String,
        enum: ['water_pumping', 'security', 'power', 'maintenance', 'other'],
        required: true,
    },
    status: {
        type: String,
        enum: ['on', 'off', 'maintenance', 'scheduled'],
        default: 'off',
    },
    schedule: {
        type: String, // e.g., 'Daily 6am-7am', or cron string
    },
    logs: [logSchema],
}, {
    timestamps: true,
});

const HouseActivity = mongoose.model('HouseActivity', houseActivitySchema);

module.exports = HouseActivity;
