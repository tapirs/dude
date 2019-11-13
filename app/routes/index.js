const contactRoutes = require('./contact_routes');
const subscribeRoutes = require('./subscribe_routes');

module.exports = function(app, db, cors) {
  contactRoutes(app, db, cors);
  subscribeRoutes(app, db, cors);
  // Other route groups could go here, in the future
};
