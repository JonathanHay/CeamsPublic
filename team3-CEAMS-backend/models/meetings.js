var mongoose = require('mongoose');
var meetingsSchema = mongoose.Schema(
    {   
        startDateTime: Date,
        endDateTime: Date,
        memberAttendingMeeting: { type: mongoose.Schema.ObjectId, ref: ('MemberAttendingMeetings') },
        meetingMinutes: { type: mongoose.Schema.ObjectId, ref: ('MeetingMinutes') }
    }
);
var Meeting = mongoose.model('meeting', meetingsSchema);
exports.Model = Meeting;