//indicator.js
var mongoose = require('mongoose');
var indicatorsSchema = mongoose.Schema(
    {
        code: String,
        name: String,
        description: String,
        status: {type: mongoose.Schema.ObjectId, ref: ('Utilizations')},
        contentLevels: {type: mongoose.Schema.ObjectId, ref: ('ContentLevels')},
        GA: {type: mongoose.Schema.ObjectId, ref: ('GraduateAttributes')},
        course: {type: mongoose.Schema.ObjectId, ref: ('Courses')}
    }
);
var Indicators = mongoose.model('indicator', indicatorsSchema);
exports.Model = Indicators;