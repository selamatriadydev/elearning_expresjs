let mysql = require('mysql');
 
let connection = mysql.createConnection({
   host:        'localhost',
   user:        'datamaster',
   password:    'datamaster123',
   database:    'elearning_dev'
 });

connection.connect(function(error){
   if(!!error){
     console.log(error);
   }else{
     console.log('Koneksi Berhasil!');
   }
 })

module.exports = connection;