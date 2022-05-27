const db = require('../config/database')
const mail = require('../config/email');

const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

const bcrypt = require('bcrypt');
const custom = require('../config/custom');
const { type } = require('express/lib/response');
const { rulesToMonitor } = require('nodemon/lib/monitor/match');
const { all } = require('express/lib/application');

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

        // req.session.cookie.maxAge = 3600000;

        res.render('admin.ejs')
    },

    singin_thanks: function(req, res) {

        res.render('thanks_singin.ejs');
    },

    admin_home: async function(req, res) {

        const user = await custom.getUser(req.user.id);

        res.render('admin_home.ejs', {name: user, header_name: 'Home'});
    },

    all_content: async function(req, res) { 

        const con = db.getCon();

        const content = await con.promise().query(`SELECT id_content, title, content.image, full_name, publish FROM content
        INNER JOIN users ON content.id_user = users.id_user WHERE publish = ? `
        ,['1']);

        con.end();

        filter = [

            {
                id: '1',
                name: 'Published'
            },
            {
                id: '2',
                name: 'Draft'
            },
            // {
            //     id: '3',
            //     name: 'Scheduled'
            // },
            {
                id: '4',
                name: 'Trashed'
            }

        ];

        const user = await custom.getUser(req.user.id);

        obj = {

            name: user, 
            header_name: 'All content',
            data:content[0],
            filter: filter,
            filter_class_name: 'ss_content_filter',
            input_search_id: 'content_search',
            ctg: '1'


        }

        res.render('all_content_admin.ejs', obj);
    },

    all_content_data: async function (req, res) { //----------------------------------------------------

        const con = db.getCon();

        const category = req.params.category;

        const content = await con.promise().query(`SELECT id_content , title, content.image, full_name, publish FROM content
        INNER JOIN users ON content.id_user = users.id_user WHERE content.publish = ?`
        , [category]);

        con.end();

        if(content[0].length <= 0) {
            res.render('messages/noData_msg.ejs');
        } else {
            res.render('partials/all_content_data.ejs', {data: content[0], publish_name: category});
        }

    },

    content_update: async function(req, res) {

        const data = req.body;
        const file = req.file;
        const con = db.getCon();

        if(custom.isEmpty(data.title, data.text_area, data.publish, data.post, data.category)) {
            res.send('IsEmpty');
            return;
        }

        const image = custom.contorlingImage(file, data.image);

        if(image == 'Empty image') {
            res.send('Empty image');
            return;
        }

        const cg = custom.formatInputTag(data.category);

        const all_category = await con.promise().query(`SELECT category_name FROM category`)
        .then(res => {
            let array = [];
            res[0].forEach(el => {array.push(el.category_name)});
            return array;
        });

        let new_categorys = cg.filter(function(el) {
            if(all_category.indexOf(el) == -1) return el;
            
        });

        const content = await con.promise().query(`UPDATE content SET title = ?, article = ?, image = ?, publish = ?, post_place = ?
        ,id_user = ? WHERE id_content = ?`
        ,[data.title, data.text_area, image, custom.publishConvert(data.publish.trim())
        , custom.postConvert(data.post.trim()), req.user.id, data.content_id]);

        for(let i = 0; i < new_categorys.length; i++) {
            await con.promise().query(`INSERT INTO category (category_name) VALUES (?)`, [new_categorys[i]]);
         }
 
         let category_ids = [];
 
        for(let i = 0; i < cg.length; i++) {
            let id = await con.promise().query('SELECT id_category FROM category WHERE category_name = ?', [cg[i]]);

            category_ids.push(id[0][0]);
        }

       await con.promise().query(`DELETE FROM content_category WHERE id_content = ?`, [data.content_id,]);

        for(let i = 0; i < category_ids.length; i++) {
            con.promise().query(`INSERT INTO content_category (id_content, id_category) VALUES (?, ?)`, [data.content_id, category_ids[i].id_category]);
        }

        const all_data = await con.promise().query(`SELECT id_content, title, content.image, full_name FROM content
        INNER JOIN users ON content.id_user = users.id_user WHERE publish = ? `
        ,['1']);

        con.end();

        let filter = [

            {
                id: '1',
                name: 'Published'
            },
            {
                id: '2',
                name: 'Draft'
            },
            // {
            //     id: '3',
            //     name: 'Scheduled'
            // },
            {
                id: '4',
                name: 'Trashed'
            }

        ];

        const user = await custom.getUser(req.user.id);

        obj = {

            name: user, 
            header_name: 'All content',
            data:all_data[0],
            filter: filter,
            filter_class_name: 'ss_content_filter',
            input_search_id: 'content_search',
            ctg: '1'


        }

        res.render('all_content_admin.ejs', obj);

    },

    content_trash: async function(req, res) { //----------------------------------------------------

        const id = req.params.id;
        const con = db.getCon();

        await con.promise().query(`UPDATE content SET publish = ? WHERE id_content = ?`, ['4', id]);

        const content = await con.promise().query(`SELECT id_content, title, content.image, full_name, publish FROM content
        INNER JOIN users ON content.id_user = users.id_user WHERE publish = ? `
        ,['1']);

        con.end();

        const user = await custom.getUser(req.user.id);

        let obj = {
            data:content[0],
            header_name: 'All content',
            name: user,
            filter: filter,
            filter_class_name: 'ss_content_filter',
            input_search_id: 'content_search',
            ctg: '4'
        }

        res.render('all_content_admin.ejs', obj);


    },

    content_publish: async function(req, res) { //----------------------------------------------------

        const id = req.params.id;
        const con = db.getCon();

        await con.promise().query(`UPDATE content SET publish = ? WHERE id_content = ?`, ['1', id]);

        const content = await con.promise().query(`SELECT id_content, title, content.image, full_name, publish FROM content
        INNER JOIN users ON content.id_user = users.id_user WHERE publish = ? `
        ,['1']);

        con.end();

        const user = await custom.getUser(req.user.id);

        let obj = {
            data:content[0],
            header_name: 'All content',
            name: user,
            filter: filter,
            filter_class_name: 'ss_content_filter',
            input_search_id: 'content_search',
            ctg: '1'
        }

        
        res.render('all_content_admin.ejs', obj);
        

    },

    content_draft: async function(req, res) { //----------------------------------------------------

        const id = req.params.id;
        const con = db.getCon();

        await con.promise().query(`UPDATE content SET publish = ? WHERE id_content = ?`, ['2', id]);

        const content = await con.promise().query(`SELECT id_content, title, content.image, full_name, publish FROM content
        INNER JOIN users ON content.id_user = users.id_user WHERE publish = ? `
        ,['1']);

        con.end();

        const user = await custom.getUser(req.user.id);

        let obj = {
            data:content[0],
            header_name: 'All content',
            name: user,
            filter: filter,
            filter_class_name: 'ss_content_filter',
            input_search_id: 'content_search',
            ctg: '2'
        }


        res.render('all_content_admin.ejs', obj);
        


    },

    content_search: async function(req, res) { 

        const input = req.params.input;
        const con = db.getCon();   
        let data; 

        let newInput = input.split('-');

        if(newInput[0] == 'empty') {
            data = await con.promise().query(`SELECT id_content, title, content.image, full_name, publish FROM content
            INNER JOIN users ON content.id_user = users.id_user WHERE publish = ? `
            ,[newInput[1]]);

            con.end();
        }
         else {
            data = await con.promise().query(`SELECT id_content, title, content.image, full_name, publish FROM content
            INNER JOIN users ON content.id_user = users.id_user WHERE title = ? OR full_name = ?`, [newInput[0], newInput[0]]);

            con.end();
        }


        if(data[0].length <= 0) {
            res.render('messages/noData_msg.ejs');
        } else {
            res.render('partials/all_content_data.ejs', {data: data[0]});
        }

        
    },

    getArticle: async function(req, res) {

        const con = db.getCon();
        const id = req.params.id;

        const data = await con.promise().query(`SELECT content.id_content, title, article, publish, post_place, category_name, content.image FROM content
        INNER JOIN content_category ON content.id_content = content_category.id_content 
        INNER JOIN category ON category.id_category = content_category.id_category WHERE content.id_content = ? `, [id]);

        con.end();

        const user = await custom.getUser(req.user.id);

        res.render('add_content.ejs', {name: user, header_name: 'Add new', data: data[0]});
    },

    add_new: async function(req, res) {
        const user = await custom.getUser(req.user.id);

        res.render('add_content.ejs', {name: user, header_name: 'Add new'});
    },

    changePassword: async function(req, res) {

        // req.session.count = 1;

        // console.log(req.session);

        // if (req.session.views == 1) {
          
        //     res.send('You can\'t access this link');
        
        // } 

        const con = db.getCon();
        const id = req.query.id;

        const data = await con.promise().query(`SELECT full_name AS name FROM users WHERE id_user = ?`, [id]);

        con.end();

        res.render('changePassword.ejs', data[0][0]);

    },

    user_changePassword: async function(req, res) {

        const con = db.getCon();
        const data = req.body;

        let isEmpty = custom.isEmpty(data.password, data.newPassword, data.newPassword2);

        if(isEmpty) {
            res.send('0');
            return;
        }

        if(data.newPassword.length < 7 ||data.newPassword2.length < 7) {

            res.send('4');
            return;

        }

        const user = await con.promise().query(`SELECT full_name AS name,
        user_password AS password FROM users
        WHERE id_user = ?`, [data.id]);

        if(user[0].length < 1) {
            res.send('1');
            return;
        } else {

            bcrypt.compare(data.password.trim(), user[0][0].password, function(err, result) {
                if(result) {

                    if(data.newPassword == data.newPassword2) {

                        bcrypt.hash(data.newPassword,10, async function(err,hash) {

                            await con.promise().query(`UPDATE users SET user_password = ? WHERE id_user = ?` , [hash, data.id]);
                            req.session.views = 1;

                            con.end();
                            res.send('/password_isChanged');

                        });
                    }
                    else {
                        res.send('3');
                    }

                } else {
                    res.send('2');
                    return;
                }
                
            });

        }

    },

    password_isChanged: function(req, res) {

        res.render('password_isChanged.ejs');
    },

    add_new_user: async function(req, res) {

        const data = req.body;
        const con = db.getCon();


        if(custom.isEmpty(data.name, data.checkbox, data.email)) {

            res.send('IsEmpty');

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

            con.end();

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

        if (req.session.views == 1) {
          
            res.send('You can\'t access this link');
        
        } 

        let id = req.query.id;
        const con = db.getCon();
        
        const data = await con.promise().query(`SELECT full_name AS name, user_role AS role, e_mail FROM users WHERE id_user = ?`, [id]);

        con.end();

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
            isEmpty = custom.isEmpty(data.name, data.role, data.email, data.num, data.password, data.confirme_pass);

            if(isEmpty) {
                await unlinkAsync(req.file.path);
                res.send('IsEmpty');
                return;
            }
    
            else {

                if(custom.validateEmail(data.email) === false) {
                    res.send('email not valid');
                    return;
                }

                else {

                    if(data.password != data.confirme_pass) {
                        res.send('password not match!!!');
                        return;
                    }

                    if(data.password.length < 7 || data.confirme_pass.length < 7) {
                        res.send('password length');
                        return;
                    }

                    const user = await con.promise().query(`SELECT full_name FROM users WHERE e_mail = ? AND num = ?`, [data.email, data.num]);

                    con.end();

                    if(user[0].length <= 0) {

                        bcrypt.hash(data.password, 10, async function(err, hash) {
                            if(err) { res.send('hashing err'); console.log(err.message); return}
                
                        await con.promise().query(`UPDATE users SET full_name = ?, user_role = ?, e_mail = ?, num = ?, user_password = ?, image = ?
                        WHERE id_user = ?`
                        ,[data.name, custom.convertRoletoNum(data.role), data.email, data.num, hash, '/img/'+ file.filename, data.id]);

                        con.end();
                
                        });
                        
                         
                        // req.session.views = 1;
                        
                        res.send('/singin/thanks');
                        return;

                    }

                    else {
                        res.send('user exsist');
                        return;
                    }


                }    
    
            }

        }

        else {
            res.send('image is empty');
            return;
        }
        
        
    },

    delete_user: async function(req, res) {

        const id = req.params.id;
        let data;
        const con = db.getCon();

        await con.promise().query(`UPDATE users SET user_trashed = ? WHERE id_user = ?`, [1, id]);

        const usr = await con.promise().query(`SELECT user_confirmed FROM users WHERE id_user = ?`, [id]).then(res => { return res[0][0].user_confirmed});

        if(usr == 1) {

            data = await con.promise().query(`SELECT id_user, full_name, user_role, e_mail, num, facebook, twitter, instagram FROM users
         WHERE user_confirmed = ? AND user_trashed = ?`, [1, 0]);

         con.end();

        } else {

            data = await con.promise().query(`SELECT id_user, full_name, user_role, e_mail, num, facebook, twitter, instagram FROM users
         WHERE user_confirmed = ? AND user_trashed = ?`, [0, 0]);

         con.end();

        }

        let filter = [

            {
                id: '1',
                name: 'Confirmed'
            },
            {
                id: '0',
                name: 'Not Confirmed'
            },
            {
                id: '2',
                name: 'Trashed'
            }

        ];

        const user = await custom.getUser(req.user.id);

        obj = {

            name: user, 
            header_name: 'Users',
            data:data[0],
            filter: filter,
            filter_class_name: 'ss_users_filter',
            input_search_id: 'user_search',
            custom


        }

        // res.render('partials/user_card.ejs', obj);

        if(data[0].length <= 0) {
            res.render('messages/noData_msg.ejs');
        } else {
            res.render('partials/user_card.ejs', obj);
        }

        // res.send(true); 

    },

    recover_user: async function(req, res) {

        const id = req.params.id;

        const con = db.getCon();

        await con.promise().query(`UPDATE users SET user_trashed = ? WHERE id_user = ?`, [0, id]);

        const data = await con.promise().query(`SELECT id_user, full_name, user_role, e_mail, num, facebook, twitter, instagram FROM users
         WHERE user_trashed = ?`, [ 1]);

         con.end();

        let filter = [

            {
                id: '1',
                name: 'Confirmed'
            },
            {
                id: '0',
                name: 'Not Confirmed'
            },
            {
                id: '2',
                name: 'Trashed'
            }

        ];

        const user = await custom.getUser(req.user.id);

        obj = {

            name: user, 
            header_name: 'Users',
            data:data[0],
            filter: filter,
            filter_class_name: 'ss_users_filter',
            input_search_id: 'user_search',
            custom


        }

        // res.render('partials/user_card.ejs', obj);

        if(data[0].length <= 0) {
            res.render('messages/noData_msg.ejs');
        } else {
            res.render('partials/user_card.ejs', obj);
        }


    },

    //confirme user

    confirmed_user: async function(req, res) {

        const id = req.params.id;

        const con = db.getCon();

        await con.promise().query(`UPDATE users SET user_confirmed = ? WHERE id_user = ?`, [1, id]);

        const data = await con.promise().query(`SELECT id_user, full_name, user_role, e_mail, num, facebook, twitter, instagram FROM users
         WHERE user_confirmed = ? AND user_trashed = ?`, [0, 0]);

         con.end();

        let filter = [

            {
                id: '1',
                name: 'Confirmed'
            },
            {
                id: '0',
                name: 'Not Confirmed'
            },
            {
                id: '2',
                name: 'Trashed'
            }

        ];

        const user = await custom.getUser(req.user.id);

        obj = {

            name: user, 
            header_name: 'Users',
            data:data[0],
            filter: filter,
            filter_class_name: 'ss_users_filter',
            input_search_id: 'user_search',
            custom


        }

        if(data[0].length <= 0) {
            res.render('messages/noData_msg.ejs');
        } else {
            res.render('partials/user_card.ejs', obj);
        }

    },

    add_new_post: async function(req, res) {

        const id = req.user.id;
        const data = req.body;
        const file = req.file;

        const con = db.getCon();


        if(custom.isEmpty(data.title, data.text_area, data.publish, data.post, data.category)) {
            res.send('IsEmpty');
            return;
        }

        const image = custom.contorlingImage(file, data.image);

        if(image == 'Empty image') {
            res.send('Empty image');
            return;
        }

        const cg = custom.formatInputTag(data.category);

        const all_category = await con.promise().query(`SELECT category_name FROM category`)
        .then(res => {
            let array = [];
            res[0].forEach(el => {array.push(el.category_name)});
            return array;
        });

        let new_categorys = cg.filter(function(el) {
            if(all_category.indexOf(el) == -1) return el;
            
        });

        content = await con.promise().query(`INSERT INTO content (title, article, image, publish, post_place, id_user, publish_time) 
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP())`, [data.title, data.text_area, image, custom.publishConvert(data.publish),custom.postConvert(data.post), id]);


        for(let i = 0; i < new_categorys.length; i++) {
           await con.promise().query(`INSERT INTO category (category_name) VALUES (?)`, [new_categorys[i]]);
        }

        let category_ids = [];

        for(let i = 0; i < cg.length; i++) {
            let id = await con.promise().query('SELECT id_category FROM category WHERE category_name = ?', [cg[i]]);

            category_ids.push(id[0][0]);
        }

        const id_content = content[0].insertId;

        for(let i = 0; i < category_ids.length; i++) {
            con.promise().query(`INSERT INTO content_category (id_content, id_category) VALUES (?, ?)`, [id_content, category_ids[i].id_category]);
        }

        con.end();

        res.send('done');

    },

    upload_image: function(req, res) {

        res.status(200).send({ "file": "/img/" + req.file.filename, "success": true});

    },

    //category

    category: async function(req, res) { //--------------------------------

        const con = db.getCon();
        

        const data = await con.promise().query(`SELECT c.category_name AS category, c.in_use, c.id_category AS id, count(cg.id_category) AS count FROM category c
        LEFT JOIN content_category cg ON c.id_category = cg.id_category WHERE c.in_use = ?
        group by c.category_name`, [1]);

        con.end();
        
        filter = [

            {
                id: '1',
                name: 'In Use'
            },
            {
                id: '0',
                name: 'Not Use'
            },

        ];

        const user = await custom.getUser(req.user.id);

        obj = {

            name: user, 
            header_name: 'Category',
            data:data[0],
            filter: filter,
            filter_class_name: 'ss_category_filter',
            input_search_id: 'category_search',
            ctg: '1'


        }



        res.render('category.ejs', obj);
    },

    category_filter: async function(req, res) {

        const use = req.params.use;
        const con = db.getCon();

        const data = await con.promise().query(`SELECT c.category_name AS category, c.in_use, c.id_category AS id, count(cg.id_category) AS count FROM category c
        LEFT JOIN content_category cg ON c.id_category = cg.id_category WHERE c.in_use = ?
        group by c.category_name`, [use]);

        con.end();

        const user = await custom.getUser(req.user.id);

        if(data[0].length <= 0) {
            res.render('messages/noData_msg.ejs');
        } else {
            res.render('partials/category_list.ejs', {name: user, header_name: 'All content', data:data[0]});
        }

    },

    category_update: async function(req, res) {

        const con = db.getCon();
        const data = req.body;

        if(data.input == '') {
            res.send('empty');
            return;
        }

        await con.promise().query(`UPDATE category SET category_name = ? WHERE id_category = ?`, [data.input, data.id]);

        const new_data = await con.promise().query(`SELECT c.category_name AS category, c.in_use, c.id_category AS id, count(cg.id_category) AS count FROM category c
        LEFT JOIN content_category cg ON c.id_category = cg.id_category
        WHERE c.in_use = ? group by c.category_name`, [data.ctg]); 

        con.end();

        filter = [

            {
                id: '1',
                name: 'In Use'
            },
            {
                id: '0',
                name: 'Not Use'
            },

        ];

        const user = await custom.getUser(req.user.id);

        obj = {

            name: user, 
            header_name: 'Category',
            data:new_data[0],
            filter: filter,
            filter_class_name: 'ss_category_filter',
            input_search_id: 'category_search',
            ctg: data.ctg


        }

        res.render('partials/category_list.ejs', obj);

    },

    edit_trashed: async function(req, res) {

        const data = req.body;
        const con = db.getCon();

        await con.promise().query(`UPDATE category SET in_use = ? WHERE id_category = ?`, [0, data.id]);

        const new_data = await con.promise().query(`SELECT category_name AS category, id_category AS id, in_use FROM category
        WHERE in_use = ?`, [1]);

        con.end();

        res.render('partials/category_list.ejs', {data:new_data[0]});

    },
    
    category_recover: async function(req, res) {

        const data = req.body;
        const con = db.getCon();

        await con.promise().query(`UPDATE category SET in_use = ? WHERE id_category = ?`, [1, data.id]);

        const new_data = await con.promise().query(`SELECT category_name AS category, id_category AS id, in_use FROM category
        WHERE in_use = ?`, [0]);

        con.end();

        res.render('partials/category_list.ejs', {data:new_data[0]});

    },

    category_input: async function(req, res) {

        const input = req.params.input;
        const con = db.getCon();
        let data;

        let newInput = input.split('-');

        if(newInput[0] == 'empty') {
            data = await con.promise().query(`SELECT category_name AS category, id_category AS id, in_use FROM category 
            WHERE in_use = ?`,[newInput[1]]);

            con.end();
        }
            else {
                data = await con.promise().query(`SELECT category_name AS category, id_category AS id, in_use FROM category 
                WHERE category_name = ?`,[newInput[0], newInput[0]]);

                con.end();
        }

        if(data[0].length <= 0) {
            res.render('messages/noData_msg.ejs');
        } else {
            res.render('partials/category_list.ejs', {data: data[0]});
        }

    },

    user: async function(req, res) {

        const con = db.getCon();

        const data = await con.promise().query(`SELECT id_user, full_name, user_role, e_mail, num FROM users
        WHERE user_confirmed = ? AND user_trashed = ?`, [1, 0]);

        con.end();

        const newRole = custom.convertRole(data.role);

        filter = [

            {
                id: '1',
                name: 'Confirmed'
            },
            {
                id: '0',
                name: 'Not Confirmed'
            },
            {
                id: '2',
                name: 'Trashed'
            }

        ];

        const user = await custom.getUser(req.user.id);

        obj = {

            name: user, 
            header_name: 'Users',
            data:data[0],
            filter: filter,
            filter_class_name: 'ss_users_filter',
            input_search_id: 'user_search',
            ctg: 1,
            custom: custom


        }

        res.render('all_users.ejs', obj);
    },

    user_filter: async function(req, res) {

        let use = req.params.cf;
        const con = db.getCon();

        let data;

        let recoverInfo = {

            isRecover: false,
            revocerId: 'user_recover_btn'

        }

        if(use == '2') {

            data = await con.promise().query(`SELECT id_user, full_name, user_role, e_mail, num, facebook, twitter, instagram FROM users
            WHERE user_trashed = ?`, [1]);

            con.end();

            recoverInfo.isRecover = true;
            

        } else {

            data = await con.promise().query(`SELECT id_user, full_name, user_role, e_mail, num, facebook, twitter, instagram FROM users
            WHERE user_confirmed = ? AND user_trashed = ?`, [use, 0]);

            con.end();
        }

        const user = await custom.getUser(req.user.id);

        res.render('partials/user_card.ejs', {name: user, header_name: 'All content', custom: custom, data:data[0], recoverInfo:recoverInfo});

    },

    not_confirmed: async function(req, res) {

        const con = db.getCon();
        const data = await con.promise().query(`SELECT id_user, full_name, user_role, e_mail, num, facebook, twitter, instagram FROM users
        WHERE user_confirmed = ? AND user_trashed = ?`, [0, 0]);

        con.end();

        res.render('partials/user_card.ejs', {data: data[0], custom: custom});

    },

    confirmed: async function(req, res) {

        const con = db.getCon();
        const data = await con.promise().query(`SELECT id_user, full_name, user_role, e_mail, num, facebook, twitter, instagram FROM users
        WHERE user_confirmed = ? AND user_trashed = ?`, [1, 0]);

        con.end();

        res.render('partials/user_card.ejs', {data: data[0], custom: custom});

    },

    trashed: async function(req, res) {

        const con = db.getCon();
        const data = await con.promise().query(`SELECT id_user, full_name, user_role, e_mail, num, facebook, twitter, instagram FROM users
        WHERE user_trashed = ?`, [1]);

        con.end();

        res.render('partials/user_card.ejs', {data: data[0], custom: custom});

    },

    user_search: async function(req, res) {

        const input = req.params.input;
        const con = db.getCon();
        let data;

        let newInput = input.split('-');
        const role = custom.convertRoletoNum(input.toLowerCase());

        if(newInput[0] == 'empty') {

            if(newInput[1] == '0' || newInput[1] == '1') {

                data = await con.promise().query(`SELECT id_user, full_name, user_role, e_mail, num, facebook, twitter, instagram FROM users
                WHERE user_confirmed = ? `, [newInput[1]]);

            } else {

                data = await con.promise().query(`SELECT id_user, full_name, user_role, e_mail, num, facebook, twitter, instagram FROM users
                WHERE user_trashed = ? `, ['1']);

            }
        }
         else {
            data = await con.promise().query(`SELECT id_user, full_name, user_role, e_mail, num, facebook, twitter, instagram FROM users
            WHERE user_role = ? OR full_name = ? `, [role, newInput[0]]);
        }

        con.end();


        if(data[0].length <= 0) {
            res.render('messages/noData_msg.ejs');
        } else {
            res.render('partials/user_card.ejs', {data: data[0], custom});
        }

    },

    edit_user: async function(req, res) {

        const con = db.getCon();
        const id = req.query.id;

        const data = await con.promise().query(`SELECT id_user, full_name, user_role, e_mail, num, about, image, facebook
        , instagram, twitter FROM users WHERE id_user = ?`, [id]);

        con.end();

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
            await unlinkAsync(path +  data.old_image).catch(err => {if(err) console.log(err)});

            img = file.filename;
        }

        // else {
        //     res.send(false);
        //     return;
        // }

        if(custom.isEmpty(data.name, data.role, data.email, data.num, data.id)) {
            res.send('empty');
            return;

        }

        if(custom.validateEmail(data.email) == false) {
            res.send('email not valid');
            return;
        }

        const d = await con.promise().query(`UPDATE users SET full_name = ?, user_role = ?, e_mail = ?, num = ?, image = ?
        WHERE id_user = ?`
        ,[data.name, data.role, data.email, data.num, '/img/'+ img, data.id]);

        const transporter = mail.getTransport();    


        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>',
            to: "semirselman321@gmail.com", 
            subject: "Update data ✔", 
            text: "Some information about you on our website is changed, if you want to change you password click link below: ", 
            html: '<p>Click <a href="http://127.0.0.1:3000/changePassword?id=' + data.id +'">here</a> to singin</p>', 
        });

        const users = await con.promise().query(`SELECT id_user, full_name, user_role, e_mail, num, facebook, twitter, instagram FROM users
         WHERE user_confirmed = ? AND user_trashed = ?`, [1, 0]);

         con.end();

        const newRole = custom.convertRole(data.role);

        let filter = [

            {
                id: '1',
                name: 'Confirmed'
            },
            {
                id: '0',
                name: 'Not Confirmed'
            },
            {
                id: '2',
                name: 'Trashed'
            }

        ];

        const user = await custom.getUser(req.user.id);

        obj = {

            name: user, 
            header_name: 'Users',
            data:users[0],
            filter: filter,
            filter_class_name: 'ss_users_filter',
            input_search_id: 'user_search',
            custom


        }

        res.render('partials/user_card.ejs', obj);


        // res.send(true);

    },

    new_user: async function(req, res) {
        const user = await custom.getUser(req.user.id);
        res.render('new_user.ejs', {name: user, header_name: 'New user'});
    },


    /* SETTINGS*/

    settings: async function(req, res) {

        const con = db.getCon();

        const data = await con.promise().query(`SELECT site_icon AS icon, site_logo AS logo, site_title, 
        site_tagline, post_per_page, pagination_count FROM settings`);

        con.end();

        const user = await custom.getUser(req.user.id);

        res.render('settings.ejs', {name: user, header_name: 'Settings', data: data[0]});
    },
    
    settings_update: async function(req, res) {

        const data = req.body;
        const logo = req.files.logo;
        const icon = req.files.icon;

        const con = db.getCon();

        let logo_res = custom.contorlingImage(logo[0], data.logo);
        let icon_res = custom.contorlingImage(icon[0], data.icon); 

        if(custom.isEmpty(data.post_page) || custom.isEmpty(data.pag_count) || custom.isEmpty(data.title) || custom.isEmpty(data.tagline)) {

            res.send('IsEmpty');
            return;

        }

        if(isNaN(data.post_page) || isNaN(data.pag_count)) {

            res.send('IsNaN');
            return;

        }


        if(logo_res == 'Empty image' || icon_res == 'Empty image') {
            res.send('emptyImage');
            return;
        }
        else {

            await con.promise().query(`UPDATE settings SET site_icon = ?, site_logo = ?,
            site_title = ?, site_tagline = ?, post_per_page = ?, pagination_count = ?
            WHERE id_settings = ?`, [icon_res, logo_res, data.title, data.tagline,
            data.post_page,data.pag_count, '1']);

            con.end();

            res.send('yes');
            return;


        }

    }
}
