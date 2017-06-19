import Map from './map.js';
import { IMAGES } from './constants.js';
import * as MapElements from './mapelements.js';
import Leaflet from '../classes/leaflet.js';
import ShowboxTwitterComponent from '../components/showbox-twitter-component.js';
import {curry, map, pipe, __} from 'ramda';

// export function generateResults(data) {
//     console.log('Data', data);
// }

// export function animateTransition(data) {
//     console.log("")
// }

export const generateResults = curry(data => {
    pipe(
        map(drawObject), // render points with animations
    )(data);
});

export const renderObject = function(renderObject) {
    const data = renderObject.data;
    const type = renderObject.type;
    const geolocation = renderObject.data.geo;

    drawObject(data, geolocation, type);
}

export const drawObject = curry((data, geolocation, iconType) => {
    let icon, latlng, popup;

    let showboxComp;

    switch(iconType) {
        case 'twitter':
            showboxComp = new ShowboxTwitterComponent('', '', 'div', '', data);
            console.log('data, geo, icon:', data, geolocation, iconType);
            console.log(showboxComp);

            // bindPopup( <String> html | <HTMLElement> el | <Popup> popup, <Popup options> options? )

            icon = MapElements.createIcon(IMAGES.SOC_MEDIA_ICONS.TWITTER);
            latlng = L.latLng(geolocation[1], geolocation[0]);

            const leaflet = new Leaflet();
            popup = leaflet.createPopup(
                latlng,
                '<p>Hello world!<br />This is a nice popup.</p>',
                {
                    minWidth: 300,
                    autoPanPadding: L.point(10, 10)
                }
            );

            L.marker([geolocation[1], geolocation[0]], {
                icon: icon,
                title: 'Tweet',
                alt: `Tweet in (${geolocation[1]}, ${geolocation[0]})`,
                riseOnHover: true
            })
            .bindPopup(popup)
            .openPopup()
            .addTo(Map);

            break;
        case 'yelp':
            console.log('Yelp data, geo, icon', data, geolocation, iconType);
            break;
        default:
            console.log('No soc media was selected.');
    };
});
