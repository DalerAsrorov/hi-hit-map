/*eslint no-undef: "off"*/

import { getParameter, buildWordPolarityMap } from './modules/sentiment-utils';
import { generateMapViewScreenshot, addFreeDrawLayerToMap, onFreeDrawMarkersPlaced } from './modules/leaflet-ops';
import LMap from './modules/map';
import * as ui from './modules/ui';
import * as Request from './modules/request';
import * as Paths from './modules/paths';
import * as utils from './modules/utils';
import * as MapOps from './modules/mapops';
import * as constants from './modules/constants';
import * as DataProcessing from './modules/dataprocessing';
import * as Emitter from './modules/emitter';
import * as Actions from './modules/actions';
import * as WidgetStructs from './modules/widget-action-structures';
import Widgets from './modules/widgets';
import DynamicQueue from './classes/dynamic-queue';
import Storage from './classes/storage';
import StorageSystem from './classes/storagesystem';
import Component from './components/component';
import WordcloudD3Component from './components/wordcloud-d3-component';
import MapLoaderComponent from './components/map-loader-component';
import WidgetComponent from './components/widget-component';
import WidgetCollectionComponent from './components/widget-collection-component';
import WidgetCollectionContainerComponent from './components/widget-collection-container-component';
import ModalComponent from './components/modal-component';
import Components from './classes/components';
import PanelComponent from './classes/panelcomponent';
import WidgetModuleMap from './modules/widgets';
import Twitter from './classes/twitter';
import Yelp from './classes/yelp';
import Sentiment from './classes/sentiment';
import Leaflet from './classes/leaflet';
import List from './classes/list';
import R from 'ramda';

