var ObjectID = require('mongodb').ObjectID;
const corsOptions = {
  origin: 'http://127.0.0.1',
  methods: ['GET', 'POST', 'DELETE', 'PUT']
}
const nodemailer = require('nodemailer');

module.exports = function(app, db, cors) {
  app.options('/contact', cors());
  app.options('/contact/:id', cors());
  app.get('/contact/:id', cors(corsOptions), (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('contact').findOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.render('contact-item', {contact: item});
      }
    });
  });
  app.get('/contact', cors(corsOptions), (req, res) => {
    db.collection('contact').find({}).toArray((err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        console.log(item);
        res.render('contact', {list: item});
      }
    });
  });
  app.post('/contact', cors(corsOptions), (req, res) => {
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
    db.collection('contact').insertOne(JSON.parse(charity), (err, result) => {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        res.redirect('/message_received.php');
      }
    });
  });
  app.delete('/contact/:id', cors(corsOptions), (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('contact').deleteOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('Charity ' + id + ' deleted!');
      }
    });
  });
  app.put('/contact/:id', cors(corsOptions), (req, res) => {
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
    db.collection('contact').updateOne(details, { $set: JSON.parse(charity)}, (err, result) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.redirect('/dude/contact/' + id);
      }
    });
  });
  app.get('/contact/admin/keys', cors(corsOptions), (req, res) => {
    const details = { 'charity_name': 'Rethink' };
    db.collection('contact').findOne( details, (err, result) => {
      if (err) {
          res.send({'error':'An error has occurred'});
        } else {
          res.send(result);
        }
    });
  });
  app.post('/contact/reply', cors(corsOptions), (req, res) => {
    let email = req.body["email"];
    let subject = "RE: " + req.body["subject"];
    let message = "\n\n======================================================\n\n" + req.body["message"];

    res.render('reply', {email: email, subject: subject, message: message});
  });
  app.post('/contact/send', cors(corsOptions), (req, res) => {
    let email = req.body["email"];
    let subject = req.body["subject"];
    let message = req.body["message"];

    var transporter = nodemailer.createTransport(config.email);

    var mailOptions = {
      from: 'no-reply@tapirs.co.uk',
      to: email,
      subject: subject,
      text: message
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        res.redirect('/dude/contact');
      }
    });
  });
}
