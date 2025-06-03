export const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

export const isNotAuthenticated = (req, res, next) => {
    if (!req.session || !req.session.user) {
        next();
    } else {
        res.redirect('/admin');
    }
}; 