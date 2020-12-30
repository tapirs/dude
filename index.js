const express        = require('express');
const methodOverride = require('method-override');
const session = require("express-session");
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const app            = express();
const port           = 8001;
const db             = require('./config/db');
const cors           = require('cors');
const { ExpressOIDC } = require('@okta/oidc-middleware');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(session({
  secret: 'jrehgruethuioafhegBUFIEHFEui3482954hu4ialgbr',
  resave: true,
  saveUninitialized: false
}));
var config = require('./config/config');
const oidc = new ExpressOIDC(config.okta);
app.use(oidc.router);
app.set('view engine', 'pug');
app.set('views', __dirname + '/views/');
MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err)
  require('./app/routes')
  (app, database.db('dude'), oidc, cors);

  // Make sure you add the database name and not the collection name  const database = database.db("note-api")
  oidc.on('ready', () => {
    app.listen(port, () => {  console.log('We are live on ' + port); });
  });

  oidc.on('error', err => {
    console.log('Unable to configure ExpressOIDC', err);
  });
})
