//measured-indicators.js
var mongoose = require('mongoose');
var measuredIndicatorSchema = mongoose.Schema(
{
indicatorCode: String,
indicatorName: String, 
rubricLevelOne: String,
rubricLevelTwo: String, 
rubricLevelThree: String,
rubricLevelFour: String,

 measurement: {type: mongoose.Schema.ObjectId, ref: ('Measurements')},
 questions: [{type: mongoose.Schema.ObjectId, ref:('Questions')}],
}

);
var MeasuredIndicators = mongoose.model("measured-indicator", measuredIndicatorSchema);
exports.Model = MeasuredIndicators