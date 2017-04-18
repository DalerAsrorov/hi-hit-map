import Map from './modules/map.js';
import * as ui from './modules/ui.js';
import * as Request from './modules/request.js';
import * as Paths from './modules/paths.js';
import * as utils from './modules/utils.js';
import * as GraphOps from './modules/mapops.js';
import * as constants from './modules/constants.js';
import Storage from './classes/storage.js';
import StorageSystem from './classes/storagesystem.js';
import PanelComponent from './classes/panelcomponent.js';
import Components from './classes/components.js';
import Twitter from './classes/twitter.js';


// Action
$(window).load(function() {
    const storageSystem = new StorageSystem(window.localStorage);
    const twitter = new Twitter('twitter');
    console.log('twitter', twitter);
    const TWITTER_MODES = constants.MAIN.TWITTER_MODES;
    const TWITTER_MODES_INDEX = constants.MAIN.TWITTER_MODES_INDEX;

    let socket = io.connect('http://localhost:8000/');

    let cpOpen,
        tracker,
        cpRightList =[];

    let rightComponents = new Components();

    /* INTRO LOADER CODE */
    $(() => {
        if(!storageSystem.getItem('firstVisit')) {
            ui.fadeOut('#initLoader', 3000, () => {
                ui.removeElement('#initLoader');
                ui.makeVisible('#mainWrapper', 500);
            });
        } else {
            ui.fadeOut('#initLoader', 550, () => {
                ui.removeElement('#initLoader');
                ui.makeVisible('#mainWrapper', 500);
            });
        }
    });

    storageSystem.setItem('firstVisit', true);

    cpOpen = storageSystem.getItem('cpOpen');
    console.log('cpOpen:::', cpOpen);
    if(cpOpen == 'false') {
        console.log("Should slide: cpOpen", cpOpen);
        ui.slideToggleCp('controlPanelWrapper', Map);
    }

    ui.addEventListenerTo('toggleSliderBtn', 'click', (event) => ui.slideToggleCp('controlPanelWrapper', Map));

    new L.Control.GPlaceAutocomplete({
        position: 'topright',
        callback: function(location) {
            console.log('Location given:', location);
            const lat = location.geometry.location.lat();
            const lng = location.geometry.location.lng();

            // const sanFrancisco = [ '-122.75, 36.8, -121.75, 37.8' ];
            const lastLocation = [`${lng}, ${lat}, ${lng+1}, ${lat+1}`];

            storageSystem.setRawItem('lastLocation', lastLocation);
            Map.setView([lat, lng], 8, {animate: true, duration: 2.0});
        }
    }).addTo(Map);

    socket.on('tweet', (tweet) => {
        let coordinates = tweet.place ? tweet.place.bounding_box.coordinates[0][1] : null;
        if(coordinates) {
            const coordinates = tweet.place.bounding_box.coordinates[0][1];
            const user = tweet.user;
            const text = tweet.text;
            const id = tweet.id;
            const created_at = tweet.created_at;
            const mlsTime = tweet.timestamp_ms;

            const data = {
                user,
                text,
                created_at,
                id,
                mlsTime
            };

            GraphOps.drawObject(data, coordinates, 'twitter');
        } else {
            console.log('Passed tweet with no coordinates', tweet);
        }
    });


    function getInfoBasedOnChosenMode(mode, query, lastLocation, twitData) {
        switch(mode) {
            case 'real_time':
                twitter.turnOnSocket(socket, 'topic', {topic: query, location: lastLocation});
                break;
            case 'specified_time':
                twitter.getData(Paths.getTwitData(), twitData)
                .then((data) => console.log(data))
                .catch((err) => new Error('err', err));
                break;
            default:
                console.log('none of the modes selected');

        };
    };

    ui.onSubmit('#querySearchForm', function(e) {
        e.preventDefault();
        const query = ui.getInputValue('#querySearch');
        const lat = Map.getCenter().lat;
        const lng = Map.getCenter().lng;
        const twitData = {q: query, geocode: [lat, lng], radius: '25mi'};

        let lastLocation = [`${lng}, ${lat}, ${lng+1}, ${lat+1}`];

        if(R.isNil(storageSystem.getItem('lastLocation'))) {
            console.log('Not selected. twitData:', twitData);
            // const testTwitDataItemTest = {q: 'trump', geocode: [37.7749, -122.4194], radius: '25mi'};

            getInfoBasedOnChosenMode('specified_time', query, lastLocation, twitData);

        } else {
            console.log('Exists', lastLocation);

            /**

                TODO:
                - This is for General and Selective timing
                - Get data points and draw them on the map

             */
            // const first = GraphOps.generateResults([1, 2, 3, 4]);
            // first(lastLocation);

            /**

                TODO:
                - This portion of code is for Socket.io/real time tweet streaming
                - Get location and query and start connecting to the socket

             */
            getInfoBasedOnChosenMode('specified_time', query, lastLocation, twitData);
        };

        // last location is saved
        storageSystem.setRawItem('lastLocation', lastLocation);

        // once query selected:
        // check if location is already selected
        // if yes, then go to that location
        //          and show the results
        // if no, then get the center of the current
        //        location of the screen and show the results.
        //
    });

    // generation
    // ui.generateCpRightPanel('#panelWrapper', {});

    // Testing area
    let testGeo = '-25.2744,-133.7751'; // Australia
    // console.log('Path:', Paths.getGeoTrends(testGeo));
    console.log(Paths.getGeoTrends(testGeo));
    Request.getRequest(Paths.getGeoTrends(testGeo))
    .then((data) => {
        if(data.data) {
            let listOfTrends = data.data.trends;
            let geoData = data.geo;

            $("#querySearch").easyAutocomplete({
                data: listOfTrends,
                getValue: 'name',
                list: {
                    match: {
                        enabled: true
                    },
                    onShowListEvent: function() {
                        // switch(storageSystem.getItem('cpOpen')) {
                        //     case 'false':
                        //        $('.easy-autocomplete-container').addClass('autocomplete-top');
                        //        break;
                        //     case 'true':
                        //        $('.easy-autocomplete-container').removeClass('autocomplete-top');
                        //        break;
                        //     default:
                        //        $('.easy-autocomplete-container').removeClass('autocomplete-top');
                        // };
                        switch(storageSystem.getItem('cpOpen')) {
                            case 'false':
                                ui.addClass('.easy-autocomplete-container', 'autocomplete-top');
                                break;
                            case 'true':
                                ui.removeClass('.easy-autocomplete-container', 'autocomplete-top');
                                break;
                            default:
                                ui.removeClass('.easy-autocomplete-container', 'autocomplete-top');
                        }

                    },
                    onKeyEnterEvent: function() {

                    }
                }
                // template: {
                //     type: "custom"
                //     // method: function(value, item) {
                //     //     return "<img src='" + item.icon + "' /> | " + item.type + " | " + value;
                //     // }
                // }
            });

        } else {
            console.log("no data", data);
        }

            // (function() {
            //     // for(let i = 0; i < 10; i++) {
            //     //     ui.addElementToPanel
            //     //     (
            //     //         '#panelCompRightWrapper',
            //     //         {},
            //     //         "Button " + i,
            //     //         $('<a></a>'),
            //     //         'menu btn btn-secondary',
            //     //         'col-lg-4'
            //     //     );
            //     // }

            //     // undefined by default will place 'div' element

            //     // ui.addElementTo('')

            // }());

            // console.log('Should reach here...');
            // let dropdown = ui.addContainerToContainer('#panelCompRightWrapper', 'favorites', undefined, 'dropdown show');
            // let $a = ui.addContainerToContainer(dropdown.attr('id'), undefined, $('<a>'), 'btn btn-secondary dropdown-toggle');
            // ui.addTextTo($a, $a.attr('id'));

            //target, dropdownName, dropdownID, dataList


            let panelComp1 = new PanelComponent('#topTen',
                                               'Top 10 Tweets',
                                               function(){console.log('hi')},
                                               [{"name":"daler"}, {"name":"michael"}]);
            let panelComp2 = new PanelComponent('#topTwenty',
                                                'Top 10 Retweets',
                                                function(){console.log('hi')},
                                                [{"lastname":"asrorov"}, {"lastname":"jojo"}]);
            let panelComp3 = new PanelComponent('#topThirty',
                                    'Top 30 Retweets',
                                    function(){ console.log('hi') },
                                    [{"jorge":"quero"}, {"sandro":"bolo"}]);

            rightComponents.add(panelComp1);
            rightComponents.add(panelComp2);
            rightComponents.add(panelComp3);
            rightComponents.setName('Social Media');
            rightComponents.setId('socMedia');

            console.log("panelComp object:", rightComponents);
            ui.appendDropDownToPanel('#panelCompRightWrapper', rightComponents);

    })
    .catch((err) => {
        console.log("Error request", err);
    });

    const arrayOfIndexes = TWITTER_MODES.map((item, index) => index);
    const arrayOfLabels = TWITTER_MODES.map((mode) => utils.titleCase(mode.split('_').join(' ')));
    ui.appendRangeSlider('#panelCompMiddle', 'range-selector', 'twitterModes', {
        ticks: arrayOfIndexes,
        ticksLabels: arrayOfLabels,
        min: arrayOfIndexes[0],
        max: arrayOfIndexes[arrayOfIndexes.length - 1],
        step: 1,
        value: arrayOfIndexes[0],
        tooltip: 'hide',
        eventHandlers: {
            change: function(slideEvt) {
                const newMode = slideEvt.value.newValue;
                const prevMode = slideEvt.value.oldValue;
                switch(newMode) {
                    case TWITTER_MODES_INDEX['real_time']:
                        break;
                    case TWITTER_MODES_INDEX['specified_time']:
                        // check the cache
                        // if location data already exists
                        //      return location from cache
                        // else
                        //      store location in cache in (key, value) pair where key is location and value is tweets
                        //      return location
                        const query = ui.getInputValue('#querySearch');
                        const lat = Map.getCenter().lat;
                        const lng = Map.getCenter().lng;
                        const twitData = {q: query, geocode: [lat, lng], radius: '25mi'};
                        twitter.getData(Paths.getTwitData(), twitData);
                        break;
                    default:
                        console.log('none selected');

                }
                console.log('Event: change. Slider object', slideEvt);
            }
        }
    });

    // Request.getRequest(Utils.getTrendsPlaces(lat, long))å
    //     .then((data) => {
    //         console.log("Trends Data");
    //     })

    // post request testing


});
