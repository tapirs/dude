var ObjectID = require('mongodb').ObjectID;
const corsOptions = {
  origin: 'http://localhost',
  methods: ['GET', 'POST', 'DELETE', 'PUT']
}

module.exports = function(app, db, cors) {
  app.options('/mental_health', cors());
  app.options('/mental_health/:id', cors());
  app.get('/mental_health/:id', cors(corsOptions), (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('mental_health').findOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(item);
      }
    });
  });
  app.get('/mental_health', cors(corsOptions), (req, res) => {
    db.collection('mental_health').find({}).toArray((err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(item);
      }
    });
  });
  app.post('/mental_health', cors(corsOptions), (req, res) => {
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
    db.collection('mental_health').insertOne(JSON.parse(charity), (err, result) => {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        res.send(result.ops[0]);
      }
    });
  });
  app.delete('/mental_health/:id', cors(corsOptions), (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('mental_health').deleteOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('Charity ' + id + ' deleted!');
      }
    });
  });
  app.put('/mental_health/:id', cors(corsOptions), (req, res) => {
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
    db.collection('mental_health').updateOne(details, { $set: JSON.parse(charity)}, (err, result) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(result);
      }
    });
  });
  app.get('/mental_health/admin/keys', cors(corsOptions), (req, res) => {
    const details = { 'charity_name': 'Rethink' };
    db.collection('mental_health').findOne( details, (err, result) => {
      if (err) {
          res.send({'error':'An error has occurred'});
        } else {
          res.send(result);
        }
    });
  });
}
