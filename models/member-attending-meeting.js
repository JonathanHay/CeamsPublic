var mongoose = require('mongoose');
var memberAttendingMeetingSchema = mongoose.Schema(
    {   
        participationStartDate: Date,
        participationEndDate: Date,
        memberRole: String,
        committeeName: String,
        committeeLevel: String,
        userProfile: [{ type: mongoose.Schema.ObjectId, ref: ('UserProfile') }],
        meeting: [{ type: mongoose.Schema.ObjectId, ref: ('Meeting') }],
        memberAttended: [{ type: mongoose.Schema.ObjectId, ref: ('MemberAttended') }]
    }
);
var MemberAttendingMeeting = mongoose.model('MemberAttendingMeeting', memberAttendingMeetingSchema);
exports.Model = MemberAttendingMeeting;