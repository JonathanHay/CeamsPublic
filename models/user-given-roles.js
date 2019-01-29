var mongoose = require('mongoose');

var userGivenRolesSchema = mongoose.Schema({
  dateAssgined: Date,
  user: {type: mongoose.Schema.ObjectId, ref: 'UserProfiles'},
  role: {type: mongoose.Schema.ObjectId, ref: 'Roles'}
});

var userGivenRoles = mongoose.model('UserGivenRoles', userGivenRolesSchema);
exports.Model =  userGivenRoles;