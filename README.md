### Javascript event store

This is a simple cli tool to allow storing of arbitrary events in a json file.

To install:

> npm install js-event-store-cli -g

Then you can record events from any folder:

> record-event hello world

> record-event something:42 somethingelse:21 someArray:2:3:5:8 someString:aValue

A db.json file will be created in the executing folder if it does not yet exist.
This is the local database used to store and retrieve events.

It is also possible to undo the last event

> undo-last-event

You can now also view events from the event editor. This will fire up the browser app and allow you to explore the applicable db.json using filter/map/reduce

> event-editor

It is also possible to do some simple filtering operations. This is a work in progress.

All events where a property exists:

>filter-events someProperty

All events where the property equals the specified value

>filter-events something=42

>filter-events somethingelse=true



