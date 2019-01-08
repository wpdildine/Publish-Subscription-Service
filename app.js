var Backbone = window.Backbone || {};
var Events = Backbone.Events = {};
// Bind an event to a `callback` function. Passing `"all"` will bind
// the callback to all events fired.
var eventSplitter = /\s+/;
// Iterates over the standard `event, callback` (as well as the fancy multiple
// space-separated events `"change blur", callback` and jQuery-style event
// maps `{event: callback}`).
var eventsApi = function (iteratee, events, name, callback, opts) {
    var i = 0
        , names;
    if (name && typeof name === 'object') {
        // Handle event maps.
        if (callback !== void 0 && 'context' in opts && opts.context === void 0) opts.context = callback;
        for (names = _.keys(name); i < names.length; i++) {
            console.log(names);

            events = eventsApi(iteratee, events, names[i], name[names[i]], opts);
        }
    }
    else if (name && eventSplitter.test(name)) {
        // Handle space-separated event names by delegating them individually.
        for (names = name.split(eventSplitter); i < names.length; i++) {
            events = iteratee(events, names[i], callback, opts);
        }
    }
    else {
        // Finally, standard events.
        events = iteratee(events, name, callback, opts);
    }
    return events;
};
Events.on = function (name, callback, context) {
    return internalOn(this, name, callback, context);
};
// Guard the `listening` argument from the public API.
var internalOn = function (obj, name, callback, context, listening) {
    obj._events = eventsApi(onApi, obj._events || {}, name, callback, {
        context: context
        , ctx: obj
        , listening: listening
    });
    if (listening) {
        var listeners = obj._listeners || (obj._listeners = {});
        listeners[listening.id] = listening;
    }
    return obj;
};
Events.trigger = function (name) {
    if (!this._events) return this;
    var length = Math.max(0, arguments.length - 1);
    var args = Array(length);
    for (var i = 0; i < length; i++) args[i] = arguments[i + 1];
    eventsApi(triggerApi, this._events, name, void 0, args);
    return this;
};
// Handles triggering the appropriate event callbacks.
var triggerApi = function (objEvents, name, callback, args) {
    if (objEvents) {
        var events = objEvents[name];
        var allEvents = objEvents.all;
        if (events && allEvents) allEvents = allEvents.slice();
        if (events) triggerEvents(events, args);
        if (allEvents) triggerEvents(allEvents, [name].concat(args));
    }
    return objEvents;
};
// A difficult-to-believe, but optimized internal dispatch function for
// triggering events. Tries to keep the usual cases speedy (most internal
// Backbone events have 3 arguments).
var triggerEvents = function (events, args) {
    var ev, i = -1
        , l = events.length
        , a1 = args[0]
        , a2 = args[1]
        , a3 = args[2];
    switch (args.length) {
    case 0:
        while (++i < l)(ev = events[i]).callback.call(ev.ctx);
        return;
    case 1:
        while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1);
        return;
    case 2:
        while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1, a2);
        return;
    case 3:
        while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
        return;
    default:
        while (++i < l)(ev = events[i]).callback.apply(ev.ctx, args);
        return;
    }
};
// The reducing API that adds a callback to the `events` object.
var onApi = function (events, name, callback, options) {
    if (callback) {
        var handlers = events[name] || (events[name] = []);
        var context = options.context
            , ctx = options.ctx
            , listening = options.listening;
        if (listening) listening.count++;
        handlers.push({
            callback: callback
            , context: context
            , ctx: context || ctx
            , listening: listening
        });
    }
    return events;
};