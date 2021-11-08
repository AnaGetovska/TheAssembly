var express = require('express');
var router = express.Router();
var _ = require('lodash');

// Get Product model
var Product = require('../models/product');

/*
 * GET add product to cart/
 */
router.get('/add/:product', function (req, res) {

    var slug = req.params.product;

    Product.findOne({ slug: slug }, function (err, p) {
        if (err)
            console.log(err);

        if (!req.session.cart) {
            req.session.cart = [];
        }
        let found = _.find(req.session.cart, { slug: p.slug });
        if (found) {
            console.log('found', found);
            if (!found.quantity) {
                found.quantity = 1;
            }
            found.quantity++;
        }
        else {
            let tmp = { ...p._doc };
            tmp.quantity = 1;
            req.session.cart.push(tmp);
        }
        console.log(req.session.cart);

        //console.log(req.session.cart);
        req.flash('success', 'Product added!');
        res.redirect('back');
    });
});

/*
 * GET checkout page
 */
router.get('/checkout', function (req, res) {
    if (req.session.cart && req.session.cart.length == 0) {
        delete req.session.cart;
        res.redirect('/cart/checkout');
    } else {
        console.log(req.session);
        res.render('checkout', {
            title: 'Checkout',
            cart: req.session.cart
        });
    }
    
});

/*
 * GET update product
 */
router.get('/update/:product', function (req, res) {
    var slug = req.params.product;
    var cart = req.session.cart;
    var action = req.query.action;

    for (var i = 0; i < cart.length; i++) {
        if (cart[i].title == slug) {
            switch (action) {
                case "add":
                    cart[i].quantity++;
                    break;
                case "remove":
                    cart[i].quantity--;
                    if (cart[i].quantity < 1) cart.splice(i, 1);
                    break;
                case "clear":
                    cart.splice(i, 1);
                    if (cart.length == 0) delete req.session.cart;
                    break;
                default:
                    console.log('update problem');
                    break;
            }
            break;
        }
    }
    req.flash('success', 'Cart updated!');
    res.redirect('/cart/checkout');
});

/*
 * GET clear cart
 */
router.get('/clear', function (req, res) {
    delete req.session.cart;

    req.flash('success', 'Cart cleared!');
    res.redirect('/cart/checkout');

});

/*
 * GET buy now
 */
router.get('/buynow', function (req, res) {
    delete req.session.cart;

    res.sendStatus(200);
});


//Exports
module.exports = router;