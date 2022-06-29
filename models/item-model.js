const { Schema, model } = require('mongoose');

const itemSchema = new Schema({
  ownerId: {
    type: String,
    required: true,
    min: 4,
    max: 255,
  },
  collectionId: {
    type: String,
    required: true,
    min: 4,
    max: 255,
  },
  ownerName: {
    type: String,
    required: true,
    min: 1,
    max: 255,
  },
  itemTitle: {
    type: String,
    required: true,
    min: 1,
    min: 255,
  },
  itemDescription: {
    type: String,
    required: true,
    min: 1,
  },
  imgLink: {
    type: String,
    required: true,
  },
});

module.exports = model('Item', itemSchema);
