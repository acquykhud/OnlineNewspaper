const db = require('../utils/db');

module.exports = {
    async getListOfCategories() {
        return await db.select('').from('categories');
    },
    async getNameOfCategory(categoryId) {
        const tmp = await db.select('category_name').from('categories').where('category_id', categoryId);
        return tmp[0]['category_name'];
    },
    async getNameOfSubCategory(subCategoryId) {
        const tmp = await db.select('subcategory_name').from('subcategories').where('subcategory_id', subCategoryId);
        return tmp[0]['subcategory_name'];
    },
    async getListOfSubCategories(categoryId) {
        // return subcategories which belong to category_id
        return await db.select('').from('subcategories').where('category_id', categoryId);
    },
    async isCategoryIDValid(categoryId) {
        const tmp = await db.select('').from('categories').where('category_id', categoryId);
        return tmp.length !== 0;
    },
    async isSubCategoryIDValid(subCategoryId) {
        const tmp = await db.select('').from('subcategories').where('subcategory_id', subCategoryId);
        return tmp.length !== 0;
    },
    async getTagsByArticleId(articleId) {
        return (await db.raw(`
        select t.tag_name, t.tag_id from articles_tags at
        join tags t on t.tag_id = at.tag_id
        where at.article_id = ${articleId}
        `))[0];
    },
    async getArticlesBySubCategory(subCategoryId, offset, isValidSub = false) {
        const option1 = (isValidSub === true) ? '' : 'where a.is_premium = 0';
        const option2 = (isValidSub === true) ? 'order by a.is_premium desc' : '';
        const query = `select a.* from articles a
        join article_subcategories ass on a.article_id = ass.article_id and ass.subcategory_id = ${subCategoryId}
        join subcategories s on ass.subcategory_id = s.subcategory_id
        join categories c on s.category_id = c.category_id
        ${option1}
        ${option2}
        limit 6 offset ${offset}
        `;
        let list = await db.raw(query);
        list = list[0];
        for (let i = 0; i < list.length; ++i) {
            const articleId = list[i].article_id;
            const tagsList = await this.getTagsByArticleId(articleId);
            list[i].tagsList = tagsList;
            list[i].tagsListEmpty = (list[i].tagsList.length === 0);
        }
        return list;
    },
    async getArticlesByCategory(categorId, offset, isValidSub = false) {
        const option1 = (isValidSub === true) ? '' : 'where a.is_premium = 0';
        const option2 = (isValidSub === true) ? 'order by a.is_premium desc' : '';
        const query = `
        select a.*, c.category_name from articles a 
        join article_subcategories ass on a.article_id = ass.article_id 
        join subcategories s on ass.subcategory_id = s.subcategory_id and s.category_id = ${categorId}
        join categories c on s.category_id = c.category_id
        ${option1}
        ${option2}
        limit 6 offset ${offset}
        `;
        let list = await db.raw(query);
        list = list[0];
        for (let i = 0; i < list.length; ++i) {
            const articleId = list[i].article_id;
            const tagsList = await this.getTagsByArticleId(articleId);
            list[i].tagsList = tagsList;
            list[i].tagsListEmpty = (list[i].tagsList.length === 0);
        }
        return list;
    },
    async getSameArticlesByCategory(categoryId, articleId) {
        let list = await db.raw(`
        select a.*, c.category_name from articles a 
        join article_subcategories ass on a.article_id = ass.article_id 
        join subcategories s on ass.subcategory_id = s.subcategory_id and s.category_id = ${categoryId}
        join categories c on s.category_id = c.category_id
        where a.article_id <> ${articleId}
        order by RAND()
        limit 5
        `);
        list = list[0];
        for (let i = 0; i < list.length; ++i) {
            const eArticleId = list[i].article_id;
            const tagsList = await this.getTagsByArticleId(eArticleId);
            list[i].tagsList = tagsList;
            list[i].tagsListEmpty = (list[i].tagsList.length === 0);
        }
        return list;
    },
    async getArticleById(articleId) {
        let ret = await db.select('').from('articles').where('article_id', articleId);
        if (ret.length === 0)
            return null;
        ret = ret[0];
        const tagsList = await this.getTagsByArticleId(articleId);
        ret.tagsList = tagsList;
        ret.tagsListEmpty = (ret.tagsList.length === 0);
        return ret;
    },
    async getCommentsByArticleId(articleId) {
        let ret = await db.select('').from('comments').where('article_id', articleId);
        for (let i = 0; i < ret.length; ++i) {
            ret[i]['username'] = await this.getUsernameFromUserId(ret[i]['subscriber_id']);
        }
        return ret;
    },
    async getCatgoryByArticleId(articleId) {
        const query = `
        select distinct s.category_id from article_subcategories ass
        join subcategories s on s.subcategory_id = ass.subcategory_id 
        where ass.article_id = ${articleId}
        `;
        return (await db.raw(query))[0][0]['category_id'];
    },
    async getSubCatgoryByArticleId(articleId) {
        const query = `
        select subcategory_id from article_subcategories where article_id = ${articleId}
        `;
        return (await db.raw(query))[0][0]['subcategory_id'];
    },
    async getUsernameFromUserId(userId) {
        const ret = await db.select('username').from('users').where('id', userId);
        return ret[0]['username'];
    },
    async getArticlesByTag(tagId) {
        let list = await db.raw(`
        select a.* from articles a
        join articles_tags at on a.article_id = at.article_id
        where at.tag_id = ${tagId}
        `);
        list = list[0];
        for (let i = 0; i < list.length; ++i) {
            const articleId = list[i].article_id;
            const tagsList = await this.getTagsByArticleId(articleId);
            list[i].tagsList = tagsList;
            list[i].tagsListEmpty = (list[i].tagsList.length === 0);
        }
        return list;
    },
    async getNameOfTag(tagId) {
        const ret = await db.select('tag_name').from('tags').where('tag_id', tagId);
        return ret[0]['tag_name'];
    },
    async postComment(articleId, time, userId, commentContent) {
        await db.insert({
            'article_id': articleId,
            'time': time,
            'subscriber_id': userId,
            'comment_content': commentContent
        }).into('comments');
    },
    async getCountArticlesByCategory(categoryId) {
        const ret = await db.raw(`
        select count(distinct a.article_id) as cnt from articles a 
        join article_subcategories ass on a.article_id = ass.article_id 
        join subcategories s on ass.subcategory_id = s.subcategory_id and s.category_id = ${categoryId}
        join categories c on s.category_id = c.category_id
        `);
        return ret[0][0].cnt;
    },
    async getCountArticlesByKeyword(keyword) {
        const hexEncodedKeyword = '0x' + (new Buffer.from(keyword).toString('hex'));
        const ret = await db.raw(`
        select count(distinct a.article_id) as cnt from articles a 
        where match (title, content, abstract) against (${hexEncodedKeyword} in natural language mode);
        `);
        return ret[0][0].cnt;
    },
    async getCountArticlesBySubCategory(subCategoryId) {
        const ret = await db.raw(`
        select count (distinct a.article_id) as cnt from articles a
        join article_subcategories ass on a.article_id = ass.article_id and ass.subcategory_id = ${subCategoryId}
        join subcategories s on ass.subcategory_id = s.subcategory_id
        join categories c on s.category_id = c.category_id
        `);
        return ret[0][0].cnt;
    },
    async getTopArticlesByTime() {
        let list = (await db.raw(`
        select a.* from articles a
        order by a.published_time desc
        limit 10
        `))[0];
        for (let i = 0; i < list.length; ++i) {
            const articleId = list[i].article_id;
            const subCategoryId = await this.getSubCatgoryByArticleId(articleId);
            const subCategoryName = await this.getNameOfSubCategory(subCategoryId);
            list[i].subCategoryName = subCategoryName;
        }
        return list;
    },
    async getTopArticlesByView(limit = 10) {
        let list = (await db.raw(`
        select a.* from articles a
        order by a.views desc
        limit ${limit}
        `))[0];
        for (let i = 0; i < list.length; ++i) {
            const articleId = list[i].article_id;
            const subCategoryId = await this.getSubCatgoryByArticleId(articleId);
            const subCategoryName = await this.getNameOfSubCategory(subCategoryId);
            list[i].subCategoryName = subCategoryName;
        }
        return list;
    },
    async getTopArticleOfCategory(categoryId) {
        const ret = await db.raw(`
        select distinct a.*, c.* from articles a 
        join article_subcategories ass on a.article_id = ass.article_id 
        join subcategories s on ass.subcategory_id = s.subcategory_id and s.category_id = ${categoryId}
        join categories c on s.category_id = c.category_id
        having a.views = 
        (
        select max(a.views) from articles a 
        join article_subcategories ass on a.article_id = ass.article_id 
        join subcategories s on ass.subcategory_id = s.subcategory_id and s.category_id = ${categoryId}
        )
        order by a.published_time desc
        limit 1
        `);
        return ret[0][0];
    },
    async getTopArticleOfEachCategory() {
        const categoryList = await this.getListOfCategories();
        let list = [];
        for (let i = 0; i < categoryList.length; ++i) {
            const categoryId = categoryList[i].category_id;
            list.push(await this.getTopArticleOfCategory(categoryId));
        }
        return list;
    },
    async getArticlesByKeyword(keyword, offset, isValidSub = false) {
        const hexEncodedKeyword = '0x' + (new Buffer.from(keyword).toString('hex'));
        const option1 = (isValidSub === true) ? '' : 'and a.is_premium = 0';
        const option2 = (isValidSub === true) ? 'order by a.is_premium desc' : '';
        const query = `
        select a.* from articles a 
        where match (title, content, abstract) against (${hexEncodedKeyword} in natural language mode)
        ${option1}
        ${option2}
        limit 6 offset ${offset}
        `;
        // console.log(query);
        const ret = await db.raw(query);
        let list = ret[0];
        for (let i = 0; i < list.length; ++i) {
            const articleId = list[i].article_id;
            list[i].categoryId = await this.getCatgoryByArticleId(articleId);
            list[i].categoryName = await this.getNameOfCategory(list[i].categoryId);
            list[i].tagsList = await this.getTagsByArticleId(articleId);
            list[i].tagsListEmpty = (list[i].tagsList.length === 0);
        }
        return list;
    },
};