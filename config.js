exports.port = process.argv[2] || process.env.PORT || 8080;
exports.dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/e-commerce';
exports.secret = process.env.JWT_SECRET || 'esta-es-el-reto-tecnico';
exports.adminEmail = process.env.ADMIN_EMAIL || 'admin-e-commerce@localhost';
exports.adminPassword = process.env.ADMIN_PASSWORD || 'changeme';