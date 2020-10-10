const nodemailer = require("nodemailer");
async function doemail(email, token, resetLink) {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: 'smtp.mail.yahoo.com',
        port: 465,
        service: 'yahoo',
        secure: false,
        tls: false,
        auth: {
            user: 'mdshafiulazam33@yahoo.com',
            pass: 'nbwnvhnrxrhqdmuz'
        },
        debug: false,
        logger: true
    });
    let link, subText;
    if (resetLink) {
        link = `https://react-jobs-clone.herokuapp.com/password-reset?token=${token}&email=${email}`
        subText = "Password-Reset On React-Jobs-Clone"
    }
    else {
        link = `https://react-jobs-clone.herokuapp.com/api/profile/email-verification?token=${token}`
        subText = "Email Verification For React-Jobs-Clone"
    }
    console.log(email)
    let info = await transporter.sendMail({
        from: '<mdshafiulazam33@yahoo.com>', // sender address
        to: email, // list of receivers
        subject: subText, // Subject line
        html: `<a href="${link}">${link}</a>`, // html body
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
module.exports.doemail = doemail