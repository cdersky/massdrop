const http = require('http');
const SiteData = require('./siteData.model'); // import db schema

function getData(url, id){
  http.get(url, function(res) { // get the url of interest
    var siteHTML = '';
    
    if(res.statusCode === 200){ // if status is 200
    
      res.on("data", function(chunk){
        siteHTML += chunk.toString(); // scrape site
      }); 

      res.on("end", function(){
        SiteData.findOneAndUpdate({ // update entry with info
          _id : id
          } , { $set : {data: siteHTML , downloadComplete: true}},
          {upsert: true},
          function(err, data){
            if(err){
              console.log('error saving data ', err);
            } else {
              console.log('data saved');
            }
          }
        ); 
      });
    } else { // if status is not 200
      SiteData.findOneAndUpdate({ // update entry with message
        _id : id
        } , { $set : {data: 'info was not retrievable' , downloadComplete: true}},
        {upsert: true},
        function(err, data){
          if(err){
            console.log('error saving data: ', err);
          } else {
            console.log('data saved');
          }
        }
      ); 
    } 
  });
}

module.exports = getData;
