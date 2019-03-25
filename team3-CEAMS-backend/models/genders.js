//genders.js
var mongoose = require('mongoose');
var gendersSchema = mongoose.Schema(
    {
        type: String,
        instructorMembers: [{type: mongoose.Schema.ObjectId, ref: ('Instructors')}],
        staffMembers: [{type: mongoose.Schema.ObjectId, ref: ('Staffs')}],
        teachingAssistantMembers: [{type: mongoose.Schema.ObjectId, ref: ('TeachingAssistants')}]
    }
);
var Genders = mongoose.model('gender', gendersSchema);
exports.Model = Genders;