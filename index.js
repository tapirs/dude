const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const app            = express();
const port           = 8001;
const db             = require('./config/db');
const cors           = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');
MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err)
  require('./app/routes')
  (app, database.db('dude'), cors);

  // Make sure you add the database name and not the collection name  const database = database.db("note-api")
  app.listen(port, () => {  console.log('We are live on ' + port); });
})
