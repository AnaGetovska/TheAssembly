exports.isUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }

}

exports.isAdmin = function (req, res, next) {
    if (req.isAuthenticated() && req.user.admin === true) {
        next();
    } else {
        res.redirect('/admin/products');
    }

}