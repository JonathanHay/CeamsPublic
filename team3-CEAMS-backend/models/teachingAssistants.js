//teachingAssistants.js
var mongoose = require('mongoose');
var teachingAssistantSchema = mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        email: String,
        building: String,
        officeNumber: String,
        contractInfo: String,
        memberships: [{ type: mongoose.Schema.ObjectId, ref: ('committeeMembership') }],
        userShadow: { type: mongoose.Schema.ObjectId, ref: ('userAccount') }
    }
);
var TeachingAssistants = mongoose.model('teachingAssistant', teachingAssistantSchema);
exports.Model = TeachingAssistants;