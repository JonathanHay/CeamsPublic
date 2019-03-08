//meetings.js
var mongoose = require('mongoose');
var meetingsSchema = mongoose.Schema(
    {
        startDateTime: Date,
        endDateTime: Date,
        location: String,
        description: String,
        minutes:String,  //PDF file name of the meeting minutes
        outcomes: [{type: mongoose.Schema.ObjectId, ref: ('meetingOutcome')}],
        attendees: [{type: mongoose.Schema.ObjectId, ref: ('committeeMembership')}]
    }
);
var Meetings = mongoose.model('meeting', meetingsSchema);
exports.Model = Meetings;