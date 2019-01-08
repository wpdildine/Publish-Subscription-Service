namespace Subscription
{
    /**
     * I can be subscribed to
     */
    export class Events
    {
        private _events: any;

        public on(name?: any, callback?: any, context?: any): any
        {
            return this.internalOn(this, name, callback, context);
        }

        public trigger(name: any, object: any, self: any): Events
        {
            if (!this._events)
            {
                return this;
            }

            let length: number = Math.max(0, arguments.length - 1);

            let args = Array(length);

            for (let i = 0; i < length; ++i)
            {
                args[i] = arguments[i + 1];
            }

            this.eventsApi(this.triggerApi.bind(this), this._events, name, undefined, args);

            return this;
        }

        public internalOn(obj?: any, name?: any, callback?: any, context?: any, listening?: any): any
        {
            obj._events = this.eventsApi(this.onApi.bind(this), obj._events || {}, name, callback, {
                context: context,
                ctx: obj,
                listening: listening
            });
            if (listening) {
                let listeners = obj._listeners || (obj._listeners = {});
                listeners[listening.id] = listening;
            }
            return obj;
        }

        /**
         *
         * @param objEvents
         * @param name
         * @param callback
         * @param args
         */
        public triggerApi(objEvents: any, name?: any, callback?: any, args?: any): void
        {
            if (!objEvents)
            {
                return;
            }

            let events = objEvents[name];
            let allEvents = objEvents.all;

            if (events && allEvents)
            {
                allEvents = allEvents.slice();
            }

            if (events)
            {
                this.triggerEvents(events, args);
            }

            if (allEvents) {
                this.triggerEvents(allEvents, [name].concat(args));
            }
        }

        public triggerEvents(events, args): void

        {
            let ev, i = -1;
            let l = events.length;
            let a1 = args[0];
            let a2 = args[1];
            let a3 = args[2];
            switch (args.length) {
                case 0:
                    while (++i < l) {
                        (ev = events[i]).callback.call(ev.ctx);
                    }
                    return;
                case 1:
                    while
                        (++i < l) {
                        (ev = events[i]).callback.call(ev.ctx, a1);
                    }
                    return;
                case 2:
                    while (++i < l) {
                        (ev = events[i]).callback.call(ev.ctx, a1, a2)
                    }
                    return;
                case 3:
                    while (++i < l) {
                        (ev = events[i]).callback.call(ev.ctx, a1, a2, a3)
                    }
                    return;
                default:
                    while (++i < l) {
                        (ev = events[i]).callback.apply(ev.ctx, args)
                    }
                    return;

            }
        }

        public onApi(events?: any, name?: any, callback?: any, options?: any): any
        {
            if (callback)
            {
                let handlers = events[name] || (events[name] = []);
                let context = options.context
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
        }

        public eventsApi(iteratee?: any, events?: any, name?: any, callback?: any, opts?: any, self?: any): any
        {
            let i = 0;
            let names;
            let eventSplitter = /\s+/;


            if (name && typeof name === 'object')
            {
                if (callback !== undefined && 'context' in opts && opts.context === undefined)
                {
                    opts.context = callback;
                }
                for (names = Object.keys(name); i < names.length; i++) {
                    events = this.eventsApi(iteratee, events, names[i], name[names[i], opts], this);
                }

            }
            else if (name && eventSplitter.test(name))
            {

                for (names = name.split(eventSplitter); i < names.length; i++)
                {
                    events = iteratee(events, names[i], callback, opts)
                }
            }
            else {
                iteratee(events, name, callback, opts);
            }
            return events;

        }
    }

}
