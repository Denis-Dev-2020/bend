const db = require('../util/database');
module.exports = class User {
	constructor(firstname, email, password){
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;
		this.phone = phone;
		this.country = country;
		this.date_of_birth = date_of_birth;
		this.company = company;
		this.password = password;
		this.newsletter = newsletter;
	}
	static find(email) {
		return db.execute(
			'SELECT * FROM users WHERE email = ?', [email]);
	}
	static save(user) {
		return db.execute(
			'insert into users (firstname, lastname, email, phone, country, date_of_birth, company, password, newsletter) values (?, ?, ?, ?, ?, ?, ?, ?, ?);',
			[user.firstname, user.lastname, user.email, user.phone, user.country, user.date_of_birth, user.company, user.password, user.newsletter]
		);
	}
};