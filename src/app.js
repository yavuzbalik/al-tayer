const express = require("express");
const path = require("path");
const autocomplete = require("./lib/autocomplete");
const app = express();
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();
const request = require("request");
const url = require('url');
const basePath='http://www.omdbapi.com/?apikey=c665692b&s='



"use strict";



app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

app.get('/api/search', (req, res,next) => {
  
  
        
  var query = url.parse(req.url,true).query;
  var key=query.keyword
 var tryCache=myCache.get(key)
  console.log(tryCache)
  console.log(key)
  if(tryCache!==undefined){
    console.log({message:'cached values returned'})
    res.send({status:200,result:tryCache,message:'cached values returned'})
  }
else{
async function sendMovie() {
  try{
  const list1 = await getMovies(key,1);
  const list2 = await getMovies(key,2);
  
var result = list1.concat(list2)
  
  
  myCache.set( key, result, 3000 );
  console.log({message:'new list returned'})
  res.send({status:200,result,message:'new list returned'})
  }
  catch (e){
    console.log(e)
    res.send({status:400,result:e})
  }
}

sendMovie();
}

});

app.get('/api/clear',(req,res)=>{
    
   
  myCache.flushAll()
    
  
  res.send({status:200,message:"cache erased"})

})


function getMovies(key,page) {
  return new Promise((resolve,reject) => {
    if(key.length>2){
    var reqURL=basePath+key+'&'+'page='+page+'';


    request.get(reqURL, function(err, resp, body) {
    if (err) {
      console.log(err)
        reject(err);
    } else {
        try {
        var parsed = JSON.parse(body);
        
        if(parsed["Response"]==="True"){
         
          resolve(parsed["Search"]);
          }
          
          else
            reject(parsed["Error"]);
            
    }   catch (e) {
          reject(e)
    }
  }
})
}   

    else
      reject ("string length must be greater than 2 ")
    });
}



module.exports = app;