$(window).load(function() {
    // Statuc modules
    const storageSystem = new StorageSystem(window.localStorage);
    const twitter = new Twitter('twitter');
    const YelpAPI = new Yelp('yelp');
    const sentiment = new Sentiment('social_media');
    const leaflet = new Leaflet();

    // Dynamic modules
    let rightComponents = new Components();
    let sentimentQueue = new DynamicQueue();
    let wordcloudQueue = new DynamicQueue();

    // Constants
    const { WIDGET_PARAMS, MAP_PARAMS } = constants;
    const { TWITTER_MODES, TWITTER_MODES_INDEX, MODAL_HEADERS } = constants.MAIN;

    // connecting to socket
    let socket = io.connect(Paths.getBase());

    // other variables used throughout the code
    let cpOpen;
    let tracker;
    let cpRightList = [];
    let streamStateButtonIsOn = false;

    // data structures
    let WordPolarityHashMap = new Map();
    let WidgetMap = new Map();

    // Loader Components
    const MapLoaderComp = new MapLoaderComponent('mapLoader', '#mapWrapper', 'div', '');

    // Map Components
    MapLoaderComp.init();

    // Widget Components
    let WidgetChartsCollectionComp = new WidgetCollectionComponent(
        'widgetChartsCollection',
        '#panelCompLeft',
        'Chart Widgets'
    );

    // Wordcloud Components
    let WordcloudModalComp = new ModalComponent(WidgetStructs['wrodcloudStruct']['id'], '#wrapper', 'div');
    WordcloudModalComp.init();
    WordcloudModalComp.buildHeader(MODAL_HEADERS.WORDCLOUD);

    let WordCloudD3Container = new Component('wordcloudD3Wrapper', `#${WordcloudModalComp.id}`, 'div', '');
    let WordcloudD3Comp = new WordcloudD3Component('wordcloudD3Comp', '', 'div', '');
    WordCloudD3Container.appendChild(WordcloudD3Comp);
    WordcloudModalComp.buildBody(WordCloudD3Container.html());

    // WordcloudModalComp.buildFooter([
    //     {
    //         name: 'Destroy',
    //         type: 'btn btn-info',
    //         dataDismissModal: true,
    //         action: ev => {
    //             console.log('Name:s', ev);
    //         }
    //     },
    //     {
    //         name: 'Help',
    //         type: 'btn btn-danger',
    //         dataDismissModal: true,
    //         action: ev => {
    //             console.log('Name:', ev);
    //         }
    //     },
    //     {
    //         name: 'Somebody',
    //         type: 'btn btn-primary',
    //         dataDismissModal: true,
    //         action: ev => {
    //             console.log('Name:', ev);
    //         }
    //     }
    // ]);

    // WordcloudModalComp.show();

    // Leaflet components
    let GPlaceAutoCompleteCompL = new L.Control.GPlaceAutocomplete({
        position: 'topright',
        callback: function(location) {
            const lat = location.geometry.location.lat();
            const lng = location.geometry.location.lng();

            // const sanFrancisco = [ '-122.75, 36.8, -121.75, 37.8' ];
            const lastLocation = [`${lng}, ${lat}, ${lng + 1}, ${lat + 1}`];

            LMap.setView([lat, lng], 8, { animate: true, duration: 2.0 });
        }
    }).addTo(LMap);

    let StopButtonL = L.easyButton({
        states: [
            {
                stateName: 'stream-is-on',
                icon: ui.generateWebIcon('fa-stop-circle-o', 'f1-1x', 'sent-neg-2', 'text'),
                title: 'Stop stream',
                onClick: function(control) {
                    const button = control.button;
                    const self = this;

                    twitter.stopStream(() => {
                        $(button).fadeOut(200, () => {
                            L.Util.requestAnimFrame(function() {
                                LMap.removeControl(self);

                                utils.performActionOnDQueue(wordcloudQueue, wordPolarityDict => {
                                    Object.entries(wordPolarityDict).forEach(([word, props]) => {
                                        const { score, freq } = props;

                                        if (!WordPolarityHashMap.get(word)) {
                                            WordPolarityHashMap.set(word, {
                                                score,
                                                freq
                                            });
                                        } else {
                                            WordPolarityHashMap.set(word, {
                                                freq: WordPolarityHashMap.get(word).freq + freq,
                                                score
                                            });
                                        }
                                    });
                                });

                                const wordcloudDataStructure = utils.convertMapToWordcloudDataStructure(
                                    WordPolarityHashMap
                                );

                                WordcloudD3Comp._words = wordcloudDataStructure;
                                WordcloudD3Comp.draw({
                                    ...WIDGET_PARAMS.WORDCLOUD
                                }); // eslint-disable

                                WidgetChartsCollectionComp.startAnimation();
                                wordcloudWidget.startAnimation();

                                // WordcloudD3Comp.convertToCanvas();

                                streamStateButtonIsOn = false;
                            });
                        });
                    });
                }
            }
        ]
    });

    let sentimentChart = ui.generateChart(
        '#sentimentChart',
        {
            x: 'x',
            columns: [['x', new Date()], ['negative', 0], ['positive', 0], ['total', 0]]
        },
        {
            x: {
                type: 'timeseries',
                tick: {
                    centered: true,
                    format: utils.formatDateToHoursOnly
                }
            }
        }
    );

    // First actions
    {
        // Initiate UI loader
        if (!storageSystem.getItem('firstVisit')) {
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

        // Navigate to user's location in map.
        MapOps.navigateToUserLocation();
    }

    storageSystem.setItem('firstVisit', true);
    cpOpen = storageSystem.getItem('cpOpen');

    if (cpOpen == 'false') {
        ui.slideToggleCp('controlPanelWrapper', LMap);
    }

    ui.addEventListenerTo('toggleSliderBtn', 'click', event => ui.slideToggleCp('controlPanelWrapper', LMap));

    socket.on('tweet', tweet => {
        Emitter.emit(Actions.MAP_LOADER_HIDE);

        let coordinates = tweet.place ? tweet.place.bounding_box.coordinates[0][1] : null;

        if (!streamStateButtonIsOn) {
            StopButtonL.addTo(LMap);
            $(StopButtonL.button).show();
            streamStateButtonIsOn = true;
        }

        if (coordinates) {
            const boundingBox = tweet.place.bounding_box;
            const polygonCenter = leaflet.computePolygonCenter(L, boundingBox);
            const coordinates = leaflet.transformLatLngToArray(polygonCenter);
            const user = tweet.user;
            const text = tweet.text;
            const id = tweet.id;
            const created_at = tweet.created_at;
            const mlsTime = tweet.timestamp_ms;
            const data = twitter.processSingle(tweet);

            console.log('Before processText: ', boundingBox);
            console.log('..Before processText polygonCenter: ', polygonCenter);
            console.log('...Before processText coordinates: ', coordinates);
            sentiment.processText({ text: text }).then(data => {
                data.geo = coordinates;
                data.tweet = tweet;

                console.log('After processText: ', boundingBox);
                console.log('..After processText polygonCenter: ', polygonCenter);
                console.log('...After processText coordinates: ', coordinates);

                const { sentiment } = data;

                let selectedChartData = DataProcessing.createSentimentDataForChart(data, 'multiple');

                sentimentQueue.enqueue(selectedChartData);

                // we are interested in tweets that have emotions for word cloud
                if (sentiment.value.totalScore !== 0) {
                    const [words, polarities] = [
                        R.concat(
                            getParameter(sentiment, 'positiveWords', 'text'),
                            getParameter(sentiment, 'negativeWords', 'text')
                        ),
                        R.concat(
                            getParameter(sentiment, 'positiveWords', 'polarity'),
                            getParameter(sentiment, 'negativeWords', 'polarity')
                        )
                    ];

                    const wordPolarityMap = buildWordPolarityMap({
                        words,
                        polarities
                    });

                    wordcloudQueue.enqueue(wordPolarityMap);
                }

                // if(sentimentQueue.size() === 5) {
                let posList = sentimentQueue.queue.map(sentimentObject => sentimentObject.positive),
                    negList = sentimentQueue.queue.map(sentimentObject => sentimentObject.negative),
                    totalList = sentimentQueue.queue.map(sentimentObject => sentimentObject.total),
                    dateList = sentimentQueue.queue.map(sentimentObject => sentimentObject.date);

                // place x before all dates
                posList.unshift('positive');
                negList.unshift('negative');
                totalList.unshift('total');
                dateList.unshift('x');

                sentimentChart.load({
                    columns: [dateList, posList, negList, totalList]
                });

                if (sentimentQueue.size() === 5) {
                    sentimentQueue.dequeue();
                }

                const renderObject = {
                    data,
                    type: 'twitter'
                };

                MapOps.renderObject(renderObject);
            });
        } else {
            // console.log('Passed tweet with no coordinates', tweet);
            return new Error('Passed tweet with no coordinates', tweet);
        }
    });

    function getInfoBasedOnChosenMode(mode, query, locations, twitData) {
        switch (mode) {
            case 'real_time':
                twitter.socketEmit(socket, 'topic', {
                    topic: query,
                    locations
                });
                break;
            case 'specified_time':
                twitter
                    .getData(Paths.getTwitData(), twitData)
                    .then(data => console.log(data))
                    .catch(err => new Error('err', err));
                break;
            default:
                console.log('none of the modes selected');
        }
    }

    ui.onSubmit('#querySearchForm', function(e) {
        e.preventDefault();
        Emitter.emit(Actions.MAP_LOADER_SHOW);

        const { searchBox } = GPlaceAutoCompleteCompL;
        const query = ui.getInputValue('#querySearch');

        let lastLocation, twitData;

        if (!R.isEmpty(searchBox.value)) {
            const { lat, lng } = LMap.getCenter();
            const twitData = {
                q: query,
                geocode: [lat, lng],
                radius: MAP_PARAMS.TWITTER.RADIUS
            };

            lastLocation = utils.getDefaultBoundingBox(lat, lng);
        }

        console.log('lastLocation', lastLocation);

        getInfoBasedOnChosenMode('real_time', query, lastLocation, twitData);
    });

    // generation
    // ui.generateCpRightPanel('#panelWrapper', {});

    Object.entries(WidgetModuleMap).forEach(([widgetID, widget]) => {
        WidgetChartsCollectionComp.addWidgetComponent(
            new WidgetComponent(widgetID, widget.name, WIDGET_PARAMS.ICON_SIZE, widget.action, widget.icon)
        );
    });

    WidgetChartsCollectionComp.init();
    const wordcloudWidget = WidgetChartsCollectionComp.getWidget('wordCloudWidget');

    // Testing area
    let testGeo = '-25.2744,-133.7751'; // Australia
    // console.log('Path:', Paths.getGeoTrends(testGeo));
    Request.getRequest(Paths.getGeoTrends(testGeo))
        .then(trends => {
            if (trends.data) {
                let listOfTrends = trends.data.trends;
                let geoData = trends.geo;

                $('#querySearch').easyAutocomplete({
                    data: listOfTrends,
                    getValue: 'name',
                    list: {
                        match: {
                            enabled: true
                        },
                        onShowListEvent: function() {
                            switch (storageSystem.getItem('cpOpen')) {
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
                        onKeyEnterEvent: function() {}
                    }
                    // template: {
                    //     type: "custom"
                    //     // method: function(value, item) {
                    //     //     return "<img src='" + item.icon + "' /> | " + item.type + " | " + value;
                    //     // }
                    // }
                });
            } else {
                console.log('no data', data);
            }

            let panelComp1 = new PanelComponent(
                '#topTen',
                'Top 10 Tweets',
                function() {
                    console.log('hi');
                },
                [{ name: 'daler' }, { name: 'michael' }]
            );
            let panelComp2 = new PanelComponent(
                '#topTwenty',
                'Top 10 Retweets',
                function() {
                    console.log('hi');
                },
                [{ lastname: 'asrorov' }, { lastname: 'jojo' }]
            );
            let panelComp3 = new PanelComponent(
                '#topThirty',
                'Top 30 Retweets',
                function() {
                    console.log('hi');
                },
                [{ jorge: 'quero' }, { sandro: 'bolo' }]
            );

            rightComponents.add(panelComp1);
            rightComponents.add(panelComp2);
            rightComponents.add(panelComp3);
            rightComponents.setName('Social Media');
            rightComponents.setId('socMedia');

            ui.appendDropDownToPanel('#panelCompRightWrapper', rightComponents);
        })
        .catch(err => {
            console.log('Error request', err);
        });

    const arrayOfIndexes = TWITTER_MODES.map((item, index) => index);
    const arrayOfLabels = TWITTER_MODES.map(mode => utils.titleCase(mode.split('_').join(' ')));
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
                switch (newMode) {
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
                        const lat = LMap.getCenter().lat;
                        const lng = LMap.getCenter().lng;
                        const twitData = {
                            q: query,
                            geocode: [lat, lng],
                            radius: '25mi'
                        };

                        twitter
                            .getData(Paths.getTwitData(), twitData)
                            .then(data => {
                                const { statuses, search_metadata } = data;
                                const filteredTweets = twitter.processData(statuses, search_metadata);

                                filteredTweets.forEach(function(data) {
                                    sentiment
                                        .processText({ text: data.text })
                                        .then(function(sentiment) {
                                            return new Promise((resolve, reject) =>
                                                resolve({
                                                    type: 'twitter',
                                                    sentiment,
                                                    data
                                                })
                                            );
                                        })
                                        .then(function(renderObject) {
                                            MapOps.renderObject(renderObject);
                                        });
                                });
                            })
                            .catch(err => console.log('getData() - ', err));

                        break;
                    default:
                        console.log('none selected');
                }
                console.log('Event: change. Slider object', slideEvt);
            }
        }
    });

    let contextMenu = ui.addContextMenuTo('#mapWrapper', '#mapContextMenu', 'mapContextMenuList', 'contextmenu');
    contextMenu.hide();
    contextMenu.bind();
    contextMenu.appendMenuItem('One', () => console.log('One'), 'click');
    contextMenu.appendMenuItem('Two', () => console.log('Two'), 'click');
    contextMenu.appendMenuItem('Three', () => console.log('Three'), 'click');
    contextMenu.addClassesToAllMenuItems('sup-li');

    // contextMenu.fadeOut();

    // Request.getRequest(Utils.getTrendsPlaces(lat, long))å
    //     .then((data) => {
    //         console.log("Trends Data");
    //     })

    // post request testing

    Emitter.on(WidgetStructs['wrodcloudStruct']['action'], data => {
        WidgetChartsCollectionComp.stopAnimation();
        wordcloudWidget.stopAnimation();
    });

    Emitter.on(Actions.MAP_LOADER_SHOW, data => {
        MapLoaderComp.show();
    });

    Emitter.on(Actions.MAP_LOADER_HIDE, data => {
        MapLoaderComp.hide();
    });

    // const tempYelpBusinessID = 'life-san-francisco';
    // YelpAPI.searchBusiness(tempYelpBusinessID).then(data => console.log('after then tempYelpBusinessID', data));

    // YelpAPI.searchBusinesses({
    //     term: 'shop',
    //     latitude: 37.773972,
    //     longitude: -122.431297
    // }).then(data => console.log('after then tempYelpBusinessID', data));

    /**
     * Map drawing features
     * 
    addFreeDrawLayerToMap();
    onFreeDrawMarkersPlaced(event => {
        console.log('event', event);
        console.log('latLngs', event.latLngs);
    });
    */
});
