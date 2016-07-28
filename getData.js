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
        saveDataToDB(id, siteHTML);
      });
    } else { // if status is not 200
      saveDataToDB(id, 'info was not retrievable');
    } 
  });
}

function saveDataToDB (id, saveToDataField){
  SiteData.findOneAndUpdate({ // update entry with info
    _id : id
    } , { $set : {data: saveToDataField , downloadComplete: true}},
    {upsert: true},
  function(err, data){
    if(err){
      console.log('error saving data ', err);
    } else {
      console.log('data saved');
    }
  }
  ); 
}

module.exports = getData;
