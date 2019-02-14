var mongoose = require('mongoose');
var meetingMinutesSchema = mongoose.Schema(
    {
        meetingTitle: String,
        meetingPlace: String,
        meetingObjective: String,
        meetingDescription: String,
        otherDetail: String,
        recommendation: String,
        decision: String,
        meetingTopics: [{ type: mongoose.Schema.ObjectId, ref: ('MeetingTopics') }],
        meetings: [{ type: mongoose.Schema.ObjectId, ref: ('Meetings') }],
        memberAttendeds: [{ type: mongoose.Schema.ObjectId, ref: ('MemberAttendeds') }]
    }
);
var MeetingMinutes = mongoose.model('meeting-minute', meetingMinutesSchema);
exports.Model = MeetingMinutes;