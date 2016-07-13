'use strict';

let findOwner = require('./findOwner');

module.exports = (factory) => {};

let proxyAddEventListener = (factory, data) => {
    factory = factory || document;
    let addEvtOwner = findOwner(factory, 'addEventListener');

    let old = addEvtOwner.addEventListener;

    addEvtOwner.addEventListener = function (type, listener, useCapture) {
        // Multiple identical event listeners
        if(data.has(this, type, listener, useCapture)) {
            return;
        }
        let proxyHandler = function () {
            listener.apply(this, arguments);
        };
        // save event register data
        data.set({
            node: this,
            type,
            listener,
            useCapture
        }, proxyHandler);
        old.apply(this, [type, proxyHandler, useCapture]);
    };
};

