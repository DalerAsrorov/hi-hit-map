import Mode from './mode.js';
import * as Request from '../modules/request.js'

export default class Twitter extends Mode {
    constructor(name) {
        super(name);
    }

    turnOnSocket(socket, channel, params) {
        socket.emit(channel, params);
    }

    getData(url, twitData) {
        // url = Paths.getTwitData()
        return new Promise((res, rej) => {
            Request.postRequest(url, twitData)
            .then((data) => {
                res(data);
            })
            .catch((err) => {
                rej(err);
            });
        });
    }
}