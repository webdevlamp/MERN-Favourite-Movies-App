let mysql = require('mysql');

const Config = require('./../Common/Config');

let conn = mysql.createConnection({
  host: Config.mysql.host || 'localhost',
  user: Config.mysql.user || 'favourite-movies',
  password: Config.mysql.pass || 'favourite-movies',
  database: Config.mysql.db || 'favourite-movies'
}); 
 
conn.connect(function(err) {
  if(err) throw err;
});

module.exports = conn;