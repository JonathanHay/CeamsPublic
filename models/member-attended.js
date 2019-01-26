var mongoose = require('mongoose');
var memberAttendedSchema = mongoose.Schema(
    {
        memberAttendingMeeting: [{ type: mongoose.Schema.ObjectId, ref: ('MemberAttendingMeeting') }],
        meetingMinutes: [{ type: mongoose.Schema.ObjectId, ref: ('MeetingMinutes') }]
    }
);
var MemberAttended = mongoose.model('MemberAttended', memberAttendedSchema);
exports.Model = MemberAttended;