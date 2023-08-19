const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key';

class Util {
    async hashPassword(password) {
        const saltRounds = 10; // Number of salt rounds to generate
        try {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            return hashedPassword;
        } catch (error) {
            // Handle error
            console.error('Error hashing password:', error);
            throw error;
        }
    }
    async verifyPassword(password, hashedPassword) {
        try {
            const match = await bcrypt.compare(password, hashedPassword);
            return match;
        } catch (error) {
            // Handle error
            console.error('Error verifying password:', error);
            throw error;
        }
    }
    generateVerificationCode() {
        const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let code = '';

        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
        }

        return code;
    }

    sendEmail(to, subject = 'verify code ✔', htmlContent) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'huutaidev@gmail.com', // generated ethereal user
                pass: 'vynpmzlehxevdqxg', // generated ethereal password
            }, // Sender's email password
        });
        const mailOptions = {
            from: 'huutaidev@gmail.com',
            to: to,
            subject: subject,
            text: 'code verify for you is : ',
            html: htmlContent,
        };

        return transporter.sendMail(mailOptions);
    }

    generateInvitationToken(userId) {
        const expiration = Math.floor(Date.now() / 1000) + 265 * 60 * 24; // 24 hours
        // Define the payload for the token
        const payload = {
            userId,
            exp: expiration,
        };
        // Generate the JWT
        const token = jwt.sign(payload, secretKey);
        return token;
    }

    generateHtmlContentInvite(link) {
        const htmlContent = `
      <html>
        <head>
          <style>
            /* Định dạng CSS cho các phần tử trong email */
            h1 {
              color: #ff0000; /* Màu đỏ */
            }
            
            p {
              font-weight: bold; /* In đậm */
            }
            
            .highlight {
              background-color: yellow; /* Nền màu vàng */
            }
          </style>
        </head>
        <body>
          <h1>Mời bạn trở thành thành viên</h1>
          <p>Bạn đã nhận được một lời mời để trở thành thành viên trong ứng dụng của chúng tôi.</p>
          <p class="highlight">Vui lòng nhấp vào <a href="${link}>đây</a> để đăng ký.</p>
        </body>
      </html>
    `;

        return htmlContent;
    }
}

module.exports = new Util();
