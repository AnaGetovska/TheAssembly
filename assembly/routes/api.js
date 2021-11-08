var express = require('express');
var router = express.Router();
var _ = require('lodash');

// Get Product model
var Product = require('../models/product');

// Get Category model
var Category = require('../models/category');

/*
 * GET all products matching string
 */
router.get('/productSearch', async (req, res) => {
    var all = await Product.find();
    var matching = _.filter(all, (e) => {
        return e.title.toLowerCase().includes(req.query.q.toLowerCase());
    });
    matching = _.map(matching, (e) => {
        console.log(e.image);
        return {
            'title': e.title,
            'image': `${e._id}/${e.image}`
        };
    })
    res.json(matching);
});

//Exports
module.exports = router;