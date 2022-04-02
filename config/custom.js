const multer = require('multer');

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

    if(p == 'Publish') {
      return 1
    } 

    if(p == 'Draft') {
        return 2;
    }  

    if(p == 'Schedule') {
        return 3;
    } 

    if(p == 'Trashe') {
        return 4;
    } 

  },

  postConvert: function(p) {

    if(p == 'Main article') {
      return 1
    } 

    if(p == 'Article') {
        return 2;
    }  

    if(p == 'Author choise') {
        return 3;
    } 

  }

}