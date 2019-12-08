var ObjectID = require('mongodb').ObjectID;
const corsOptions = {
  origin: 'http://127.0.0.1',
  methods: ['GET', 'POST', 'DELETE', 'PUT']
}

module.exports = function(app, db, oidc, cors) {
  app.options('/subscribe', cors());
  app.options('/subscribe/:id', cors());
  app.get('/subscribe/:id', oidc.ensureAuthenticated(), (corsOptions), (req, res) => {
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
  app.get('/subscribe', oidc.ensureAuthenticated(), cors(corsOptions), (req, res) => {
    db.collection('subscribe').find({}).toArray((err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.render('subscribe', {list: item});
      }
    });
  });
  app.post('/subscribe', oidc.ensureAuthenticated(), cors(corsOptions), (req, res) => {
    let subscribe = '{'
    for(var prop in req.body) {
      if(req.body[prop] == "true" || req.body[prop] == "false") {
        subscribe += '"' + prop + '":' + req.body[prop] + ','
      } else {
        subscribe += '"' + prop + '":' + '"' + req.body[prop] + '",'
      }
    }
    subscribe = subscribe.substring(0,subscribe.length -1)
    subscribe += '}'
    db.collection('subscribe').insertOne(JSON.parse(subscribe), (err, result) => {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        res.redirect('/thanks_for_subscribing.php');
      }
    });
  });
  app.delete('/subscribe/:id', oidc.ensureAuthenticated(), cors(corsOptions), (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('subscribe').deleteOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        console.log('Subscriber' + id + ' deleted!');
        res.redirect('/dude/subscribe');
      }
    });
  });
  app.put('/subscribe/:id', oidc.ensureAuthenticated(), cors(corsOptions), (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    let subscribe = '{'
    for(var prop in req.body) {
      if(req.body[prop] == "true" || req.body[prop] == "false") {
        subscribe += '"' + prop + '":' + req.body[prop] + ','
      } else {
        subscribe += '"' + prop + '":' + '"' + req.body[prop] + '",'
      }
    }
    subscribe =  subscribe.substring(0,subscribe.length -1)
    subscribe += '}'
    db.collection('subscribe').updateOne(details, { $set: JSON.parse(subscribe)}, (err, result) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.redirect('/dude/subscribe/' + id);
      }
    });
  });
  app.get('/subscribe/admin/keys', oidc.ensureAuthenticated(), cors(corsOptions), (req, res) => {
    const details = { 'subscribe_name': 'Rethink' };
    db.collection('subscribe').findOne( details, (err, result) => {
      if (err) {
          res.send({'error':'An error has occurred'});
        } else {
          res.send(result);
        }
    });
  });
}
