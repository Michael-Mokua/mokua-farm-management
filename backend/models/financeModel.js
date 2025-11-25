const mongoose = require('mongoose');

const financeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true,
    },
    category: {
        type: String,
        required: true, // e.g., 'crop_sales', 'feed_purchase', 'wages'
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
    },
    relatedEntity: {
        type: mongoose.Schema.Types.ObjectId, // Optional ref to Crop/Livestock
        refPath: 'entityType',
    },
    entityType: {
        type: String,
        enum: ['Crop', 'Livestock', 'Task', 'HouseActivity'],
    },
}, {
    timestamps: true,
});

const Finance = mongoose.model('Finance', financeSchema);

module.exports = Finance;
