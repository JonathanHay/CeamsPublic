var mongoose = require('mongoose');

var utilizationsSchema = mongoose.Schema({
  code: String,
  name: String,
  indicators: [{type: mongoose.Schema.ObjectId, ref: 'Indicators'}]
});

var Utilizations = mongoose.model('licenceStatus', utilizationsSchema);
exports.Model =  Utilizations;