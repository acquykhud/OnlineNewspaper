const hbs_sections = require('express-handlebars-sections');
const moment = require('moment');
const days = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'];

module.exports = {
    section: hbs_sections(),

    ifCond: function(v1, operator, v2) {
        switch (operator) {
            case '==':
                return (v1 == v2);
            case '===':
                return (v1 === v2);
            case '!=':
                return (v1 != v2);
            case '!==':
                return (v1 !== v2);
            case '<':
                return (v1 < v2);
            case '<=':
                return (v1 <= v2);
            case '>':
                return (v1 > v2);
            case '>=':
                return (v1 >= v2);
            case '&&':
                return (v1 && v2);
            case '||':
                return (v1 || v2);
            default:
                return false;
        }
    },
    length: function(obj) {
        return obj.length;
    },
    convertTs: function(ts) {
        const tmp = moment.unix(ts);
        const dow = tmp.day();
        return tmp.format(`[${days[dow]}], DD/MM/YYYY HH:mm:ss`);
    },
};