/*eslint no-undef: "off"*/

'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let httpServer = require('http').createServer(app);
let io = require('socket.io')(httpServer);
const url = require('url');

require('dotenv').config();

// modules
const Sentiment = require('./api/sentiment');
const Twitter = require('./api/twitter');
const Yelp = require('./api/yelp');
const utils = require('./api/helpers/utils');

let port = process.env.PORT || 8000;

// reference to Twitter stream object
let baseStream;

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static(__dirname + '/app'));
// app.use(express.static(__dirname + '/bower_components'));

// init APIs
Yelp.init();

// use middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/app/index.html');
});

app.get('/api', (req, res) => {
    res.send({ app: 'hi-hat-map' });
});

app.get('/api/yelp/business/:id', (req, res) => {
    const { id } = req.params;
    Yelp.searchBusiness(id).then(data => {
        const requestTime = new Date().getTime();
        const requestDescription = 'Yelp API - ' + id + ' business info';

        res.send({
            requestTime,
            requestDescription,
            data
        });
    });
});

app.get('/api/yelp/reviews/:id', (req, res) => {
    const { id } = req.params;
    Yelp.searchReviews(id).then(data => {
        const requestTime = new Date().getTime();
        const requestDescription = 'Yelp API - ' + id + ' ratings results.';

        res.send({
            requestTime,
            requestDescription,
            data
        });
    });
});

app.post('/api/yelp/businesses', (req, res) => {
    const { body } = req;

    Yelp.searchBusinesses(body).then(data => {
        const requestTime = new Date().getTime();
        const requestDescription = 'Yelp API - businesses search.';

        res.send({
            requestTime,
            requestDescription,
            data
        });
    });
});

/**
* woed - yahoo location IDs
* 1 = Worldwide trends
*/
app.get('/api/twitter/trends/:woeid?', (req, res) => {
    const woeid = req.params.woeid;
    Twitter.getTrends(woeid)
        .then(data => {
            res.send({
                requestDescription: 'List of trends.',
                requestTime: new Date().getTime(),
                data: data[0]
            });
        })
        .catch(error => {
            res.send({
                message: 'ERROR',
                details: error
            });
        });
});

/**
*   Given the latitude and longtitude, it finds the trends
*   of the country given
*/
app.get('/api/twitter/geotrends/:latAndLong?', (req, res) => {
    const latAndLongString = req.params.latAndLong.trim();
    const geoArray = latAndLongString.split(',');
    const lat = geoArray[0].trim();
    const long = geoArray[1].trim();

    if (geoArray.length === 2) {
        Twitter.getClosest(lat, long)
            .then(data => {
                const woeid = data[0].woeid;
                const name = data[0].name;
                const country = data[0].country;
                const countryCode = data[0].countryCode;

                Twitter.getTrends(woeid)
                    .then(data => {
                        res.send({
                            requestDescription: 'List of trends.',
                            requestTime: new Date().getTime(),
                            geo: {
                                woeid: woeid,
                                name: name,
                                country: country,
                                countryCode: countryCode
                            },
                            data: data[0]
                        });
                    })
                    .catch(error => {
                        res.send({
                            message: 'ERROR',
                            details: error
                        });
                    });
            })
            .catch(error => {
                consle.log('Error!', error);
            });
    }
});

/**
* Finding the closest location based on lat and long
* lat, long
*/
app.get('/api/twitter/place/:latAndLong?', (req, res) => {
    const latAndLongString = req.params.latAndLong.trim();
    const geoArray = latAndLongString.split(',');
    const lat = geoArray[0].trim();
    const long = geoArray[1].trim();

    if (geoArray.length === 2) {
        Twitter.getClosest(lat, long)
            .then(data => {
                res.send({
                    requestDescription: 'List of trends places.',
                    requestTime: new Date().getTime(),
                    data: data[0]
                });
            })
            .catch(error => {
                consle.log('Error!', error);
            });
    }
});

/**
 *
 * POST:
 * Function:
 * (location, topic, time, limit) => {tweets}
 *
 */
app.post('/api/twitter/twitdata', (req, res) => {
    let receivedData = req.body;

    const q = receivedData.q;
    const geocode = receivedData.geocode;
    const radius = receivedData.radius;
    const count = receivedData.count;
    const since_id = receivedData.since_id;
    const max_id = receivedData.max_id;

    Twitter.getTwitData(q, geocode, radius, since_id, max_id)
        .then(tweets => {
            res.send(tweets);
        })
        .catch(err => {
            console.log('Error /api/twitter/twitdata', err);
        });
});

app.post('/api/sentiment/evaluatestring', (req, res) => {
    const data = req.body;
    const method = req.method.toUpperCase();
    const text = data.text;
    const pathname = url.parse(req.url).pathname.toString();

    const params = {
        method: method,
        path: pathname,
        data: JSON.stringify(text)
    };

    Sentiment.processText(text)
        .then(data => Sentiment.parseSentiment(data))
        .then(parsedData => utils.wrapWithObject('sentiment', parsedData))
        .then(wrappedData => utils.addMetaDataTo(wrappedData, params))
        .then(finalData => res.send(finalData))
        .catch((err, status) => res.status(500).send(err));
});

app.post('/api/twitter/stream/stop', (req, res) => {
    if (!baseStream) {
        return res.status(500).send({ error: 'There is no stream to stop.' });
    }

    baseStream.stop();
    return res.send({ status: true });
});

/**
*   socket.io stuff
*
**/
io.on('connection', function(socket) {
    socket.on('topic', info => {
        const track = info.topic.toString().trim().toLowerCase();
        const { locations } = info;

        baseStream = locations
            ? Twitter.module.stream('statuses/filter', { locations })
            : Twitter.module.stream('statuses/filter', { track });

        baseStream.on('tweet', tweet => {
            socket.emit('tweet', tweet);
        });
    });
});

/**
*  Launching the server.
**/
httpServer.listen(port, function() {
    console.log('Listenning on port ' + port);
});
