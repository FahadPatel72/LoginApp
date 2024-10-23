const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String,
  loggedInAt: { type: Date, default: Date.now },
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
