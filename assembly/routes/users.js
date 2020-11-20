var express = require('express');
var router = express.Router();

/*
 * GET logout
 */
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'You are logged out!');
    res.redirect('back');
});
//Exports
module.exports = router;