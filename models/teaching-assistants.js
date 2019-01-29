var mongoose = require('mongoose');

var teachingAssistantsSchema = mongoose.Schema({  
  contactInfo: String,

  // UserProfile attributes
  firstName: String,
  lastName: String,
  email: String,
  building: String,
  officeNumber: String
});

var TeachingAssistants = mongoose.model('teaching-assistant', teachingAssistantsSchema);
exports.Model = TeachingAssistants;