const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviews = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  dealership: { type: Number, required: true },
  review: { type: String, required: true },
  purchase: { type: Boolean, required: true },
  purchase_date: { type: String, default: '' },
  car_make: { type: String, required: true },
  car_model: { type: String, required: true },
  car_year: { type: Number, required: true },
  time: { type: String, default: '' },
  user_id: { type: Number, default: 0 },
  sentiment: { type: String, default: 'neutral' },
});

module.exports = mongoose.model('reviews', reviews);
