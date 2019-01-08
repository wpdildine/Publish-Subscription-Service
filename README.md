## Subscription Service

Example of how to use:

```
var object = {};
    var Subscriber = new Subscription.Events();

    Subscriber.on("alert", function (msg) {

        alert("Triggered " + msg);

    });

    Subscriber.trigger("alert", "an event");

```

