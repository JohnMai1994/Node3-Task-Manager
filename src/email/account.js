const sgMail = require("@sendgrid/mail");

const sendgridAPIKey = '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';

sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "jmai@bluroot.co",
        subject: "Thanks for joining in!",
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
};

const sendGoodByeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "jmai@bluroot.co",
        subject: `Good Bye, ${name}`,
        text: `Thank you for your using, hope you have a good day!! Could you might tell me why you design not to use our product? `
    })
}



module.exports = {
   sendWelcomeEmail,
    sendGoodByeEmail
};


// sgMail.send({
//     to: "mjd64929@icloud.com",
//     from: "jmai@bluroot.co",
//     subject: "This is my first creation",
//     text: "I hop this work",
//     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// });