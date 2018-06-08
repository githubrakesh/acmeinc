const sharejsaof = require('./../controllers/sharejsaof.controller');

module.exports = function (app) {
    app.route('/api/v1/sharejsaof/status')
        //.post(users.create)
        .get(sharejsaof.checkStatus);
    app.route('/api/v1/sharejsaof/memory')
        .get(sharejsaof.checkMemory);
}