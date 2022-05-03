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


        const other_data =  custom.filter_data(all_data[0], '1', '3').arr_data;
        const main_data = custom.filter_data(all_data[0], '1', '1').arr_data;
        const side_data = custom.filter_data(all_data[0], '1', '2').arr_data;

        const sett_data = await con.promise().query(`SELECT post_per_page AS post_page, pagination_count AS pag_cnt FROM settings`);

        const {itemsList, pagination} = custom.pagination(5, 1, other_data, 10);

        const other_categorys = await con.promise().query(`SELECT category_name as category, id_category FROM category
        WHERE in_use = ? AND category_name != ? AND category_name != ? AND category_name != ?
        AND category_name != ?`, [1,'Hardwar', 'Softwar', 'Network', 'Code']);

        const newList = custom.sortCatgList(other_categorys[0], 5);

        let obj = {
            data: itemsList,
            main_content:main_data,
            side_data: side_data,
            settings: sett_data[0],
            pag: pagination,
            all_content: true,
            other_categorys: newList
        }

        res.render('home.ejs', obj);
    },
    // next: function(req, res) {
    //     res.render('category_page.ejs') not in use this ejs file
    // },

    content: async function(req, res) {

        const category = req.params.cg;

        const page = typeof req.params.pg != 'undefined' ? req.params.pg : 1; 

        const con = db.getCon();

        const data = await con.promise().query(`SELECT c.id_content, c.title, c.article, c.image AS content_image,
        DATE(c.publish_time) AS date, TIME(c.publish_time) AS time,
        c.publish, c.post_place, u.id_user, u.full_name, u.image AS user_image, ca.category_name AS category FROM content c 
        INNER JOIN  users u ON c.id_user = u.id_user
        INNER JOIN content_category cg ON cg.id_content = c.id_content
        INNER JOIN category ca ON ca.id_category = cg.id_category 
        ORDER BY publish_time DESC`);

        const other_data =  custom.filter_data(data[0], '1', '3', category).arr_data_filter;
        const side_data = custom.filter_data(data[0], '1', '2').arr_data;

        const sett_data = await con.promise().query(`SELECT post_per_page AS post_page, pagination_count AS pag_cnt FROM settings`);

        const {itemsList, pagination} = custom.pagination(5, page, other_data, 10);

        const other_categorys = await con.promise().query(`SELECT category_name as category, id_category FROM category
        WHERE in_use = ? AND category_name != ? AND category_name != ? AND category_name != ?
        AND category_name != ?`, [1,'Hardwar', 'Softwar', 'Network', 'Code']);

        const newList = custom.sortCatgList(other_categorys[0], 5);

        const new_side_data = custom.reduceSidedata(side_data);


        let obj = {

            data: itemsList,
            main_content: [],
            side_data: new_side_data,
            settings: sett_data[0],
            pag: pagination,
            all_content: false,
            category: category,
            other_categorys: newList

        }
        
        res.render('home.ejs', obj);
    },

    page: async function(req, res) {
        
        const page = req.params.pg;
        

        const con = db.getCon();

        const all_data = await con.promise().query(`SELECT c.id_content, c.title, c.article, c.image AS content_image,
        DATE(c.publish_time) AS date, TIME(c.publish_time) AS time,
        c.publish, c.post_place, u.id_user, u.full_name, u.image AS user_image FROM content c 
        INNER JOIN  users u ON c.id_user = u.id_user ORDER BY publish_time DESC`);


        const other_data =  custom.filter_data(all_data[0], '1', '3').arr_data;
        const side_data = custom.filter_data(all_data[0], '1', '2').arr_data;

        const sett_data = await con.promise().query(`SELECT post_per_page AS post_page, pagination_count AS pag_cnt FROM settings`);

        const {itemsList, pagination} = custom.pagination(5, page, other_data, 10);

        

        res.render('home.ejs', {data: itemsList, main_content:[], side_data: side_data, settings: sett_data[0], pag: pagination, all_content: true});
        

    },

    getContent: async function(req, res) {

        const id = req.params.id;
        const con = db.getCon();

        const data = await con.promise().query(`SELECT c.title, c.article, c.image AS content_image, DATE(c.publish_time) AS date,
        TIME(c.publish_time) AS time, u.full_name as name, u.image AS author_image  FROM content c INNER JOIN users u ON u.id_user = c.id_user
        WHERE c.id_content = ?`, [id]);

        const all_data = await con.promise().query(`SELECT c.id_content, c.title, c.article, c.image AS content_image,
        DATE(c.publish_time) AS date, TIME(c.publish_time) AS time,
        c.publish, c.post_place, u.id_user, u.full_name, u.image AS user_image FROM content c 
        INNER JOIN  users u ON c.id_user = u.id_user ORDER BY publish_time DESC`);

        const side_data = custom.filter_data(all_data[0], '1', '2').arr_data;

        const other_categorys = await con.promise().query(`SELECT category_name as category, id_category FROM category
        WHERE in_use = ? AND category_name != ? AND category_name != ? AND category_name != ?
        AND category_name != ?`, [1,'Hardwar', 'Softwar', 'Network', 'Code']);

        const newList = custom.sortCatgList(other_categorys[0], 5);

        res.render('content.ejs', {data: data[0][0], side_data: side_data, other_categorys: newList})

        

    },

    about: function(req, res) {
        res.render('about.ejs');
    }
}