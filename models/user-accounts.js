var mongoose = require('mongoose');

var userAccountsSchema = mongoose.Schema({
  username: String,
  passwordReset: Boolean,
  passwordMustChanged: Boolean,
  userAccountExpiryDate: Date,
  salt: String,
  encryptedPassword: String,

  // UserProfile relationships
  instructor: {type: mongoose.Schema.ObjectId, ref: 'Instructors'},
  staff: {type: mongoose.Schema.ObjectId, ref: 'Staff'},
  teachingAssistant: {type: mongoose.Schema.ObjectId, ref: 'TeachingAssistants'},
});

var UserAccounts = mongoose.model('user-account', userAccountsSchema);
exports.Model = UserAccounts;