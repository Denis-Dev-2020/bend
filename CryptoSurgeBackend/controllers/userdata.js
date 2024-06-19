const Userdata = require('../models/userdata');
exports.fetchAll = async (req, res, next) => {
  try {
    const [rows, fields] = await Userdata.fetchAll(req.params.id);
    res.status(200).json(rows[0]);
  } catch (err) {
      console.error('Error fetch userdata from database:', err);
      if (!err.statusCode) {
          err.statusCode = 500;
      }
      next(err);
  }
};
exports.insert = (req, res, next) => {
  const user_id = req.body.user_id;
  Userdata.insert(user_id)
    .then(result => {
      res.status(201).json({ message: 'Userdata created successfully', result });
    })
    .catch(err => {
      res.status(500).json({ error: 'Database query error' });
    });
};
exports.update = (req, res, next) => {
  const { field, value, user_id } = req.body;
  Userdata.update(field, value, user_id)
    .then(result => {
      res.status(200).json({ message: 'Userdata updated successfully', result });
    })
    .catch(err => {
      res.status(500).json({ error: 'Database query error' });
    });
};