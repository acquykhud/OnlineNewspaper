const db = require('../utils/db');

module.exports = {
    all() {
        return db('tags');
    },

    async add(tag_name) {
        const query =
            `insert into tags(tag_name)
            values ("${tag_name}")
            `;

        const doQuery = await db.raw(query);
        return;
    },

    async find(tag_name) {
        const query =
            `select *
            from tags
            where tag_name = "${tag_name}"
            `;

        const list = await db.raw(query);
        return list[0];
    },

    async isIncluded(tag_name) {
        const list = await this.find(tag_name);
        if (list.length > 0) {
            return true;
        }
        return false;
    },

    async addTagList(tagList) {
        for (tag_name of tagList) {
            const isIncluded = await this.isIncluded(tag_name);
            if (isIncluded === false) {
                await this.add(tag_name);
            }
        }
    },
};