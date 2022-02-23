let mysql2 = require('mysql2');
    

module.exports = {


    getCon: function() {
        let con = mysql2.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE
        });

        con.connect((err) => {
            if (err) throw err.message;
        });

        return con;
    }

}