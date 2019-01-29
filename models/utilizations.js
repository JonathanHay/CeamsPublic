var mongoose = require('mongoose');

var utilizationSchema = mongoose.Schema({
  code: String,
  name: String,
  indicators: [{type: mongoose.Schema.ObjectId, ref: 'Indicators'}]
});

var utilization = mongoose.model('Utilizations', utilizationSchema);
exports.Model =  utilization;