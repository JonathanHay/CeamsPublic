//academic-rank.js
var mongoose = require('mongoose');
var academicRankSchema = mongoose.Schema({
    code: String,
    name: String,
    instructor: [{type: mongoose.Schema.ObjectId, ref: ('Instructor')}]
});
var AcademicRank= mongoose.model('AcademicRank', academicRankSchema);
exports.Model = AcademicRank;