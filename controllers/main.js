const db = require('../config/database');

module.exports = {
    home: async function(req, res) {

        const con = db.getCon();

        const data = await con.promise().query(`SELECT c.id_content, c.title, c.article, c.image AS content_image,
        DATE(c.publish_time) AS date, TIME(c.publish_time) AS time,
        c.publish, c.post_place, u.id_user, u.full_name, u.image AS user_image FROM content c 
        INNER JOIN  users u ON c.id_user = u.id_user ORDER BY publish_time DESC`);

        const main_content = [];

        for(let i = 0; i < data[0].length; i++) {

            if(data[0][i].publish == '1' && data[0][i].post_place == '1') {
                main_content.push(data[0][i]);
            }

        }

        res.render('home.ejs', {data: data[0], main_content});
    },
    next: function(req, res) {
        res.render('next_page.ejs')
    },

    content: async function(req, res) {

        const content = req.params.con;

        const con = db.getCon();

        const data = await con.promise().query(`SELECT c.id_content, c.title, c.article, c.image AS content_image,
        DATE(c.publish_time) AS date, TIME(c.publish_time) AS time,
        c.publish, c.post_place, u.id_user, u.full_name, u.image AS user_image FROM content c 
        INNER JOIN  users u ON c.id_user = u.id_user
        INNER JOIN content_category cg ON cg.id_content = c.id_content
        INNER JOIN category ca ON ca.id_category = cg.id_category 
        WHERE ca.category_name = ?
        ORDER BY publish_time DESC`, [content]);
        
        res.render('next_page.ejs', {data: data[0], main_content: []});
    },
    about: function(req, res) {
        res.render('about.ejs');
    }
}