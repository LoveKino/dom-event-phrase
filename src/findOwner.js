'use strict';

/**
 * find attribute owner through the prototype chain
 */

module.exports = (obj, attributeName) => {
    // TODO check type
    let proto = obj;
    while (proto) {
        if (hasOwnProperty(proto, attributeName)) {
            return proto;
        }
        proto = getPrototype(proto);
    }
};

let hasOwnProperty = (obj, name) => {
    if (Object.hasOwnProperty) {
        return Object.hasOwnProperty(obj, name);
    } else {
        for (var key in obj) {
            if (key === name) return true;
        }
    }
    return false;
};

let getPrototype = (obj) => {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(obj);
    }
    return obj.__proto__;
};
