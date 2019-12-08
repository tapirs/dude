const contactRoutes = require('./contact_routes');
const subscribeRoutes = require('./subscribe_routes');

module.exports = function(app, db, oidc, cors) {
  contactRoutes(app, db, oidc, cors);
  subscribeRoutes(app, db, oidc, cors);
  // Other route groups could go here, in the future
};
