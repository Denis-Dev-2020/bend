const db = require('../util/database');

module.exports = class News {
  constructor(id, title, subtitle, publisher, created, body1, body2, body3, body4, body5, picture1, picture2, picture3, picture4, picture5) {
    this.id = id;
    this.title = title;
    this.subtitle = subtitle;
    this.publisher = publisher;
    this.created = created;
    this.body1 = body1;
    this.body2 = body2;
    this.body3 = body3;
    this.body4 = body4;
    this.body5 = body5;
    this.picture1 = picture1;
    this.picture2 = picture2;
    this.picture3 = picture3;
    this.picture4 = picture4;
    this.picture5 = picture5;
  }

  static fetchAll() {
    return db.execute('SELECT * FROM news');
  }
};
