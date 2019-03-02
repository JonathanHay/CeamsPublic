//genders.js
var mongoose = require('mongoose');
var gendersSchema = mongoose.Schema(
    {
        type: String,
        instructorMember: {type: mongoose.Schema.ObjectId, ref: ('Instructors')},
        staffMember: {type: mongoose.Schema.ObjectId, ref: ('Staffs')},
        teachingAssistantMember: {type: mongoose.Schema.ObjectId, ref: ('TeachingAssistants')}
    }
);
var Genders = mongoose.model('role', gendersSchema);
exports.Model = Genders;