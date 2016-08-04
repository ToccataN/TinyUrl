var express = require('express'),
    app = express(),
    mongoclient = require('mongodb').MongoClient,
    vurl= require('validator');
    var url='mongodb://localhost:27017/TinyUrl',
        thisurl = "https://apiproject1-toccatan.c9users.io/",
        obj ={};
       
    
    app.get('/', function(req, res){
        res.send("Tiny-Url API: Type in url as an URL parameter, recieve a numeric code that can be typed in as an Url parameter that references the original url.");
        mongoclient.connect(url, function(e, db){
          db.createCollection('urls');
        });
    });
 
    
    var mongo = function(x){
       var json;
       var num = Math.floor(Math.random() * 90000)+10000;
        mongoclient.connect(url, function(e, db){  
            var collection = db.collection('urls');
            collection.insert({_id: num, url: x}, function(e, result){
                if (e) return e
                
                json = num;
                console.log(result);
                obj.js = thisurl+json;
                db.close();
            });
        });
        
    };
  
    var find = function(x){
        mongoclient.connect(url, function(e, db){
          var collection = db.collection('urls');
          collection.find({_id: x}).toArray( function(e, result){
              if (e) return e
              console.log(result[0].url);
              obj.uri= thisurl+result[0].url;
              db.close();
          });
          
        });
    }
  
    app.param('id', function(req, res){
        var urlp = req.params.id;
        if (vurl.isURL(urlp.toString())){
          var tinyurl= mongo( urlp);
          setTimeout(function(){res.send(obj.js)}, 200);
          
        } else if(urlp.length ===5){
            find(Number(urlp));
            setTimeout(function(){res.send(obj.uri)}, 200);
        } 
        
        else {
            res.send("try again");
        }
        
    })
  

    app.get('/:id', function(req, res){
        res.end();
    })
    
    app.listen(8080, function(){
        console.log("listenning in on 8080")
    })