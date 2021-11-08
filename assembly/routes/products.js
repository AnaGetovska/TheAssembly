var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var auth = require('../config/auth');
var isUser = auth.isUser;
var _ = require('lodash');

// Get Product model
var Product = require('../models/product');

// Get Category model
var Category = require('../models/category');

/*
 * GET all products
 */
router.get('/', async (req, res) => {
    let allCategories = await Category.find();
    let products = await Product.find();
    var loggedIn = (req.isAuthenticated()) ? true : false;

    res.render('cat_products', {
        title: 'All Products',
        category: 'All Products',
        products: products,
        loggedIn: loggedIn
    });
});

//GET Search
router.get('/search', async (req, res) => {
    var all = await Product.find();
    var matching = _.filter(all, (e) => {
        return e.title.toLowerCase().includes(req.query.q.toLowerCase());
    });

    res.render('search_results', {
        products: matching,
        title: "Search Results"
    });
});

/*
 * GET products by category
 */
router.get('/:category', function (req, res) {
    var loggedIn = (req.isAuthenticated()) ? true : false;
    var categorySlug = req.params.category;

    Category.findOne({ slug: categorySlug }, function (err, c) {
        Product.find({ category: categorySlug }, function (err, products) {
            if (err)
                console.log(err);
            if (!c) {
                res.redirect('/');
                return;
            }

            res.render('cat_products', {
                title: c.title,
                category: c.title,
                products: products,
                loggedIn: loggedIn
            });

        });
    });

});


/*
 * GET products details
 */
router.get('/:category/:product', function (req, res) {
    var galeryImages = null;
    var loggedIn = (req.isAuthenticated()) ? true : false;

    Product.findOne({ slug: req.params.product }, function (err, product) {
        if (err) {
            console.log(err);
        }
        if (!product) {
            res.redirect('/');
            return;
        }
        var galleryDir = 'public/product_images/' + product._id + '/gallery';

        fs.readdir(galleryDir, function (err, files) {

            if (err) {
                console.log(err);
            } else {
                galleryImages = files;

                res.render('product', {
                    title: product.title,
                    p: product,
                    galleryImages: galleryImages,
                    loggedIn: loggedIn
                });

            }
        });
    });
});
//Exports
module.exports = router;