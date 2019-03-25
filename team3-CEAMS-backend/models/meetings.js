//meetings.js
var mongoose = require('mongoose');
var meetingsSchema = mongoose.Schema(
    {
        startDateTime: Date,
        endDateTime: Date,
        location: String,
        description: String,
        minutes:String,  //PDF file name of the meeting minutes
        outcomes: [{type: mongoose.Schema.ObjectId, ref: ('MeetingOutcomes')}],
        attendees: [{type: mongoose.Schema.ObjectId, ref: ('CommitteeMemberships')}]
    }
);
var Meetings = mongoose.model('meeting', meetingsSchema);
exports.Model = Meetings;