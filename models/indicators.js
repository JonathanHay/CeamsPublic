//indicators.js
var mongoose = require('mongoose');
var indicatorSchema = mongoose.Schema(
{
 code: String,
 name: String,
 description: String,

courses: [{type: mongoose.Schema.ObjectId, ref: ('Courses')}],

//routes
utilization: {type: mongoose.Schema.ObjectId, ref: ('Utilizations')},
contentLevel: {type: mongoose.Schema.ObjectId, ref: ('ContentLevels')},
graduateAttributes: {type: mongoose.Schema.ObjectId, ref: ('GraduateAttributes')},

}
);
var Indicators = mongoose.model("indicator", indicatorSchema);
exports.Model = Indicators