const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk user ID of the car owner
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  description: { type: String, required: true }, // Opis usterek
  status: { 
    type: String, 
    enum: ['Oczekujące', 'Przyjęte', 'W trakcie', 'Oczekuje na akceptację', 'Gotowe do odbioru', 'Odebrane'],
    default: 'Oczekujące'
  },
  scheduledDate: { type: Date }, // Zarezerwowany termin
  mechanicNotes: { type: String }, // Notatki mechanika
  additionalIssues: [{
    description: String,
    estimatedCost: Number,
    isAccepted: { type: Boolean, default: null } // null = oczekuje, true = akceptacja, false = odrzucone
  }],
  totalCost: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
