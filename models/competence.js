//competence.js
var mongoose = require('mongoose');
var competenceSchema = mongoose.Schema({
    description: String,
    topic: [{type: mongoose.Schema.ObjectId, ref: ('Topic')}]
});
var Competence= mongoose.model('Competence', competenceSchema);
exports.Model = Competence;