//committeeMemberships.js
var mongoose = require('mongoose');
var committeeMembershipsSchema = mongoose.Schema(
    {
        participationStartDate: Date,
        participationEndDate: Date,
        role: String,
        meetings: [{type: mongoose.Schema.ObjectId, ref: ('Meetings')}],
        committee: {type: mongoose.Schema.ObjectId, ref: ('Committees')},
        instructorMember: {type: mongoose.Schema.ObjectId, ref: ('Instructors')},
        staffMember: {type: mongoose.Schema.ObjectId, ref: ('Staffs')},
        teachingAssistantMember: {type: mongoose.Schema.ObjectId, ref: ('TeachingAssistants')}
    }
);
var CommitteeMemberships = mongoose.model('committeeMembership', committeeMembershipsSchema, 'committeeMemberships');
exports.Model = CommitteeMemberships;