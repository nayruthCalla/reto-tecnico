const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const db = require('../services/connection');
const { dbUrl } = require('../config');

module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return next(403);
    }
    // TODO: Verificar identidad del usuario usando `decodeToken.uid`
    console.info(decodedToken);

    db(dbUrl)
      .then((db) => {
        db.collection('users').findOne({ _id: new ObjectId(decodedToken.uid) })
          .then((user) => {
            if (user) {
              Object.assign(req, { userAuth: { id: decodedToken.uid, email: user.email, roles: user.roles.admin } });
              next();
            } else {
              next(404);
            }
          });
      });
  });
};


module.exports.isAuthenticated = (req) => (
  // TODO: decidir por la informacion del request si la usuarix esta autenticada
  false
);


module.exports.isAdmin = (req) => (
  // TODO: decidir por la informacion del request si la usuarix es admin
  false
);


module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);


module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
);
