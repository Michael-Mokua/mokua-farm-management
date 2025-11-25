const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    itemName: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['seeds', 'fertilizer', 'feed', 'medicine', 'fuel', 'tools', 'other'],
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
    },
    unit: {
        type: String,
        required: true, // kg, liters, pieces
    },
    reorderLevel: {
        type: Number,
        default: 10,
    },
    costPerUnit: {
        type: Number,
        default: 0,
    },
    supplier: {
        type: String,
    },
}, {
    timestamps: true,
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
