const { Schema, model } = require('mongoose');

const RecipeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  username: {
    type: String
  }
});

// Optimize our search
// and specify which fields we are searching on
RecipeSchema.index({
  '$**': 'text'
  // we are searching for any field on this model
});

module.exports = model('Recipe', RecipeSchema);
