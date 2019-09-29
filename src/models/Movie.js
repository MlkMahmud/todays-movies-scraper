const { Schema, model } = require('mongoose');

const schema = new Schema({
  title: {
    type: String,
    required: [true, 'Movie must have a title'],
  },

  starring: {
    type: [String],
  },

  synopsis: {
    type: String,
    default: '...',
  },

  genre: {
    type: [String],
  },

  rating: {
    type: String,
    default: 'TBC',
  },

  poster: {
    type: String,
    default: 'cloudinarylink',
  },

  trailer: {
    type: String,
    default: null,
  },

  release_date: {
    type: String,
    default: '--',
  },

  runtime: {
    type: String,
    default: '--',
  },

  showtimes: {
    type: [{}],
  },

  status: {
    type: String,
    enum: ['Coming Soon', 'Now Showing'],
  },

});

schema.index({ title: 'text' });

export const Movie = model('Movie', schema);
export const Temp = model('Temp', schema);
