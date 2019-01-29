//complimentary-studies-types.js
var mongoose = require('mongoose');
var complimentaryStudiesTypeSchema = mongoose.Schema({
    code: String,
    name: String,
    course: [{type: mongoose.Schema.ObjectId, ref: ('Courses')}]
});
var ComplimentaryStudiesTypes= mongoose.model('complimentary-study-types', complimentaryStudiesTypeSchema);
exports.Model = ComplimentaryStudiesTypes;