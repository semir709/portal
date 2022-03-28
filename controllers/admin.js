const db = require('../config/database')
const mail = require('../config/email');

const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

const bcrypt = require('bcrypt');
const custom = require('../config/custom');

module.exports = {

    isAuthenticated: function(req, res, next) {

        if (req.isAuthenticated()) {
            return next()
        }

        else {
            res.redirect('/login');
        }
    },

    login: function(req, res) {
        res.render('login.ejs');
    },

    logout: function(req, res) {

        req.logout();
        res.send('/login');
    },

    login_verify: {

        successRedirect: '/admin',
        failureRedirect: '/login'   

    },

    home: async function(req, res) {

        req.session.cookie.maxAge = 3600000;

        res.render('admin.ejs')
    },

    singin_thanks: function(req, res) {

        res.render('thanks_singin.ejs');
    },

    admin_home: function(req, res) {

        res.render('admin_home.ejs', {name: 'Niko Nikic', header_name: 'Home'});
    },

    all_content: async function(req, res) {

        const con = db.getCon();


        const content = await con.promise().query('SELECT id_content, title, content.image, full_name FROM content INNER JOIN users ON content.id_user = users.id_user WHERE publish = ? '
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

    edit_user: async function(req, res) {

        const con = db.getCon();
        const id = req.query.id;

        const data = await con.promise().query(`SELECT id_user, full_name, user_role, e_mail, num, about, image, facebook
        , instagram, twitter FROM users WHERE id_user = ?`, [id]);

        // const newRole = custom.convertRole(data[0][0].user_role);

        // data[0][0].user_role = newRole;

        res.send(data[0][0]);

    },

    update_user: async function(req, res, next) {
        
        const data = req.body;
        const file = req.file;
        const con = db.getCon();

        let img;

        if((typeof  data.src === 'undefined' || data.src == '') && typeof file === 'undefined') {
            res.send('image missing');
            return;
        }

        else if((typeof  data.src !== 'undefined' || data.src != '') && typeof file === 'undefined') {
            let old_img = data.src.split('/img/')[1];
            img = old_img;
        }

        else if(typeof  data.src === 'undefined' && typeof file !== 'undefined') {
            let path = './public';
            await unlinkAsync(path +  data.old_image);

            img = file.filename;
        }

        else {
            res.send(false);
            return;
        }

        await con.promise().query(`UPDATE users SET full_name = ?, user_role = ?, e_mail = ?, num = ?, image = ?
        ,facebook = ?, instagram = ?, twitter = ? WHERE id_user = ?`
        ,[data.name, data.role, data.email, data.num, '/img/'+ img, data.facebook, data.instagram, data.twitter, data.id]);

        const transporter = mail.getTransport();    


        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>',
            to: "semirselman321@gmail.com", 
            subject: "Update data ✔", 
            text: "Some information about you on our website is changed, if you want to change you password click link below: ", 
            html: '<p>Click <a href="http://127.0.0.1:3000/changePassword?id=' + data.id +'">here</a> to singin</p>', 
        });


        res.send(true);

    },

    changePassword: async function(req, res) {

        const con = db.getCon();
        const id = req.query.id;

        const data = await con.promise().query(`SELECT full_name AS name FROM users WHERE id_user = ?`, [id]);

        res.render('changePassword.ejs', data[0][0]);

    },

    user_changePassword: async function(req, res) {

        const con = db.getCon();
        const data = req.body;

        //need hasing 
        console.log(data);

        let isEmpty = custom.isEmpty(data.password, data.newPassword, data.newPassword2);

        if(isEmpty) {
            res.send('0');
            return;
        }

        const user = await con.promise().query(`SELECT full_name AS name FROM users WHERE user_password = ?`, [data.password]);

        if(user[0].length < 1) {
            res.send('1');
            return;
        } 

        if(data.newPassword == data.newPassword2) {
            await con.promise().query(`UPDATE users SET user_password = ? WHERE id_user = ?` , [data.newPassword, data.id]);
            res.send('/password_isChanged');
        }
        else {
            res.send('3');
        }

    },

    password_isChanged: function(req, res) {

        res.render('password_isChanged.ejs');
    },

    add_new_user: async function(req, res) {

        const data = req.body;
        const con = db.getCon();


        if(custom.isEmpty(data.name, data.checkbox, data.email)) {

            res.send(false);

        }

        else {

            if(custom.validateEmail(data.email) === false) {
                res.send('not valid');
            }

            else {

                const user = await con.promise().query(`INSERT INTO users (full_name, user_role, e_mail) VALUES (?, ?, ?)`,
            [data.name, data.checkbox, data.email]);

            const user_id = user[0].insertId;

            const user_info = await con.promise().query(`SELECT full_name, user_role, e_mail FROM users WHERE id_user = ?`, [user_id]);

            const name = user_info[0][0].full_name;
            const role = user_info[0][0].user_role;
            const user_mail = user_info[0][0].e_mail;

            const name_array = name.split('');

            let newName = '';

            for(let i = 0; i < name_array.length - 1; i++) {

                if(name_array[i].indexOf(' ') >= 0) {
                    name_array[i] = '_';
                }

                newName += name_array[i];

            }

            const transporter = mail.getTransport();    


            let info = await transporter.sendMail({
                from: '"Fred Foo 👻" <foo@example.com>',
                to: "semirselman321@gmail.com", 
                subject: "Hello ✔", 
                text: "Hello world?", 
                html: '<p>Click <a href="http://127.0.0.1:3000/singin?id=' + user_id + '">here</a> to singin</p>', 
            });

            res.send('done');

            }

        }

    },

    singin: async function(req, res) {

        let id = req.query.id;
        const con = db.getCon();
        
        const data = await con.promise().query(`SELECT full_name AS name, user_role AS role, e_mail FROM users WHERE id_user = ?`, [id]);

        const final_data = data[0][0];

        final_data.role = custom.convertRole(final_data.role);

        res.render('singin.ejs', final_data);
    },

    send_request: async function(req, res) {

        const data = req.body;
        const con = db.getCon();
        const file = req.file;
        let isEmpty;

        if(typeof file !== 'undefined') {
            isEmpty = custom.isEmpty(data.name, data.role, data.email, data.num, data.txt_area, data.facebook, data.instagram, data.twitter);

            if(isEmpty) {
                await unlinkAsync(req.file.path);
                res.send(false);
            }
    
            else {

                if(custom.validateEmail(data.email) === false) {
                    res.send('not valid');
                }

                else {

                    const user = await con.promise().query(`SELECT full_name FROM users WHERE e_mail = ? AND num = ?`, [data.email, data.num]);

                    if(user[0].length <= 0) {

                        bcrypt.hash(data.password, 10, async function(err, hash) {
                            if(err) throw err;
                
                        await con.promise().query(`UPDATE users SET full_name = ?, user_role = ?, e_mail = ?, num = ?, user_password = ?, about = ?, image = ?
                            ,facebook = ?, instagram = ?, twitter = ? WHERE id_user = ?`
                            ,[data.name, data.role, data.email, data.num, hash, data.txt_area, '/img/'+ file.filename, data.facebook, data.instagram, data.twitter, data.id]);
                
                        });

                        res.send('/singin/thanks');

                    }

                    else {
                        res.send('user');
                    }


                }    
    
            }

        }

        else {
            res.send(false);
        }
        
        
    },

    delete_user: async function(req, res) {

        const id = req.params.id;

        const con = db.getCon();

        await con.promise().query(`UPDATE users SET user_active = ? WHERE id_user = ?`, [0, id]);

        res.send(true);

    },

    add_new_post: async function(req, res) {

        const id = req.user.id;
        const data = req.body;

        const con = db.getCon();

        let content;
        let category = [];


        content = await con.promise().query(`INSERT INTO content (title, article, image, publish, post_place, id_user) 
        VALUES (?, ?, ?, ?, ?, ?)`, [data.input_title, data.txt_area, data.img_content, data.inputGroup_publish, data.inputGroup_post, id]);

        const cg = data.category_ch;

        const all_category = await con.promise().query(`SELECT category_name FROM category`);
        const array_categroy = [];

        for(let i = 0; i < all_category[0].length; i++) {
            array_categroy.push(all_category[0][i].category_name);
        }

        const final_cg = [];
        const old_cg = [];

        for(let i = 0; i < cg.length; i++) {

            if(array_categroy.indexOf(cg[i]) === -1 ) {
                final_cg.push(cg[i]);
            }

            else {
                old_cg.push(cg[i]);
            }

        }


        for(let i = 0; i < final_cg.length; i++) {
           category[i] = await con.promise().query(`INSERT INTO category (category_name) VALUES (?)`, [final_cg[i]]);
        }


        for(let i = 0; i < category.length; i++) {
            con.promise().query(`INSERT INTO content_category (id_content, id_category) VALUES (?, ?)`, [content[0].insertId, category[i][0].insertId]);
        }

        const old_id = [];
        let old_catg_id;

        for(let i = 0; i < old_cg.length; i++) {
            old_catg_id = await con.promise().query(`SELECT id_category FROM category WHERE category_name = ?`, [old_cg[i]]);

            old_id.push(old_catg_id[0][0].id_category);
        }


        for(let i = 0; i < old_id.length; i++) {
            con.promise().query(`INSERT INTO content_category (id_content, id_category) VALUES (?, ?)`, [content[0].insertId, old_id[i]]);
        }

    },

    upload_image: function(req, res) {

        res.status(200).send({ "file": "/img/" + req.file.filename, "success": true});

    },

    category: async function(req, res) {

        const con = db.getCon();
        

        const data = await con.promise().query(`SELECT c.category_name, cg.id_category, count(cg.id_category) AS count FROM category c
        LEFT JOIN content_category cg ON c.id_category = cg.id_category
        group by c.category_name`); 

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

        const data = await con.promise().query(`SELECT id_user, full_name, user_role, e_mail, num, facebook, twitter, instagram FROM users
         WHERE user_confirmed = ? AND user_trashed = ?`, [1, 0]);

        const newRole = custom.convertRole(data.role);

        res.render('all_users.ejs', {name: 'Niko Nikic', header_name: 'User', data: data[0], newRole: newRole});
    },

    not_confirmed: async function(req, res) {

        const con = db.getCon();
        const data = await con.promise().query(`SELECT id_user, full_name, user_role, e_mail, num, facebook, twitter, instagram FROM users
        WHERE user_confirmed = ? AND user_trashed = ?`, [0, 0]);

        res.render('partials/user_card.ejs', {data: data[0]});

    },

    confirmed: async function(req, res) {

        const con = db.getCon();
        const data = await con.promise().query(`SELECT id_user, full_name, user_role, e_mail, num, facebook, twitter, instagram FROM users
        WHERE user_confirmed = ? AND user_trashed = ?`, [1, 0]);

        res.render('partials/user_card.ejs', {data: data[0]});

    },

    trashed: async function(req, res) {

        const con = db.getCon();
        const data = await con.promise().query(`SELECT id_user, full_name, user_role, e_mail, num, facebook, twitter, instagram FROM users
        WHERE user_trashed = ?`, [1]);

        res.render('partials/user_card.ejs', {data: data[0]});

    },

    user_search: async function(req, res) {

        const input = req.params.input;
        const con = db.getCon();

        const role = custom.convertRoletoNum(input.toLowerCase());

        const data = await con.promise().query(`SELECT id_user, full_name, user_role, e_mail, num, facebook, twitter, instagram FROM users
        WHERE user_role = ? OR full_name = ? `, [role, input]);

        res.render('partials/user_card.ejs', {data: data[0]});

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

    settings: async function(req, res) {

        const con = db.getCon();

        const data = await con.promise().query(`SELECT site_icon AS icon, site_logo AS logo, site_title, 
        site_tagline, post_per_page, pagination_count FROM settings`);

        console.log(data[0]);

        res.render('settings.ejs', {name: 'Niko Nikic', header_name: 'Settings', data: data[0]});
    },

}
