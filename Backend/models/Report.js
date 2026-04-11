const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk user ID of the car owner
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  description: { type: String, required: true }, // Opis usterek
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'in_progress', 'awaiting_approval', 'ready', 'completed', 'cancelled'],
    default: 'pending'
  },
  requestedDate: { type: Date }, // Preferowany termin od klienta
  scheduledDate: { type: Date }, // Zarezerwowany termin
  completedDate: { type: Date },
  mechanicNotes: { type: String }, // Notatki mechanika
  additionalIssues: { type: String }, // Dodatkowe usterki
  estimatedCost: { type: Number, min: 0 },
  finalCost: { type: Number, min: 0 },
  messages: [{
    senderId: String,
    senderRole: String, // 'mechanic' or 'client'
    content: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
