//math-types.js
var mongoose = require('mongoose');
var mathTypeSchema = mongoose.Schema(
 {
 code: String,
 name: String,
courses: [{type: mongoose.Schema.ObjectId, ref: ('Courses')}]
 }
);
var MathTypes = mongoose.model("math-type", mathTypeSchema);
exports.Model = MathTypes