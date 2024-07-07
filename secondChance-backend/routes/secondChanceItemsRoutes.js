const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const connectToDatabase = require('../models/db');
const logger = require('../logger');

// Define the upload directory path
const directoryPath = 'public/images';

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, directoryPath); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage: storage });

// Get all secondChanceItems
router.get('/api/secondchance/items', async (req, res, next) => {
  logger.info('/ called');
  try {
    const db = await connectToDatabase(); // Step 2: Task 1
    const collection = db.collection('secondChanceItems'); // Step 2: Task 2
    const secondChanceItems = await collection.find({}).toArray(); // Step 2: Task 3
    res.json(secondChanceItems); // Step 2: Task 4
  } catch (e) {
    logger.console.error('oops something went wrong', e);
    next(e);
  }
});

// Add a new item
router.post('/api/secondchance/items', upload.single('image'), async (req, res, next) => {
  try {
    const db = await connectToDatabase(); // Step 3: Task 1
    const collection = db.collection('secondChanceItems'); // Step 3: Task 2
    const newItem = {
      name: req.body.name,
      description: req.body.description,
      image: req.file ? req.file.filename : '',
    }; // Step 3: Task 3
    const secondChanceItem = await collection.insertOne(newItem); // Step 3: Task 4
    res.status(201).json(secondChanceItem.ops[0]); // Step 3: Task 5
  } catch (e) {
    next(e);
  }
});

// Get a single secondChanceItem by ID
router.get('/api/secondchance/items/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase(); // Step 4: Task 1
    const collection = db.collection('secondChanceItems'); // Step 4: Task 2
    const secondChanceItem = await collection.findOne({ _id: new require('mongodb').ObjectID(req.params.id) }); // Step 4: Task 3
    res.json(secondChanceItem); // Step 4: Task 4
  } catch (e) {
    next(e);
  }
});

// Update an existing item
router.put('/api/secondchance/items/:id', upload.single('image'), async (req, res, next) => {
  try {
    const db = await connectToDatabase(); // Step 5: Task 1
    const collection = db.collection('secondChanceItems'); // Step 5: Task 2
    const updatedItem = {
      $set: {
        name: req.body.name,
        description: req.body.description,
        image: req.file ? req.file.filename : '',
      },
    }; // Step 5: Task 3
    const result = await collection.updateOne({ _id: new require('mongodb').ObjectID(req.params.id) }, updatedItem); // Step 5: Task 4
    res.json(result); // Step 5: Task 5
  } catch (e) {
    next(e);
  }
});

// Delete an existing item
router.delete('/api/secondchance/items/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase(); // Step 6: Task 1
    const collection = db.collection('secondChanceItems'); // Step 6: Task 2
    const result = await collection.deleteOne({ _id: new require('mongodb').ObjectID(req.params.id) }); // Step 6: Task 3
    res.json(result); // Step 6: Task 4
  } catch (e) {
    next(e);
  }
});

module.exports = router;
