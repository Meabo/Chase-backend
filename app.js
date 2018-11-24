let app = require('express')();
let http = require('http').Server(app);
let SocketHandling = require('./SocketsHandling')(http);


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


http.listen(3000, function(){
    console.log('listening on *:3000');
});
