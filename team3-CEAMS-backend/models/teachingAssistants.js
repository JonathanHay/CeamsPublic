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
        gender: {type: mongoose.Schema.ObjectId, ref: ('Genders')},
        memberships: [{type: mongoose.Schema.ObjectId, ref: ('CommitteeMemberships')}],
        userShadow: {type: mongoose.Schema.ObjectId, ref: ('UserAccounts')}
    }
);
var TeachingAssistants = mongoose.model('teachingAssistant', teachingAssistantSchema);
exports.Model = TeachingAssistants;