const nodemailer = require('nodemailer');

module.exports = {
    async sendOTPEmail(email, fullname, otp, outdateTime) {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'hcmus.thnmcntt2.project1@gmail.com',
                pass: 'barbarteamgmail'
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        let content = '';
        content += "<p>Chào, " + fullname + "</p><br>";
        content += "<p>Bạn đã yêu cầu đặt lại mật khẩu trên trang Online Newspaper, vì vậy đây là mã OTP để đặt lại mật khẩu:</p><br>";
        content += "<h3>" + otp + "</h3><br>";
        content += "<p>Mã OTP này sẽ hết hạn vào <b>" + outdateTime + "</b></p><br>";
        content += "<p>Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này</p><br>"; 
        await transporter.sendMail({
            from: "hcmus.thnmcntt2.project1@gmail.com",
            to: email,
            subject: "[Online Newspaper] Yêu cầu đặt lại mật khẩu",
            text: "",
            html: content,
        });
    }
};