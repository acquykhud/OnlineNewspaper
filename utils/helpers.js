const categoryModel = require('../models/categories.models');
const { findSubInfoByUserId } = require('../models/user.model');
const puppeteer = require('puppeteer');
 
module.exports = {
    async createPagingList(currentPage, type, arg1) {
        let totalArticlesCount = 0;
        switch (type) {
            case 'category':
                totalArticlesCount = await categoryModel.getCountArticlesByCategory(arg1);
                break;
            case 'subcategory':
                totalArticlesCount = await categoryModel.getCountArticlesBySubCategory(arg1);
                break;
            case 'keyword':
                totalArticlesCount = await categoryModel.getCountArticlesByKeyword(arg1);
                break;
            case 'tag':
                break;
            default:
                console.log(`[+] Unknown type: ${type}, please check`);
                break;
        }
        const totalPage = (totalArticlesCount % 6 === 0) ? (totalArticlesCount / 6) : Math.floor(totalArticlesCount / 6) + 1;
        let ret = {
            prev: null,
            next: null,
            list: [],
        };
        let start = 1;
        if (currentPage === 1) {
            start = 1;
            //ret.next = 2;
            ret.next = (totalPage >= 2) ? 2 : null;
            ret.prev = null;
        } else if (currentPage === totalPage) {
            //start = totalPage - 2;
            //ret.prev = totalPage - 1;
            start = Math.max(totalPage - 2, 1);
            ret.prev = (totalPage >= 2) ? totalPage - 1: null;
            ret.next = null;
        } else {
            start = currentPage - 1;
            ret.next = currentPage + 1;
            ret.prev = currentPage - 1;
        }
        for (let i = start; i <= Math.min(start + 2, totalPage); ++i) {
            ret.list.push({
                page: i,
                active: (i === currentPage) ? true : false,
            });
        }
        return ret;
    },
    makePairs(list) {
        let ret = [];
        for (let i = 0; ;) { // make pairs
            let pairs = {
                a1: null,
                a2: null,
            };
            if (i >= list.length)
                break;
            pairs.a1 = list[i];
            if (i + 1 >= list.length) {
                ret.push(pairs);
                break;
            }
            pairs.a2 = list[i + 1];
            ret.push(pairs);
            i = i + 2;
        }
        return ret;
    },
    async checkValidSub(user) {
        if (user.role !== 2)
            return false;
        const subInfo = await findSubInfoByUserId(user.id);
        const start_time = subInfo['start_time'];
        const now = Math.ceil(Date.now() / 1000.0);
        const diff = now - start_time;
        if (diff < 604800)
            return true;
        return false;
    },
    async printPDF(url) {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, {waitUntil: 'networkidle0'});
        const pdf = await page.pdf({ format: 'A4' });
        await browser.close();
        return pdf;
    },

    sendWithFileName(res, data, fileName) {
        res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
        res.setHeader('Content-Transfer-Encoding', 'binary');
        res.setHeader('Content-Type', 'application/octet-stream');
        return res.send(data);
    }
}