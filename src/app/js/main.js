import Map from './map.js';
import * as ui from './ui.js';
import * as Request from './request.js';
import * as Paths from './paths.js';
import * as utils from './utils.js';
import StorageSystem from './storagesystem.js';

// Action
$(window).load(() => {
    const storageSystem = new StorageSystem(window.localStorage);
    let socket = io.connect('http://localhost:8000/');
    let cpOpen;

    console.log(storageSystem.getItem('firstVisit'));

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


    function getTweets(event) {
        // console.log(`Ready: ${event}`);
        socket.emit('topic', "trump");
    };

    $(`#toggleSliderBtn`).on('click', (event) => {
        console.log('CLICKED');
        ui.slideToggleCp('controlPanelWrapper', Map);
    });

    // let input = document.getElementById('pac-input')
    new L.Control.GPlaceAutocomplete({
        position: 'topright',
        callback: (location) => {
            // object of google place is given
            console.log('Location given:', location);
            Map.panTo(location);

        }
    }).addTo(Map);

    socket.on('tweet', (tweet) => {
        console.log('Tweet: ', tweet);
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
                        switch(storageSystem.getItem('cpOpen')) {
                            case 'false':
                               $('.easy-autocomplete-container').addClass('autocomplete-top');
                               break;
                            case 'true':
                               $('.easy-autocomplete-container').removeClass('autocomplete-top');
                               break;
                            default:
                               $('.easy-autocomplete-container').removeClass('autocomplete-top');
                        };
                    },
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
        const listOfActions = [
            {
                id: '#topTen',
                name: 'Top 10 Tweets'
            },
            {
                id: '#topTen',
                name: 'Top 10 Retweets'
            }
        ];
        ui.appendDropDownTo('#panelCompRightWrapper', 'Top', 'twitterTop', listOfActions);
        ui.appendDropDownTo('#panelCompRightWrapper', 'Not Top', 'yelpTop', listOfActions);


        console.log('$a', $a);
    })
    .catch((err) => {
        console.log("Error request", err);
    });

    // Request.getRequest(Utils.getTrendsPlaces(lat, long))
    //     .then((data) => {
    //         console.log("Trends Data");
    //     })
});



