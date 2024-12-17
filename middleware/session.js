module.exports.isAdmin = (req, res, next) => {
    if (req.session.isAdmin) {
        next();
    } else {
        res.redirect('/adminlogin');
    }
}

module.exports.isUser = (req, res, next) => {
    if (req.session.isUser) {
        next();
    } else {
        res.redirect('/');
    }
}