//courses.js
var mongoose = require('mongoose');
var coursesSchema = mongoose.Schema(
    {
            number: String,
            title: String,
            calendarWebLink: String,
            notes: String,
            kFactor: Boolean,
            engineeringScienceAUPercent: Number,
            engineeringDesignAUPercent: Number,
            mathAUPercent: Number,
            naturalScienceAUPercent: Number,
            complementaryStudiesAUPercent: Number,
            academicCredit: Number,
            labTutorialHoursPerWeek: Number,
            numberOfLectureSections: Number,
            numberOfLabTutorialSections: Number,
            numberOfLabs: Number,
            laboratorySafetyTaught: Boolean,
            laboratorySafetyExamined: Boolean,

            terms: [{type: mongoose.Schema.ObjectId, ref: ('Semesters')}],
            indicators: [{type: mongoose.Schema.ObjectId, ref: ('Indicators')}],

            preRequisites: [{type: mongoose.Schema.ObjectId, ref: ('Courses')}],
            coRequisites: [{type: mongoose.Schema.ObjectId, ref: ('Courses')}],

            courseType: {type: mongoose.Schema.ObjectId, ref: ('courseTypes')},
            mathType: {type: mongoose.Schema.ObjectId, ref: ('MathTypes')},
            NSType: {type: mongoose.Schema.ObjectId, ref: ('NaturalScienceTypes')},
            CSType: {type: mongoose.Schema.ObjectId, ref: ('ComplementaryStudiesTypes')},
            labType: {type: mongoose.Schema.ObjectId, ref: ('LabTypes')},
            requiredTextbooks: [{type: mongoose.Schema.ObjectId, ref: ('TextBooks')}],
            learningOutcomes: [{type: mongoose.Schema.ObjectId, ref: ('CourseLearningOutcomes')}],
            courseContents: [{type: mongoose.Schema.ObjectId, ref: ('Topics')}]
    }
);
var Courses = mongoose.model('course', coursesSchema);
exports.Model = Courses;