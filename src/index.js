'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let randa = require('ramda');
let httpServer = require('http').createServer(app);
let io = require('socket.io')(httpServer);

// custom modules
let Twitter = require('./api/twitter');

let port = process.env.PORT || 8000;

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static(__dirname + '/app'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/app/index.html')
});

app.get('/api', function(req, res) {
    Twitter.stream("Daler");
    res.send({"Message": "You reached the API base."})
});

app.get('/api/:topic?', function(req, res) {
    let tweet = req.params.topic;

    let sanFrancisco = [ '-122.75, 36.8, -121.75, 37.8'];

    try
    {
        Twitter.module.stream('statuses/filter', {'locations': sanFrancisco },
            function(stream) {
                stream.on('data', function(data) {
                  // let coordinates = tweet.place.bounding_box.coordinates;
                  // stream.on('data', function(data) {
                  // io.sockets.emit('tweet', data);
                    console.log(data);

                  // });

                  // stream.on('destroy', function() {
                  //     console.log("Disconnected from Twitter.");
                  // });

                });

            }
        );
    }
    catch(err)
    {
        console.log("Couldn't stream yet...", err);
    }

    console.log(tweet);
});


/**
*   socket.io stuff
*
**/

io.on('connection', (socket) => {
    socket.on('topic', (topic) => {
        console.log("\nTOPIC: ", topic, "\n");
        let topicStr = topic.toString();

        const sanFrancisco = [ '-122.75, 36.8, -121.75, 37.8' ];

        Twitter.module.stream('statuses/filter', {'locations': sanFrancisco },
            function(stream) {
                stream.on('data', function(data) {
                  // let coordinates = tweet.place.bounding_box.coordinates;
                  // stream.on('data', function(data) {
                  // io.sockets.emit('tweet', data);
                    // console.log(data);
                    socket.broadcast.emit('tweet', data);
                    socket.emit('tweet', data);
                  // });

                  // stream.on('destroy', function() {
                  //     console.log("Disconnected from Twitter.");
                  // });

                });

        });

    });
});



httpServer.listen(port, function() {
  console.log('Listenning on port ' + port);
});