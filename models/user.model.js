const db = require('../utils/db');
const moment = require('moment');

module.exports = {
    async findUserByUsername(username) {
        const matched_users = await db('users').where('username', username);
        if (matched_users.length == 0) {
            return null;
        }
        return matched_users[0];
    },

    async findSubInfoByUserId(id) {
        const ret = await db('sub_timer').where({
            subscriber_id: id,
        }).orderBy('start_time', 'desc');
        if (ret.length === 0)
            return null;
        return ret[0];
    },

    async updateSub(id) {
        const ts = Math.floor(Date.now() / 1000.0);
        const tmp = moment.unix(ts) //.format('YYYY-MM-DD');
        const start_time = tmp.format('YYYY-MM-DD hh:mm:ss');
        await db('sub_timer').insert({
            'subscriber_id': id,
            'start_time': start_time,
        });
    },

    async findUserByEmail(email) {
        const matched_users = await db('users').where('email', email);
        if (matched_users.length == 0) {
            return null;
        }
        return matched_users[0];
    },

    async findValidUnusedOTP(email, date) {
        const rows = await db('resetpwd_otp_logs').where('email', email)
                    .where('is_used', 0)
                    .where('create_time', '<=', date)
                    .where('outdate_time', '>', date)
                    .orderBy('outdate_time', 'desc');
        if (rows.length == 0) {
            return null;
        }
        return rows[0];
    },

    async findNewestOTPByEmailAndOTP(email, otp) {
        const rows = await db('resetpwd_otp_logs').where('email', email).where('otp', otp).orderBy('outdate_time', 'desc');
        if (rows.length == 0) {
            return null;
        }
        return rows[0];
    },

    async findRoleNameByRoleId(roleId) {
        const matched_rows = await db('user_roles').where('rold_id', roleId);
        if (matched_rows.length == 0) {
            return '???';
        }
        return matched_rows[0].role_name;
    },

    addUser(user) {
        return db('users').insert(user);
    },

    addOTP(otp) {
        return db('resetpwd_otp_logs').insert(otp);
    },

    updateUser(user) {
        const username = user.username;
        delete user.username;
    
        return db('users')
          .where('username', username)
          .update(user);
      },
};