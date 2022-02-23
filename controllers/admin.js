const db = require('../config/database')

module.exports = {

    login: function(req, res) {
        res.render('login.ejs');
    },

    home: async function(req, res) {

        res.render('admin.ejs')
    },

    singin: function(req, res) {
        res.render('singin.ejs');
    },

    admin_home: function(req, res) {
        res.render('admin_home.ejs', {name: 'Niko Nikic', header_name: 'Home'});
    },

    all_content: async function(req, res) {

        const con = db.getCon();


        const content = await con.promise().query('SELECT id_content, title, image, full_name FROM content INNER JOIN users ON content.id_user = users.id_user WHERE publish = ? '
        ,['1']);

        res.render('all_content_admin.ejs', {name: 'Niko Nikic', header_name: 'All content', data: content[0]});
    },

    all_content_data: async function (req, res) {

        const con = db.getCon();

        const category = req.params.category;

        const content = await con.promise().query('SELECT id_content, title, image, full_name FROM content INNER JOIN users ON content.id_user = users.id_user WHERE content.publish = ?'
        , [category]);

        res.render('partials/all_content_data.ejs', {data: content[0]});

    },

    getArticle: async function(req, res) {

        const con = db.getCon();
        const id = req.params.id;

        const data = await con.promise().query(`SELECT content.id_content, title, article, publish, post_place, category_name FROM content
        INNER JOIN content_category ON content.id_content = content_category.id_content 
        INNER JOIN category ON category.id_category = content_category.id_category WHERE content.id_content = ? `, [id]);


        res.render('add_content.ejs', {name: 'Niko Nikic', header_name: 'Add new', data: data[0]});
    },

    add_new: function(req, res) {
        res.render('add_content.ejs', {name: 'Niko Nikic', header_name: 'Add new'});
    },

    category: async function(req, res) {

        const con = db.getCon();
        

        const data = await con.promise().query(`SELECT category.id_category AS id, category_name, count(category_name) AS count FROM category
        INNER JOIN content_category ON content_category.id_category = category.id_category
        group by category_name`); 

        res.render('category.ejs', {name: 'Niko Nikic', header_name: 'Category', data: data[0]});
    },

    inbox: function(req, res) {
        res.render('inbox.ejs', {name: 'Niko Nikic', header_name: 'Inbox'});
    },

    media: function(req, res) {
        res.render('media.ejs', {name: 'Niko Nikic', header_name: 'Media'});
    },

    user: async function(req, res) {

        const con = db.getCon();

        const data = await con.promise().query(`SELECT id_user, full_name, user_role, e_mail, num, facebook, twitter, instagram FROM users`);


        res.render('all_users.ejs', {name: 'Niko Nikic', header_name: 'User', data: data[0]});
    },

    user_view: async function(req, res) {

        const id = req.params.id;

        const con = db.getCon();

        const data = await con.promise().query(`SELECT full_name, user_role, e_mail, num,
        about, image, facebook, twitter, instagram FROM users WHERE id_user = ?`, [id]);

        const name = data[0][0].full_name;
        const role = data[0][0].user_role;


        res.render('user_view.ejs', {name: name, header_name: role, data: data[0]});

    },

    new_user: function(req, res) {
        res.render('new_user.ejs', {name: 'Niko Nikic', header_name: 'New user'});
    },

    settings: function(req, res) {
        res.render('settings.ejs', {name: 'Niko Nikic', header_name: 'Settings'});
    },

}
