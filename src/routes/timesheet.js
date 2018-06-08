
"use strict";
import timesheet from './../controllers/timesheet.controller';

module.exports = function (app) {
    app.route('/api/v1/timesheet/getScreenShot')
        .get(timesheet.getScreenShot);

    app.route('/api/v1/timesheet/sendemail')
        .get(timesheet.sendEmail);

};