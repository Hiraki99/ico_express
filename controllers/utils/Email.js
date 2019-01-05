const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    pool: true,
	host: 'mail.unibot.org',
	port: 26,
    secure: false, // true for 465, false for other ports
    tls: {
        rejectUnauthorized:false
    },
    auth: {
        user: "adminaibitcash@unibot.org", // generated ethereal user
        pass: "hlMJ4t=y.E5T"  // generated ethereal password
    }
});

exports.sendemail = function(from, sender_name, sender_to, title, body,callback){
	let mailOptions = {
        from: from, // sender address
        to: sender_to, // list of receivers
        subject: title, // Subject line
        html: body // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(27);
            console.log(error);
            callback(false);
        }else callback(true);

    });
}