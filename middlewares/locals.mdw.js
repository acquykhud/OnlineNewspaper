const categoryModel = require('../models/categories.models');

module.exports = function (app) {
    app.use(function (req, res, next) {
        if (typeof(req.session.auth) == 'undefined') {
            req.session.auth = false;
        }
        res.locals.auth = req.session.auth;
        next();
    });

    app.use(async function (req, res, next) {
        const categoriesList = await categoryModel.getListOfCategories();
        let allList = [];
        for (let i = 0; i < categoriesList.length; ++i) {
            let newObject = {
                'category': categoriesList[i],
            };
            const category_id = categoriesList[i]['category_id'];
            let subCategoriesList = await categoryModel.getListOfSubCategories(category_id);
            newObject['subCategoriesList'] = subCategoriesList;
            newObject['empty'] = false;
            if (subCategoriesList.length === 0)
                newObject['empty'] = true;
            allList.push(newObject);
        }
        res.locals.categoriesList = allList;
        next();
    });
}