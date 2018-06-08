"use strict";

import fs from 'fs';
import path from 'path';

import webdriver from 'selenium-webdriver';
import phantomjs from 'selenium-webdriver/phantomjs';

import config from './../config';

const By = webdriver.By;
const Key = webdriver.Key;
const until = webdriver.until;
const TimeUnit = webdriver.TimeUnit;

module.exports = {
    getScreenShot: function (req, res, next) {
        console.log('Begin getScreenShot');

        let capabilities = webdriver.Capabilities.phantomjs();
        capabilities.set(webdriver.Capability.ACCEPT_SSL_CERTS, true);
        capabilities.set(webdriver.Capability.SECURE_SSL, false);
        capabilities.set("phantomjs.cli.args", ["--web-security=no",
            "--ssl-protocol=any",
            "--ignore-ssl-errors=yes"
        ]);

        let driver = new webdriver.Builder()
            .withCapabilities(capabilities)
            .build();

        function writeScreenshot(data, name, cBack) {
            name = name || 'ss.png';
            let imgFile = path.join('.', 'datafiles', name);
            fs.mkdir(path.join('.', 'datafiles'), function (err) {
                fs.writeFile(imgFile, data, 'base64', function (err) {
                    if (err) {
                        throw err;
                    } else {
                        cBack(imgFile);
                    }
                });
            });
        }

        driver
            .manage()
            .window()
            .maximize();

        driver
            //.get('https://<<zone>>/enterprisedesktop/login.aspx')
            .get(config.loginpage.url)
            .then(() => {
                console.log(config.loginpage.url);
                driver
                    .takeScreenshot()
                    .then((data) => {
                        // console.log('loginpage');
                        writeScreenshot(data, 'loginpage.png', (imgPath) => {
                            console.log(`saved login image ${imgPath}`);
                        });
                    })
                    .catch((err) => {
                        console.log(`Error ${err}`);
                        throw err;
                    });
                driver
                    .findElement(By.id(config.loginpage.usernameelem))
                    .sendKeys(config.loginpage.usernamevalue);
                driver
                    .findElement(By.id(config.loginpage.passwordelem))
                    .sendKeys(config.loginpage.passwordvalue);
                driver
                    .findElement(By.id(config.loginpage.btnloginelem))
                    .click();
                driver
                    .sleep(2000)
                    .then(() => {
                        driver
                            .findElement(By.id('gridPageViewToolBar1_gridView__gridViewCombo_search'))
                            .click()
                            .then(() => {
                                driver
                                    .findElement(By.xpath('//*[@id="gridPageViewToolBar1_gridView__gridViewCombo_tdata"]/tbody/tr[3]'))
                                    .click()
                                    .then(() => {
                                        //console.log("found ");
                                        driver
                                            .takeScreenshot()
                                            .then((data) => {
                                                writeScreenshot(data, 'timeappgrid.png', (file) => {
                                                    console.log(`created image ${file}`);
                                                    let strm = fs.createReadStream(file);
                                                    strm.on('open', function () {
                                                        res.setHeader('Content-Type', 'image/png');
                                                        strm.pipe(res);
                                                    });
                                                    // res.send({ 'd': 'd' });
                                                });
                                            })
                                            .catch((err) => {
                                                console.log(`Error ${err}`);
                                                throw err;
                                            });
                                    }).catch((err) => {
                                        console.log(`Error ${err}`);
                                        throw err;
                                    });
                            })
                            .catch((err) => {
                                throw err;
                            });
                    });
            }).catch((err) => {
                console.log(`Error in getScreenShot ${err}`);
            });
    }  
};