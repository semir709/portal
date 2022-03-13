
const nodemailer = require('nodemailer');

module.exports = {

    getTransport:  function() {

        let transport = nodemailer.createTransport({

            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }

        });

        return transport;

    }


}