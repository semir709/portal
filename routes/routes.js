const express = require('express');
const route = express.Router();

const custom = require('../config/custom');
const multer = require('multer');

const storage = custom.image_destination();

const upload = multer({storage:storage});

const main = require('../controllers/main');
const admin = require('../controllers/admin');

const passport = require('passport');

route.get('/', main.home);
route.get('/home', main.home);

route.get('/page:num', main.next);
route.get('/home/page:page', main.next);

route.get('/content:name', main.content)

route.get('/about', main.about);

route.get('/login', admin.login);
route.post('/login/verify', passport.authenticate('local', admin.login_verify));

route.post('/admin/logout', admin.logout);

route.get('/singin', admin.singin);
route.post('/singin/send_request', upload.single('file'), admin.send_request);
route.get('/singin/thanks', admin.singin_thanks);

route.get('/admin', admin.isAuthenticated,  admin.home);

route.get('/admin/admin_home', admin.isAuthenticated ,admin.admin_home);

route.get('/admin/all_content', admin.isAuthenticated ,admin.all_content);
route.get('/admin/all_content_data:category', admin.isAuthenticated , admin.all_content_data);
route.get('/admin/all_content_data/getArticle:id', admin.isAuthenticated , admin.getArticle)

route.get('/admin/add_new', admin.isAuthenticated ,admin.add_new);
route.post('/admin/add_new/post', admin.isAuthenticated , admin.add_new_post);
route.post('/admin/image_upload', admin.isAuthenticated , upload.single('image'), admin.upload_image);

route.get('/admin/category', admin.isAuthenticated ,admin.category);
route.get('/admin/inbox', admin.isAuthenticated ,admin.inbox);
route.get('/admin/media', admin.isAuthenticated, admin.media);

route.get('/admin/user', admin.isAuthenticated, admin.user);
route.get('/admin/view_user:id', admin.isAuthenticated, admin.user_view);

route.get('/admin/new_user', admin.isAuthenticated, admin.new_user);
route.post('/admin/add_new_user', admin.add_new_user);

route.get('/admin/settings', admin.isAuthenticated, admin.settings);


module.exports = route;