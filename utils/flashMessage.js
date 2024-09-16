module.exports = {
    setFlash: function(req, type, message) {
        req.flash(type, message);
    },

    getFlash: function(req, type) {
        return req.flash(type);
    }
}