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

app.listen(3000, function() {
  console.log('Server Started On Port 3000');
});
