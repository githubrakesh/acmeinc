var redis = require('redis');

/**
 * Creates a `RedisStatus` object configured to check the status of the specified Redis server.
 *
 * @param {object} config
 *    @property {string} name - An arbitrary name for the server, included in error messages.
 *    @property {int} port - The port of the Redis server to which to connect.
 *    @property {string} host - The host of the Redis server to which to connect.
 *    @property {string=} password - (Optional) The password of the Redis server to which to connect.
 *      Defaults to none.
 *    @property {number=} memoryThreshold - (Optional) The maximum amount of memory which the Redis
 *      server is expected to use when healthy:
 *        - If you use Redis as an LRU cache, set to the value of the server's `maxmemory`
 *          configuration directive.
 *        - If you use Redis for pub/sub, set (via observation) to the amount of memory used by
 *          the server 's runtime operations (most likely something like 10MB).
 *        - Leave unset if your Redis deployment is autoscaled.
 *      Defaults to none.
 */
// function RedisStatus(config) {
//     if (!(instanceof RedisStatus)) {
//         return new RedisStatus(config);
//     }
//     _name = 'rak';
//     _port = 6379;
//     _host = 'localhost';
//     _password = 'config.password';
//     _memoryThreshold = 1024;
// }

/**
 * Checks the status of the Redis server.
 *
 * The server is considered healthy if:
 *    - it is reachable;
 *    - and if the server is using less memory than is specified by object's memory threshold
 *      (if a threshold was specified when object was created).
 *
 * @param {function<string=>} callback - A function to call with the status: `undefined` if the
 *    server is healthy, or a string describing the reason that the server is unhealthy.
 */

const redisInstance = {
    _name: 'rak',
    _port: 6379,
    _host: 'localhost',
    _password: 'config.password',
    _memoryThreshold: 1024
};

function getRedisClient(cBack) {
    return redis
        .createClient(redisInstance._port, redisInstance._host, {
            //auth_pass: con._password
        })
        .on('error', function (err) {
            // If Redis is not responsive, `node_redis` will emit an error on the next turn of the event
            // loop. If we don't provide an error handler, that error will bring down the process. Providing
            // an error handler will cause `node_redis` to begin attempting to reconnect--but the ping below
            // will force the matter.
            cBack(err);
        });
}


module.exports = {
    checkStatus: function (req, res, next) {
        let redisClient = getRedisClient(next);
        redisClient
            .ping(function (err, pong) {
                if (err || (pong !== 'PONG')) {
                    res.json({
                        'message': err
                    });
                } else {
                    res.json({
                        'message': pong
                    });
                }
            });
    },
    checkMemory: function (req, res, next) {
        let redisClient = getRedisClient(next);
        redisClient
            .info('memory', function (err, info) {
                if (err) {
                    res.json({
                        'message': err
                    });
                }
                // '# Memory\r\nused_memory:1086352…' -> ['# Memory', 'used_memory:1086352'] ->
                // 'used_memory:1086352' -> ['used_memory', '1086352'] -> 1086352
                var usedMemory = parseInt(info.split('\r\n')[1].split(':')[1]);
                if (usedMemory > redisInstance._memoryThreshold) {
                    res.json({
                        'message': 'Redis instance is using abnormally high memory.'
                    });
                } else {
                    res.json(''); // Success.
                }
            });
    }
};
// exports.checkStatus = function (req, res, next) {
//     let con = {
//         _name: 'rak',
//         _port: 6379,
//         _host: 'localhost',
//         _password: 'config.password',
//         _memoryThreshold: 1024
//     };


//     var redisClient = redis
//         .createClient(con._port, con._host, {
//             //auth_pass: con._password
//         })
//         .on('error', function () {
//             // If Redis is not responsive, `node_redis` will emit an error on the next turn of the event
//             // loop. If we don't provide an error handler, that error will bring down the process. Providing
//             // an error handler will cause `node_redis` to begin attempting to reconnect--but the ping below
//             // will force the matter.
//         });


//     var closingCallback = function (mes, callback) {
//         console.log(mes);
//         redisClient.quit();

//         callback();

//     };

//     // Ensure that our Redis instance is responsive.
//     redisClient
//         .ping(function (err, pong) {
//             if (err || (pong !== 'PONG')) {
//                 closingCallback({ 'message': `pong Redis instance is not responsive.` }, next);

//             } else {
//                 console.log(pong);
//                 closingCallback({ 'message': 'Redis instance is not responsive.' }, next);
//             }

//             if (!con._memoryThreshold) {
//                 closingCallback('', next); // Success.
//             } else {
//                 redisClient
//                     .info('memory', function (err, info) {
//                         if (err) {
//                             closingCallback(' Redis instance is not responsive.', next);

//                         }
//                         // '# Memory\r\nused_memory:1086352…' -> ['# Memory', 'used_memory:1086352'] ->
//                         // 'used_memory:1086352' -> ['used_memory', '1086352'] -> 1086352
//                         var usedMemory = parseInt(info.split('\r\n')[1].split(':')[1]);
//                         if (usedMemory > con._memoryThreshold) {
//                             closingCallback('Redis instance is using abnormally high memory.', next);
//                         } else {
//                             closingCallback('', next); // Success.
//                         }
//                     });
//             }
//         });
// };