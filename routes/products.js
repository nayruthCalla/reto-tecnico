const { dbUrl } = require('../config');
const modelDataBase = require('../models/general-model');
const validateProducto = require('../middleware/productos.validate').validateProduct;

const productModel = modelDataBase('products', dbUrl);
const modelController = require('../controller/product');
const productController = modelController(productModel);

const {
  requireAuth,
  requireAdmin,  
} = require('../middleware/auth');

module.exports = (app, nextMain) => {
  app.get('/products',  productController.controllerGetAllProducts);
  app.get('/products/:productId', productController.controllerGetProductById);
  app.post('/products',requireAdmin , productController.controllerCreateProduct);
  app.put('/products/:productId', requireAdmin, productController.controllerPutProduct);  
  app.delete('/products/:productId', requireAdmin, productController.controllerDeleteProduct);

  nextMain();
};
