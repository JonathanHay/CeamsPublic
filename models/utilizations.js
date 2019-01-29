var mongoose = require('mongoose');

var utilizationsSchema = mongoose.Schema({
  code: String,
  name: String,
  indicators: [{type: mongoose.Schema.ObjectId, ref: 'Indicators'}]
});

var utilizations = mongoose.model('Utilizations', utilizationsSchema);
exports.Model =  utilizations;