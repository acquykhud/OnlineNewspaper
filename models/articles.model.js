const db = require('../utils/db');

module.exports = {
    all() {
        return db('articles');
    },

    async getArticleList(author_id) {
        const query =
            `select a.article_id, a.title, a.state
            from articles a
            where a.author_id = ${author_id}`;

        const list = await db.raw(query);
        return list[0];
    },

    async getEditorArticleList(editor_id) {
        const query =
            `select art.article_id, art.title, cat.category_name, subcat.subcategory_name, art.state 
            from editor_categories ec, categories cat, subcategories subcat,
            article_subcategories artsub, articles art
            where ec.category_id in
            (
                select ec2.category_id
                from editor_categories ec2
                where ec2.editor_id = ${editor_id}
            )
            and ec.category_id = cat.category_id
            and cat.category_id = subcat.category_id
            and subcat.subcategory_id = artsub.subcategory_id
            and artsub.article_id = art.article_id
            `;

        const list = await db.raw(query);
        return list[0];
    },

    async getTagForArticle(article_id) {
        const query =
            `select article_id, tag_name
            from articles_tags atag, tags t
            where atag.tag_id = t.tag_id
            and atag.article_id = ${article_id}`;

        const list = await db.raw(query);
        return list[0];
    },

    async getCategoryForArticle(article_id) {
        const query =
            `select sub.subcategory_name, cat.category_name
            from article_subcategories arsub, subcategories sub, categories cat
            where arsub.subcategory_id = sub.subcategory_id
            and sub.category_id = cat.category_id
            and arsub.id = ${article_id}`;

        const list = await db.raw(query);
        return list[0][0];
    },

    async getLatestDeclineReason(article_id) {
        const query =
            `select da.article_id, da.editor_id, u.full_name, da.decline_reason
            from declined_articles da, users u
            where da.editor_id = u.id
            and article_id = ${article_id}
            and da.decline_time =
            (
                select max(da2.decline_time)
                from declined_articles da2
                where article_id = ${article_id}
            )`;

        const list = await db.raw(query);
        return list[0][0];
    },

    async setStateToDeclined(article_id) {
        const query =
            `update articles
            set state = 3
            where article_id = ${article_id};`;

        const doQuery = await db.raw(query);
        return;
    },

    async addToDeclinedArticles(article_id, editor_id, decline_reason) {
        const query =
            `insert into declined_articles(article_id, editor_id, decline_reason, decline_time)
            values (${article_id}, ${editor_id}, "${decline_reason}", now())
            `;

        const doQuery = await db.raw(query);
        return;
    },
};