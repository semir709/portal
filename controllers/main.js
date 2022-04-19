const { use } = require('passport/lib');
const { pagination } = require('../config/custom');
const db = require('../config/database');

const custom = require('../config/custom');

module.exports = {

    home: async function(req, res) {

        const con = db.getCon();

        const all_data = await con.promise().query(`SELECT c.id_content, c.title, c.article, c.image AS content_image,
        DATE(c.publish_time) AS date, TIME(c.publish_time) AS time,
        c.publish, c.post_place, u.id_user, u.full_name, u.image AS user_image FROM content c 
        INNER JOIN  users u ON c.id_user = u.id_user ORDER BY publish_time DESC`);


        const other_data =  custom.filter_data(all_data[0], '1', '3');
        const main_data = custom.filter_data(all_data[0], '1', '1');
        const side_data = custom.filter_data(all_data[0], '1', '2');

        const sett_data = await con.promise().query(`SELECT post_per_page AS post_page, pagination_count AS pag_cnt FROM settings`);

        const {itemsList, pagination} = custom.pagination(5, 4, other_data, 10);

        res.render('home.ejs', {data: itemsList, main_content:main_data, side_data: side_data, settings: sett_data[0], pag: pagination});
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

        const sett_data = await con.promise().query(`SELECT post_per_page AS post_page, pagination_count AS pag_cnt FROM settings`);

        
        res.render('next_page.ejs', {data: data[0], main_content: [], settings: sett_data[0]});
    },
    about: function(req, res) {
        res.render('about.ejs');
    }
}