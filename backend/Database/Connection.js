var mysql = require('mysql');
var conn = mysql.createConnection({
  host: 'localhost', // Replace with your host name
  user: 'favourite-movies',      // Replace with your database username
  password: 'favourite-movies',      // Replace with your database password
  database: 'favourite-movies' // // Replace with your database Name
}); 
 
conn.connect(function(err) {
  if(err) throw err;
});

module.exports = conn;