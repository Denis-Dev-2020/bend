////////////////////// HERE WILL BE THE DECODER KEY SECRET ///////////////////////
    // decodedToken = jwt.verify(token, 'secretfortokenERTt1231');
/////////////////////////////////////////////////////////////////////////////////////////
// const jwt = require('jsonwebtoken');
// module.exports = (req, res, next) => {
//   const authHeader = req.get('Authorization');
//   if (!authHeader) {
//     req.isAuth = false;
//     return next();
//   }
//   const token = authHeader.split(' ')[1];
//   let decodedToken;
//   try {
//     decodedToken = jwt.verify(token, 'somesupersecretsecret');
//   } catch (err) {
//     req.isAuth = false;
//     return next();
//   }
//   if (!decodedToken) {
//     req.isAuth = false;
//     return next();
//   }
//   req.userId = decodedToken.userId;
//   req.isAuth = true;
//   next();
// };

// middleware/auth.js
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'secretfortokenERTt1231');
  } catch (err) {
    req.isAuth = false;
    return res.status(401).json({ error: 'Invalid token.' });
  }
  if (!decodedToken) {
    req.isAuth = false;
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  req.userId = decodedToken.userId;
  req.isAuth = true;
  next();
};
