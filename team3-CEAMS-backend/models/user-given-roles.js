var mongoose = require('mongoose');

var userGivenRolesSchema = mongoose.Schema({
  dateAssgined: Date,
  role: {type: mongoose.Schema.ObjectId, ref: 'Roles'},

  // UserProfile relationships
  instructor: {type: mongoose.Schema.ObjectId, ref: 'Instructors'},
  staff: {type: mongoose.Schema.ObjectId, ref: 'Staff'},
  teachingAssistant: {type: mongoose.Schema.ObjectId, ref: 'TeachingAssistants'},
});

var UserGivenRoles = mongoose.model('user-given-role', userGivenRolesSchema);
exports.Model =  UserGivenRoles;