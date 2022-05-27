
const LocalStrategy = require('passport-local');
const db = require('../config/database');
const bcrypt = require('bcrypt');


module.exports = function (passport) {

    passport.use(new LocalStrategy( {usernameField: 'email'}, async (email, password, cb)  => {

        const con = db.getCon();    

        const user = await con.promise().query(`SELECT id_user AS id, user_password AS password FROM users WHERE e_mail = ?`,
        [email.trim()])
        .then((res) => {

            const id = res[0][0];

            if(res[0].length > 0) {

                bcrypt.compare(password, res[0][0].password , function(err, result) {
                    console.log(result);
                    if(result) return cb(null, res[0][0]);
                    else return cb(null, false, { message: 'Incorrect password' });
                    
                });

            } else {

                return cb(null, false, { message: 'Incorrect e-mail' });

            }


        })
        .catch((err) => {console.log(err);  cb(err)});
        

    }));

    passport.serializeUser(function(user, cb) {

        process.nextTick(function() {

            cb(null, {id: user.id, email: user.email});

        });

    });

    passport.deserializeUser(function(user, cb) {

        process.nextTick(function() {
          return cb(null, user);
        });
        
      });

}