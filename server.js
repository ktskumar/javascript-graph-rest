var express = require('express');
var app = express();
var morgan = require('morgan');
var path = require('path');

var port = process.env.port || 2020;

app.use(morgan('dev'));

app.use(express.static(__dirname+'/public'));
app.use("/bower_components",express.static(path.join(__dirname,'bower_components')));


app.get("*", function(req, res){
    res.sendFile(path.join(__dirname+'/public/index.html'));
});

app.listen(port);
console.log('Listening on port '+ port +' ...');
