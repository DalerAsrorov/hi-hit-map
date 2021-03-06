let Twit = require('twit');
let setup = require('./setup');

const twitConfig = {
    consumer_key: setup.twitterTokens.getConsumerKey(),
    consumer_secret: setup.twitterTokens.getConsumerSecret(),
    access_token: setup.twitterTokens.getAccessTokenKey(),
    access_token_secret: setup.twitterTokens.getAccessTokenSecret()
};

const Twitter = new Twit(twitConfig);

module.exports = {
    // base module used for streaming
    module: Twitter,

    // get the trends based on geo-location
    // weid represents the location ID
    getTrends: function getTrends(woeid) {
        return new Promise(function(resolve, reject) {
            Twitter.get('trends/place', { id: woeid }, function(err, data) {
                if (!data) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    },

    getClosest: function getClosest(lat, long) {
        // Test: San Francisco = 37.773972, -122.431297.
        lat = lat.trim();
        long = long.trim(long);

        function isNumber(number) {
            return parseFloat(number) === Number(number);
        }

        if (isNumber(lat) && isNumber(long)) {
            return new Promise((resolve, reject) => {
                let latNumber = parseInt(lat);
                let longNumber = parseInt(long);
                Twitter.get('trends/closest', { lat: latNumber, long: longNumber }, function(err, data) {
                    if (data) {
                        resolve(data);
                    } else {
                        reject('Error:::', err);
                    }
                });
            });
        } else {
            console.log('Passed strings cannot be converted to number.', lat, long);
        }
    },

    getTwitData: function getTwitData(query, geocode, radius, count, since_id, max_id) {
        geocode = geocode.join(',').toString().concat(`,${radius}`).trim();
        console.log(geocode);

        const params = {
            q: `${query}`,
            geocode: geocode,
            count: count ? count : 100,
            since_id: since_id ? since_id : '',
            max_id: max_id ? max_id : ''
        };

        return new Promise((resolve, reject) => {
            Twitter.get('search/tweets', params, (err, data) => {
                if (!err) {
                    resolve(data);
                } else {
                    reject(err);
                }
            });
        });
    }
};
