

module.exports = {
    home: function(req, res) {
        res.render('home.ejs')
    },
    next: function(req, res) {
        res.render('next_page.ejs')
    }
}