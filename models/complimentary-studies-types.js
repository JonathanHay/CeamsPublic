//complimentary-studies-types.js
var mongoose = require('mongoose');
var complimentaryStudiesTypesSchema = mongoose.Schema({
    code: String,
    name: String,
    courses: [{type: mongoose.Schema.ObjectId, ref: ('Courses')}]
});
var ComplimentaryStudiesTypes= mongoose.model('complimentary-study-types', complimentaryStudiesTypesSchema);
exports.Model = ComplimentaryStudiesTypes;