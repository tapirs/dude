var ObjectID = require('mongodb').ObjectID;
const corsOptions = {
  origin: 'http://127.0.0.1',
  methods: ['GET', 'POST', 'DELETE', 'PUT']
}

module.exports = function(app, db, cors) {
  app.options('/subscribe', cors());
  app.options('/subscribe/:id', cors());
  app.get('/subscribe/:id', cors(corsOptions), (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('subscribe').findOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.render('subscribe-item', {subscribe: item});
      }
    });
  });
  app.get('/subscribe', cors(corsOptions), (req, res) => {
    db.collection('subscribe').find({}).toArray((err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.render('subscribe', {list: item);
      }
    });
  });
  app.post('/subscribe', cors(corsOptions), (req, res) => {
    let charity = '{'
    for(var prop in req.body) {
      if(req.body[prop] == "true" || req.body[prop] == "false") {
        charity += '"' + prop + '":' + req.body[prop] + ','
      } else {
        charity += '"' + prop + '":' + '"' + req.body[prop] + '",'
      }
    }
    charity = charity.substring(0,charity.length -1)
    charity += '}'
    db.collection('subscribe').insertOne(JSON.parse(charity), (err, result) => {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        res.redirect('/thanks_for_subscribing.php');
      }
    });
  });
  app.delete('/subscribe/:id', cors(corsOptions), (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('subscribe').deleteOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('Charity ' + id + ' deleted!');
      }
    });
  });
  app.put('/subscribe/:id', cors(corsOptions), (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    let charity = '{'
    for(var prop in req.body) {
      if(req.body[prop] == "true" || req.body[prop] == "false") {
        charity += '"' + prop + '":' + req.body[prop] + ','
      } else {
        charity += '"' + prop + '":' + '"' + req.body[prop] + '",'
      }
    }
    charity =  charity.substring(0,charity.length -1)
    charity += '}'
    db.collection('subscribe').updateOne(details, { $set: JSON.parse(charity)}, (err, result) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(result);
      }
    });
  });
  app.get('/subscribe/admin/keys', cors(corsOptions), (req, res) => {
    const details = { 'charity_name': 'Rethink' };
    db.collection('subscribe').findOne( details, (err, result) => {
      if (err) {
          res.send({'error':'An error has occurred'});
        } else {
          res.send(result);
        }
    });
  });
}
