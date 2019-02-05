//dashboard-infos.js
var mongoose = require('mongoose');
var dashboardInfosSchema = mongoose.Schema(
    {   
        code: String,
        message: String,
        startTime: Date,
        endTime: Date  
    }
);
var DashboardInfos = mongoose.model('dashboard-info', dashboardInfosSchema);
exports.Model = DashboardInfos;