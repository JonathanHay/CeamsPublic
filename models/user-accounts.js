var mongoose = require('mongoose');

var userAccountsSchema = mongoose.Schema({
  username: String,
  passwordReset: Boolean,
  passwordMustChanged: Boolean,
  userAccountExpiryDate: Date,
  salt: String,
  encryptedPassword: String,
  userProfile: {type: mongoose.Schema.ObjectId, ref: 'UserProfiles'}
});

var userAccounts = mongoose.model('UserAccounts', userAccountsSchema);
exports.Model =  userAccounts;