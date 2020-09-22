const bcrypt = require('bcrypt');
const { dbUrl } = require('../config');
const modelDataBase = require('../models/general-model');

const userModel = modelDataBase('users', dbUrl);
const modelController = require('../controller/users');

const userController = modelController(userModel)(bcrypt);

const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');

const initAdminUser = async (app, next) => {
  const { adminEmail, adminPassword } = app.get('config');
  if (!adminEmail || !adminPassword) {
    return next();
  }
  const adminUser = {
    email: adminEmail,
    password: bcrypt.hashSync(adminPassword, 10),
    roles: { admin: true },
  };
  // TODO: crear usuarix admin
  const userAdmin = await userModel.searchDataBase({ email: adminUser.email });
  if (!userAdmin) {
    await userModel.createDocument(adminUser);
    return next();
  }
  return next();
};

module.exports = (app, next) => {
  app.get('/users', requireAdmin, userController.controllerGetAllUsers);
  app.get('/users/:uid', requireAuth, userController.controllerGetUserById);
  app.post('/users', requireAdmin, userController.controllerCreateUser);  
  app.put('/users/:uid', requireAuth, userController.controllerPutUserById);
  app.delete('/users/:uid', requireAuth, userController.controllerDeleteUserById);
  initAdminUser(app, next);
};
