

module.exports = {
    home: function(req, res) {
        res.render('home.ejs')
    },
    next: function(req, res) {
        res.render('next_page.ejs')
    },
    content: function(req, res) {
        res.render('content.ejs')
    },
    about: function(req, res) {
        res.render('about.ejs');
    }
}