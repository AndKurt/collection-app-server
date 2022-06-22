const { Schema, model } = require('mongoose');

const collectionSchema = new Schema({
  ownerId: {
    type: String,
    required: true,
    min: 4,
    max: 255,
  },
  collectionTitle: {
    type: String,
    required: true,
    min: 1,
    min: 255,
  },
  collectionDescription: {
    type: String,
    required: true,
    min: 1,
  },
  country: {
    type: String,
    required: true,
    min: 1,
  },
  city: {
    type: String,
    required: true,
    min: 1,
  },
  date: {
    type: Array,
    default: [Date],
    required: true,
  },
});

module.exports = model('Collection', collectionSchema);
