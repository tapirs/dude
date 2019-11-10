const contactRoutes = require('./contact_routes');
const homelessRoutes = require('./homeless_routes');
const lgbtqRoutes = require('./lgbtq_routes');

module.exports = function(app, db, cors) {
  contactRoutes(app, db, cors);
  homelessRoutes(app, db, cors);
  lgbtqRoutes(app, db, cors);
  // Other route groups could go here, in the future
};
