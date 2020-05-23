const { Schema, model } = require('mongoose');

const schema = new Schema({
  title: {
    type: String,
    required: [true, 'Movie must have a title'],
  },

  starring: {
    type: String,
    default: '--',
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
    default: '---',
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

  now_showing: {
    type: Boolean,
    default: false,
  },

});

schema.index({ title: 'text' });

export default model('Movie', schema);
