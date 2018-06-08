"use strict;"
//import { runCollection } from "./../middleware/newman";
const newman = require('./../middleware/newman');

const app = require('./../express');
const io = require('./../middleware/socketio')(app);

module.exports = {
    runPMCollection: function (req, res, next) {
        console.log('Begin runCollection');



        //Sample request
        // {
        //     "collectionFile": "./TestCollection.collection.json",
        //     "environmentFile": "./local.environment.json",
        //     "iterationCount": 1,
        //     "iterationFile": "req.body.iterationFile",
        //     "delayRequest": 5,
        //     "globalsFile": "./globals.postman_globals.json" 
        //   }

        let runnerData = {
            'collectionFile': req.body.collectionFile,
            'environmentFile': req.body.environmentFile,
            'iterationCount': req.body.iterationCount,
            'iterationFile': req.body.iterationFile,
            'delayRequest': req.body.delayRequest,
            'globalsFile': req.body.globalsFile
        };
        newman(io)
            .runCollection(runnerData, (summary) => {
                res.send('/htmlOutput.html');
            });
    }
};