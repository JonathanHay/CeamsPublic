var mongoose = require('mongoose');

// TODO: Figure out inheritence from user-profile
var teachingAssistantSchema = mongoose.Schema({
  contactInfo: String
});

var teachingAssistant = mongoose.model('TeachingAssistants', teachingAssistantSchema);
exports.Model =  teachingAssistant;