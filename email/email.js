//Configuration for email connection
function email_Init() {
    const nodemailer = require("nodemailer");
    const email_config = require("./email_config.json");

    const transporter = nodemailer.createTransport({
        host: email_config.email_config.host,
        port: email_config.email_config.port,
        secure: email_config.email_config.secure,
        service: email_config.email_config.service,
        auth: {
            user: email_config.email_config.auth.user,
            pass: email_config.email_config.auth.pass
        }
    });

    return transporter;
}

function email_CreateBody(dataObject) {
    const mustache = require('mustache');
    
    // Your email template
    const emailTemplate = `
        <html>
            <head>
                <title>Whatapp Notification Bot ==> Chat ID: {{chat_id}}</title>
            </head>
            <body>
                <h1>Dear {{chat_receiver_name}},</h1>
                <p>Please find new message generated automatically based on Whatapp Bot application.</p>
                <ul>
                    <li>Message Time: {{chat_time}}</li>
                    <li>Sender Number: {{chat_sender_number}}</li>
                    <li>Sender Name: {{chat_sender_name}}</li>
                    <li>Message Body: {{chat_body}}</li>
                </ul>
                <p>
                    <br>Best Regards,
                    <br>Robot Email
                </p>
            </body>
        </html>
    `;
  
    // Use mustache to render the template with the dataObject
    const emailBody = mustache.render(emailTemplate, dataObject);
  
    return emailBody;
}

function email_Send(dataObject) {
    //Init email connection 
    const transporter = email_Init();
    
    //Generate the email body based on data object
    const emailBody = email_CreateBody(dataObject);
        
    const mailOptions = {
        from: "'No-reply' <robotemailproject@gmail.com>", //Sender address
        to: "aripilem@gmail.com, aritc2001@gmail.com", //List of to receivers
        cc: "robotemailproject@gmail.com", //List of cc receivers
        subject: "Whatapp Notification Bot ==> Chat ID: " + dataObject.chat_id, //Subject email text
        //text: "This is a test email sent using Nodemailer.", //Plain text body
        html: emailBody //HTML body
    };
    
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    email_Send
};