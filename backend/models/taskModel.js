const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    dueDate: {
        type: Date,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
    },
    category: {
        type: String,
        enum: ['crop', 'livestock', 'maintenance', 'house', 'other'],
        default: 'other',
    },
    relatedEntity: {
        type: mongoose.Schema.Types.ObjectId, // Can be Crop or Livestock ID
        refPath: 'category', // Dynamic ref based on category? Maybe too complex for now. Just ID.
    },
}, {
    timestamps: true,
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
