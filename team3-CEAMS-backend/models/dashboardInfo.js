//dashboardInfo.js
var mongoose = require('mongoose');
var dashboardInfoSchema = mongoose.Schema(
    {
        code: String,
        message: String,
        startTime: Date,
        endTime: Date
    }
);
var DashboardInfo = mongoose.model('dashboardInfo', dashboardInfoSchema);
exports.Model = DashboardInfo;