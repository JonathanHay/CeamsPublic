//academicRanks.js
var mongoose = require('mongoose');
var academicRanksSchema = mongoose.Schema(
    {
        code: String,
        name: String,
        instructors: [{type: mongoose.Schema.ObjectId, ref: ('Instructors')}]
    }
);
var AcademicRanks = mongoose.model('academicRank', academicRanksSchema);
exports.Model = AcademicRanks;