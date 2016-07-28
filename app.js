// items for server and routes
const express =  require('express');
const app = express();
const port = 8080; // server port
const bodyParser = require('body-parser'); // body-parser to parse urls
const path = require('path');

// database related items
const mongoose = require('mongoose'); // mongoose to make Schemas and dbs easy
const SiteData = require('./siteData.model'); // import db schema
const getData = require('./getData');

// data base items
const db = 'mongodb://localhost/siteDataDB'; // specificy db address
mongoose.connect(db); // connect to db

app.use(bodyParser.json()); // use express to parse JSON objs
app.use(bodyParser.urlencoded({
  extended: false
}));


// costum templating engine - simple and made with express
var fs = require('fs'); 
app.engine('ntl', function (filePath, options, callback) { // define the template engine
  fs.readFile(filePath, function (err, content) {
    if (err) return callback(new Error(err));
    
    var rendered = content.toString()
    .replace('#message#', '<h4>'+ options.message +'</h4>');
    return callback(null, rendered);
  });
});
app.set('views', './views'); // specify the views directory
app.set('view engine', 'ntl'); // register the template engine
// end of templating engine

//////////////////// Routes
// main page
app.get('/', function (req, res) {
  res.render('index', { message: ''});
});

// take in information from main page
app.post('/:action', function(req, res){
  
  if (req.params.action === 'getSiteData'){ // if post was to scrape a site
    var newSiteData = new SiteData(); // make a new entry
    
    newSiteData.url = req.body.url; // url is set to request url
    newSiteData.data = ''; // data is blank
    newSiteData.downloadComplete = false; // downloadComplete is false

    newSiteData.save(function(err, siteData){ // save new entry to database
      if(err){
        console.log('error saving entry to database: ', err);
      } else {
        getData(siteData.url, siteData._id); // scrape site and store in db
        res.render('index', { message: 'job number is: ' + siteData._id}); // render job id to main page
      }
    });

  } else { // if post was to look up a job

    SiteData.findOne({ // retrieve item
      _id: req.body.jobID
    })
    .exec(function(err, site){
      if(err){
        res.render('index', { message: 'job id is invalid'});
      } else {
        if(site.downloadComplete){ // if download is complete
          res.send(site.data); // render page
        } else { // if download is incomplete, render message on index page
        res.render('index', { message: 'download is not yet complete. try again later'});
        }
      }
    });
  }

});


// 404 for all other routes
app.get('*', function(req, res){
  res.send('404 - this page does not exist');
});

// run server
app.listen(port, function (argument) {
  console.log(`app listening on port ${port}`);
});