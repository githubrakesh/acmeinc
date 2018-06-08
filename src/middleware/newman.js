"use strict";
//import { newman } from "newman"; // does not work when module is instaled globally and linked
const newman = require('newman');
const newmanReports = './datafiles/newman';


module.exports = function (io) {
    var runCollection = function (runnerData, callback) {
        newman.run({
                collection: require(runnerData.collectionFile),
                environment: require(runnerData.environmentFile),
                // {
                //     "id": "my-id",
                //     "name": "testEnv",
                //     "values": [
                //         {
                //             "key": "env",
                //             "value": "env2",
                //         },
                //         {
                //             "key": "data",
                //             "value": "env2",
                //         }
                //     ]
                // },
                exportEnvironment: newmanReports + '/envOut.json',

                iterationCount: runnerData.iterationCount,
                //iterationData: require(runnerData.iterationFile),
                //  [
                //     { a: 1 },
                //     { a: 2 }],

                delayRequest: runnerData.delayRequest,
                bail: true,
                // timeoutRequest: 5000,
                disableUnicode: true,
                suppressExitCode: true,
                ignoreRedirects: true,
                insecure: true,

                //exportGlobals: 'globalOut.json',
                globals: require(runnerData.globalsFile),
                // [
                //     {
                //         key: "var1",
                //         value: "/get",
                //         enabled: true
                //     },
                //     {
                //         key: "var2",
                //         value: "Global Bar",
                //     }
                // ],
                reporters: [
                    'cli'
                    // , 'junit'
                    // , 'json'
                    , 'html'
                ],
                reporter: {
                    html: {
                        export: newmanReports + '/htmlOutput.html'
                    },
                    junit: {
                        export: newmanReports + '/xmlOut.xml'
                    },
                    json: {
                        export: newmanReports + '/jsonOut.json'
                    }
                }
            }, function (error, summary) {
                if (error || summary.error) {
                    throw error;
                } else {
                    callback(summary);
                }
            })
            .on('start', (err, args) => { // on start of run, log to console
                console.log('start');
            })
            .on('beforeIteration', (err, args) => {
                console.log('beforeIteration');
            })
            .on('beforeItem', (err, args) => {
                console.log('beforeItem');
            })
            .on('beforePrerequest', (err, args) => {
                console.log('beforePrerequest');
            })
            .on('prerequest', (err, args) => {
                console.log('prerequest');
            })
            .on('beforeRequest', (err, args) => {
                console.log('beforeRequest');
            })
            .on('request', (err, args) => {
                console.log('request');
            })
            .on('beforeTest', (err, args) => {
                console.log('beforeTest');
            })
            .on('test', (err, args) => {
                console.log('test');
            })
            .on('beforeScript', (err, args) => {
                console.log('beforeScript');
            })
            .on('script', (err, args) => {
                console.log('script');
            })
            .on('item', (err, args) => {
                console.log('item');
            })
            .on('iteration', (err, args) => {
                console.log('iteration');
            })
            .on('assertion', (err, args) => {
                // console.log('assertion');   
                io.emit('messages', args);
            })
            .on('console', (err, args) => {
                console.log('console');
            })
            .on('exception', (err, args) => {
                console.log('exception');
            })
            .on('beforeDone', (err, args) => {
                console.log('beforeDone');
            })
            .on('done', (err, summary) => {
                if (err || summary.error) {
                    console.error('collection run encountered an error.');
                } else {
                    console.log(summary);
                    console.log('collection run completed.');
                }
            });
    };

    return {
        runCollection: runCollection
    };

};