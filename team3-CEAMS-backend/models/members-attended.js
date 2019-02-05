var mongoose = require('mongoose');
var memberAttendedsSchema = mongoose.Schema(
    {
        memberAttendingMeeting: { type: mongoose.Schema.ObjectId, ref: ('MemberAttendingMeeting') },
        meetingMinutes: { type: mongoose.Schema.ObjectId, ref: ('MeetingMinutes') }
    }
);
var MemberAttended = mongoose.model('member-attended', memberAttendedsSchema);
exports.Model = MemberAttended;