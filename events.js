var Subscription;
(function (Subscription) {
    /**
     * I can be subscribed to
     */
    var Events = (function () {
        function Events() {
        }
        Events.prototype.on = function (name, callback, context) {
            return this.internalOn(this, name, callback, context);
        };
        Events.prototype.trigger = function (name, object, self) {
            if (!this._events) {
                return this;
            }
            var length = Math.max(0, arguments.length - 1);
            var args = Array(length);
            for (var i = 0; i < length; ++i) {
                args[i] = arguments[i + 1];
            }
            this.eventsApi(this.triggerApi.bind(this), this._events, name, undefined, args);
            return this;
        };
        Events.prototype.internalOn = function (obj, name, callback, context, listening) {
            obj._events = this.eventsApi(this.onApi.bind(this), obj._events || {}, name, callback, {
                context: context,
                ctx: obj,
                listening: listening
            });
            if (listening) {
                var listeners = obj._listeners || (obj._listeners = {});
                listeners[listening.id] = listening;
            }
            return obj;
        };
        /**
         *
         * @param objEvents
         * @param name
         * @param callback
         * @param args
         */
        Events.prototype.triggerApi = function (objEvents, name, callback, args) {
            if (!objEvents) {
                return;
            }
            var events = objEvents[name];
            var allEvents = objEvents.all;
            if (events && allEvents) {
                allEvents = allEvents.slice();
            }
            if (events) {
                this.triggerEvents(events, args);
            }
            if (allEvents) {
                this.triggerEvents(allEvents, [name].concat(args));
            }
        };
        Events.prototype.triggerEvents = function (events, args) {
            var ev, i = -1;
            var l = events.length;
            var a1 = args[0];
            var a2 = args[1];
            var a3 = args[2];
            switch (args.length) {
                case 0:
                    while (++i < l) {
                        (ev = events[i]).callback.call(ev.ctx);
                    }
                    return;
                case 1:
                    while (++i < l) {
                        (ev = events[i]).callback.call(ev.ctx, a1);
                    }
                    return;
                case 2:
                    while (++i < l) {
                        (ev = events[i]).callback.call(ev.ctx, a1, a2);
                    }
                    return;
                case 3:
                    while (++i < l) {
                        (ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
                    }
                    return;
                default:
                    while (++i < l) {
                        (ev = events[i]).callback.apply(ev.ctx, args);
                    }
                    return;
            }
        };
        Events.prototype.onApi = function (events, name, callback, options) {
            if (callback) {
                var handlers = events[name] || (events[name] = []);
                var context = options.context, ctx = options.ctx, listening = options.listening;
                if (listening)
                    listening.count++;
                handlers.push({
                    callback: callback,
                    context: context,
                    ctx: context || ctx,
                    listening: listening
                });
            }
            return events;
        };
        Events.prototype.eventsApi = function (iteratee, events, name, callback, opts, self) {
            var i = 0;
            var names;
            var eventSplitter = /\s+/;
            if (name && typeof name === 'object') {
                if (callback !== undefined && 'context' in opts && opts.context === undefined) {
                    opts.context = callback;
                }
                for (names = Object.keys(name); i < names.length; i++) {
                    events = this.eventsApi(iteratee, events, names[i], name[names[i], opts], this);
                }
            }
            else if (name && eventSplitter.test(name)) {
                for (names = name.split(eventSplitter); i < names.length; i++) {
                    events = iteratee(events, names[i], callback, opts);
                }
            }
            else {
                iteratee(events, name, callback, opts);
            }
            return events;
        };
        return Events;
    }());
    Subscription.Events = Events;
})(Subscription || (Subscription = {}));
//# sourceMappingURL=events.js.map