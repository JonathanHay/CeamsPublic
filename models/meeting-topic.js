var mongoose = require('mongoose');
var meetingTopicSchema = mongoose.Schema(
    {
        name: String,
        description: String,
        meetingMinutes: [{ type: mongoose.Schema.ObjectId, ref: ('MeetingMinutes') }]
    }
);
var MeetingTopic = mongoose.model('MeetingTopic', meetingTopicSchema);
exports.Model = MeetingTopic;