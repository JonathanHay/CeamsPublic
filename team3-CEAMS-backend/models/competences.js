//competences.js
var mongoose = require('mongoose');
var competencesSchema = mongoose.Schema(
    {
        description: String,
        topic: {type: mongoose.Schema.ObjectId, ref: ('Topics')}
    }
);
var Competences = mongoose.model('competence', competencesSchema);
exports.Model = Competences;