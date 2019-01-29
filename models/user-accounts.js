var mongoose = require('mongoose');

var userAccountSchema = mongoose.Schema({
  username: String,
  passwordReset: Boolean,
  passwordMustChanged: Boolean,
  userAccountExpiryDate: Date,
  salt: String,
  encryptedPassword: String,
  userProfile: {type: mongoose.Schema.ObjectId, ref: 'UserProfiles'}
});

var userAccount = mongoose.model('UserAccounts', userAccountSchema);
exports.Model =  userAccount;