const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const db = require('../services/connection');

const { dbUrl, secret } = config;


module.exports = (app, nextMain) => {
  app.post('/auth', (req, resp, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }
    // TODO: autenticar a la usuarix

    db(dbUrl)
      .then((db) => {
        db.collection('users').findOne({ email })
          .then((user) => {
            if (!user) {
              next(404);
            } else if (!bcrypt.compareSync(password, user.password)) {
              next(401);
            } else {
              const payload = { uid: user._id, email: user.email, roles: user.roles.admin };
              resp.send({ message: 'authenticatio successful', token: jwt.sign(payload, secret) });
            }
          });
      });
  });

  return nextMain();
};