
"use strict";
import newman from './../controllers/newman.controller';

module.exports = function (app) {    
    app.route('/api/v1/newman/runCollection')
        .post(newman.runPMCollection);

};