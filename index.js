require('dotenv').config()
var express = require('express');
const fileUpload = require('express-fileupload');
var app = express();
var cors = require('cors');
var request = require('request');
var fs = require('fs');
var port = process.env.PORT || 8080;

var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204 ,
    credentials: true
  }
app.use(fileUpload());
app.use(cors(corsOptions))

app.post('/upload', function (req, res) {
    var tmpFile = req.files.file;
    var url = process.env.ENDPOINT+'/'+tmpFile.name;
    var myHeaders = {
        'X-Auth-Token': process.env.X_AUTH_TOKEN
    };
    tmpFile.mv('file.tmp', function(err) {
        if (err)
          return res.status(500).send(err);
          fs.readFile('file.tmp', function(err, data) {
            if (err) return console.error(err);
            
              options = {
                url: url,
                body: data,
                headers: myHeaders
              }
            
              request.put(options, function (err, message, data) {
                if (err) return console.error(err);
            
                fs.unlink('file.tmp');
                res.send(url);
              });

          });
      });
});

app.listen(port, function () {
    console.log('Example app listening on port '+port+' !');
});