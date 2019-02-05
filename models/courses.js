//courses.js
var mongoose = require('mongoose');
var coursesSchema = mongoose.Schema(
    {   
        number: String,
        title:String,
        calendarWebLink:String,
        notes:String,
        kFactor:Boolean,
        engineeringScienceAUPercent:Double,
        engineeringDesignAUPercent:Double,
        mathAUPercent:Double,
        naturalScienceAUpercent:Double,
        complementaryStudiesAUPercent:Double,
        academicCredit:Double,
        lecturesHoursPerWeek:Double,
        labHoursPerWeek:Double,
        tutorialHoursPerWeek:Double,
        numberOfLectureSections:Integer,
        numberOfLabSections:Integer,
        numberOfTutorialSections:Integer,
        numberOfLabs:Integer,
        laboratorySafetyTaught:Boolean,
        laboratorySafetyExamined: Boolean,
        preRequisite: [{ type: mongoose.Schema.ObjectId, ref: ('Courses') }],
        coRequisite: [{ type: mongoose.Schema.ObjectId, ref: ('Courses') }],
        indicator: [{ type: mongoose.Schema.ObjectId, ref: ('Indicators') }],
        courseType: { type: mongoose.Schema.ObjectId, ref: ('CourseTypes') },
        mathType: { type: mongoose.Schema.ObjectId, ref: ('MathTypes') },
        naturalScienceType: { type: mongoose.Schema.ObjectId, ref: ('NaturalScienceTypes') },
        complementaryStudiesType : { type: mongoose.Schema.ObjectId, ref: ('ComplementaryStudiesTypes') },
        labType: { type: mongoose.Schema.ObjectId, ref: ('LabTypes') },
        textBook: [{ type: mongoose.Schema.ObjectId, ref: ('TextBooks') }],
        courseLearningOutcome: [{ type: mongoose.Schema.ObjectId, ref: ('CourseLearningOutcomes') }],
        topic: [{ type: mongoose.Schema.ObjectId, ref: ('Topics') }]
    }
);
var Courses = mongoose.model('course', coursesSchema);
exports.Model = Courses;
