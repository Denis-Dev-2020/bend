const mysql = require('mysql2');
const config = require('../config/config.json');
const pool = mysql.createPool({
	host: config.host,
	port: config.port,
	user: config.user,
	database: config.database,
	password: config.password,
});

module.exports = pool.promise();