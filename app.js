const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const NodeCouchDb = require('node-couchdb');

const couch = new NodeCouchDb({
  auth: {
    user: 'admin',
    password: 'ninette24'
  }
});

const dbName = 'customers';
const viewUrl = '_design/all_customers/_view/all';

couch.listDatabases().then(dbs => console.log(dbs));

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  couch
    .get(dbName, viewUrl)
    .then((data, headers, status) => {
      console.log('data', data.data.rows);
      res.render('index', {
        customers: data.data.rows
      });
    })
    .catch(err => res.send(err));
});

app.post('/customer/add', function(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  couch.uniqid().then(ids => {
    const id = ids[0];
    couch
      .insert(dbName, {
        _id: id,
        name: name,
        email: email
      })
      .then((data, header, status) => {
        res.redirect('/');
      })
      .catch(err => {
        res.send(err);
      });
  });
});

app.post('/customer/delete/:id', function(req, res) {
  const id = req.params.id;
  const rev = req.body.rev;
  couch
    .del(dbName, id, rev)
    .then((data, headers, status) => {
      res.redirect('/');
    })
    .catch(err => {
      res.send(err);
    });
});

app.listen(3000, function() {
  console.log('Server Started On Port 3000');
});
