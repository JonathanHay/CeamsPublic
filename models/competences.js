//competences.js
var mongoose = require('mongoose');
var competenceSchema = mongoose.Schema({
    description: String,
    topic: {type: mongoose.Schema.ObjectId, ref: ('Topics')}
});
var Competences= mongoose.model('competence', competenceSchema);
exports.Model = Competences;