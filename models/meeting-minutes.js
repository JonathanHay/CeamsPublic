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
        meetingTopic: [{ type: mongoose.Schema.ObjectId, ref: ('MeetingTopic') }],
        meeting: [{ type: mongoose.Schema.ObjectId, ref: ('Meeting') }],
        memberAttended: [{ type: mongoose.Schema.ObjectId, ref: ('MemberAttended') }]
    }
);
var MeetingMinutes = mongoose.model('MeetingMinutes', meetingMinutesSchema);
exports.Model = MeetingMinutes;