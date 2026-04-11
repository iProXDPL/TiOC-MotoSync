const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk user ID
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  vin: { type: String, required: false },
  licensePlate: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);
