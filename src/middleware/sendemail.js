const nodemailer = require('nodemailer');
const config = require('./../config');

module.exports = {

    sendEmail: function (mailParams, callBack) {
        const transporter = nodemailer
            .createTransport({
                service: config.notification.service,
                auth: {
                    user: config.notification.emailAcc,
                    pass: config.notification.emailPass
                }
            });

        const mailOptions = {
            from: {
                name: config.notification.emailFrom.name,
                address: config.notification.emailFrom.address
            },
            //to: mailParams.emailTo,
            to: {
                name: config.notification.emailFrom.name,
                address: config.notification.emailFrom.address
            },
            subject: 'mailParams.mailSub', // Subject line
            html: 'mailParams.html', // plain text body
            //attachments: mailParams.attachments
        };

        transporter
            .sendMail(mailOptions, function (err, info) {
                if (err)
                    console.log(err);
                else
                    console.log(info);
                callBack();
            });
    },
    buildEmbeddedImages: function (embObjects) {

        let _attachments = [];
        let _img = '';
        embObjects.forEach(function (embObject) {
            _attachments.push({
                filename: embObject.filename,
                path: embObject.path,
                cid: embObject.cid
            });
            _img = _img + `<img src="${embObject.cid}"/>`;
        });
        var message = {
            html: `Embedded image: ${_img}`,
            attachments: _attachments
        };
        console.log(message);
        return message;
    },
    buildAndSend: function (payload) {
        payload = [{
            filename: 'embObject.filename',
            path: 'embObject.path',
            cid: 'embObject.cid'
        }, {
            filename: 'embObject.filename2',
            path: 'embObject.path2',
            cid: 'embObject.cid2'
        }];

        let message = buildEmbeddedImages(payload);
        message.mailSub = payload.mailSubject;
        sendEmail(message);

    }
};