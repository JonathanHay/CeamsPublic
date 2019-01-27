//course.js
var mongoose = require('mongoose');
var courseSchema = mongoose.Schema(
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
        indicator: [{ type: mongoose.Schema.ObjectId, ref: ('Indicator') }],
        courseType: [{ type: mongoose.Schema.ObjectId, ref: ('CourseType') }],
        mathType: [{ type: mongoose.Schema.ObjectId, ref: ('MathType') }],
        naturalScienceType: [{ type: mongoose.Schema.ObjectId, ref: ('NaturalScienceType') }],
        complementaryStudiesType : [{ type: mongoose.Schema.ObjectId, ref: ('ComplementaryStudiesType') }],
        labType: [{ type: mongoose.Schema.ObjectId, ref: ('LabType') }],
        textBook: [{ type: mongoose.Schema.ObjectId, ref: ('TextBook') }],
        courseLearningOutcome: [{ type: mongoose.Schema.ObjectId, ref: ('CourseLearningOutcome') }],
        topic: [{ type: mongoose.Schema.ObjectId, ref: ('Topic') }]
    }
);
var Course = mongoose.model('Course', courseSchema);
exports.Model = Course;
