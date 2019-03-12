//committeeMemberships.js
var mongoose = require('mongoose');
var committeeMembershipsSchema = mongoose.Schema(
    {
        participationStartDate: Date,
        participationEndDate: Date,
        role: String,
        meetings: [{ type: mongoose.Schema.ObjectId, ref: ('meeting') }],
        committee: { type: mongoose.Schema.ObjectId, ref: ('committee') },
        instructorMember: { type: mongoose.Schema.ObjectId, ref: ('instructor') },
        staffMember: { type: mongoose.Schema.ObjectId, ref: ('staff') },
        teachingAssistantMember: { type: mongoose.Schema.ObjectId, ref: ('teachingAssistant') }
    }
);

var CommitteeMemberships = mongoose.model('committeeMembership', committeeMembershipsSchema);
exports.Model = CommitteeMemberships;