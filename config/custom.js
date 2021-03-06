const multer = require('multer');

const fs = require('fs')
const { promisify } = require('util');
// const { content } = require('../controllers/main');
const unlinkAsync = promisify(fs.unlink)
const db = require('../config/database');

module.exports = {

    image_destination: function() {

        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
              cb(null, '/cem/public/img')
            },
        
            filename: function (req, file, cb) {
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        
              cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg')
            }
        })
        
        return storage;


    },

    isEmpty: function(...inputs) {

      for(let i = 0; i < inputs.length ; i++) {
        
        if(inputs[i] === '' || typeof inputs[i] === 'undefined' || inputs[i] === '0') {
          
          return true;
        }
        
      }

    },

    validateEmail: function(email) {

      const char =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(email.match(char)) {

        return true;

      }

      else {

        return false;
      }
    },

    convertRole: function(role) {

      if(role == 1) {
        return 'super admin'
    } 

    if(role == 2) {
        return 'admin';
    } 

    if(role == 3) {
        return 'editor';
    } 

    if(role == 4) {
        return 'author';
    } 

    if(role == 5) {
        return 'contributor';
    } 

    if(role == 6) {
        return 'supporter';
    }

  },

  convertRoletoNum: function(role) {
    if(role === 'super admin') {
      return 1;
    } 

    if(role === 'admin') {
      return 2;
    } 

    if(role === 'editor') {
      return 3;
    } 

    if(role === 'author') {
      return 4;
    } 

    if(role === 'contributor') {
      return 5;
    } 

    if(role === 'supporter') {
      return 6;
    } 
  },

  publishConvert: function(p) {

    let value;

    if(p == 'Publish') {
      value = '1';
    } 

    if(p == 'Draft') {
      value =  2;
    }  

    if(p == 'Schedule') {
      value = 3;
    } 

    if(p == 'Trashe') {
      value =  4;
    } 

    return value;

  },

  postConvert: function(p) {

    if(p == 'Main article') {
      return 1;
    } 

    if(p == 'Article') {
        return 2;
    }  

    if(p == 'Author choise') {
        return 3;
    } 

  },

  contorlingImage: function(file, image) {


    if(typeof file !== 'undefined') {
      return '/img/' + file.filename;
    } else{

        if(image.length > 0) {
            return image;
        } else {
            return 'Empty image';
        }

    }

  },

  pagination: function(row_per_page, page, data, limit_pagination) { 

    let start = row_per_page * (page - 1);
    let end = start + row_per_page;

    let itemsList = data.slice(start, end);

    const page_count = Math.ceil(data.length / row_per_page);

    let count_limit = 1;

    const pagination = [];

    for(let i = page - 4; i <= page_count ; i++) {

        if(i < 1) {
            i = 1;
        }

        pagination.push(i);

        if(count_limit == limit_pagination) {
            break;
        }

        count_limit++;
    }

    return  {

      itemsList,
      pagination,
      max_pag: page_count

    }

  },

  filter_data: function(data, publish, post_place, category) {

    const cg = category || false;

    const arr_data = [];
    const arr_data_filter = [];

    // console.log(category, 'c');
    // console.log(data);
    // console.log(cg);


    for(let i = 0; i < data.length; i++) {

      if( cg != false && cg.toLowerCase() == data[i].category.toLowerCase()) {
        arr_data_filter.push(data[i]);

      }

      else if(data[i].publish == publish && data[i].post_place == post_place && cg == false ) {

        arr_data.push(data[i]);
      }

    }

    return { arr_data, arr_data_filter};

  },

  reduceSidedata: function(data) {

    const new_side_data = Array.from(new Set(data.map(e => e.id_content)))
    .map(e => {

      return data.find((d => d.id_content == e)); 

    })

    return new_side_data;

  },

  getUser: async function(id) {

    const con = db.getCon();

    const user =  await con.promise().query(`SELECT full_name FROM users WHERE id_user = ?`, id);

    return user[0][0].full_name;

  },

  getRole: async function(id) {

    const con = db.getCon();

    const user =  await con.promise().query(`SELECT user_role FROM users WHERE id_user = ?`, id);

    return user[0][0].user_role;


  },

  sortCatgList: function(data, rows) {

    let a = [];
    // let rows = 5;
    let list = 1;

    let firstIndex = rows * (list - 1);
    let lastIndex = firstIndex + rows;

    for(let i = 0; i < data.length / 5; i++) {

        a.push([...data.slice(firstIndex, lastIndex)]);

        list++;

        firstIndex = rows * (list - 1);
        lastIndex = firstIndex + rows; 

    }

    return a;

  },

  formatInputTag: function(input) {

    let inputs = input.split(',');

    let newInput = [];

    for(i = 0; i < inputs.length; i++) {

      let arryInput = inputs[i].split('');
      let string = arryInput[0].toUpperCase();

      for(let j = 1; j < arryInput.length; j++) {
        string += arryInput[j].toLowerCase();
      }

      newInput.push(string);

    }

    return newInput;

  }

}