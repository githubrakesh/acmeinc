
"use strict";
import github from './../controllers/github.controller';

module.exports = function (app) {
    app.route('/api/v1/github/test')
        //.get(github.gettest)
        .post(github.posttest)
};