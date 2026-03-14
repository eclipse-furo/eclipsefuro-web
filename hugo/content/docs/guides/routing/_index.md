---
weight: 7
title: "Routing"
bookCollapseSection: true 
---

# Routing
For applications which just have one view, routing is not needed. As soon you need multiple views, routing is needed. 

Even in a small *todo app* you will quickly have more than one view  (list, create, details,...). Having the possibility
to display only one of them at a time, is a nice feature.

> Routing is just the procedure to display a view based on some conditions. 
> The most known condition for routing, is the path URL of your app.
> *Another well known condition could also be a tab bar, this variant is mostly used
> to display different sub parts of a view/page.*

## Trivial example
Lets assume the following structure for a simple application:
```
todo-app
├── View List         //app.com/                     <view-list>
├── View Create       //app.com/create               <view-create>
└── View Details      //app.com/detail?tsk=999       <view-detail>     
```


## Building blocks
You need the following building blocks to implement the example:

| component                                                                | description                       |
|:-------------------------------------------------------------------------|:----------------------------------|
| [@furo/route/src/furo-location](/docs/modules/furo-route/furo-location/) | observes location and path
| [@furo/route/src/furo-pages](/docs/modules/furo-route/furo-pages/)       | can activate views based on the current location



## Implementation
[Furo FBP](https://fbp.furo.pro) syntax is used in this example.

```html
<furo-location
  @-location-changed="--pathChanged"></furo-location>

<furo-pages 
  ƒ-inject-location="--pathChanged" 
  default="list">
    <view-list name="list"></view-list>
    <view-create name="create"></view-create>
    <view-detail name="detail"></view-detail>
</furo-pages>
```

## Summary
Let's have a deeper look on the example from above.

- `furo-location` will emit a `location-changed` event, as soon something in the url of the page changes.
- The emitted location object will be passed to the `inject-location` method of the `furo-pages` component, which will then activate
  the component which have name attribute set to "detail".

### flowbased auto wires triggered from `furo-pages`
`furo-pages` provides a set of auto wires, which are automatically triggered in the child elements if
they support FBP. Each wire will forward a `locationObject`

-  `--pageActivated` : Is triggered when the element is activated.
-  `--pageDeActivated` : Is triggered when another page is activated. Empty wire.
-  `--pageQueryChanged` : Is triggered when the page query changes.
-  `--pageHashChanged` : Is triggered when the page hash changes.
-  `--pageReActivated` : Is triggered when the locatioin contains the same page which already was activated.

### locationObject
```json
{
    "host": "localhost:8480",
    "query": {"tsk": 999},
    "hash": {},
    "path": "/detail",
    "pathSegments": [
        "detail"
    ],
    "hashstring": "",
    "querystring": "tsk=999"
}
```
