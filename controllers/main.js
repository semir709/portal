const db = require('../config/database');

module.exports = {
    home: async function(req, res) {

        const con = db.getCon();

        const data = await con.promise().query(`SELECT c.id_content, c.title, c.article, c.image AS content_image,
        DATE(c.publish_time) AS date, TIME(c.publish_time) AS time,
        c.publish, c.post_place, u.id_user, u.full_name, u.image AS user_image FROM content c 
        INNER JOIN  users u ON c.id_user = u.id_user ORDER BY publish_time DESC`);

        console.log(data[0])

        let d = data[0][0].date.toUTCString().slice(0, -13);

        console.log(d);

        res.render('home.ejs', {data: data[0]});
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