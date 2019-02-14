var mongoose = require('mongoose');
var memberAttendingMeetingsSchema = mongoose.Schema(
    {
        participationStartDate: Date,
        participationEndDate: Date,
        memberRole: String,
        committeeName: String,
        committeeLevel: String,
        instructor: { type: mongoose.Schema.ObjectId, ref: ('Instructors') },
        staff: {type: mongoose.Schema.ObjectId, ref: ('Staff')},
        teachingAssistant: {type: mongoose.Schema.ObjectId, ref: ('TeachingAssistants')},
        meeting: [{ type: mongoose.Schema.ObjectId, ref: ('Meetings') }],
        memberAttended: { type: mongoose.Schema.ObjectId, ref: ('MembersAttended') }
    }
);
var MemberAttendingMeeting = mongoose.model('member-attending-meeting', memberAttendingMeetingsSchema);
exports.Model = MemberAttendingMeeting;