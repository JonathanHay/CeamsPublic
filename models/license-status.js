//liscense-status.js
var mongoose = require('mongoose');
var licenseStatusSchema = mongoose.Schema(
 {
 code: String,
 name: String,
instructors: [{type: mongoose.Schema.ObjectId, ref: ('Instructors')}]
 }
);
var LiscenseStatus = mongoose.model("license-status", licenseStatusSchema);
exports.Model = LiscenseStatus