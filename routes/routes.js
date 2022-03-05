const express = require('express');
const route = express.Router();

const custom = require('../config/custom');
const multer = require('multer');

const storage = custom.image_destination();

const upload = multer({storage:storage});

const main = require('../controllers/main');
const admin = require('../controllers/admin');

route.get('/', main.home);
route.get('/home', main.home);

route.get('/page:num', main.next);
route.get('/home/page:page', main.next);

route.get('/content:name', main.content)

route.get('/about', main.about);

route.get('/login', admin.login);
route.get('/singin', admin.singin);

route.get('/admin:name', admin.home);

route.get('/admin/admin_home',admin.admin_home);

route.get('/admin/all_content',admin.all_content);
route.get('/admin/all_content_data:category', admin.all_content_data);
route.get('/admin/all_content_data/getArticle:id', admin.getArticle)

route.get('/admin/add_new',admin.add_new);
route.post('/admin/image_upload', upload.single('image'), admin.upload_image);

route.get('/admin/category',admin.category);
route.get('/admin/inbox',admin.inbox);
route.get('/admin/media',admin.media);

route.get('/admin/user',admin.user);
route.get('/admin/view_user:id', admin.user_view);
route.get('/admin/new_user',admin.new_user);

route.get('/admin/settings',admin.settings);


module.exports = route;