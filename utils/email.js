const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.to = user.email;
    this.from = `Mahmoud Yahia <${process.env.MAIL_FROM}>`;
  }
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //sendinBlue

      return nodemailer.createTransport({
        // service: 'Brevo',
        host: process.env.SENDINBLUE_SERVER,
        secure: true,
        port: process.env.SENDINBLUE_PORT,
        auth: {
          user: process.env.SENDINBLUE_USER,
          pass: process.env.SENDINBLUE_PASSWORD,
        },
      });
    }
    // 1) Create a transporter
    return nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendEmail(template, subject) {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    // 2) Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    // 3) Actually send the email
    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcomeEmail() {
    await this.sendEmail('welcome', 'Welcome to Our Natours Family');
  }

  async sendResetPasswordEmail() {
    await this.sendEmail(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};

//   // transport by Gmail ==> only 500 email per day  & you will be marked as a spammer
//   const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//       user: process.env.USERNAME_GMAIL,
//       pass: process.env.PASSWORD_GMAIL,
//     },
//     //activate in gmail "less secure app" option
//   });
