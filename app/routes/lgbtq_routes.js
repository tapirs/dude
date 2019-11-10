var ObjectID = require('mongodb').ObjectID;
const corsOptions = {
  origin: 'http://localhost:5000',
  methods: ['GET', 'POST', 'DELETE', 'PUT']
}

module.exports = function(app, db, cors) {
  app.options('/lgbtq', cors());
  app.options('/lgbtq/:id', cors());
  app.get('/lgbtq/:id', cors(corsOptions), (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('lgbtq').findOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(item);
      }
    });
  });
  app.get('/lgbtq', cors(corsOptions), (req, res) => {
    db.collection('lgbtq').find({}).toArray((err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(item);
      }
    });
  });
  app.post('/lgbtq', cors(corsOptions), (req, res) => {
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
    db.collection('lgbtq').insertOne(JSON.parse(charity), (err, result) => {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        res.send(result.ops[0]);
      }
    });
  });
  app.delete('/lgbtq/:id', cors(corsOptions), (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('lgbtq').deleteOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('Charity ' + id + ' deleted!');
      }
    });
  });
  app.put('/lgbtq/:id', cors(corsOptions), (req, res) => {
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
    db.collection('lgbtq').updateOne(details, { $set: JSON.parse(charity)}, (err, result) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(result);
      }
    });
  });
  app.get('/lgbtq/admin/keys', cors(corsOptions), (req, res) => {
    const details = { 'charity_name': 'Switchboard LGBT support' };
    db.collection('lgbtq').findOne( details, (err, result) => {
      if (err) {
          res.send({'error':'An error has occurred'});
        } else {
          res.send(result);
        }
    });
  });
}
