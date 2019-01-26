var mongoose = require('mongoose');
var meetingSchema = mongoose.Schema(
    {   
        startDateTime: Date,
        endDateTime: Date,
        memberAttendingMeeting: [{ type: mongoose.Schema.ObjectId, ref: ('MemberAttendingMeeting') }],
        meetingMinutes: [{ type: mongoose.Schema.ObjectId, ref: ('MeetingMinutes') }]
    }
);
var Meeting = mongoose.model('Meeting', meetingSchema);
exports.Model = Meeting;