var mongoose = require('mongoose');

// TODO: Figure out inheritence from user-profile
var teachingAssistantsSchema = mongoose.Schema({
  contactInfo: String
});

var teachingAssistants = mongoose.model('TeachingAssistants', teachingAssistantsSchema);
exports.Model =  teachingAssistants;