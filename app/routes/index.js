const contactRoutes = require('./contact_routes');

module.exports = function(app, db, cors) {
  contactRoutes(app, db, cors);
  // Other route groups could go here, in the future
};
