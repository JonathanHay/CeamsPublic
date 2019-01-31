var mongoose = require('mongoose');
var memberAttendingMeetingsSchema = mongoose.Schema(
    {   
        participationStartDate: Date,
        participationEndDate: Date,
        memberRole: String,
        committeeName: String,
        committeeLevel: String,
        userProfile: { type: mongoose.Schema.ObjectId, ref: ('UserProfile') },
        meeting: [{ type: mongoose.Schema.ObjectId, ref: ('Meeting') }],
        memberAttended: { type: mongoose.Schema.ObjectId, ref: ('MemberAttended') }
    }
);
var MemberAttendingMeeting = mongoose.model('member-attending-meeting', memberAttendingMeetingsSchema);
exports.Model = MemberAttendingMeeting;