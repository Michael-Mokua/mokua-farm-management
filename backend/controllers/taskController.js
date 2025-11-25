const asyncHandler = require('express-async-handler');
const { admin, db } = require('../config/firebase');

const getTasks = asyncHandler(async (req, res) => {
    const snapshot = await db.collection('tasks').orderBy('dueDate').get();
    const tasks = [];
    snapshot.forEach(doc => tasks.push({ _id: doc.id, ...doc.data() }));
    res.json(tasks);
});

const createTask = asyncHandler(async (req, res) => {
    const { title, description, assignedTo, dueDate, priority, category, relatedEntity } = req.body;
    const docRef = await db.collection('tasks').add({
        userId: req.user.id,
        title,
        description: description || '',
        assignedTo: assignedTo || null,
        dueDate,
        priority: priority || 'medium',
        status: 'pending',
        category: category || 'other',
        relatedEntity: relatedEntity || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    const doc = await docRef.get();
    res.status(201).json({ _id: doc.id, ...doc.data() });
});

const updateTask = asyncHandler(async (req, res) => {
    const { status, assignedTo, title, description, dueDate, priority } = req.body;
    const ref = db.collection('tasks').doc(req.params.id);
    const updateData = {};
    if (status) updateData.status = status;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (dueDate) updateData.dueDate = dueDate;
    if (priority) updateData.priority = priority;
    await ref.update(updateData);
    const doc = await ref.get();
    res.json({ _id: doc.id, ...doc.data() });
});

const assignTask = asyncHandler(async (req, res) => {
    const { assignedTo } = req.body;
    const ref = db.collection('tasks').doc(req.params.id);
    await ref.update({ assignedTo });
    const doc = await ref.get();
    res.json({ _id: doc.id, ...doc.data() });
});

const completeTask = asyncHandler(async (req, res) => {
    const ref = db.collection('tasks').doc(req.params.id);
    await ref.update({
        status: 'completed',
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
        completedBy: req.user.id
    });
    const doc = await ref.get();
    res.json({ _id: doc.id, ...doc.data() });
});

const deleteTask = asyncHandler(async (req, res) => {
    await db.collection('tasks').doc(req.params.id).delete();
    res.json({ message: 'Task removed' });
});

module.exports = { getTasks, createTask, updateTask, deleteTask, assignTask, completeTask };
