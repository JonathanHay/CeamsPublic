var mongoose = require('mongoose');

var userProfilesSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  building: String,
  officeNumber: String,
  userGivenRole: [{type: mongoose.Schema.ObjectId, ref: 'Indicators'}],
  userAccount: {type: mongoose.Schema.ObjectId, ref: 'UserAccount'},
  memberAttendingMeeting: [{type: mongoose.Schema.ObjectId, ref: 'MembersAttendingMeeting'}]
});

var UserProfiles = mongoose.model('user-profile', userProfilesSchema);
exports.Model =  UserProfiles;