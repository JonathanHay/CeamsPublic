//announcements-windows.js
var mongoose = require('mongoose');
var announcementsWindowSchema = mongoose.Schema({
    code: String,
    message: String,
    startTime: Date,
    endTime: Date
});
var AnnouncementsWindows= mongoose.model('announcements-window', announcementsWindowSchema);
exports.Model = AnnouncementsWindows;