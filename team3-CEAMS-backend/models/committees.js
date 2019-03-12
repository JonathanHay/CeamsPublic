//committees.js
var mongoose = require('mongoose');
var committeesSchema = mongoose.Schema(
    {
        name: String,
        level: String,
        dateCreated: Date,
        members: [{type: mongoose.Schema.ObjectId, ref: ('CommitteeMemberships')}]
    }
);
var Committees = mongoose.model('committee', committeesSchema);
exports.Model = Committees;