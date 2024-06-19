const News = require('../models/news');

exports.fetchAll = (req, res, next) => {
  News.fetchAll()
    .then(([rows, fieldData]) => {
      res.status(200).json(rows);
    })
    .catch(err => {
      res.status(500).json({ error: 'Database query error' });
    });
};
