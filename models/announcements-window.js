//announcements-window.js
var mongoose = require('mongoose');
var announcementsWindowSchema = mongoose.Schema({
    code: String,
    message: String,
    startTime: Date,
    endTime: Date
});
var AnnouncementsWindow= mongoose.model('AnnouncementsWindow', announcementsWindowSchema);
exports.Model = AnnouncementsWindow;