const db = require('../util/database');
module.exports = class Userdata {
  constructor(
    data_id, user_id, account_type_0, account_type_1, account_type_2, account_type_3,
    total_created_posts, total_deleted_posts, total_positive_feedback_posts, total_negative_feedback_posts,
    total_positive_feedback_news, total_negative_feedback_news, total_apicalls, daily_created_posts,
    daily_deleted_posts, daily_positive_feedback_posts, daily_negative_feedback_posts,
    daily_positive_feedback_news, daily_negative_feedback_news, daily_apicalls, read_posts,
    read_news, signedup_datetime, last_active_datetime
  ) {
    this.data_id = data_id;
    this.user_id = user_id;
    this.account_type_0 = account_type_0;
    this.account_type_1 = account_type_1;
    this.account_type_2 = account_type_2;
    this.account_type_3 = account_type_3;
    this.total_created_posts = total_created_posts;
    this.total_deleted_posts = total_deleted_posts;
    this.total_positive_feedback_posts = total_positive_feedback_posts;
    this.total_negative_feedback_posts = total_negative_feedback_posts;
    this.total_positive_feedback_news = total_positive_feedback_news;
    this.total_negative_feedback_news = total_negative_feedback_news;
    this.total_apicalls = total_apicalls;
    this.daily_created_posts = daily_created_posts;
    this.daily_deleted_posts = daily_deleted_posts;
    this.daily_positive_feedback_posts = daily_positive_feedback_posts;
    this.daily_negative_feedback_posts = daily_negative_feedback_posts;
    this.daily_positive_feedback_news = daily_positive_feedback_news;
    this.daily_negative_feedback_news = daily_negative_feedback_news;
    this.daily_apicalls = daily_apicalls;
    this.read_posts = read_posts;
    this.read_news = read_news;
    this.signedup_datetime = signedup_datetime;
    this.last_active_datetime = last_active_datetime;
  }
  static fetchAll(user_id) {
    return db.execute('SELECT * FROM userdata WHERE user_id = ?',[user_id]);
  }
  static insert(user_id) {
    const today = new Date().toISOString().split('T')[0]; // get current date in YYYY-MM-DD format
    return db.execute(
      `INSERT INTO userdata (user_id, signedup_datetime, last_active_datetime) VALUES (?, ?, ?)`,
      [user_id, today, today]
    );
  }
  static update(field, value, user_id) {
    return db.execute(`UPDATE userdata SET ${field} = ? WHERE user_id = ?`, [value, user_id]);
  }
};