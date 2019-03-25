let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let favicon = require('serve-favicon');
let bodyParser = require('body-parser');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let logins = require('./routes/logins');
let roots = require('./routes/roots');
let userAccounts = require('./routes/userAccounts');
let roles = require('./routes/roles');
let userGivenRoles = require('./routes/userGivenRoles');
let capabilities = require('./routes/capabilities');
let permissions = require('./routes/permissions');
let instructors = require('./routes/instructors');
let staffs = require('./routes/staffs');
let teachingAssistants = require('./routes/teachingAssistants');
let courses = require('./routes/courses');
let courseTypes = require('./routes/courseTypes');

let academicTerms = require('./routes/academicTerms');
let academicYears = require('./routes/academicYears');
let committees = require('./routes/committees');
let committeeMemberships = require('./routes/committeeMemberships')
let complementaryStudiesTypes = require('./routes/complementaryStudiesTypes');
let contentLevels = require('./routes/contentLevels');
let deliverableTypes = require('./routes/deliverableTypes');
let kpiReports = require('./routes/kpiReports');
let meetings = require('./routes/meetings');
let meetingOutcomes = require('./routes/meetingOutcomes');
let labTypes = require('./routes/labTypes');
let mathTypes = require('./routes/mathTypes');
let naturalScienceTypes = require('./routes/naturalScienceTypes');
let utilizations = require('./routes/utilizations');
let userEvaluationMethods = require('./routes/userEvaluationMethods');

let app = express();

//Set up mongoose connection
let mongoose = require('mongoose');
let mongoDB = 'mongodb://dbUser:dbpassw0rd@ds039880.mlab.com:39880/ceams-db';
mongoose.connect(mongoDB, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// remove the following middleware in the production version
app.use(function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS');
    next();
});
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/logins', logins);
app.use('/roots', roots);
app.use('/userAccounts', userAccounts);
app.use('/roles', roles);
app.use('/userGivenRoles', userGivenRoles);
app.use('/capabilities', capabilities);
app.use('/permissions', permissions);
app.use('/instructors', instructors);
app.use('/staffs', staffs);
app.use('/teachingAssistants', teachingAssistants);
app.use('/courses', courses);
app.use('/courseTypes', courseTypes);

app.use('/academicTerms', academicTerms);
app.use('/academicYears', academicYears);
app.use('/committees', committees);
app.use('/committeeMemberships', committeeMemberships);
app.use('/complementaryStudiesTypes', complementaryStudiesTypes);
app.use('/contentLevels', contentLevels);
app.use('/courseTypes', courseTypes);
app.use('/deliverableTypes', deliverableTypes);
app.use('/kpiReports', kpiReports);
app.use('/meetings', meetings);
app.use('/meetingOutcomes', meetingOutcomes);
app.use('/labTypes', labTypes);
app.use('/mathTypes', mathTypes);
app.use('/naturalScienceTypes', naturalScienceTypes);
app.use('/utilizations', utilizations);
app.use('/userEvaluationMethods', userEvaluationMethods);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
