//meetingOutcomes.js
var mongoose = require('mongoose');
var meetingOutcomesSchema = mongoose.Schema(
    {
        title: String,
        description: String,
        recommendations: String,
        decision: String,
        meetings: {type: mongoose.Schema.ObjectId, ref: ('Meetings')}
    }
);
var MeetingOutcomes = mongoose.model('meetingOutcome', meetingOutcomesSchema);
exports.Model = MeetingOutcomes;