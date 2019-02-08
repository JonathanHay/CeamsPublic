//announcements-windows.js
var mongoose = require('mongoose');
var announcementsWindowsSchema = mongoose.Schema({
    code: String,
    message: String,
    startTime: Date,
    endTime: Date
});
var AnnouncementsWindows= mongoose.model('announcements-window', announcementsWindowsSchema);
exports.Model = AnnouncementsWindows;