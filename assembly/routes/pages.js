var express = require('express');
var router = express.Router();
var _ = require('lodash');

// Get Page model
var Page = require('../models/page');
var Product = require('../models/product');
var Category = require('../models/category');

/*
 * GET/
 */
router.get('/', function (req, res) {

    Page.findOne({ slug: 'home' }, function (err, page) {
        Category.find(function (err, categories) {
            Product.find(function (err, products) {
                var arrivals = _.sortBy(products, ['timeAdded']).reverse().slice(0, 3);
                var popular = _.sortBy(products, ['sold']).reverse().slice(0, 6);
                var featured = _.filter(categories, { featured: true }).slice(0, 6);
                res.render('home', {
                    title: "The Assembly",
                    arrivals: arrivals,
                    popular: popular,
                    featured: featured
                });
            });
        });
    });
});

/*
 * GET a page
 */
router.get('/:slug', function (req, res) {

    var slug = req.params.slug;

    Page.findOne({ slug: slug }, function (err, page) {
        if (err)
            console.log(err);

        if (!page) {
            res.redirect('/');
        } else {
            res.render('index', {
                title: page.title,
                content: page.content
            });
        }
    });

});
//Exports
module.exports = router;