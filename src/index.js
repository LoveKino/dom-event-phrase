'use strict';

/**
 *
 * truth:
 *
 * 1. if e.preventDefault() was called before event finished, no new window will open
 *
 * 2. e is the same e, from capture to target to bubble
 *
 * 3. last bind handle will execute later
 *
 * 4. when call stop, you can not stop the stop
 *
 *
 * capture -> target -> bubble (could be canceled at any moment)
 *
 * start: (e) => {phase, finished}
 *
 *
 * TODO new thought: intercept all handlers, for precise event phase
 */

module.exports = (type, opts = {}) => {
    let start = opts.start || noop;

    // capture
    document.addEventListener(type, (e) => {
        // this is the start moment for UI event
        let {
            phase, finished
        } = start(e) || {};

        if (!phase && !finished) return;

        phase = phase || noop;
        finished = finished || noop;
        //
        let target = e.target;

        // first point
        phase(e, {
            node: target,
            type,
            'phase': 'capture'
        });

        // proxy stopPropagation
        proxyStop(e);

        let {
            reportPhase
        } = handlers(type, phase);

        // target phase
        targetPhase(target, type, reportPhase);

        // capture and bubble phase
        captureNBubble(target, type, reportPhase);

        // finished, if not cancel bubbles
        once(document, type, (e) => {
            finished(e, {
                node: document,
                type
            });
        });
    }, true);
};

let targetPhase = (target, type, reportPhase) => {
    // target
    once(target, type, reportPhase(target, 'target'));
};

let captureNBubble = (target, type, reportPhase) => {
    let parent = target.parentNode;

    while (parent) {
        once(parent, type, reportPhase(parent, 'capture'), true); // capture
        once(parent, type, reportPhase(parent, 'bubble')); // bubble
        parent = parent.parentNode;
    }
};

let noop = () => {};

let handlers = (type, phase) => {
    let handlerList = [];
    let reportPhase = (e) => {
        // assume that this handler is the last one
        let handle = (node, phaseValue) => {
            // call phase callback
            phase(e, {
                node,
                type,
                'phase': phaseValue
            });
        };
        handlerList.push(handle);
        return handle;
    };

    return {
        reportPhase
    };
};

const unique = {};

let proxyStop = (e) => {
    let oldStopPro = e.stopPropagation;
    // prevent repeated
    if (oldStopPro.unique === unique) {
        return e;
    }

    let stopPropagation = function () {
        oldStopPro.call(e);
        // finish event
        // TODO 1. find node
        
        let node = e.currentTarget;      

        // 2. find node's last handler
        // 3. after last one, call finished handler
    };

    stopPropagation.unique = unique;
    e.stopPropagation = stopPropagation;
    return e;
};

let once = (node, type, handler, doCapture) => {
    // TODO check type
    let dynamic = (e) => {
        let ret = handler.apply(node, [e]);
        node.removeEventListener(type, dynamic);
        return ret;
    };
    node.addEventListener(type, dynamic, doCapture);
};
