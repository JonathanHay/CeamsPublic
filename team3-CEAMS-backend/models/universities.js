//universities.js
var mongoose = require('mongoose');
var universitiesSchema = mongoose.Schema(
    {
        code: String,
        name: String,
        faculties: [{type: mongoose.Schema.ObjectId, ref: ('Faculties')}]
    }
);
var Universities = mongoose.model('university', universitiesSchema);
exports.Model = Universities;