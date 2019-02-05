var mongoose = require('mongoose');
var meetingTopicsSchema = mongoose.Schema(
    {
        name: String,
        description: String,
        meetingMinutes: { type: mongoose.Schema.ObjectId, ref: ('MeetingMinutes') }
    }
);
var MeetingTopic = mongoose.model('meeting-topic', meetingTopicsSchema);
exports.Model = MeetingTopic;