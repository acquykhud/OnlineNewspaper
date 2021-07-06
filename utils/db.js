const moment = require('moment');
const days = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'];
const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'xikhud',
        password: 'xikhud',
        database: 'OnlineNewspaper',
        typeCast: function (field, next) {
            if (field.type == 'DATETIME') {
                const tmp = moment(field.string());
                const dow = tmp.day();
                return tmp.format(`[${days[dow]}], DD/MM/YYYY HH:mm:ss`);
            }
            return next();
        }
    }
});

module.exports = knex;