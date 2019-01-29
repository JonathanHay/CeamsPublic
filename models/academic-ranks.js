//academic-ranks.js
var mongoose = require('mongoose');
var academicRankSchema = mongoose.Schema({
    code: String,
    name: String,
    instructor: [{type: mongoose.Schema.ObjectId, ref: ('Instructors')}]
});
var AcademicRanks= mongoose.model('academic-rank', academicRankSchema);
exports.Model = AcademicRanks;