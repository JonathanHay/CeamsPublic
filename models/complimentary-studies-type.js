//complimentary-studies-type.js
var mongoose = require('mongoose');
var complimentaryStudiesTypeSchema = mongoose.Schema({
    code: String,
    name: String,
    course: [{type: mongoose.Schema.ObjectId, ref: ('Course')}]
});
var ComplimentaryStudiesType= mongoose.model('ComplimentaryStudiesType', complimentaryStudiesTypeSchema);
exports.Model = ComplimentaryStudiesType;