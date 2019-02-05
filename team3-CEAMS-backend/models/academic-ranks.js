//academic-ranks.js
var mongoose = require('mongoose');
var academicRanksSchema = mongoose.Schema({
    code: String,
    name: String,
    instructors: [{type: mongoose.Schema.ObjectId, ref: ('Instructors')}]
});
var AcademicRanks= mongoose.model('academic-rank', academicRanksSchema);
exports.Model = AcademicRanks;