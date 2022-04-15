const express = require('express');
const route = express.Router();

const custom = require('../config/custom');
const multer = require('multer');

const storage = custom.image_destination();

const upload = multer({storage:storage});

const main = require('../controllers/main');
const admin = require('../controllers/admin');

const passport = require('passport');


//MAIN PAGE
route.get('/', main.home);
route.get('/home', main.home);

route.get('/content/:con', main.content);

route.get('/page:num', main.next);
route.get('/home/page:page', main.next);

route.get('/about', main.about);


//LOGIN
route.get('/login', admin.login);
route.post('/login/verify', passport.authenticate('local', admin.login_verify));

route.post('/admin/logout', admin.logout);

route.get('/singin', admin.singin);
route.post('/singin/send_request', upload.single('file'), admin.send_request);
route.get('/singin/thanks', admin.singin_thanks);


//ADMIN
route.get('/admin', admin.isAuthenticated,  admin.home);

route.get('/admin/admin_home', admin.isAuthenticated ,admin.admin_home);

route.get('/admin/all_content', admin.isAuthenticated ,admin.all_content);
route.get('/admin/all_content_data:category', admin.isAuthenticated , admin.all_content_data);
route.get('/admin/all_content_data/getArticle:id', admin.isAuthenticated , admin.getArticle)
route.post('/admin/content/update',upload.single('file'), admin.content_update);

route.get('/admin/content/trash:id', admin.content_trash);
route.get('/admin/content/public:id', admin.content_publish);
route.get('/admin/content/schedule:id', admin.content_schedule);
route.get('/admin/content/draft:id', admin.content_draft);
route.get('/admin/content/search:input', admin.content_search);

route.get('/admin/add_new', admin.isAuthenticated ,admin.add_new);
route.post('/admin/add_new/post', admin.isAuthenticated , upload.single('file') , admin.add_new_post);
route.post('/admin/image_upload', admin.isAuthenticated , upload.single('image'), admin.upload_image);

route.get('/admin/category', admin.isAuthenticated ,admin.category);
route.post('/admin/category_update', admin.category_update);
route.get('/admin/category_use', admin.category_use);
route.get('/admin/category_trashed', admin.category_trashed);
route.post('/admin/category/edit_trashed', admin.edit_trashed);
route.post('/admin/category/category_recover', admin.category_recover);
route.get('/admin/category_input:input', admin.category_input);

route.get('/admin/inbox', admin.isAuthenticated ,admin.inbox);
route.get('/admin/media', admin.isAuthenticated, admin.media);

route.get('/admin/user', admin.isAuthenticated, admin.user);
route.get('/admin/not_confirmed', admin.not_confirmed);
route.get('/admin/confirmed', admin.confirmed);
route.get('/admin/trashed', admin.trashed);
route.get('/admin/user_search:input', admin.user_search);
route.get('/admin/view_user:id', admin.isAuthenticated, admin.user_view);
route.get('/edit_user', admin.edit_user);
route.post('/update_user',upload.single('image'), admin.update_user);
route.get('/changePassword', admin.changePassword);
route.post('/user_changePassword', admin.user_changePassword);
route.get('/password_isChanged',admin.password_isChanged)

route.get('/admin/new_user', admin.isAuthenticated, admin.new_user);
route.post('/admin/add_new_user', admin.add_new_user);
route.get('/delete/user:id', admin.delete_user);

route.get('/admin/settings', admin.isAuthenticated, admin.settings);
route.post('/admin/settings/update', upload.fields([{name: 'icon', maxCount: 1}, {name: 'logo', maxCount: 1}]) ,admin.settings_update);


module.exports = route;