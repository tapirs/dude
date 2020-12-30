var ObjectID = require('mongodb').ObjectID;

var whitelist = ['http://127.0.0.1', 'https://tapirs.co.uk', 'https://dev.tapirs.co.uk', 'https://dev.get-chips.co.uk', 'https://get-chips.co.uk']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'PUT']
}
const nodemailer = require('nodemailer');
var config = require('../../config/config');

module.exports = function(app, db, oidc, cors) {
  app.options('/contact', cors());
  app.options('/contact/:id', cors());
  app.get('/contact/:id', oidc.ensureAuthenticated(), cors(corsOptions), (req, res) => {
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
  app.get('/contact', oidc.ensureAuthenticated(), cors(corsOptions), (req, res) => {
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
    console.log(req.body);
    let contact = '{'
    if (req.is('application/json')) {
      console.log('its json')
      contact = req.body
    } else {
      for(var prop in req.body) {
        if(req.body[prop] == "true" || req.body[prop] == "false") {
          contact += '"' + prop + '":' + req.body[prop] + ','
        } else {
          contact += '"' + prop + '":' + '"' + req.body[prop] + '",'
        }
      }
      contact = contact.substring(0,contact.length -1)
      contact += '}'
      contact = JSON.parse(contact);
    }
    console.log(contact);
    db.collection('contact').insertOne(contact, (err, result) => {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        let email = req.body["email"];
        let subject = req.body["subject"];
        let message = req.body["message"];

        var transporter = nodemailer.createTransport(config.email);

        var mailOptions = {
          from: 'info@tapirs.co.uk',
          to: 'andrew.partis@tapirs.co.uk, michelle.partis@tapirs.co.uk',
          subject: "New contact",
          text: subject + "-" + message
        };

	console.log("sending mail");

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          }
        });
        if (req.is('application/json')) {
          res.send();
        } else {
          res.redirect('/message_received.php');
        }
      }
    });
  });
  app.delete('/contact/:id', oidc.ensureAuthenticated(), cors(corsOptions), (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('contact').deleteOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        console.log('Contact' + id + ' deleted!');
        res.redirect('/dude/contact');
      }
    });
  });
  app.put('/contact/:id', oidc.ensureAuthenticated(), cors(corsOptions), (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    let contact = '{'
    for(var prop in req.body) {
      if(req.body[prop] == "true" || req.body[prop] == "false") {
        contact += '"' + prop + '":' + req.body[prop] + ','
      } else {
        contact += '"' + prop + '":' + '"' + req.body[prop] + '",'
      }
    }
    contact =  contact.substring(0,contact.length -1)
    contact += '}'
    db.collection('contact').updateOne(details, { $set: JSON.parse(contact)}, (err, result) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.redirect('/dude/contact/' + id);
      }
    });
  });
  app.get('/contact/admin/keys', oidc.ensureAuthenticated(), cors(corsOptions), (req, res) => {
    const details = { 'contact_name': 'Rethink' };
    db.collection('contact').findOne( details, (err, result) => {
      if (err) {
          res.send({'error':'An error has occurred'});
        } else {
          res.send(result);
        }
    });
  });
  app.post('/contact/reply', oidc.ensureAuthenticated(), cors(corsOptions), (req, res) => {
    let email = req.body["email"];
    let subject = "RE: " + req.body["subject"];
    let message = "\n\n======================================================\n\n" + req.body["message"];

    res.render('reply', {email: email, subject: subject, message: message});
  });
  app.post('/contact/send', oidc.ensureAuthenticated(), cors(corsOptions), (req, res) => {
    let email = req.body["email"];
    let subject = req.body["subject"];
    let message = req.body["message"];

    var transporter = nodemailer.createTransport(config.email);

    var mailOptions = {
      from: 'info@tapirs.co.uk',
      to: email,
      subject: subject,
      text: message
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.send({'error':'An error has occurred'});
      } else {
        res.redirect('/dude/contact');
      }
    });
  });
}
