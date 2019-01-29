var mongoose = require('mongoose');

var userGivenRoleSchema = mongoose.Schema({
  dateAssgined: Date,
  user: {type: mongoose.Schema.ObjectId, ref: 'UserProfiles'},
  role: {type: mongoose.Schema.ObjectId, ref: 'Role'}
});

var userGivenRole = mongoose.model('UserGivenRoles', userGivenRoleSchema);
exports.Model =  userGivenRole;