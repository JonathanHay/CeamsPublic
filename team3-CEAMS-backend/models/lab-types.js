//lab-types.js
var mongoose = require('mongoose');
var labTypeSchema = mongoose.Schema(
 {
 code: String,
 name: String,
courses: [{type: mongoose.Schema.ObjectId, ref: ('Courses')}]
 }
);
var LabTypes = mongoose.model("lab-type", labTypeSchema);
exports.Model = LabTypes;