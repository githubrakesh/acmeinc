
"use strict";
import path from 'path';
import nodegit from "nodegit";
module.exports = {

    posttest: function (req, res, next) {
        let inputData = {
            'repopath': req.body.repopath,
            'fromlocalbranch': req.body.fromlocalbranch,
            'fromremotebranch': req.body.fromremotebranch,
            'tolocalbranch': req.body.tolocalbranch,
            'toremotebranch': req.body.toremotebranch,
            'stashmessage': req.body.stashmessage
        };

        // local-iq17.3 //fromlocalbranch
        // remote-origin/iq17.3 //fromremotebranch

        // merge-18.1 //tolocalbranch
        // merge- origin/18.1 //toremotebranch

        // gettest: function (req, res, next) {
        let directories = req.body.repopath;// ["E:", "Source", "IQ11", "DesktopClientUI"];
        //directories.join(path.sep);
        console.log(inputData.repopath.join(path.sep));
        console.log(inputData);

        var cloneOpts = {
            fetchOpts: {
                callbacks: {
                    credentials: function (url, userName) {
                        return nodegit.Cred.sshKeyNew(
                            userName,
                            '/Users/radek/.ssh/id_rsa.pub',
                            '/Users/radek/.ssh/id_rsa',
                            "<your-passphrase-here>");
                    }
                }
            }
        };

        nodegit.Repository
            .open(directories.join(path.sep))
            .then(function (repo) {
                console.log('Stashing repo');
                return nodegit.Stash
                    .save(repo, repo.defaultSignature(), inputData.stashmessage, 0) //repo.defaultSignature(), stashMessage, 0
                    .then((oid) => {
                        return repo.getCurrentBranch()
                            .then((ref) => {
                                console.log("On " + ref.shorthand() + " " + ref.target());
                                console.log("Checking out to " + inputData.fromlocalbranch);

                                let checkoutOpts = {
                                    checkoutStrategy: nodegit.Checkout.STRATEGY.FORCE
                                };
                                return repo.checkoutBranch(inputData.fromlocalbranch, checkoutOpts);
                            }).then(() => {
                                return repo.getCurrentBranch()
                                    .then((ref) => {
                                        console.log("On " + ref.shorthand() + " " + ref.target());
                                    });
                            }).then(() => {
                                return repo.fetchAll({
                                    callbacks: {
                                        credentials: function (url, userName) {
                                            console.log("Username: " + userName);
                                            return nodegit.Cred.sshKeyFromAgent(userName);
                                        },
                                        certificateCheck: function () {
                                            return 1;
                                        }
                                    }
                                }).then(() => {
                                    console.log('merging ' + inputData.fromlocalbranch + ' to ' + inputData.fromremotebranch)
                                    return repo.mergeBranches(inputData.fromlocalbranch, inputData.fromremotebranch);
                                    // repo.mergeBranches("master", "origin/master"); origin/iq17.3
                                });
                            }).then(() => {
                                console.log("Checking out to " + inputData.tolocalbranch);
                                let checkoutOpts = {
                                    checkoutStrategy: nodegit.Checkout.STRATEGY.FORCE
                                };
                                return repo.checkoutBranch(inputData.tolocalbranch, checkoutOpts)
                                    .then(() => {
                                        return repo.getCurrentBranch()
                                            .then((ref) => {
                                                console.log("On " + ref.shorthand() + " " + ref.target());
                                            });
                                    });
                            }).then(() => {
                                console.log('merging ' + inputData.fromlocalbranch + ' to ' + inputData.tolocalbranch)
                                return repo.mergeBranches(inputData.fromlocalbranch,
                                    inputData.tolocalbranch, repo.defaultSignature())
                                    .then((oid) => {
                                        console.log('Oid  ' + oid);
                                    });
                            }).then(() => {
                                return repo.fetchAll({
                                    callbacks: {
                                        credentials: function (url, userName) {
                                            console.log("Username: " + userName);
                                            return nodegit.Cred.sshKeyFromAgent(userName);
                                        },
                                        certificateCheck: function () {
                                            return 1;
                                        }
                                    }
                                }).then(() => {
                                    console.log('merging ' + inputData.tolocalbranch + ' to ' + inputData.toremotebranch)
                                    return repo.mergeBranches(inputData.tolocalbranch, inputData.toremotebranch)
                                        .then((oid) => {
                                            console.log('Oid  ' + oid);
                                        });
                                });
                            }).
                            then(() => {
                                return nodegit.Stash.pop(repo, 0);
                                // .then(() => {
                                // })                                   
                            });
                    });
            })
            .catch((err) => {
                console.log(`Error :` + err);
                next(err);
            })
            .done(() => {
                console.log('Finished');
                res.json({ message: 'Finished' });

            });
    }
};