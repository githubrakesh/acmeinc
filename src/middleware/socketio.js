module.exports = function (app) {
    let server = require('http').createServer(app);
    let io = require('socket.io')(server);
    server.listen(4202);
    return io;
};