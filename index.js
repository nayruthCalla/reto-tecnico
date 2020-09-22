const express = require('express')
const helmet = require('helmet')
const app = express()
const config = require('./config');
const { dbUrl, port, secret } = config;
const routes = require('./routes');
const pkg = require('./package.json');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const db = require('./services/connection');

db(dbUrl)
  .then(() => {
    app.set('config', config);
    app.set('pkg', pkg);
    //app.use(cors());
    app.use(helmet()); //Helmet ayuda a proteger la aplicación de algunas vulnerabilidades web conocidas mediante el establecimiento correcto de cabeceras HTTP.
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(authMiddleware(secret));
    // Registrar rutas
    routes(app, (err) => {
      if (err) {
        throw err;
      }
      app.use(errorHandler);
      app.listen(port, () => {
        console.info(`App listening on port ${port}`);
      });
    });
  });