
const LocalStrategy = require('passport-local');
const db = require('../config/database');


module.exports = function (passport) {

    passport.use(new LocalStrategy( {usernameField: 'email'}, async (email, password, cb)  => {

        const con = db.getCon();        

        const user = await con.promise().query(`SELECT id_user AS id FROM users WHERE e_mail = ? AND user_password = ?`,
        [email, password])
        .then((res) => {

            const id = res[0][0];

            if(typeof id === 'undefined') {
                cb(null, false, { message: 'Incorrect username or password.' })
            }

           return res;

        })
        .catch((err) => {console.log(err); cb(err)});

           //check password
           //---------------------------------------------------------------------

        cb(null, user[0][0]);


        

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