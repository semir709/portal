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

      for(let i = 0; i < inputs.length; i++) {
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
    }

}