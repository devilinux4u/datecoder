require('dotenv').config({ path: '../.env' });
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

const sendMatchEmail = (email, user) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'You Have a New Match!',
        html: `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    background-color: #ffffff;
                    margin: 20px auto;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    max-width: 600px;
                }
                .header {
                    text-align: center;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #dddddd;
                }
                .header h1 {
                    margin: 0;
                    color: #333333;
                }
                .content {
                    padding: 20px 0;
                }
                .content p {
                    margin: 0 0 10px;
                    color: #555555;
                }
                .footer {
                    text-align: center;
                    padding-top: 20px;
                    border-top: 1px solid #dddddd;
                }
                .footer p {
                    margin: 0;
                    color: #999999;
                    font-size: 12px;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    margin-top: 20px;
                    background-color: #007BFF;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>Congratulations, You Have a New Match!</h1>
                </div>
                <div class="content">
                    <p>Hi,</p>
                    <p>We are excited to inform you that you have a new match on 'date with coder'!</p>
                    <p>You matched with <b>${user.name}</b><br>
                       Their email is <b>${user.email}</b><br>
                       And, instagram id is <b>${user.insta}</b>
                    </p>
                    <p>Login to view the details.</p>
                </div>
            </div>
        </body>
        </html>
        `,
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:');
        }
    });
};

module.exports.mail = sendMatchEmail;