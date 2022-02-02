module.exports = {

    login: function(req, res) {
        res.render('login.ejs');
    },

    home: function(req, res) {
        res.render('admin.ejs')
    },

    singin: function(req, res) {
        res.render('singin.ejs');
    }

}