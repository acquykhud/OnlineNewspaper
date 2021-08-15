const express = require('express');
const auth = require('../middlewares/auth.mdw');
const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const sendmail = require('../utils/sendmail');
const { route } = require('./writer.route');
const session = require('express-session');
const router = express.Router();

router.get('/login', auth.requireNoLogin, function (req, res) {
    res.render('user/login');
});

router.post('/login', auth.requireNoLogin, async function (req, res) {
    const user = await userModel.findUserByUsername(req.body.username);
    if (user == null) {
        return res.render('user/login', {login_error: "Tài khoản không tồn tại"});
    }
    if (bcrypt.compareSync(req.body.password, user.password) === false) {
        return res.render('user/login', {login_error: "Mật khẩu không chính xác"});
    }
    delete user.password;
    user.dob = moment(user.dob, 'YYYY/MM/DD').format('DD/MM/YYYY');
    user.roleName = await userModel.findRoleNameByRoleId(user.role);
    req.session.logged = true;
    req.session.user = user;
    res.redirect('/');
});

router.get('/register', auth.requireNoLogin, function (req, res) {
    res.render('user/register');
});

router.post('/register', auth.requireNoLogin, async function (req, res) {
    const user = {
        username: req.body.username,
        password: req.body.password,
        repassword: req.body.repassword,
        full_name: req.body.full_name,
        email: req.body.email,
        dob: req.body.dob,
        role: 2
    };
    let registerMsg = [];
    let error = true;
    if (typeof(user.username) == 'undefined' || user.username.length == 0) {
        registerMsg.push('Hãy điền tên đăng nhập');
    }
    if (typeof(user.password) == 'undefined' || user.password.length == 0) {
        registerMsg.push("Hãy điền mật khẩu");
    }
    if (typeof(user.repassword) == 'undefined' || user.repassword.length == 0) {
        registerMsg.push("Hãy nhập lại mật khẩu");
    }
    if (typeof(user.full_name) == 'undefined' || user.full_name.length == 0) {
        registerMsg.push("Hãy điền họ tên");
    }
    if (typeof(user.email) == 'undefined' || user.email.length == 0) {
        registerMsg.push("Hãy điền email");
    }
    else if (/\S+@\S+\.\S+/.test(user.email) == false) {
        registerMsg.push("Email không đúng định dạng");
    }
    if (typeof(user.dob) == 'undefined' || user.dob.length == 0) {
        registerMsg += "Hãy điền ngày tháng năm sinh";
    }
    if (user.password != user.repassword) {
        registerMsg.push("Mật khẩu nhập lại không khớp");
    }
    if (await userModel.findUserByUsername(user.username) != null) {
        registerMsg.push("Tên tài khoản đã tồn tại");
    }
    if (await userModel.findUserByEmail(user.email) != null) {
        registerMsg.push("Địa chỉ email đã được sử dụng");
    }
    if (registerMsg.length == 0) {
        user.password = bcrypt.hashSync(user.password, 10);
        user.dob = moment(user.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
        delete user.repassword;
        await userModel.addUser(user);
        registerMsg.push("Đăng ký tài khoản thành công");
        res.render('user/register', {registerMsg: registerMsg});
    }
    else {
        res.render('user/register', {registerMsg: registerMsg, error: error});
    }
});

router.post('/logout', auth.requireLogin, function (req, res) {
    req.session.logged = false;
    req.session.user = null;
    res.redirect('/');
});

router.get('/info', auth.requireLogin, function (req, res) {
    res.render('user/info');
});

router.get('/update', auth.requireLogin, function (req, res) {
    res.render('user/update_info');
});

router.post('/update', auth.requireLogin, async function (req, res) {
    let msg = [];
    let user = {
        username: req.session.user.username,
        full_name: req.body.full_name,
        email: req.body.email,
        dob: req.body.dob
    };
    if (req.session.user.role == 3) {
        user.pseudonym = req.body.pseudonym;
    }
    if (typeof(user.full_name) == 'undefined' || user.full_name.length == 0) {
        msg.push('Hãy điền họ tên');
    }
    if (typeof(user.email) == 'undefined' || user.email.length == 0) {
        msg.push('Hãy điền email');
    }
    else if (/\S+@\S+\.\S+/.test(user.email) == false) {
        registerMsg.push("Email không đúng định dạng");
    }
    if (req.session.user.role == 3) {
        if (typeof(user.pseudonym) == 'undefined' || user.pseudonym.length == 0) {
            msg.push('Hãy điền bút danh');
        }
    }
    if (typeof(user.dob) == 'undefined' || user.dob.length == 0) {
        msg.push('Hãy điền ngày tháng năm sinh');
    }

    if (msg.length == 0) {
        user.dob = moment(user.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
        await userModel.updateUser(user);
        req.session.user = await userModel.findUserByUsername(req.session.user.username);
        delete req.session.user.password;
        req.session.user.dob = moment(req.session.user.dob, 'YYYY/MM/DD').format('DD/MM/YYYY');
        req.session.user.roleName = await userModel.findRoleNameByRoleId(req.session.user.role);
        res.locals.user = req.session.user;
        msg.push('Cập nhật thông tin tài khoản thành công');
        return res.render('user/update_info', {msg: msg});
    }
    else {
        return res.render('user/update_info', {msg: msg, err: true});
    }
});

router.get('/changepwd', auth.requireLogin, function (req, res) {
    res.render('user/change_password');
});

router.post('/changepwd', auth.requireLogin, async function (req, res) {
    let msg = [];
    if (typeof(req.body.oldpassword) == 'undefined' || req.body.oldpassword.length == 0) {
        msg.push("Hãy nhập mật khẩu cũ");
    }
    if (typeof(req.body.password) == 'undefined' || req.body.password.length == 0) {
        msg.push("Hãy nhập mật khẩu mới");
    }
    if (typeof(req.body.repassword) == 'undefined' || req.body.repassword.length == 0) {
        msg.push("Hãy nhập lại mật khẩu mới");
    }
    if (req.body.password != req.body.repassword) {
        msg.push("Mật khẩu mới nhập lại không khớp");
    }
    let user = await userModel.findUserByUsername(req.session.user.username);
    if (user == null) {
        msg.push("Tài khoản không tồn tại");
    }
    else {
        if (bcrypt.compareSync(req.body.oldpassword, user.password) === false) {
            msg.push("Mật khẩu cũ không chính xác");
        }
        else {
            userInfo = {
                username: req.session.user.username,
                password: bcrypt.hashSync(req.body.password, 10),
            }
            await userModel.updateUser(userInfo);
        }
    }
    if (msg.length == 0) {
        msg.push("Đổi mật khẩu thành công");
        return res.render('user/change_password', {msg: msg});
    }
    else {
        return res.render('user/change_password', {msg: msg, err: true});
    }
});

router.get('/resetpwd', auth.requireNoLogin, function (req, res) {
    res.render('user/resetpwd_send_otp');
});

router.post('/resetpwd', auth.requireNoLogin, async function (req, res) {
    if (typeof(req.body.email) == 'undefined' || req.body.email.length == 0) {
        res.render('user/resetpwd_send_otp', {err: "Hãy nhập email"});
    }
    else {
        let user = await userModel.findUserByEmail(req.body.email);
        if (user == null) {
            res.render('user/resetpwd_send_otp', {err: "Không có tài khoản nào sử dụng địa chỉ email này"});
        }
        else {
            let timeNow = new Date();
            let lastestOTP = await userModel.findValidUnusedOTP(req.body.email, timeNow);
            if (lastestOTP == null) {
                let createTime = timeNow;
                let outdateTime = new Date(createTime.getTime() + 15 * 60000);
                let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                let otp = '';
                for (var i = 0; i < 6; ++i) {
                    otp += chars[Math.floor(Math.random() * chars.length)];
                }
                lastestOTP = {
                    email: req.body.email,
                    otp: otp,
                    create_time: createTime,
                    outdate_time: outdateTime,
                    is_used: 0
                }
                await userModel.addOTP(lastestOTP);
                const days = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'];
                const tmp = moment(lastestOTP.outdate_time);
                const dow = tmp.day();
                lastestOTP.outdate_time = tmp.format(`[${days[dow]}], DD/MM/YYYY HH:mm:ss`);
            }
            req.session.emailOTP = req.body.email;
            sendmail.sendOTPEmail(req.body.email, user.full_name, lastestOTP.otp, lastestOTP.outdate_time);
            res.render('user/resetpwd_change_pass', {
                email: req.body.email, 
                time: lastestOTP.outdate_time
            });
        }
    }
});

router.post('/resetpwd/changepass', auth.requireNoLogin, async function (req, res) {
    let msg = [];
    if (typeof(req.body.otp) == 'undefined' || req.body.otp.length == 0) {
        msg.push("Hãy nhập mã OTP");
    }
    if (typeof(req.body.password) == 'undefined' || req.body.password.length == 0) {
        msg.push("Hãy nhập mật khẩu mới");
    }
    if (typeof(req.body.repassword) == 'undefined' || req.body.repassword.length == 0) {
        msg.push("Hãy nhập lại mật khẩu mới");
    }
    if (req.body.password != req.body.repassword) {
        msg.push("Mật khẩu nhập lại không khớp");
    }
    if (msg.length == 0) {
        if (req.session.emailOTP == null) {
            return res.redirect('/user/resetpwd');
        }
        otp = await userModel.findNewestOTPByEmailAndOTP(req.session.emailOTP, req.body.otp);
        if (otp == null) {
            msg.push("Mã OTP không đúng");
        }
        else {
            user = await userModel.findUserByEmail(req.session.emailOTP);
            if (user == null) {
                msg.push("Không tìm thấy tài khoản của bạn");
            }
            else {
                user.password = bcrypt.hashSync(req.body.password, 10);
                await userModel.updateUser(user);
                req.session.emailOTP = null;
                msg.push("Khôi phục mật khẩu thành công");
                return res.render('user/resetpwd_change_pass', {
                    msg: msg,
                });
            }
        }
        res.render('user/resetpwd_change_pass', {
            msg: msg,
            err: true
        });
    }
    else {
        res.render('user/resetpwd_change_pass', {
            msg: msg,
            err: true
        });
    }
});

module.exports = router;