"use strict";(function(){const t={cache:!0};t.doc={id:"id",field:["title","content"],store:["title","href","section"]};const e=FlexSearch.create("balance",t);window.bookSearchIndex=e,e.add({id:0,href:"/docs/guides/dealing-w-data/",title:"Dealing with data",section:"Guides",content:` Dealing with data # Overview # flowchart LR I1(Input Component) -. data binding --- DO(Data Object); I2(Custom Component) -. data binding --- DO(Data Object); DO -- set data --> A(Entity Agent); A -- updates --> DO; A <-- fetch / update --> API[(Rest API)]; SB(Save Button) -- triggers --> A LB(Load Button) -- triggers --> A Data Object # The furo-data-object translates raw JSON to objects which are usable for the UI components and vice versa.
flowchart LR I1(Input Component) -. data binding --- DO(Data Object); I2(Custom Component) -. data binding --- DO(Data Object); DO -- produces --> JSON JSON -- consumes --> DO 1 2 3 4 5 6 7 8 &lt;furo-ui5-text-input ƒ-bind-data=&#34;--taskDO(*.fields.display_name)&#34;&gt;&lt;/furo-ui5-text-input&gt; &lt;furo-data-object type=&#34;task.Task&#34; ƒ-inject-raw=&#34;--rawJsonData&#34; @-object-ready=&#34;--taskDO&#34;&gt;&lt;/furo-data-object&gt; Entity Agent # The main task of the furo-entity-agent is to communicating with REST API&rsquo;s.
It exposes a simple API for saving, loading, creating and deleting stuff on the server side.
flowchart LR DO(Data Object) -- object --> A(Entity Agent); A -- json --> DO; A -- json --> API[(Rest API)]; API -- json --> A 1 2 3 4 5 6 7 8 9 10 11 12 &lt;furo-data-object type=&#34;task.Task&#34; ƒ-inject-raw=&#34;--rawJsonData&#34; @-object-ready=&#34;--taskDO&#34;&gt; &lt;/furo-data-object&gt; &lt;furo-entity-agent service=&#34;TaskService&#34; ƒ-create=&#34;--createClicked&#34; ƒ-hts-in=&#34;--hts&#34; ƒ-bind-request-object=&#34;--taskDO&#34; @-response=&#34;--rawJsonData&#34;&gt;&lt;/furo-entity-agent&gt; Hateoas # furo-deep-link builds static HATEOAS information based on query params and service-type.
The HATEOAS data is used by the furo-entity-agent to resolve the locations it has to send the requests to.
flowchart LR DL(Deep Link) -- HATEOAS --> A(Entity Agent); QP[Query Params] -- json --> DL 1 2 3 4 5 6 7 8 &lt;furo-deep-link ƒ-qp-in=&#34;--pageURLChanged(*.query)&#34; service=&#34;TaskService&#34; @-hts-out=&#34;--hts&#34;&gt;&lt;/furo-deep-link&gt; &lt;furo-location @-location-changed=&#39;--pageURLChanged&#39; &gt;&lt;/furo-location&gt; Assume we visit a link like my.app.com/display_task?tsk=5
furo-deep-link receives the query params {&quot;tsk&quot;: &quot;5&quot;} from furo-location.
It will then produce the HATEOAS links according to the specified service.
1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 [ { &#34;rel&#34;: &#34;self&#34;, &#34;href&#34;: &#34;/api/v1/tasks/5&#34;, &#34;method&#34;: &#34;GET&#34;, &#34;type&#34;: &#34;task.Task&#34;, &#34;service&#34;: &#34;TaskService&#34; }, { &#34;rel&#34;: &#34;delete&#34;, &#34;href&#34;: &#34;/api/v1/tasks/5&#34;, &#34;method&#34;: &#34;DELETE&#34;, &#34;type&#34;: &#34;task.Task&#34;, &#34;service&#34;: &#34;TaskService&#34; }, { &#34;rel&#34;: &#34;create&#34;, &#34;href&#34;: &#34;/api/v1/tasks&#34;, &#34;method&#34;: &#34;POST&#34;, &#34;type&#34;: &#34;task.Task&#34;, &#34;service&#34;: &#34;TaskService&#34; } ] `}),e.add({id:1,href:"/docs/guides/routing/",title:"Routing",section:"Guides",content:` Routing # For applications which just have one view, routing is not needed. As soon you need multiple views, routing is needed.
Even in a small todo app you will quickly have more than one view (list, create, details,&hellip;). Having the possibility to display only one of them at a time, is a nice feature.
Routing is just the procedure to display a view based on some conditions. The most known condition for routing, is the path URL of your app. Another well known condition could also be a tab bar, this variant is mostly used to display different sub parts of a view/page.
Trivial example # Lets assume the following structure for a simple application:
todo-app ├── View List //app.com/ &lt;view-list&gt; ├── View Create //app.com/create &lt;view-create&gt; └── View Details //app.com/detail?tsk=999 &lt;view-detail&gt; Building blocks # You need the following building blocks to implement the example:
component description @furo/route/src/furo-location observes location and path @furo/route/src/furo-pages can activate views based on the current location Implementation # Furo FBP syntax is used in this example.
1 2 3 4 5 6 7 8 9 10 &lt;furo-location @-location-changed=&#34;--pathChanged&#34;&gt;&lt;/furo-location&gt; &lt;furo-pages ƒ-inject-location=&#34;--pathChanged&#34; default=&#34;list&#34;&gt; &lt;view-list name=&#34;list&#34;&gt;&lt;/view-list&gt; &lt;view-create name=&#34;create&#34;&gt;&lt;/view-create&gt; &lt;view-detail name=&#34;detail&#34;&gt;&lt;/view-detail&gt; &lt;/furo-pages&gt; Summary # Let&rsquo;s have a deeper look on the example from above.
furo-location will emit a location-changed event, as soon something in the url of the page changes. The emitted location object will be passed to the inject-location method of the furo-pages component, which will then activate the component which have name attribute set to &ldquo;detail&rdquo;. flowbased auto wires triggered from furo-pages # furo-pages provides a set of auto wires, which are automatically triggered in the child elements if they support FBP. Each wire will forward a locationObject
--pageActivated : Is triggered when the element is activated. --pageDeActivated : Is triggered when another page is activated. Empty wire. --pageQueryChanged : Is triggered when the page query changes. --pageHashChanged : Is triggered when the page hash changes. --pageReActivated : Is triggered when the locatioin contains the same page which already was activated. locationObject # 1 2 3 4 5 6 7 8 9 10 11 { &#34;host&#34;: &#34;localhost:8480&#34;, &#34;query&#34;: {&#34;tsk&#34;: 999}, &#34;hash&#34;: {}, &#34;path&#34;: &#34;/detail&#34;, &#34;pathSegments&#34;: [ &#34;detail&#34; ], &#34;hashstring&#34;: &#34;&#34;, &#34;querystring&#34;: &#34;tsk=999&#34; } `}),e.add({id:2,href:"/docs/guides/routing/subrouting/",title:"Sub routing",section:"Routing",content:` Sub Routing # For applications which just have one view, routing is not needed. As soon you need multiple views, routing is needed.
Even in a small todo app you will quickly have more than one view (list, create, details,&hellip;). Having the possibility to display only one of them at a time, is a nice feature.
Routing is just the procedure to display a view based on some conditions. The most known condition for routing, is the path URL of your app. Another well known condition could also be a tab bar, this variant is mostly used to display different sub parts of a view/page.
Example # Lets assume the following structure for a simple application:
todo-app ├── View List //app.com/ &lt;view-list&gt; ├── View Create //app.com/create &lt;view-create&gt; └── View Details //app.com/detail?tsk=999 &lt;view-detail&gt; ├── Tab what //app.com/detail/what?tsk=999 ├── Tab when //app.com/detail/when?tsk=999 └── Tab who //app.com/detail/who?tsk=999 Building blocks # You need the following building blocks to implement the example:
component description @furo/route/src/furo-location observes location and path @furo/route/src/furo-pages can activate views based on the current location Implementation # app-shell
1 2 3 4 5 6 7 8 9 10 &lt;furo-location @-location-changed=&#34;--pathChanged&#34;&gt;&lt;/furo-location&gt; &lt;furo-pages ƒ-inject-location=&#34;--pathChanged&#34; default=&#34;list&#34;&gt; &lt;view-list name=&#34;list&#34;&gt;&lt;/view-list&gt; &lt;view-create name=&#34;create&#34;&gt;&lt;/view-create&gt; &lt;view-detail name=&#34;detail&#34;&gt;&lt;/view-detail&gt; &lt;/furo-pages&gt; view-detail
1 2 3 4 5 6 7 8 9 10 11 12 &lt;h1&gt;Title&lt;/h1&gt; &lt;furo-pages ƒ-inject-location=&#34;--pathChanged&#34; default=&#34;when&#34;&gt; &lt;panel-detail-what name=&#34;what&#34;&gt;&lt;/panel-detail-what&gt; &lt;panel-detail-when name=&#34;when&#34;&gt;&lt;/panel-detail-when&gt; &lt;panel-detail-who name=&#34;who&#34;&gt;&lt;/panel-detail-who&gt; &lt;/furo-pages&gt; &lt;furo-location url-space-regex=&#34;^/detail&#34; @-location-changed=&#34;--pathChanged&#34;&gt;&lt;/furo-location&gt; Summary # The furo-location component in view-detail will only listen to URLs that begins with &ldquo;/details&rdquo; because the attribute url-space-regex=&quot;^/detail&quot; is set.
`}),e.add({id:3,href:"/docs/guides/",title:"Guides",section:"Docs",content:" Getting started # If you need a detailed getting started guide and examples, visit this guide.\nInitializing process # To be able to use the components from furo-data, you have to set up the environment and register the types and services.\nMinimal Environment # 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 // -- initialize application env, api import {Init, Env} from &#34;@furo/framework/src/furo.js&#34; // The services and types must be registered in the Env: import {Services, Types} from &#34;data-environment.js&#34;; // this is the file which was generated by `furo genEsModule`. /** * register the available types and services * This is needed if you want to work with @furo/data/* and components with bind-data support. */ Init.registerApiServices(Services); Init.registerApiTypes(Types); /** * [Optional] * Register the API prefix based on the APPROOT. * This information is used for furo-deep-link and furo-reverse-deep-link to resolve the api address. */ Env.api.prefix = `/api`; // apply the prefix Init.applyCustomApiPrefixToServicesAndTypes(Env.api.prefix); example of an init file\n"}),e.add({id:4,href:"/docs/guides/app-flow/",title:"Application Flow",section:"Guides",content:` Application flow / Event driven routing # For this kind of routing you need the following building blocks:
component description @furo/route/src/furo-app-flow-router app flow manager @furo/route/src/furo-app-flow emits app flow events @furo/config/src/furo-config-loader can load config files flowConfig.json flow config definition file 1 2 3 4 5 6 7 8 &lt;!-- main-app --&gt; &lt;furo-config-loader src=&#34;custom/flowConfig.json&#34; section=&#34;flow&#34; @-config-loaded=&#34;--flowConfigLoaded&#34;&gt;&lt;/furo-config-loader&gt; &lt;furo-app-flow-router ƒ-.config=&#34;--flowConfigLoaded&#34; ƒ-trigger=&#34;--flowEvent&#34;&gt;&lt;/furo-app-flow-router&gt; &lt;!-- somewhere inside e.g. view, page --&gt; &lt;furo-app-flow ƒ-emit=&#34;--actionWire&#34; event=&#34;actionSaved&#34;&gt;&lt;/furo-app-flow&gt; flowConfig configuration # /** *Configuration Array * * | current | flow-event-name | target | [mapping] | noHistory | * |:----------|:---------------------|:------------|:-------------------|:-------------------| * | view-main | form-complete | detail-view | element =&gt; aufgabe | flag | * | * | menu-settings-click | settings | | | * * * * [[&#39;view-main&#39;, &#39;button-tap&#39;, &#39;detail-view&#39;, &#39;task =&gt; id]] * if current is set to view-main and the app-flow-event with name &#39;button-tap&#39; * is triggered, current is set to detail-view and data.task from app-flow is mapped to data.id. * * Special configurations: * * if target is set to HISTORY-BACK the app-flow-event will * allways set the current to the lastCurrent * * [[&#39;view-detail&#39;, &#39;button-tap&#39;, &#39;HISTORY-BACK&#39;, &#39;task =&gt; id]] will route you back to view-main * * You can set a wildcard for &#34;current&#34;. If you check the example: menu-settings-click can be triggered * from any current. If there is a &#34;current&#34; with menu-settings-click configured and you are * there, the wildcard is not used. * * Set noHistory if there &#34;current&#34; view should not be listed under _lastCurrents. * This is used to exclude pages from the back navigation. */ Example file # 1 2 3 4 [ [&#34;*&#34;, &#34;unauthorized&#34;, &#34;auth&#34;], [&#34;overview&#34;, &#34;actionSaved&#34;, &#34;detailview&#34;] ] `}),e.add({id:5,href:"/docs/guides/FNA/",title:"Extending a UI lib",section:"Guides",content:` How to make your own UI components bindable # There are several ways to make your component bindable.
Variant 1 DIY # You can create a bind-data method by yourself and apply the listeners and watchers on the FieldNode or the RepeaterNode, depending on what your component will consume.
This can be quite complex, but will give you the greatest flexibility.
Take a look at the furo-ui5-bool-icon, which is a very small example to handle the binding by yourself.
Variant 2: Use the FieldNodeAdapter # The easiest and most convenient way to make your component bindable is to extend the component with the FieldNodeAdapter. It will give you some callback methods to overwrite and does the heavy lifting for you.
Take a look at the furo-ui5-text-input , which is a full-fledged example which uses nearly everything from the FNA.
Minimal example # The smallest variant to achieve a usable binding will need the method _setFnaFieldValue and the callback onFnaFieldValueChanged.
onFnaFieldValueChanged({JSON}) Will give you the value as JSON literal, you do not need to handle the FieldNode attributes.
setFnaFieldValue({JSON}) Let you update the FieldNode by simply passing in a JSON literal.
1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 import { FieldNodeAdapter } from &#39;@furo/data/src/lib/FieldNodeAdapter.js&#39;; export class SampleInput extends FBP(FieldNodeAdapter(LitElement)) { constructor() { super() this.addEventListener(&#34;change&#34;, (e) =&gt; { // update the FieldNode this.setFnaFieldValue(e.data); }) } // receive updates from FieldNode onFnaFieldValueChanged(val) { this.value = val } } Methods, Attrs and Callbacks # There are some more attributes, methods and callbacks that you receive from the FieldNodeAdapter.
var __fieldNode # This is a reference for the adapter and contains the FieldNode.
Method getDataType() # Returns the type name of the bounded fieldNode
@return string Typename
Method isFat() # Check if bounded type is a fat type
@return boolean
Method isWrapper() # Check if bounded type is a wrapper type
@return boolean
Method bindData(fieldNode) # Binds a fieldNode. Make sure the type of your field is accepted by the implemented component.
@param fieldNode {FieldNode|RepeaterNode} - FieldNode or RepeaterNode
Method setFnaFieldValue(value) # Sets the value on the fieldNode. When you set the value, the changes you made will not trigger the onFnaFieldValueChanged of the current component (no loop backs).
@param value {JSON} - the raw json value for the fieldNode.
callback onFnaFieldValueChanged(value) # Notifies a field value change event. This event is debounced with 1ms, if you have bound a complex type, only one change event will be triggered (this is what you want). If you need all change events or more control for your component, use the listener on the fieldNode itself.
@param value - the raw json value for the fieldNode.
callback onFnaConstraintsChanged(constraints) # Notifies changes on the constraints.
returns an object like:
1 2 3 4 5 6 { &#34;min&#34;: { is: 33, message: &#34;must be bigger&#34; } } 1 2 3 4 5 6 7 8 9 10 // example callback onFnaConstraintsChanged(constraints) { if (constraints.min !== undefined) { this._constraintsFromFNA.min = constraints.min; if (this._privilegedAttributes.min === null &amp;&amp; this._attributesFromFAT.min === undefined) { this.min = constraints.min.is; } } } callback onFnaOptionsChanged(options) # Notifies when the options for the field is changed or set.
@param options Object - options object
onFnaReadonlyChanged(readonly) # Notifies when the readonly flag for the field is changed or set.
@param readonly bool - readonly state
callback onFnaHintChanged(hint) # Notifies when the hint for the field is changed or set.
@param hint - text for the hint
callback onFnaLabelChanged(label) # Notifies when the label for the field is changed or set.
@param label string - text for the label
onFnaPlaceholderChanged(placeholder) # Notifies when the placeholder for the field is changed or set.
@param placeholder string - text for the placeholder
callback onFnaFieldNodeBecameInvalid(validity) # Notifies that a field gets invalid.
@param validity - Object like {constraint: &ldquo;min&rdquo;, description: &ldquo;too small&rdquo;, field: &ldquo;&rdquo;}
callback onFnaFieldNodeBecameValid() # Notifies that a field gets valid.
callback onFnaFieldNewDataInjected() # Notifies that new data was injected.
callback onFnaRepeatedFieldChanged() # Notifies when a repeater node changes. This means, a element was added or removed to the repeater node.
This will not notify you about values inside the repeater node.
`}),e.add({id:6,href:"/docs/guides/type-renderer/",title:"Type Renderer",section:"Guides",content:` Dynamic type-dependent rendering # The furo-type-renderer is used to display type specific data. It uses display as default context and will warn you on the console if the requested context-[type-name] does not exist or was not imported.
There is a standard set of type-renderers for rendering the most common types.
The standard ui5 set can be integrated with the import
import &lsquo;@furo/ui5/src/standard-type-renderers/display-registry.js&rsquo;. If you want to implement an individual display of a type, you need your own context-[type-name] component and import it.
Component Naming Convention # Type: google.type.TimeOfDay
display-google-type-timeofday ------- --------------------- | | context type-name use the generic path # 1 2 3 &lt;furo-type-renderer ƒ-bind-data=&#34;--dao(*.data.any_type_of_field)&#34;&gt; &lt;/furo-type-renderer&gt; or use the specific component # 1 2 3 &lt;display-google-type-timeofday ƒ-bind-data=&#34;--dao(*.data.timeofday_field)&#34;&gt; &lt;/display-google-type-timeofday&gt; DOM Sample # 1 2 3 4 5 6 7 8 9 10 11 12 13 &lt;!-- use the furo-type-renderer in the html markup --&gt; &lt;furo-type-renderer content=&#34;&#34; ƒ-bind-data=&#34;--data&#34; context=&#34;display&#34; value-state=&#34;Positive&#34; data-size=&#34;size-s&#34;&gt;&lt;/furo-type-renderer&gt; &lt;!-- it creates the type specific component in the DOM. Context and all attributes are applied--&gt; &lt;display-country-factsheet content=&#34;&#34; context=&#34;display&#34; value-state=&#34;Positive&#34; data-size=&#34;size-s&#34;&gt;&lt;/display-country-factsheet&gt; `}),e.add({id:7,href:"/docs/guides/featuretoggle/",title:"Feature Toggles",section:"Guides",content:` Feature Toggles # Use FuroFeatureToggle to implement toggles for the following scenarios: 1
release toggles - in the context of Continuous Delivery, unfinished features are toggled off, and only activated when the feature is ready. However, the source code is transferred to the master branch earlier and deployed to the various stages. experiment toggles - the classic, for example for A/B tests ops toggles - this refers to switches under operational aspects. For example, when new features are rolled out and the performance behavior of the application is still unclear, the feature can simply be turned off if problems occur during operation. As far as everything runs stable, the switches are removed. permission toggles - certain features are made available only to a subset of users, or to users with extended privileges. Hints: # read feature-toggle-best-practices from flagship.io Keep toggle scope as small as possible Always expose feature toggle configurations Have a standardized toggle naming scheme For enabling or hiding buttons, based on a HATEOAS response, use furo-hateoas-state. Initialization # If you want to init your keys, register them with registerKeyMap. This method can be called at any time, because a uninitialized key defaults to the false state.
1 2 3 4 5 6 7 import { FuroFeatureToggle } from &#39;@furo/framework/src/FuroFeatureToggler/FuroFeatureToggle.js&#39;; FuroFeatureToggle.registerKeyMap({ &#34;feature.a&#34;:true, &#34;feature.b&#34;:true, &#34;feature.c&#34;:false, }); init.js
Supported toggles for Web Components or HTML # The lib supports the following cases, for direct usage in your html:
data-furo-toggle-append # Appends the element on true state of the key and removes the element from the dom on false state. This will also happen if you change the state of the toggle, at a later time.
For this, you have to write the tag in the HTML, to avoid flickering, you can import the needed component with a toggle callback.
data-furo-toggle-remove # This behaves like the append toggle, but the difference is, that it removes the element on true state of the key and will append the element on a false state
data-furo-toggle-hide # Will add a hidden=&quot;&quot; attribute to the element on true state of the key and removes the attribute on a false state.
data-furo-toggle-show # Is the counter component for hide. It removes a hidden attribute from the element on true state of the key and adds the attribute on a false state
data-furo-toggle-disable # Will add a disabled=&quot;&quot; attribute to the element on true state of the key and removes the attribute on a false state.
data-furo-toggle-enable # Is the counter component for disable. It removes a disabled attribute from the element on true state of the key and adds the disabled attribute on a false state
Helpers and Utils # At the moment, there is only the furo-feature-toggle component available. Feel free to file an issue with a feature request, if you miss something.
Wikipedia (de), Wikipedia (en)&#160;&#x21a9;&#xfe0e;
`}),e.add({id:8,href:"/docs/modules/furo-fbp/empty-fbp-node/",title:"empty-fbp-node",section:"@furo/fbp",content:` empty-fbp-node # @furo/fbp v6.11.0 import '@furo/fbp/src/empty-fbp-node.js'; exports EmptyFBPNode js exports &lt;empty-fbp-node&gt; custom-element-definition superclass HTMLElement mixes FBP summary **
Attributes and Properties # Methods # `}),e.add({id:9,href:"/docs/modules/furo-fbp/flow-bind/",title:"flow-bind",section:"@furo/fbp",content:` flow-bind # @furo/fbp v6.11.0 import '@furo/fbp/src/flow-bind.js'; exports FlowBind js exports &lt;flow-bind&gt; custom-element-definition superclass HTMLElement mixes FBP summary Custom element to allow using furo-fbp's template features in a html document.
flow-bind
Custom element to allow using furo-fbp&rsquo;s template features in a html document. It comes very handy, when you want write tests or make some demos.
1 2 3 4 5 6 7 8 9 10 &lt;test-fixture id=&#34;basic&#34;&gt; &lt;template&gt; &lt;flow-bind id=&#34;elem&#34;&gt; &lt;template&gt; &lt;div id=&#34;sender&#34; @-click=&#34;--data-received&#34;&gt;sender&lt;/div&gt; &lt;div id=&#34;receiver&#34; ƒ-render=&#34;--data-received&#34;&gt;receiver&lt;/div&gt; &lt;/template&gt; &lt;/flow-bind&gt; &lt;/template&gt; &lt;/test-fixture&gt; Attributes and Properties # Methods # `}),e.add({id:10,href:"/docs/modules/furo-fbp/flow-repeat/",title:"flow-repeat",section:"@furo/fbp",content:` flow-repeat # @furo/fbp v6.11.0 import '@furo/fbp/src/flow-repeat.js'; exports FlowRepeat js exports &lt;flow-repeat&gt; custom-element-definition superclass HTMLElement mixes FBP summary Custom element to allow using FBPs template features in repeated template
flow-repeat
Custom element to repeat Arrays. The repeated items are injected before the flow-repeat element. If you need the repeated items inside of an other dom node, use setInsertRef
1 2 3 4 5 &lt;flow-repeat ƒ-inject-items=&#34;--dataArray&#34;&gt; &lt;template&gt; &lt;repeated-item index=&#34;\${this.index}&#34; ƒ-inject=&#34;--init&#34;&gt; &lt;/template&gt; &lt;/flow-repeat&gt; Note: if you want to bind a repeater node, use furo-data-flow-repeat.
Available wires in the template: # Note: Each repeated item has its own closed scope. You can not use the wires outside of the template. Use events to interact with components outside of the template.
--init : contains the repeated item, fired only once on creation of the repeated node --item : contains the repeated item, fired on every inject --firstItem : contains the repeated item, fired on the first element. --lastItem : contains the repeated item, fired on the last element. --index : contains a number with the index of the element. --host : contains a reference to the host component. --trigger : contains what was passed in to the triggering method. --triggerFirst : contains what was passed in to the triggering method. --triggerLast : contains what was passed in to the triggering method. --itemSelected : contains true, is triggered with select(index). --itemDeSelected : contains false, is triggered when another item is selected with select(index). Available attributes # index contains the current index of the item. Use this to fire a event with an index like @-click=&quot;^^item-clicked(index)&quot; item contains the current index of the item. Use this to fire a event with the repeated item like @-click=&quot;^^item-selected(item)&quot;
Attributes and Properties # Events # last-element-selected # at-last-element-selected → index of the element
Fired when the last element is selected. Use this to trigger a load next. items-in-dom # at-items-in-dom → Number
Fired when items are attached to the dom, with Number of items. Methods # clear # clear() ⟹ void
* → fn-clear
Clear the list
select # select(index int ) ⟹ void
int → fn-select
Triggers the wire --itemSelected on selected item and --itemDeSelected on last selected Item.
index Index of item to select selectIdentity # selectIdentity(identifier * ) ⟹ void
* → fn-select-identity
Select item by its identity.
Using this method only works when you have set the identity-path.
identifier Identity from identity-path selectNextIndex # selectNextIndex() ⟹ void
* → fn-select-next-index
Selects next index. If none was selected, the first index will be selected.
If you reached the last index, the first index will be selected.
If you reach the last element, last-element-selected will fire.
Triggers the wire --itemSelected on selected item and --itemDeSelected on last selected Item
selectPreviousIndex # selectPreviousIndex() ⟹ void
* → fn-select-previous-index
Selects the previous index.
If you are on the first item, the last will be selected.
Triggers the wire --itemSelected on selected item and --itemDeSelected on last selected Item
triggerSelected # triggerSelected(data * ) ⟹ void
* → fn-trigger-selected
Triggers the currently selected item.
Triggers the wire --trigger on the every item.
Triggers the wire --triggerIndex on the every item.
data Data to forward. triggerAll # triggerAll(data * ) ⟹ void
* → fn-trigger-all
Triggers all nodes.
Triggers the wire --trigger on the every item.
Triggers the wire --triggerIndex on the every item.
data data to forward deselect # deselect() ⟹ void
* → fn-deselect
Triggers the wire --itemDeSelected on the last selected item
setInsertRef # setInsertRef(ref DomNode ) ⟹ void
DomNode → fn-set-insert-ref
Set a reference to append the repeated elements in to the ref instead of appending them before the repeater itself.
ref Node to append the repeated items. deselectAll # deselectAll() ⟹ void
* → fn-deselect-all
Triggers the wire --itemDeSelected on all items
injectItems # injectItems(items Array ) ⟹ void
Array → fn-inject-items
Inject items to repeat.
items Items to repeat triggerFirst # triggerFirst(data * ) ⟹ void
* → fn-trigger-first
Triggers the wire --trigger on the first item.
Triggers the wire &ndash;triggerFirst on the first item.
data data to forward to the item. triggerLast # triggerLast(data * ) ⟹ void
* → fn-trigger-last
Triggers the wire --trigger on the last item.
Triggers the wire &ndash;triggerLast on the last item.
data data to forward to the item. triggerIndex # triggerIndex(i int data * ) ⟹ void
int * → fn-trigger-index
Triggers the wire --trigger on the item.
Triggers the wire --triggerIndex on the item.
i index of item that you want to trigger. data data to forward to the item. `}),e.add({id:11,href:"/docs/modules/furo-data/furo-api-fetch/",title:"furo-api-fetch",section:"@furo/data",content:` furo-api-fetch # @furo/data v2.18.0 import '@furo/data/src/furo-api-fetch.js'; exports FuroApiFetch js exports &lt;furo-api-fetch&gt; custom-element-definition superclass HTMLElement summary fetch data from network
Use furo-api-fetch to fetch data from the network.
1 &lt;furo-api-fetch fn-invoke-request=&#34;--Request&#34;&gt;&lt;/furo-api-fetch&gt; Attributes and Properties # lastRequest # default: {}
LastRequest&rsquo;s response.
Note that lastResponse is set when ongoing request finishes, so if loading is true, then lastResponse will correspond to the result of the previous request. isLoading # default: false
True while request is in flight. Events # fatal-error # at-fatal-error → Request
Requests are made via the Fetch API if possible.Fallback XMLHttpRequest request-started # at-request-started → Request
Fired when a request is sent. request-aborted # at-request-aborted → Request
Fired when a request was canceled. response-raw # at-response-raw → Object
Fired when a response is received. response # at-response → Object
Fired when a response is received. Here you will get the parsed response Format depends on request header content-type supported types: - text/plain - application/json - image/jpeg (Blob) - application/octet-stream (ArrayBuffer) - application/pdf (Blob) parse-error # at-parse-error → CustomEvent
response-error-raw # at-response-error-raw → Object
Fired when a error has occoured. response-error # at-response-error → Object
Fired when an error has occoured. This is a general error event. The specific error events are fired additionally. **** # at- → CustomEvent
response-error-[status-code] # at-response-error-[status-code] → Object
Fired when an error has occoured. This is a specific error event. response-error-4xx # at-response-error-4xx → Object
Fired when an error has occoured. This is a group error event. E.g. response-error-5xx, response-error-4xx response-error-5xx # at-response-error-5xx → Object
Fired when an error has occoured. This is a group error event. E.g. response-error-5xx, response-error-4xx Methods # invokeRequest # invokeRequest(request Request ) ⟹ void
Request → fn-invoke-request
Sends a HTTP request to the server
request (The Request interface of the Fetch API represents a resource request.) https://developer.mozilla.org/en-US/docs/Web/API/Request abortRequest # abortRequest(controller AbortController ) ⟹ void
AbortController → fn-abort-request
Aborts a pending request You have to submit an AbortController
controller (The AbortController interface represents a controller object that allows you to abort one or more DOM requests as and when desired.) https://developer.mozilla.org/en-US/docs/Web/API/AbortController `}),e.add({id:12,href:"/docs/modules/furo-route/furo-app-flow/",title:"furo-app-flow",section:"@furo/route",content:` furo-app-flow # @furo/route v2.6.13 import '@furo/route/src/furo-app-flow.js'; exports FuroAppFlow js exports &lt;furo-app-flow&gt; custom-element-definition superclass LitElement summary Application Flow =&gt; routing
furo-app-flow triggers the flow events for the app-flow-router.
Attributes and Properties # qp # Deprecated, use the setQp method instead display # default: 'none'
event # event String Name of your app-flow event object
i.e. &rsquo;task-clicked&rsquo;, &lsquo;wizard-step1-completed&rsquo;,&hellip; Events # app-flow # at-app-flow → data
App-flow event with app-flow object will be fired when you trigger the emit function. Methods # setQp # setQp(qp Object ) ⟹ void
Object → fn-set-qp
Use this to explicitly set the query params.
This is useful if you use the trigger method.
qp Object with key value pairs trigger # trigger() ⟹ void
* → fn-trigger
Triggers the flow event (with the qp that was set before)
emit # emit(queryParams \`\` QueryParam object|QueryParams ) ⟹ void
\`\` object|QueryParams → fn-emit
fire the app-flow event
queryParams QueryParam Object `}),e.add({id:13,href:"/docs/modules/furo-route/furo-app-flow-router/",title:"furo-app-flow-router",section:"@furo/route",content:` furo-app-flow-router # @furo/route v2.6.13 import '@furo/route/src/furo-app-flow-router.js'; exports FuroAppFlowRouter js exports &lt;furo-app-flow-router&gt; custom-element-definition superclass LitElement mixes FBP summary Application Flow =&gt; routing
furo-app-flow-router
Use this component with app-flow and furo-pages to implement your application flow / routing
1 &lt;app-flow-router set-config=&#34;--flowConfigLoaded&#34; fn-trigger=&#34;--flowEvent&#34; fn-back=&#34;--wire&#34; fn-forward=&#34;--wire&#34;&gt;&lt;/app-flow-router&gt; *Configuration Array
current flow-event-name target [mapping] view-main form-complete detail-view from =&gt; to * menu-settings-click settings * all-fields-req all-qps * * some-fields-req some-qps a=&gt;b,x=&gt;id,c=&gt;item 1 2 3 4 5 6 7 [ [&#39;view-main&#39;, &#39;button-tap&#39;, &#39;detail-view&#39;, &#39;task =&gt; id], [&#34;*&#34;, &#34;search&#34;, &#34;EXTERNAL_LINK: https://google.com/&#34;], [&#34;*&#34;, &#34;searchInNewWindow&#34;, &#34;EXTERNAL_LINK_BLANK: https://google.com/&#34;] [&#34;*&#34;, &#34;searchInNewWindow&#34;, &#34;EXTERNAL_LINK_BLANK:&#34;, *], [&#34;*&#34;, &#34;activity-url&#34;, &#34;URL&#34;, &#34;*&#34;], ] if the current view is view-main and the flow-event-name is &lsquo;form-complete&rsquo;, the view switches to detail-view and data.from is mapped to &ldquo;to&rdquo;.
Special configurations: # Set a &ldquo;*&rdquo; to map all data 1:1 to the url.
You can set a wildcard for &ldquo;current&rdquo;. If you check the example: menu-settings-click can be triggered from any current. If there is a &ldquo;current&rdquo; with menu-settings-click configured and you are there, the wildcard is not used.
if you want to link to a dynamic target outside your app add URL and use fn-emit on the furo-app-flow component with the url as data.
if you want to link to a target outside your app add EXTERNAL_LINK: followed by the link
if you want to close a page which was openend by a _blank click use the keyword WINDOW-CLOSE
if you want to trigger a history.back() use the HISTORY-BACK
if there is no history.back() possible use the flow event! HISTORY-BACK and define the target as usual
Attributes and Properties # config # config Array build internal config for faster access display # default: 'none'
urlSpaceRegex # url-space-regex string default: ''
default value of urlSpaceRegex. this value can be rewritten via url-space-regex attribute Events # __beforeReplaceState # at-__beforeReplaceState → void
Fired when before the state will be updated. view-changed # at-view-changed → flowEvent
Fired when page was changed. event-not-found # at-event-not-found → flowEvent
Fired when view was not found. Methods # back # back() ⟹ void
* → fn-back
trigger a history back
forward # forward() ⟹ void
* → fn-forward
trigger a history forward
setConfig # setConfig(config \`\` ) ⟹ void
\`\` → fn-set-config
Set the config
config trigger # trigger(flowEvent \`\` ) ⟹ boolean
\`\` → fn-trigger
Trigger the router
flowEvent `}),e.add({id:14,href:"/docs/modules/furo-layout/furo-backdrop/",title:"furo-backdrop",section:"@furo/layout",content:` furo-backdrop # @furo/layout v2.2.14 import '@furo/layout/src/furo-backdrop.js'; exports FuroBackdrop js exports &lt;furo-backdrop&gt; custom-element-definition superclass LitElement mixes FBP summary show content with backdrop
furo-backdrop
Displays content with a backdrop.
The element you place in to furo-backdrop will be displayed centered.
1 2 3 4 5 &lt;furo-backdrop at-opened=&#34;--BackdropFocus&#34; at-closed=&#34;--backdropClosed&#34; fn-show=&#34;--expandIconClicked&#34; fn-close=&#34;--closeRequested, --recordSelected&#34;&gt; &lt;any-component at-item-selected=&#34;--recordSelected&#34; style=&#34;width: 90vw; height: 90vh&#34;&gt;&lt;/any-component&gt; &lt;/furo-backdrop&gt; You can wire and use the elements in furo-backrop as if they were local elements.
Do not forget to add the furo-backdrop-display somewhere in the parent dom.
Attributes and Properties # Events # opened # at-opened → FuroBackdrop
The opened event will be fired when the content is visible on the backdrop. Tipp: you can use this to focus something on the shown content. Event.details {FuroBackdrop} is the reference to the emiting DOM node. closed # at-closed → FuroBackdrop
The closed event will be fired when the displayed content is invisible and the backdrop is closed. Tipp: Maybe you want to use this event to refocus the initiator. Event.details {FuroBackdrop} is the reference to the emiting DOM node. register-backdrop # at-register-backdrop → FuroBackdrop
Internal event to move the contents to the backdrop-display. Event.details {FuroBackdrop} is the reference to the emiting DOM node. Methods # show # show() ⟹ void
* → fn-show
Initiates the backdrop and shows the content on top of the backdrop area.
close # close() ⟹ void
* → fn-close
Hides the display.
Note: The display will also get closed when the user clicks on the backdrop.
`}),e.add({id:15,href:"/docs/modules/furo-layout/furo-backdrop-display/",title:"furo-backdrop-display",section:"@furo/layout",content:` furo-backdrop-display # @furo/layout v2.2.14 import '@furo/layout/src/furo-backdrop-display.js'; exports FuroBackdropDisplay js exports &lt;furo-backdrop-display&gt; custom-element-definition superclass LitElement mixes FBP summary Display component for furo-backdrop
furo-backdrop-display
This components receives and displays the backdrop requests from furo-backdrop components.
The backdrop display can be placed anywhere in the dom. The higher the better.
Tipp: place it below or inside the component which applies the style vars. Othewise the displayed components do not know these vars.
1 2 &lt;!-- place the display in your main-stage --&gt; &lt;furo-backdrop-display&gt;&lt;/furo-backdrop-display&gt; Attributes and Properties # toDuration # to-duration number default: 100
timeout duration Methods # close # close() ⟹ void
* → fn-close
closes the backdrop. You can close the backdrop on the display element, this is useful when you want to close the backdrops on page changes.
Usualy the component which triggers the backdrop or is displayed closes it.
Styling # The following custom properties available for styling:
Custom property Description --furo-backdrop-color background color of backdrop default: #6d6d6d fallback: 0px `}),e.add({id:16,href:"/docs/modules/furo-data/furo-collection-agent/",title:"furo-collection-agent",section:"@furo/data",content:` furo-collection-agent # @furo/data v2.18.0 import '@furo/data/src/furo-collection-agent.js'; exports FuroCollectionAgent js exports &lt;furo-collection-agent&gt; custom-element-definition superclass LitElement mixes FBP summary interface component to handle collection requests
furo-collection-agent is an interface component to handle collection requests.
1 2 3 4 5 6 7 &lt;furo-collection-agent service=&#34;Servicename&#34; fn-hts-in=&#34;--hts&#34;&gt;&lt;/furo-collection-agent&gt; &lt;!-- produces a hateoas link array --&gt; &lt;furo-deep-link service=&#34;Servicename&#34; at-hts-out=&#34;--hts&#34;&gt;&lt;/furo-deep-link&gt; before you can do any requests, the service and the HATEOAS must be defined
Attributes and Properties # view # view String Parameter for contextual representations
To reduce network traffic, it is sometimes useful to allow the client to limit which parts of the resource the server should return in its responses, returning a view of the resource (i.e. specialized version for dropdowns ) instead of the full resource representation.
https://cloud.google.com/apis/design/design_patterns#resource_view
view=smallcards
Only useable if your service has implemented this feature. filter # filter String Set the filter.
Hint: use the FieldNode._base64 property to send complex objects as a filter and decode it on the server side.
Only useable if your service has implemented this feature. service # service String Setze den Service pageSize # page-size Number Sets pagination size in the List request.
Only useful if your service supports pagination. fields # fields String Comma separated list of fields (like a fieldmask) used for partial representation / partial responses.
If your services supports this feature, you will receive a subset of the fields. orderBy # order-by String Sorting order
order-by=&ldquo;foo,-bar&rdquo; means foo asc and bar desc
https://cloud.google.com/apis/design/design_patterns#sorting_order
To avoid sql injection errors we do not send any sql like syntax!
Only useable if your service has implemented this feature. listOnHtsIn # list-on-hts-in Boolean Executes a list when a rel=&ldquo;list&rdquo; is injected. loadRelOnHtsIn # load-rel-on-hts-in Boolean Executes a loadRel when a rel=&ldquo;XXXX&rdquo; is injected.
You have to set the attributes rel and method to have this working.
This is useful for getting &ldquo;custom&rdquo; collections. rel # rel String rel which should be used on load rel method # method String for compatibility reasons you have to specify the method inside of the service.
This attribute should not be needed in future versions, because the rel already contains all relevant information. Events # request-aborted # at-request-aborted → Request
Fired if the request was successfully cancelled request-started # at-request-started → Request
Fired when a request is sent. response-raw # at-response-raw → Object
Fired when a response is received. response-error # at-response-error → Object
Fired when an error has occoured. This is a general error event. The specific error events are fired additionally. response-error-[status-code] # at-response-error-[status-code] → Object
Fired when an error has occoured. This is a specific error event. fatal-error # at-fatal-error → Request
Requests are made via the Fetch API if possible.Fallback XMLHttpRequest response-error-4xx # at-response-error-4xx → Object
Fired when an error has occoured. This is a group error event. E.g. response-error-5xx, response-error-4xx response-error-5xx # at-response-error-5xx → Object
Fired when an error has occoured. This is a group error event. E.g. response-error-5xx, response-error-4xx response-error-raw # at-response-error-raw → Object
Fired when a error has occoured. response # at-response → Object
Fired when a response is received. response-hts-updated # at-response-hts-updated → hts
Fired when the hts was updated by the received response. filter-changed # at-filter-changed → \`\`
Fired when filter was updated with fn-set-filter. hts-updated # at-hts-updated → Array|HATEOAS
Fired when hateoas was updated from response. hts-injected # at-hts-injected → Hateoas links
Fired when hateoas was updated Methods # setFields # setFields(fields String ) ⟹ void
String → fn-set-fields
Comma separated list of fields (like a fieldmask) used for partial representation / partial responses.
If your services supports this feature, you will receive a subset of the fields.
fields Comma separated list of fields bindRequestData # bindRequestData(dataObject \`\` ) ⟹ void
\`\` → fn-bind-request-data
Binds a furo-data-object type. Use this if you want save data.
dataObject setOrderBy # setOrderBy(order String ) ⟹ void
String → fn-set-order-by
Sorting order
order-by=&ldquo;foo,-bar&rdquo; means foo asc and bar desc
https://cloud.google.com/apis/design/design_patterns#sorting_order
To avoid sql injection errors we do not send any sql like syntax!
Only useable if your service has implemented this feature.
order Comma separated list of sort orders clearFilter # clearFilter() ⟹ void
* → fn-clear-filter
clear the setted filter
setFilter # setFilter(filterstring String ) ⟹ void
String → fn-set-filter
Set the filter.
Hint: use the FieldNode._base64 property to send complex objects as a filter and decode it on the server side.
Only useable if your service has implemented this feature.
filterstring String for your filter. setPageSize # setPageSize(size Number ) ⟹ void
Number → fn-set-page-size
Sets pagination size in the List request.
Only useful if your service supports pagination.
size requested size of a page. updateQp # updateQp(qp \`\` key Object ) ⟹ void
\`\` Object → fn-update-qp
Update query params a qp like {&ldquo;active&rdquo;:true} will just update the qp active
If the current value of the qp is not the same like the injected value, a qp-changed event will be fired
qp key value pairs setQp # setQp(qp \`\` key Object ) ⟹ void
\`\` Object → fn-set-qp
Set query params All existing query params are replaced by the transferred parameters If the transferred object is empty, all the values will be removed! The AgentHelper fires a qp-set event after the query params are replaced.
qp key value pairs clearQp # clearQp() ⟹ void
* → fn-clear-qp
clear the query params that you have setted before
list # list() ⟹ void
* → fn-list
loads the entity if hts is available
load # load() ⟹ void
* → fn-load
loads the entity if hts is available
loadRel # loadRel() ⟹ void
* → fn-load-rel
loads the entity following the link which is specified on the attribute rel if it is available.
searchRel # searchRel(term \`\` ) ⟹ void
\`\` → fn-search-rel
search for a term following the link which is specified on the attribute rel
This will set the query param q and execute the query.
term search # search(term \`\` ) ⟹ void
\`\` → fn-search
search for a term.
This will set the query param q and triggers a list()
term first # first() ⟹ void
* → fn-first
loads the entity if hts is available
prev # prev() ⟹ void
* → fn-prev
loads the entity if hts is available
next # next() ⟹ void
* → fn-next
loads the entity if hts is available
last # last() ⟹ void
* → fn-last
loads the entity if hts is available
htsIn # htsIn(hts \`\` ) ⟹ void
\`\` → fn-hts-in
Inject HATEOAS links.
hts abortPendingRequest # abortPendingRequest() ⟹ void
* → fn-abort-pending-request
Aborts a pending request
`}),e.add({id:17,href:"/docs/modules/furo-util/furo-config/",title:"furo-config",section:"@furo/util",content:` furo-config # @furo/util v2.1.19 import '@furo/util/src/furo-config.js'; exports FuroConfig js exports &lt;furo-config&gt; custom-element-definition superclass LitElement summary config access
furo-config
Access config data
1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 &lt;!-- set with config-loader --&gt; &lt;furo-config-loader section=&#34;views&#34; src=&#34;/viewconfig.json&#34; &gt;&lt;/furo-config&gt; &lt;!-- consume a config --&gt; &lt;furo-config section=&#34;views&#34; at-config-updated=&#34;--conf&#34; &gt;&lt;/furo-config&gt; &lt;!-- consume a sub path of a config section --&gt; &lt;furo-config section=&#34;views.subset.deep&#34; at-config-updated=&#34;--deepconf&#34; &gt;&lt;/furo-config&gt; Attributes and Properties # section # section String section of the config object that you are interested in
access deep object with dots like main.sub.sub config # default: Config
The current section of the config, which was defined by section. Events # config-updated # at-config-updated → config.section
Fired when section changed Methods # `}),e.add({id:18,href:"/docs/modules/furo-util/furo-config-loader/",title:"furo-config-loader",section:"@furo/util",content:` furo-config-loader # @furo/util v2.1.19 import '@furo/util/src/furo-config-loader.js'; exports FuroConfigLoader js exports &lt;furo-config-loader&gt; custom-element-definition superclass LitElement mixes FBP summary load config files
furo-config-loader loads a configuration json in to the defined section.
To access the config values, use furo-config.
1 2 3 4 &lt;furo-config-loader src=&#34;/custom/view-config.json&#34; section=&#34;views&#34; &gt;&lt;/furo-config-loader&gt; Attributes and Properties # src # src String File source section # section String Targeted section to load the config in. Events # config-loaded # at-config-loaded → Object
Fired when the config is loaded with the loaded config as detail. Methods # `}),e.add({id:19,href:"/docs/modules/furo-data/furo-custom-method/",title:"furo-custom-method",section:"@furo/data",content:` furo-custom-method # @furo/data v2.18.0 import '@furo/data/src/furo-custom-method.js'; exports FuroCustomMethod js exports &lt;furo-custom-method&gt; custom-element-definition superclass LitElement mixes FBP summary interface component to handle custom methods
furo-custom-method is a interface component to handle custom methods.
1 2 3 4 5 6 7 8 9 &lt;furo-custom-method service=&#34;Servicename&#34; method=&#34;release&#34; fn-hts-in=&#34;--hts&#34; fn-trigger=&#34;--customClick&#34;&gt;&lt;/furo-custom-method&gt; &lt;!-- produces a hateoas link array --&gt; &lt;furo-deep-link service=&#34;Servicename&#34; at-hts-out=&#34;--hts&#34;&gt;&lt;/furo-deep-link&gt; before you can do any requests, the service, method and the HATEOAS must be known Attributes and Properties # service # service String Setze den Service method # method String Name of the custom method / rel. Events # hts-updated # at-hts-updated → HTS
Fired when hts was updated by fn-hts-in. request-aborted # at-request-aborted → Request
Fired when a request was canceled. request-started # at-request-started → Request
Fired when a request is sent. response-raw # at-response-raw → Object
Fired when a response is received. response-error # at-response-error → Object
Fired when an error has occoured. This is a general error event. The specific error events are fired additionally. response-error-[status-code] # at-response-error-[status-code] → Object
Fired when an error has occoured. This is a specific error event. fatal-error # at-fatal-error → Request
Requests are made via the Fetch API if possible.Fallback XMLHttpRequest response-error-4xx # at-response-error-4xx → Object
Fired when an error has occoured. This is a group error event. E.g. response-error-5xx, response-error-4xx response-error-5xx # at-response-error-5xx → Object
Fired when an error has occoured. This is a group error event. E.g. response-error-5xx, response-error-4xx response-error-raw # at-response-error-raw → Object
Fired when a error has occoured. response # at-response → Object
Fired when a response is received. Methods # updateQp # updateQp(qp \`\` key Object ) ⟹ void
\`\` Object → fn-update-qp
Update query params a qp like {&ldquo;active&rdquo;:true} will just update the qp active
If the current value of the qp is not the same like the injected value, a qp-changed event will be fired
qp key value pairs bindRequestData # bindRequestData(dataObject \`\` ) ⟹ void
\`\` → fn-bind-request-data
Binds a furo-data-object type.
dataObject clearQp # clearQp() ⟹ void
* → fn-clear-qp
clear the query params that you have setted before
trigger # trigger() ⟹ void
* → fn-trigger
trigger the method with respect for binded-requset-object
triggerEmpty # triggerEmpty() ⟹ void
* → fn-trigger-empty
triggerWithBody # triggerWithBody(body \`\` ) ⟹ void
\`\` → fn-trigger-with-body
trigger the method with data
body htsIn # htsIn(hts \`\` ) ⟹ void
\`\` → fn-hts-in
hts abortPendingRequest # abortPendingRequest() ⟹ void
* → fn-abort-pending-request
Aborts a pending request
`}),e.add({id:20,href:"/docs/modules/furo-data/furo-data-flow-repeat/",title:"furo-data-flow-repeat",section:"@furo/data",content:` furo-data-flow-repeat # @furo/data v2.18.0 import '@furo/data/src/furo-data-flow-repeat.js'; exports FuroDataFlowRepeat js exports &lt;furo-data-flow-repeat&gt; custom-element-definition superclass FlowRepeat mixes FieldNodeAdapter summary automatic display of repeated fields
furo-data-flow-repeat Is a bindable repeater.
1 2 3 4 5 6 &lt;furo-data-flow-repeat identity-path=&#34;id&#34; fn-bind-data=&#34;--data(*.repeaterfield)&#34;&gt; &lt;template&gt; &lt;furo-ui5-data-text-input-labeled fn-bind-data=&#34;--init&#34;&gt;&lt;/furo-ui5-data-text-input-labeled&gt; &lt;/template&gt; &lt;/furo-data-flow-repeat&gt; The wire --init is fired from furo-data-flow-repeat
If you want to delete a repeated item, implement something which triggers the deleteNode method on the fieldNode itself.
Available wires in the template: # --init : contains the repeated item, fired only once on creation of the repeated node --item : contains the repeated item, fired on every inject --firstItem : contains the repeated item, fired on the first element. --lastItem : contains the repeated item, fired on the last element. --index : contains a number with the index of the element. --host : contains a reference to the host component. --trigger : contains what was passed in to the triggering method. --triggerFirst : contains what was passed in to the triggering method. --triggerLast : contains what was passed in to the triggering method. --itemSelected : contains nothing, is triggered with select(index). --itemDeSelected : contains nothing, is triggered when another item is selected with select(index). Available attributes # index contains the current index of the item. Use this to fire a event with an index like at-click=&quot;^^item-clicked(index)&quot; item contains the current index of the item. Use this to fire a event with the repeated item like at-click=&quot;^^item-selected(item)&quot;
Attributes and Properties # selectAddedItem # default: false
Enable this to select the created item. This will trigger a wire --itemSelected which can be wired to fn-focus=&quot;--itemSelected&quot;. identityPath # default: false
By setting this param, the repeater has not to rebuild the list on new data. It only updates the parts that have changed.
The path is a field, relative to the root of the repeated item. Methods # bindData # bindData(fieldNode RepeaterNode ) ⟹ boolean
RepeaterNode → fn-bind-data
Bind a repeater node.
If identity-path is not set, the list will be cleared every time it receives new data.
fieldNode Must be a repeater node. add # add(data Object ) ⟹ void
Object → fn-add
Adds a repeated item of the same type.
If no object is set, a initial FieldNode of the same type is added to the repeats.
data Object that match the type of the repeated node. `}),e.add({id:21,href:"/docs/modules/furo-data/furo-data-hide-content/",title:"furo-data-hide-content",section:"@furo/data",content:` furo-data-hide-content # @furo/data v2.18.0 import '@furo/data/src/furo-data-hide-content.js'; exports FuroDataHideContent js exports &lt;furo-data-hide-content&gt; custom-element-definition superclass LitElement mixes FBP summary hide content with a boolean fieldnode
furo-data-hide-content hides content in dependency to a boolean field value.
It is also possible to call the hide() and show() methods to show and hide the content and update the value. TODO: support furo.fat.Bool and google.protobuf.BoolValue
1 2 3 &lt;furo-data-hide-content animated fn-bind-data=&#34;--bind(*.bool)&#34;&gt; &lt;div&gt;some content&lt;/div&gt; &lt;/furo-collapsible-box&gt; The attribute animated will add a slide in slide out animation.
Attributes and Properties # hidden # default: false
hideOnFalse # hide-on-false Boolean Hide element on false instead of true animated # animated boolean Set this to animate the collapse and expand. Events # value-changed # at-value-changed → Boolean
Fired when the visibility changed, contains the current visibility state hid # at-hid → void
Fired when the content gets hid showed # at-showed → void
Fired when the content gets visible Methods # bindData # bindData(fieldNode Object|FieldNode ) ⟹ void
Object|FieldNode → fn-bind-data
Bind a entity field to the date-input. You can use the entity even when no data was received. When you use at-object-ready from a furo-data-object which emits a EntityNode, just bind the field with --entity(*.fields.fieldname)
fieldNode a Field object hide # hide() ⟹ void
* → fn-hide
hides the content
show # show() ⟹ void
* → fn-show
shows the content
toggle # toggle() ⟹ void
* → fn-toggle
Toggle the current visibility state.
Slots # default # Type: HTMLElement [0..n]
default slot to add content. `}),e.add({id:22,href:"/docs/modules/furo-data/furo-data-object/",title:"furo-data-object",section:"@furo/data",content:` furo-data-object # @furo/data v2.18.0 import '@furo/data/src/furo-data-object.js'; exports FuroDataObject js exports &lt;furo-data-object&gt; custom-element-definition superclass LitElement summary Typed data object
furo-data-object gives you a object which is built based on the type spec. The types must be available in the {Env}, learn more about setting up the environment in the guide.
The data will mostly be used in a [data-ui]/(../../data-input/doc) component or in component that yoh build, which contains one or more of them.
furo-data-object receives its data regularly from a collection-aget or a entity-aget. But you can also send json data which is formed like the raw-data of this type.
furo-data-object will not do any validation or data manipulation neither will send the data. It is just responsible to transform incomming data to an object and vice versa. You can access the manipulated data structure on the property .data.rawData with javascript (if needed).
1 2 3 4 5 6 7 8 9 10 &lt;!-- The furo-data-object will send a initial dataObject of type project.Project on at-response-ready --&gt; &lt;furo-data-object type=&#34;project.Project&#34; fn-inject-raw=&#34;--response(*.data)&#34; at-object-ready=&#34;--dataObject&#34;&gt;&lt;/furo-data-object&gt; &lt;!-- The furo-entity-agent will fetch the data from ProjectService and pass it in at-response to the furo-data-object. --&gt; &lt;furo-entity-agent service=&#34;ProjectService&#34; fn-save=&#34;--saveClicked&#34; fn-bind-request-data=&#34;--dataObject&#34; at-response=&#34;--response&#34; &gt;&lt;/furo-entity-agent&gt; Attributes and Properties # type # type String Set the type. The type must be available in the environment json # get the data from the data object as raw json Events # data-injected # at-data-injected → \`\`
Fired when injected data was processed (bubbles). data-changed # at-data-changed → {Object|CollectionNode}
Fired when data in furo-data-object has changed (bubbles). This event fires a lot, consider using a de-bounce with the event. data-changed-after-inject # at-data-changed-after-inject → {Object|CollectionNode}
Fired when data in furo-data-object has changed after injectRaw is complete (bubbles). This event fires a lot, consider using a de-bounce with the event. field-value-changed # at-field-value-changed → {Object} the field node
Fired when a field has changed. validation-success # at-validation-success → DataObject
Fired when validation results in a valid state. validation-failed # at-validation-failed → DataObject
Fired when validation results in a invalid state. data-object-became-invalid # at-data-object-became-invalid → {Object|EntityNode} reference to entity
Fired when the data object switches from ininvalid to invalid state (bubbles). data-object-became-valid # at-data-object-became-valid → {Object|EntityNode} reference to entity
Fired when the data object switches from invalid to valid state (bubbles). object-ready # at-object-ready → A EntityNode object
Fired when the object defined by type is built (bubbles). init-completed # at-init-completed → A EntityNode object
Fired when the object init was done (bubbles). Methods # injectRaw # injectRaw(jsonObj \`\` ) ⟹ void
\`\` → fn-inject-raw
inject a raw data response from the corresonding agent.
Input may look something like this:
Entity data
1 2 3 4 5 { &#34;data&#34;: {}, &#34;links&#34;: [], &#34;meta&#34;: {} } Collection data
1 2 3 4 5 6 { &#34;data&#34;: {}, &#34;links&#34;: [], &#34;meta&#34;: {}, &#34;entities&#34;: [] } jsonObj setPristine # setPristine() ⟹ void
* → fn-set-pristine
Set all nodes to pristine
Useful for working with deltas
clearAllErrors # clearAllErrors() ⟹ void
* → fn-clear-all-errors
Clears all errors on children without any validation!
validateAllFields # validateAllFields() ⟹ void
* → fn-validate-all-fields
Triggers the validation of all fields in the data object.
Use this before you submit some data to a server.
Will cause a data-object-became-valid or data-object-became-invalid and a validation-success or validation-failed event.
appendErrors # appendErrors(grpcStatus \`\` ) ⟹ void
\`\` → fn-append-errors
Append errors from custom methods or other agents or sources to the data object. The error object must have a grpc status error signature like:
1 2 3 4 5 6 7 8 9 10 11 { &#34;code&#34;:3, &#34;message&#34;:&#34;invalid username&#34;, &#34;details&#34;:[{ &#34;@type&#34;:&#34;type.googleapis.com/google.rpc.BadRequest&#34;, &#34;field_violations&#34;:[{ &#34;field&#34;:&#34;user.name&#34;, &#34;description&#34;:&#34;The username must only contain alphanumeric characters&#34; }] }] } grpcStatus reset # reset() ⟹ void
* → fn-reset
Reset the model to the last injected state.
To set the model to the initial state use init
init # init() ⟹ void
* → fn-init
Sets the model to an initial state according to the given type.
fires init-completed
To reset changed data to the last injected state, please use reset();
getData # getData() ⟹ void
* → fn-get-data
get the data of the data object
`}),e.add({id:23,href:"/docs/modules/furo-util/furo-de-bounce/",title:"furo-de-bounce",section:"@furo/util",content:` furo-de-bounce # @furo/util v2.1.19 import '@furo/util/src/furo-de-bounce.js'; exports FuroDeBounce js exports &lt;furo-de-bounce&gt; custom-element-definition superclass LitElement mixes FBP summary event de bouncer
The Debounce technique allow us to “group” multiple sequential calls in a single one.
Read more about debouncing here
1 2 3 &lt;furo-de-bounce fn-trigger=&#34;--searchStringEntered&#34; at-debounced=&#34;--debouncedSrch&#34; &gt;&lt;/furo-de-bounce&gt; Attributes and Properties # immediate # immediate Boolean If true, input-wire is triggered immediatley (leading edge instead of trailing) Default value: false wait # wait Number Debounce time in milliseconds Default value: 250 Events # out # at-out → *
deprecated, use debounced instead. // TODO: remove @out and fn-input-wire in q2 2022 debounced # at-debounced → *
Fired after N milliseconds. If immediateis set to TRUE, it fires on the leading edge. Methods # trigger # trigger(data * ) ⟹ void
* → fn-trigger
Trigger the debounce
data Any data, will be dispatched on the debounced event. `}),e.add({id:24,href:"/docs/modules/furo-data/furo-deep-link/",title:"furo-deep-link",section:"@furo/data",content:` furo-deep-link # @furo/data v2.18.0 import '@furo/data/src/furo-deep-link.js'; exports FuroDeepLink js exports &lt;furo-deep-link&gt; custom-element-definition superclass LitElement summary Resolve deep links HATEOAS based on query params
furo-deep-link Resolve deep links HATEOAS based on the query params and the selected service.
1 2 3 4 &lt;furo-deep-link service=&#34;TaskService&#34; fn-qp-in=&#34;--pageQueryChanged(*.query)&#34; at-hts-out=&#34;--serviceHTS&#34;&gt; &lt;/furo-deep-link&gt; Deeplink inside of a furo-page
The services must be registered in the Env:
1 2 3 import {Services,Types} from &#34;./furo-spec.js&#34; Init.registerApiServices(Services); Init.registerApiTypes(Types); Usually this is done in your src/configs/init.js
Attributes and Properties # service # service String Set the service name like TaskService.
Services must be registered before. Events # hts-out # at-hts-out → []HTSLinks
Fired when hateoas is available Methods # qpIn # qpIn(queryParams \`\` ) ⟹ void
\`\` → fn-qp-in
Furo-deep-link consumes a object literal with key value pairs.
This can come from the *.query part of an event from furo-location.
Or from a furo-pages wire.
Relevant wires from furo-pages:
&ndash;pageQueryChanged(*.query)
&ndash;pageActivated(*.query)
&ndash;pageHashChanged(*.query)
queryParams trigger # trigger() ⟹ void
* → fn-trigger
Evaluates hts. Use qpIn(qp) if you have a qp object in your event.detail This method have no effect as long _qp is not set.
setService # setService(serviceName \`\` ) ⟹ void
\`\` → fn-set-service
Sets the service by wire
serviceName `}),e.add({id:25,href:"/docs/modules/furo-util/furo-demo-snippet/",title:"furo-demo-snippet",section:"@furo/util",content:` furo-demo-snippet # @furo/util v2.1.19 import '@furo/util/src/doc/furo-demo-snippet.js'; exports FuroDemoSnippet js exports &lt;furo-demo-snippet&gt; custom-element-definition superclass LitElement mixes FBP summary documentation helper
furo-demo-snippet This is a documentation helper to show a example, the flow and the source of an example.
Attributes and Properties # template # markdown # icon # default: '# '
source # source reflects Boolean Show the source tab demo # demo reflects Boolean Show the demo tab flow # flow reflects Boolean Show the flow tab Methods # `}),e.add({id:26,href:"/docs/modules/furo-route/furo-document-title/",title:"furo-document-title",section:"@furo/route",content:` furo-document-title # @furo/route v2.6.13 import '@furo/route/src/furo-document-title.js'; exports FuroDocumentTitle js exports &lt;furo-document-title&gt; custom-element-definition superclass LitElement mixes FBP summary Document title
furo-document-title
Updates the document title and set navigation waypoints.
Structure of the title # The title is built up from 3 parts (prefix, title, suffix). Each of them can be set by attribute or a setter method. The title and suffix part can be set with a fieldnode from a furo-data-object.
document.title = prefix + title + suffix
Waypoints # Waypoints are pushed to the browser history and allows you to navigate with the back and forward buttons of the browser. To return to the last waypoint within your app, you have to trigger a history.back(). Read more about the history API here.
If you use furo-app-flow you can send the history-back event.
Views and pages without a waypoint are not stored in the history.
[a]--&gt;[b]--&gt;[.]--&gt;[.]--&gt;[.]--&gt;[c] ▲ │ └───────────────────────┘ By clicking the back button you will return to b Usage example # 1 2 3 4 5 6 &lt;furo-document-title prefix=&#34;\${i18n.t(&#39;prefix.label&#39;)} [&#34; fn-bind-title=&#34;--DataObject(*.display_name)&#34; suffix=&#34;]&#34; fn-set-waypoint=&#34;--pageActivated&#34; &gt;&lt;/furo-document-title&gt; The document title will be set to: PrefixLabel [display_name_value]
Attributes and Properties # prefix # prefix string default: ''
prefix part, you can also use setPrefix().\` title # title string default: ''
Title part, you can also use setTitle() or bindTitle(). suffix # suffix string default: ''
Suffix part, you can also use setSuffix() or bindSuffix(). Events # waypoint-pushed # at-waypoint-pushed → Event
Fired when the waypoint is finaly pushed to the browser history. waypoint-canceled # at-waypoint-canceled → Event
Fired when the waypoint was set but not pushed to the history, because the user navigated back. Methods # setWaypoint # setWaypoint() ⟹ void
* → fn-set-waypoint
activate # activate() ⟹ void
* → fn-activate
Set the document title with the current prefix title suffix. Without setting a waypoint.
setSuffix # setSuffix(s \`\` ) ⟹ void
\`\` → fn-set-suffix
Updates the suffix
s setTitle # setTitle(title \`\` ) ⟹ void
\`\` → fn-set-title
Updates the title
title string bindSuffix # bindSuffix(fieldnode \`\` ) ⟹ void
\`\` → fn-bind-suffix
Bind a fieldnode to auto update the suffix
fieldnode bindTitle # bindTitle(fieldnode \`\` ) ⟹ void
\`\` → fn-bind-title
Bind a fieldnode to auto update the title
fieldnode `}),e.add({id:27,href:"/docs/modules/furo-layout/furo-empty-spacer/",title:"furo-empty-spacer",section:"@furo/layout",content:` furo-empty-spacer # @furo/layout v2.2.14 import '@furo/layout/src/furo-empty-spacer.js'; exports FuroEmptySpacer js exports &lt;furo-empty-spacer&gt; custom-element-definition superclass LitElement summary fill the space in a furo-xxxx-flex
furo-empty-spacer Takes the place in furo-horizontal-flex or a furo-vertical-flex.
small small Attributes and Properties # flex # flex reflects boolean default: true
Attribute flex for furo-horizontal-flex and furo-vertical-flex hidden # hidden reflects boolean default: false
Set to true to hide the spacer Methods # `}),e.add({id:28,href:"/docs/modules/furo-data/furo-entity-agent/",title:"furo-entity-agent",section:"@furo/data",content:` furo-entity-agent # @furo/data v2.18.0 import '@furo/data/src/furo-entity-agent.js'; exports FuroEntityAgent js exports &lt;furo-entity-agent&gt; custom-element-definition superclass LitElement mixes FBP summary interface component to handle entity requests
furo-entity-agent is an interface component to handle entity requests.
Note When you trigger the save method and there is a HTS wich allows to PATCH the record, only the deltas (changes) of the values are sent.
Hint PUT will send all fields which are not marked as readonly. If you want to send all data on PUT (without filtering readonly fields) set Env.api.sendAllDataOnMethodPut = true;
1 2 3 4 5 6 7 8 9 10 11 12 &lt;!-- The furo-entity-agent will fetch the data from ProjectService and pass it in at-response to the furo-data-object. --&gt; &lt;furo-entity-agent service=&#34;ProjectService&#34; fn-hts-in=&#34;--hts&#34; at-response=&#34;--response&#34; &gt;&lt;/furo-entity-agent&gt; &lt;!-- The furo-data-object will send a initial dataObject of type project.Project on at-response-ready --&gt; &lt;furo-data-object type=&#34;project.ProjectEntity&#34; fn-inject-raw=&#34;--response&#34; &gt;&lt;/furo-data-object&gt; Attributes and Properties # service # service String Setze den Service loadOnHtsIn # load-on-hts-in Boolean triggers a load when link rel=&ldquo;self&rdquo; is in the injected hts (after hts-injected is fired) appendUpdateMaskQP # with-update-mask Boolean Creates the query param update mask according to the google api design guidelines.
Your update service must have a query param update_mask to use this feature.
https://cloud.google.com/apis/design/standard_methods#update
You may not need it if your server can handle PATCHes without a update_mask https://grpc-ecosystem.github.io/grpc-gateway/docs/patch.html Events # response-hts-updated # at-response-hts-updated → hts
Fired when hts was updated from the response. load-success # at-load-success → response
Fired when load() was successful. load-failed # at-load-failed → response
Fired when load() was not successful. delete-success # at-delete-success → response
Fired when delete() was successful. delete-failed # at-delete-failed → response
Fired when delete() was not successful. save-success # at-save-success → response
Fired when save() was successful. save-failed # at-save-failed → response
Fired when save() was not successful. put-success # at-put-success → response
Fired when update() was successful. put-failed # at-put-failed → response
Fired when update() was not successful. create-success # at-create-success → response
Fired when create() was successful. create-failed # at-create-failed → response
Fired when create() was not successful. hts-updated # at-hts-updated → {Array|HATEOAS}
Fired when hateoas is updated from response. hts-injected # at-hts-injected → Hateoas links
Fired when hateoas is updated. request-aborted # at-request-aborted → Request
Fired when a request was canceled. request-started # at-request-started → Request
Fired when a request is sent. response-raw # at-response-raw → Object
Fired when a response is received. response-error # at-response-error → Object
Fired when an error has occoured. This is a general error event. The specific error events are fired additionally. response-error-[status-code] # at-response-error-[status-code] → Object
Fired when an error has occoured. This is a specific error event. fatal-error # at-fatal-error → Request
Requests are made via the Fetch API if possible.Fallback XMLHttpRequest response-error-4xx # at-response-error-4xx → Object
Fired when an error has occoured. This is a group error event. E.g. response-error-5xx, response-error-4xx response-error-5xx # at-response-error-5xx → Object
Fired when an error has occoured. This is a group error event. E.g. response-error-5xx, response-error-4xx response-error-raw # at-response-error-raw → Object
Fired when a error has occoured. response # at-response → Object
Fired when a response is received. Methods # updateQp # updateQp(qp \`\` key Object ) ⟹ void
\`\` Object → fn-update-qp
Update query params a qp like {&ldquo;active&rdquo;:true} will just update the qp active
If the current value of the qp is not the same like the injected value, a qp-changed event will be fired
qp key value pairs bindRequestData # bindRequestData(dataObject \`\` ) ⟹ void
\`\` → fn-bind-request-data
Binds a furo-data-object type. Use this if you want save data.
dataObject clearQp # clearQp() ⟹ void
* → fn-clear-qp
clear the query params that you have setted before
load # load() ⟹ void
* → fn-load
loads the entity if hts is available
delete # delete() ⟹ void
* → fn-delete
delete the entity if hts is available
save # save() ⟹ void
* → fn-save
loads the entity if hts is available
put # put() ⟹ void
* → fn-put
saves the entity with method put if hts is available
create # create() ⟹ void
* → fn-create
creating the entity if hts rel=&ldquo;create&rdquo; is available
htsIn # htsIn(hts \`\` ) ⟹ void
\`\` → fn-hts-in
hts abortPendingRequest # abortPendingRequest() ⟹ void
* → fn-abort-pending-request
Aborts a pending request
`}),e.add({id:29,href:"/docs/modules/furo-data/furo-entity-field/",title:"furo-entity-field",section:"@furo/data",content:` furo-entity-field # @furo/data v2.18.0 import '@furo/data/src/furo-entity-field.js'; exports FuroEntityField js exports &lt;furo-entity-field&gt; custom-element-definition superclass LitElement summary interact with single field of a data object
Use this component to interact with fields from a furo-data-object.
You can update the field value or listen to changes of a field.
1 &lt;furo-entity-field fn-bind-data=&#34;--dataObject(*.field)&#34;&gt;&lt;/furo-entity-field&gt; Attributes and Properties # value # Set a value to update the fieldnode Events # value-changed # at-value-changed → *
Fired when the field value or a child value of it was changed. Methods # setValue # setValue(value * ) ⟹ void
* → fn-set-value
Set the value of the field.
value bindData # bindData(fieldNode Object|FieldNode ) ⟹ void
Object|FieldNode → fn-bind-data
Bind a FieldNode to the date-input.
--personDO(*.person.firstname)
fieldNode a Field object deleteNode # deleteNode() ⟹ void
* → fn-delete-node
Trigger deleteNode on the FieldNode.
`}),e.add({id:30,href:"/docs/modules/furo-util/furo-feature-toggle/",title:"furo-feature-toggle",section:"@furo/util",content:` furo-feature-toggle # @furo/util v2.1.19 import '@furo/util/src/furo-feature-toggle.js'; exports FuroFeatureToggle js exports &lt;furo-feature-toggle&gt; custom-element-definition superclass LitElement mixes FBP summary flow based handler for feature toggles
furo-feature-toggle Is a handler for feature toggles, you can react to key changes with FBP. This component is quite simple, but gives you a lot of possibilities. Read more about feature toggles in the guide
1 2 3 4 5 6 7 8 9 &lt;!-- setting a key --&gt; &lt;furo-feature-toggle key=&#34;feature.easter.egg&#34; fn-set-true=&#34;--activateClicked&#34; fn-set-false=&#34;--disableClicked&#34;&gt; &lt;/furo-feature-toggle&gt; &lt;!-- observing key changes --&gt; &lt;furo-feature-toggle key=&#34;feature.xxxx.yyy&#34; at-key-activated=&#34;--fxyActivated&#34; at-key-changed=&#34;--fxyChanged&#34;&gt; &lt;/furo-feature-toggle&gt; Attributes and Properties # key # key String Name of a feature toggle. Events # key-true # at-key-true → true
Fired when the key is set to true or is true on init. key-false # at-key-false → false
Fired when the key is set to false or is false on init. key-changed # at-key-changed → Boolean
Fired on init and when the key changes its state. Methods # setFalse # setFalse() ⟹ void
* → fn-set-false
Sets a feature key state to false.
setTrue # setTrue() ⟹ void
* → fn-set-true
Sets a feature key state to true.
`}),e.add({id:31,href:"/docs/modules/furo-util/furo-fetch-json/",title:"furo-fetch-json",section:"@furo/util",content:` furo-fetch-json # @furo/util v2.1.19 import '@furo/util/src/furo-fetch-json.js'; exports FuroFetchJson js exports &lt;furo-fetch-json&gt; custom-element-definition superclass LitElement mixes FBP summary fetch json data
furo-fetch-json Fetches and parses json data from a source.
1 &lt;furo-fetch-json src=&#34;/example.json&#34; fn-fetch=&#34;|--FBPready&#34; at-data=&#34;--contentReceived&#34;&gt;&lt;/furo-fetch-json&gt; Attributes and Properties # src # src String the url you want to fetch Events # data # at-data → {Object} json data
Fired when data received and json parsed parse-error # at-parse-error → error
Fired when json is not parseable Methods # fetch # fetch() ⟹ Promise
* → fn-fetch
fetch and parse the data from specified src.
Use fetch-src if you want to pass the source url
fetchSrc # fetchSrc(source *String* ) ⟹ Promise
→ fn-fetch-src
fetch json data from source
source String source `}),e.add({id:32,href:"/docs/modules/furo-layout/furo-form-layouter/",title:"furo-form-layouter",section:"@furo/layout",content:` furo-form-layouter # @furo/layout v2.2.14 import '@furo/layout/src/furo-form-layouter.js'; exports FuroFormLayouter js exports &lt;furo-form-layouter&gt; custom-element-definition superclass LitElement mixes FBP summary Grid based form field row
furo-form-layouter
Use furo-form-layouter to structure your forms. It is based on a grid system with the following properties:
full-width row (Standard) two columns four columns The required variant is set using an attribute. e.g. two, three, four and six
1 2 3 4 5 6 7 &lt;!-- four coulumn layout --&gt; &lt;furo-form-layouter four&gt; &lt;input-element&gt;&lt;/input-element&gt; &lt;input-element double&gt;&lt;/input-element&gt; &lt;input-element newline&gt;&lt;/input-element&gt; &lt;input-element full&gt;&lt;/input-element&gt; &lt;/furo-form-layouter&gt; To customize the slotted elements inside furo-form-layouter there are several attributes.
double | stretches the element over two units full | stretches the element to full width newline | forces a new line Responsiveness # Columns narrow narrower one one one two one one three one one four two one six three one Attributes and Properties # narrow # default: false
narrower # default: false
breakpointBig # breakpoint-big reflects number default: 810
Set custom breakpoint big Default: &ldquo;810&rdquo; breakpointSmall # breakpoint-small reflects number default: 405
Set custom breakpoints small Default: &ldquo;405&rdquo; narrowFix # narrow-fix reflects Boolean Set narrow-fix attribute to force the layout analog to breakpoint big narrowerFix # narrower-fix reflects Boolean Set narrower-fix attribute to force 1 column view (analog breakpoint small) Events # layout-changed # at-layout-changed → CustomEvent
Methods # Slots # default # Type: HTMLElement [0..n]
default slot to add content. Styling # The following custom properties available for styling:
Custom property Description --furo-form-layouter-row-gap width of row gap default: 0px fallback: 0px --furo-form-layouter-column-gap width of column gap default: 0px fallback: 0px `}),e.add({id:33,href:"/docs/modules/furo-util/furo-forth-stack/",title:"furo-forth-stack",section:"@furo/util",content:` furo-forth-stack # @furo/util v2.1.19 import '@furo/util/src/furo-forth-stack.js'; exports FuroForthStack js exports &lt;furo-forth-stack&gt; custom-element-definition superclass LitElement summary forth like stack
furo-forth-stack is a declarative stack, inspired by the forth stack.
https://hackaday.com/2017/01/27/forth-the-hackers-language/ http://wiki.laptop.org/go/Forth_stack_operators http://galileo.phys.virginia.edu/classes/551.jvn.fall01/primer.htm#stacks
Attributes and Properties # size # default: 0
Current size of the stack Events # stack-size-changed # at-stack-size-changed → Number
Fired when the stack size changes with Integer with the current size of the stack. rotated # at-rotated → the top element
Fired when stack was rotated stack-changed # at-stack-changed → the top element
Fired when the stack contents changes after put, drop,&hellip; swapped # at-swapped → void
Fired when stack was swapped empty # at-empty → void
Fired when stack gets empty Methods # clearStack # clearStack() ⟹ void
* → fn-clear-stack
Empties the stack and set the stack-size to 0
put # put(e \`\` ) ⟹ void
\`\` → fn-put
Add an element to the stack
e swap # swap() ⟹ void
* → fn-swap
swap ( n1 n2 &ndash; n2 n1 )
swap, as you may have guessed, swaps the top two elements of the stack. For example:
1 2 3 4 swap will give you:
1 2 4 3 &lt;- Top
drop # drop() ⟹ void
* → fn-drop
drop ( n &ndash; )
drop simply drops the top element of the stack. Running:
1 2 3 drop gives you a stack of:
1 2 &lt;- Top
dup # dup() ⟹ void
* → fn-dup
dup ( n &ndash; n n )
dup is short for “duplicate” – it duplicates the top element of the stack. For example, try this out: 1 2 3 dup You should end up with the following stack: 1 2 3 3 &lt;- Top over # over() ⟹ void
* → fn-over
over ( n1 n2 &ndash; n1 n2 n1 )
over is a bit less obvious: it takes the second element from the top of the stack and duplicates it to the top of the stack. Running this:
1 2 3 over will result in this:
1 2 3 2 &lt;- Top
rot # rot() ⟹ void
* → fn-rot
rot ( n1 n2 n3 &ndash; n2 n3 n1 )
Finally, rot “rotates” the top three elements of the stack. The third element from the top of the stack gets moved to the top of the stack, pushing the other two elements down.
1 2 3 rot gives you:
2 3 1 &lt;- Top
rrot # rrot() ⟹ void
* → fn-rrot
rrot ( n1 n2 n3 &ndash; n3 n1 n2 )
Reverse rotation or right rotation rrot “rotates” the elements of the stack inverse to rot. The top elemen the stack gets moved to the bottom of the stack.
1 2 3 rot gives you:
3 1 2 &lt;- Top
`}),e.add({id:34,href:"/docs/modules/furo-util/furo-get-clipboard/",title:"furo-get-clipboard",section:"@furo/util",content:` furo-get-clipboard # @furo/util v2.1.19 import '@furo/util/src/furo-get-clipboard.js'; exports FuroGetClipboard js exports &lt;furo-get-clipboard&gt; custom-element-definition superclass LitElement mixes FBP summary get clipboard content
furo-get-clipboard get the clipboard content from the OS.
1 2 3 4 &lt;furo-get-clipboard fn-trigger=&#34;--clipboardContentRequested&#34; at-content=&#34;--contentReceived&#34; &gt;&lt;/furo-get-clipboard&gt; Attributes and Properties # json # json String Convert clipboard content to json Events # content # at-content → \`\`
Fired when clipboard content is received Methods # trigger # trigger() ⟹ void
* → fn-trigger
`}),e.add({id:35,href:"/docs/modules/furo-util/furo-graph-renderer/",title:"furo-graph-renderer",section:"@furo/util",content:` furo-graph-renderer # @furo/util v2.1.19 import '@furo/util/src/doc/graph/furo-graph-renderer.js'; exports FuroGraphRenderer js exports &lt;furo-graph-renderer&gt; custom-element-definition superclass LitElement mixes FBP summary paints a dagree graph as svg
furo-graph-renderer Paint a SVG from the received graph data
Attributes and Properties # Events # show-tooltip-requested # at-show-tooltip-requested → node
Fired on mouseover of a attr node Methods # draw # draw(graph dagre ) ⟹ void
dagre → fn-draw
Draw the graph as svg
graph Dagre graph `}),e.add({id:36,href:"/docs/modules/furo-data/furo-hateoas-state/",title:"furo-hateoas-state",section:"@furo/data",content:` furo-hateoas-state # @furo/data v2.18.0 import '@furo/data/src/furo-hateoas-state.js'; exports FuroHateoasState js exports &lt;furo-hateoas-state&gt; custom-element-definition superclass LitElement mixes FieldNodeAdapter summary disables or hide nodes based on hts
furo-hateoas-state is an invisible component with a binding of type furo.Link or injection of a link array.
It disables / enables or hides / shows components according to the injected HATEOAS links. furo-hateoas-state only sets or remove the attributes hidden and disabled on the nodes.
All nodes inside the same parent are taken in to control.
Elements inside a shadow root are not selected.
Set the attribute data-rel=&ldquo;list&rdquo; on any element you want to control with furo-hateoas-state.
Set the attribute hide-no-rel if you want to hide the node instead of being disabled.
1 2 3 4 5 6 &lt;div&gt; &lt;button data-rel=&#39;list&#39;&gt;list&lt;/button&gt; &lt;button hide-no-rel data-rel=&#39;list&#39;&gt;hide no rel&lt;/button&gt; &lt;button data-rel=&#39;add&#39;&gt;add&lt;/button&gt; &lt;furo-hateoas-state fn-bind-hts=&#39;--collection(*.links)&#39;&gt;&lt;/furo-hateoas-state&gt; &lt;/div&gt; all elements with a data-rel=&ldquo;something&rdquo; attribute inside the div are controlled
Attributes and Properties # Methods # enable # enable() ⟹ void
* → fn-enable
Enable or show all nodes.
disable # disable() ⟹ void
* → fn-disable
Disable or hide all nodes.
bindData # bindData(fieldNode \`\` ) ⟹ boolean
\`\` → fn-bind-data
Binds a fieldNode. Make sure the type of your field is accepted by the implemented component.
fieldNode bindHts # bindHts(Links \`\` ) ⟹ void
\`\` → fn-bind-hts
Bind a RepeaterNode of type furo.Link.
Links injectHts # injectHts(value [json] ) ⟹ void
[json] → fn-inject-hts
Inject a link array directly.
1 2 3 4 5 6 7 8 9 [ { &#34;href&#34;: &#34;/mockdata/persons/list&#34;, &#34;method&#34;: &#34;GET&#34;, &#34;rel&#34;: &#34;list&#34;, &#34;type&#34;: &#34;person.PersonCollection&#34;, &#34;service&#34;: &#34;PersonService&#34; } ] value Array with raw furo.Link like `}),e.add({id:37,href:"/docs/modules/furo-util/furo-head-tail/",title:"furo-head-tail",section:"@furo/util",content:` furo-head-tail # @furo/util v2.1.19 import '@furo/util/src/furo-head-tail.js'; exports FuroHeadTail js exports &lt;furo-head-tail&gt; custom-element-definition superclass HTMLElement summary split an array
furo-head-tail Splits an iterable (i.e. Array) in its head and tail part.
&lt;furo-head-tail fn-split=&#34;--arrayData&#34; at-head=&#34;--firstElement&#34; at-tail=&#34;--restOfArray&#34;&gt;&lt;/furo-head-tail&gt; Attributes and Properties # Events # head # at-head → {Any}
Fired when Array was splitted, contains the first element of array. tail # at-tail → Array | Any
Fired when Array was splitted. {Array || Any} is the tail from the injected array (e1 - 1n) Methods # split # split(iterable \`\` ) ⟹ void
\`\` → fn-split
Splits an iterable to its head (first item) and its tail (the rest) parts.
[&#34;a&#34;, &#34;b&#34;, &#34;c&#34;, &#34;d&#34;] |_| |___________| ^ ^ | | | TAIL =&gt; [&#34;b&#34;, &#34;c&#34;, &#34;d&#34;] HEAD =&gt; &#34;a&#34; iterable `}),e.add({id:38,href:"/docs/modules/furo-layout/furo-horizontal-flex/",title:"furo-horizontal-flex",section:"@furo/layout",content:` furo-horizontal-flex # @furo/layout v2.2.14 import '@furo/layout/src/furo-horizontal-flex.js'; exports FuroHorizontalFlex js exports &lt;furo-horizontal-flex&gt; custom-element-definition superclass LitElement summary horizontal alignment
furo-horizontal-flex
With this component, any elements can be aligned horizontally. Similar to css flex. The attribute &ldquo;flex&rdquo; must be set for growing elements. The component takes up 100% of the space.
1 2 3 4 5 &lt;furo-horizontal-flex&gt; &lt;div&gt;small&lt;/div&gt; &lt;div flex&gt;full width&lt;/div&gt; &lt;div&gt;small&lt;/div&gt; &lt;/furo-horizontal-flex&gt; Attributes and Properties # Methods # Slots # default # Type: HTMLElement [0..n]
default slot to add content. Styling # The following custom properties available for styling:
Custom property Description --furo-horizontal-flex-space default padding (space) default: 0.5rem fallback: N/A --furo-horizontal-flex-bigspace big padding (bigspace) Tags: layout default: 3rem fallback: N/A `}),e.add({id:39,href:"/docs/modules/furo-util/furo-hp-35/",title:"furo-hp-35",section:"@furo/util",content:` furo-hp-35 # @furo/util v2.1.19 import '@furo/util/src/furo-hp-35.js'; exports FuroHp35 js exports &lt;furo-hp-35&gt; custom-element-definition extends /src/furo-forth-stack.js superclass FuroForthStack summary calculator component
hp-35 is a declarative rpn calculator component.
see https://hansklav.home.xs4all.nl/rpn/
http://h10032.www1.hp.com/ctg/Manual/c01579350
Attributes and Properties # radMode # radMode boolean default: false
Set to true to use rad, default is deg x # x Number current x y # y Number current y z # z Number current z t # t Number current t stack # stack Array the stack. size # default: 0
Current size of the stack Events # stackchange # at-stackchange → void
Fired when something in stack changes stack-size-changed # at-stack-size-changed → Number
Fired when the stack size changes with Integer with the current size of the stack. rotated # at-rotated → the top element
Fired when stack was rotated stack-changed # at-stack-changed → the top element
Fired when the stack contents changes after put, drop,&hellip; swapped # at-swapped → void
Fired when stack was swapped empty # at-empty → void
Fired when stack gets empty Methods # enter # enter(n Number ) ⟹ void
Number → fn-enter
Enter a number
n updateXYZT # updateXYZT() ⟹ void
* → fn-update-xyzt
swap # swap() ⟹ void
* → fn-swap
swap ( n1 n2 &ndash; n2 n1 )
swap, as you may have guessed, swaps the top two elements of the stack. For example:
1 2 3 4 swap will give you:
1 2 4 3 &lt;- Top
rot # rot() ⟹ void
* → fn-rot
rot ( n1 n2 n3 &ndash; n2 n3 n1 )
Finally, rot “rotates” the top three elements of the stack. The third element from the top of the stack gets moved to the top of the stack, pushing the other two elements down.
1 2 3 rot gives you:
2 3 1 &lt;- Top
roll # roll() ⟹ void
* → fn-roll
rot ( n1 n2 n3 &ndash; n2 n3 n1 )
Finally, rot “rotates” the top three elements of the stack. The third element from the top of the stack gets moved to the top of the stack, pushing the other two elements down.
1 2 3 rot gives you:
2 3 1 &lt;- Top
add # add(n Number ) ⟹ number
Number → fn-add
Process an addition
n substract # substract(n Number ) ⟹ number
Number → fn-substract
Process a substraction
n sqrt # sqrt(n Number ) ⟹ number
Number → fn-sqrt
Perform square root operation
n ln # ln(n Number ) ⟹ number
Number → fn-ln
Perform log operation
n cos # cos(n Number ) ⟹ number
Number → fn-cos
Perform cos operation
n sin # sin(n Number ) ⟹ number
Number → fn-sin
Perform sin operation
n tan # tan(n Number ) ⟹ number
Number → fn-tan
Perform tan operation
n abs # abs(n Number ) ⟹ number
Number → fn-abs
Perform abs operation
n reciprocal # reciprocal(n Number ) ⟹ number
Number → fn-reciprocal
Perform reciprocal operation
n exp # exp(n Number ) ⟹ number
Number → fn-exp
Perform exp operation
returns e^x, where x is the argument, and e is Euler&rsquo;s number (also known as Napier&rsquo;s constant), the base of the natural logarithms.
n xroot # xroot(n \`\` ) ⟹ void
\`\` → fn-xroot
n multiply # multiply(n Number ) ⟹ number
Number → fn-multiply
Process a multiplication
n pow # pow(n Number ) ⟹ number
Number → fn-pow
Process power
n divide # divide(n Number ) ⟹ number
Number → fn-divide
Process a division
n clear # clear() ⟹ void
* → fn-clear
clear the stack
clearStack # clearStack() ⟹ void
* → fn-clear-stack
Empties the stack and set the stack-size to 0
put # put(e \`\` ) ⟹ void
\`\` → fn-put
Add an element to the stack
e drop # drop() ⟹ void
* → fn-drop
drop ( n &ndash; )
drop simply drops the top element of the stack. Running:
1 2 3 drop gives you a stack of:
1 2 &lt;- Top
dup # dup() ⟹ void
* → fn-dup
dup ( n &ndash; n n )
dup is short for “duplicate” – it duplicates the top element of the stack. For example, try this out: 1 2 3 dup You should end up with the following stack: 1 2 3 3 &lt;- Top over # over() ⟹ void
* → fn-over
over ( n1 n2 &ndash; n1 n2 n1 )
over is a bit less obvious: it takes the second element from the top of the stack and duplicates it to the top of the stack. Running this:
1 2 3 over will result in this:
1 2 3 2 &lt;- Top
rrot # rrot() ⟹ void
* → fn-rrot
rrot ( n1 n2 n3 &ndash; n3 n1 n2 )
Reverse rotation or right rotation rrot “rotates” the elements of the stack inverse to rot. The top elemen the stack gets moved to the bottom of the stack.
1 2 3 rot gives you:
3 1 2 &lt;- Top
`}),e.add({id:40,href:"/docs/modules/furo-util/furo-interval-pulse/",title:"furo-interval-pulse",section:"@furo/util",content:` furo-interval-pulse # @furo/util v2.1.19 import '@furo/util/src/furo-interval-pulse.js'; exports FuroIntervalPulse js exports &lt;furo-interval-pulse&gt; custom-element-definition superclass LitElement summary trigger an event in intervals
furo-interval-pulse
Pulses a tick event every interval ms duration and every takt a tock event is also fired.
Attributes and Properties # interval # interval number default: 200
Duration of a tact in ms. takt # takt number default: 4
Number of ticks per tact. auto # auto Boolean Starts interval automatically Events # tick # at-tick → Number
Fired on every interval with the position of the pulse starting at 0. tock # at-tock → Number
Fired nth interval defined by takt. Methods # start # start() ⟹ void
* → fn-start
Starts the pulsing.
stop # stop() ⟹ void
* → fn-stop
Stops the pulsing.
`}),e.add({id:41,href:"/docs/modules/furo-util/furo-key-filter/",title:"furo-key-filter",section:"@furo/util",content:` furo-key-filter # @furo/util v2.1.19 import '@furo/util/src/furo-key-filter.js'; exports FuroKeyFilter js exports &lt;furo-key-filter&gt; custom-element-definition superclass LitElement mixes FBP summary keyboard event filter
furo-key-filter Allows only defined keyboard events to pass through
1 2 3 4 5 6 &lt;!-- note the asterisk on other-component keydown. Because filter needs the keyboard event. --&gt; &lt;other-component at-keydown=&#34;--keydown(*)&#34;&gt;&lt;/other-component&gt; &lt;furo-key-filter fn-filter=&#34;--keydown&#34; at-matched=&#34;--escapePressed&#34; keys=&#34;Escape&#34; &gt;&lt;/furo-key-filter&gt; Attributes and Properties # keys # keys String Coma separated list with allowed keys to pass. i.e &ldquo;Enter, ArrowUp&rdquo; shift # shift Boolean Modifier key shift must be pressed too to match alt # alt Boolean Modifier key alt must be pressed too to match command # command Boolean Alias for meta.
Modifier key meta must be pressed too to match. meta # meta Boolean Modifier key meta must be pressed too to match control # control Boolean Modifier key control must be pressed too to match Events # matched # at-matched → KeyboardEvent
Fired when key matches the options Methods # filter # filter(keyboardEvent \`\` ) ⟹ void
\`\` → fn-filter
Check the event and dispatch matched when the conditions are fulfilled.
keyboardEvent `}),e.add({id:42,href:"/docs/modules/furo-util/furo-keydown/",title:"furo-keydown",section:"@furo/util",content:` furo-keydown # @furo/util v2.1.19 import '@furo/util/src/furo-keydown.js'; exports FuroKeydown js exports &lt;furo-keydown&gt; custom-element-definition superclass LitElement mixes FBP summary keyboard event listener
furo-keydown attaches a keypress listener to the parent element and gives you handy events to work with.
When you set alt, ctrl or any of the other arguments, the key event will be triggered only if the corresponding key was pressed too.
more about keydown
1 2 &lt;furo-keydown key=&#34;Enter&#34; at-key=&#34;--enterPressed&#34;&gt;&lt;/furo-keydown&gt; &lt;furo-keydown ctrl key=&#34;c&#34; at-key=&#34;--copyRequested&#34;&gt;&lt;/furo-keydown&gt; Attributes and Properties # key # key String Key to listen on. Like Enter, Backspace, ArrowLeft, A,B,C, a,b,c global # global Boolean Set this attribute to listen to the keydown event global (window). alt # alt Boolean alt key must be pressed to trigger the key event. ctrl # ctrl Boolean ctrl key must be pressed to trigger the key event. meta # meta Boolean meta key must be pressed to trigger the key event. shift # shift Boolean shift key must be pressed to trigger the key event. preventDefault # prevent-default Boolean Set this attribute to prevent the event default of the keypress event. stopPropagation # stop-propagation Boolean Set this to true to stop the event propagation of the keypress event. Events # key # at-key → KeyboardEvent
Fired when key was catched on target Methods # `}),e.add({id:43,href:"/docs/modules/furo-route/furo-location/",title:"furo-location",section:"@furo/route",content:` furo-location # @furo/route v2.6.13 import '@furo/route/src/furo-location.js'; exports FuroLocation js exports &lt;furo-location&gt; custom-element-definition superclass LitElement summary url watcher
furo-location watches for URL changes and notifies you. The location object which is fired from furo-location can be used for page navigation in furo-pages or for deep link resolution.
1 2 3 4 5 6 7 8 9 &lt;furo-location at-location-changed=&#34;--pathChanged&#34;&gt;&lt;/furo-location&gt; &lt;furo-pages fn-inject-location=&#34;--pathChanged&#34; default=&#34;list&#34;&gt; &lt;view-list name=&#34;list&#34;&gt;&lt;/view-list&gt; &lt;view-create name=&#34;create&#34;&gt;&lt;/view-create&gt; &lt;view-detail name=&#34;detail&#34;&gt;&lt;/view-detail&gt; &lt;/furo-pages&gt; locationObject # 1 2 3 4 5 6 7 8 9 10 11 { &#34;host&#34;: &#34;localhost:8480&#34;, &#34;query&#34;: {&#34;tsk&#34;: 999}, &#34;hash&#34;: {}, &#34;path&#34;: &#34;/detail&#34;, &#34;pathSegments&#34;: [ &#34;detail&#34; ], &#34;hashstring&#34;: &#34;&#34;, &#34;querystring&#34;: &#34;tsk=999&#34; } Attributes and Properties # urlSpaceRegex # url-space-regex string|RegExp default: ''
A regexp that defines the set of URLs that should be considered part of this web app.
Clicking on a link that matches this regex won&rsquo;t result in a full page navigation, but will instead just update the URL state in place.
This regexp is given everything after the origin in an absolute URL. So to match just URLs that start with /app/ do: url-space-regex=&quot;^/app/&quot;
If you plan to work in sub directories, you may set url-space-regex=&quot;^\${window.APPROOT}/additional/path&quot;. Keep in mind to put a &ldquo;url-space-regex&rdquo; on every furo-location. Otherwise you can not switch between apps in different folders with a link. Events # location-path-changed # at-location-path-changed → Location object
Fired when Path portion of the location changed location-hash-changed # at-location-hash-changed → Location object
Fired when Hash portion of the location changed location-query-changed # at-location-query-changed → Location object
Fired when Query portion of the location changed location-changed # at-location-changed → Location object
Fired when something in the location changed external-link-clicked # at-external-link-clicked → Location object
Fired when a external link was clicked url-space-entered # at-url-space-entered → Location object
Fired when the path matches the url-space-regex and neither a search query or hash was given, useful to detect if someone enters the current url __beforeReplaceState # at-__beforeReplaceState → void
Fired when before the state will be updated Methods # `}),e.add({id:44,href:"/docs/modules/furo-route/furo-location-updater/",title:"furo-location-updater",section:"@furo/route",content:` furo-location-updater # @furo/route v2.6.13 import '@furo/route/src/furo-location-updater.js'; exports FuroLocationUpdater js exports &lt;furo-location-updater&gt; custom-element-definition superclass LitElement mixes FBP summary deep linking helper
furo-location-updater updates parts of the url location with pushState
You can set query params and hashes. Use this component for proper deep linking. The furo-location component will fire the location events as usual.
1 2 3 4 &lt;furo-location-updater fn-set-qp=&#34;--QueryParamKeyValuePairs&#34; fn-set-hash=&#34;--HashKeyValuePairs&#34;&gt;&lt;/furo-location-updater&gt; Attributes and Properties # clearQp # clear-qp String Comma separated list of qp keys to clear if they are not explicitly set with fn-set-qp clearHash # clear-hash String Comma separated list of hashes to clear if they are not explicitly set with fn-set-hash Events # __beforeReplaceState # at-__beforeReplaceState → Number
Fired when before the state will be updated, with window.performance.now(). Methods # setQp # setQp(newQP \`\` ) ⟹ void
\`\` → fn-set-qp
Set query params by giving an object with key-value pairs.
Keep in mind, that this values goes to the url, so setting objects as values is not a good idea
newQP setHash # setHash(newHASH \`\` ) ⟹ void
\`\` → fn-set-hash
Set hash values by giving an object with key-value pairs.
Keep in mind, that this values goes to the url, so setting objects as values is not a good idea
newHASH `}),e.add({id:45,href:"/docs/modules/furo-route/furo-lock-navigation/",title:"furo-lock-navigation",section:"@furo/route",content:` furo-lock-navigation # @furo/route v2.6.13 import '@furo/route/src/furo-lock-navigation.js'; exports FuroLockNavigation js exports &lt;furo-lock-navigation&gt; custom-element-definition superclass LitElement mixes FBP summary Blocks the furo-location-updater from navigating away
furo-lock-navigation Blocks the furo-location-updater and furo-app-flow-router from navigating away if you have unsaved changes or work to do.
This component also adds a listener to the unload event, which kicks in at a reload or close of the window.
1 &lt;furo-lock-navigation fn-lock=&#34;--dataChanged&#34; fn-unlock=&#34;--saveSuccess&#34;&gt;&lt;/furo-lock-navigation&gt; Attributes and Properties # message # message string default: 'You have unsaved changes, proceed anyway?'
The warning message, which is displayed at the prompt. Events # furo-navigation-locked # at-furo-navigation-locked → void
Fired when the navigation was locked furo-navigation-unlocked # at-furo-navigation-unlocked → void
Fired when the navigation was unlocked Methods # lock # lock() ⟹ void
* → fn-lock
Blocks furo-location-updater and furo-app-flow-router from navigating away.
unlock # unlock() ⟹ void
* → fn-unlock
Removes the lock.
`}),e.add({id:46,href:"/docs/modules/furo-util/furo-markdown/",title:"furo-markdown",section:"@furo/util",content:` furo-markdown # @furo/util v2.1.19 import '@furo/util/src/furo-markdown.js'; exports FuroMarkdown js exports &lt;furo-markdown&gt; custom-element-definition superclass LitElement summary renders markdown data
furo-markdown Renders given md data with parseMarkdown or loads a md file with mdsrc=&quot;source.md&quot;
Attributes and Properties # mdsrc # mdsrc String source of the md markdown # markdown String markdown string markdownRendered # default: undefined
unsafe # unsafe Boolean allow unsafe md. (writing html, components,&hellip;) Methods # fetchMd # fetchMd(src \`\` ) ⟹ Promise&amp;lt;string | never&amp;gt;
\`\` → fn-fetch-md
fetch markdown from a url or path
src parseMarkdown # parseMarkdown(markdown \`\` ) ⟹ void
\`\` → fn-parse-markdown
Parse markdown string to html content
markdown `}),e.add({id:47,href:"/docs/modules/furo-data/furo-message-container-handler/",title:"furo-message-container-handler",section:"@furo/data",content:` furo-message-container-handler # @furo/data v2.18.0 import '@furo/data/src/furo-message-container-handler.js'; exports FuroMessageContainerHandler js exports &lt;furo-message-container-handler&gt; custom-element-definition superclass LitElement summary furo.MessageContainer handler
furo-message-container-handler will update the &lsquo;value states&rsquo; of all fields of your data object from the injected furo.MessageContainer message.
Attributes and Properties # Events # success # at-success → void
Fired when success field was set on the received furo.MessageContainer. no-success # at-no-success → void
Fired when the success field on the furo.MessageContainer was not set or is set to false. has-confirmation # at-has-confirmation → []furo.ConfirmationMessage
Fired when the message container contains any confirmation field, with list with all furo.ConfirmationMessage. has-errors # at-has-errors → []furo.MCFieldViolation
Fired when the message container contains any error field, with list with all error fields. has-success # at-has-success → []furo.MCFieldViolation
Fired when the message container contains any success field, with list with all success fields. has-warnings # at-has-warnings → []furo.MCFieldViolation
Fired when the message container contains any warning field, with list with all warning fields. has-infos # at-has-infos → []furo.MCFieldViolation
Fired when the message container contains any info field, with list with all info fields. Methods # injectRaw # injectRaw(messageContainer JSON ) ⟹ void
JSON → fn-inject-raw
This will set the corresponding value-states on the sibling nodes of the bounded furo.MessageContainer field.
messageContainer with furo.MessageContainer signature _updateCountersAndFireEvents # _updateCountersAndFireEvents() ⟹ void
* → fn&ndash;update-counters-and-fire-events
_applyValueState # _applyValueState() ⟹ void
* → fn&ndash;apply-value-state
_clearValueStates # _clearValueStates() ⟹ void
* → fn&ndash;clear-value-states
bindMessageContainer # bindMessageContainer(fieldNode FieldNode ) ⟹ void
FieldNode → fn-bind-message-container
bindMc Bind a furo.MessageContainer fieldnode.
The updates from the injected raw messagecontainer are applied to the siblings of the bounded node.
fieldNode Messagecontainer fieldnode bindRootNode # bindRootNode(fieldNode FieldNode ) ⟹ void
FieldNode → fn-bind-root-node
bindMc Bind a furo.MessageContainer fieldnode.
The updates from the injected raw messagecontainer are applied to the siblings of the bounded node.
fieldNode Messagecontainer fieldnode `}),e.add({id:48,href:"/docs/modules/furo-util/furo-navigation-pad/",title:"furo-navigation-pad",section:"@furo/util",content:` furo-navigation-pad # @furo/util v2.1.19 import '@furo/util/src/furo-navigation-pad.js'; exports FuroNavigationPad js exports &lt;furo-navigation-pad&gt; custom-element-definition superclass LitElement mixes FBP summary keyboard navigation helper
furo-navigation-pad listens to different keyboard navigation events like the arrow keys. It will attach the listeners to the parent node and cancel the default and stop the propagation of the events.
The events are available as standalone events or as combined event in the navigated event.
1 2 3 4 &lt;!-- forward all navigation events except the Escape --&gt; &lt;furo-navigation-pad ignored-keys=&#34;Escape&#34; at-navigated=&#34;--navpad&#34; &gt;&lt;/furo-navigation-pad&gt; Attributes and Properties # ignoredKeys # ignored-keys String Enter the keys you want to ignore as comma seperated values.
i.e. &ldquo;Escape, ArrowLeft&rdquo; Events # navigated # at-navigated → String
Generic navigation event, fired when one of the navigation keys was pressed, detail contains one of these: Escape | Enter | ArrowDown | ArrowUp |ArrowLeft|ArrowRight| PageUp | PageDown | Home | End enter-pressed # at-enter-pressed → KeyboardEvent
Fired when Enter key was pressed. arrow-down-pressed # at-arrow-down-pressed → KeyboardEvent
Fired when ArrowDown key was pressed. arrow-up-pressed # at-arrow-up-pressed → KeyboardEvent
Fired when ArrowUp key was pressed. arrow-left-pressed # at-arrow-left-pressed → KeyboardEvent
Fired when ArrowLeft key was pressed. arrow-right-pressed # at-arrow-right-pressed → KeyboardEvent
Fired when ArrowRight key was pressed. escape-pressed # at-escape-pressed → KeyboardEvent
Fired when Escape key was pressed. page-up-pressed # at-page-up-pressed → KeyboardEvent
Fired when PageUp key was pressed. page-down-pressed # at-page-down-pressed → KeyboardEvent
Fired when PageDown key was pressed. home-pressed # at-home-pressed → KeyboardEvent
Fired when Home key was pressed. end-pressed # at-end-pressed → KeyboardEvent
Fired when End key was pressed. Methods # `}),e.add({id:49,href:"/docs/modules/furo-route/furo-pages/",title:"furo-pages",section:"@furo/route",content:` furo-pages # @furo/route v2.6.13 import '@furo/route/src/furo-pages.js'; exports FuroPages js exports &lt;furo-pages&gt; custom-element-definition superclass LitElement summary Simple content switcher
Use furo-pages to build tabs, views, subviews,&hellip;
preconditions # The components used in a furo-page must implement a hidden attribute css to set itself to display none.
1 2 3 :host([hidden]){ display:none } usage # 1 2 3 4 5 6 7 8 &lt;furo-pages fn-inject-location=&#34;--locationChanged&#34; default=&#34;home&#34;&gt; &lt;page-home name=&#34;home&#34;&gt;&lt;/page-home&gt; &lt;other-page name=&#34;more&#34;&gt;&lt;/other-page&gt; &lt;view-404 name=&#34;404&#34;&gt;&lt;/view-404&gt; &lt;/furo-pages&gt; &lt;furo-location at-location-changed=&#34;--locationChanged&#34;&gt;&lt;/furo-location&gt; If the url is / or /home, page-home is displayed. If the url is /more, other-page is displayed. If the url does not match any of the names and a 404 is available, the 404 is displayed.
flowbased auto wires # furo-pages provides auto wires, which are automatically triggered in the child elements if they support FBP. Each wire will forward a locationObject
|--pageActivated : Is triggered when the element is activated.
|--pageDeActivated : Is triggered when another page is activated. Empty wire.
|--pageQueryChanged : Is triggered when the page query changes.
|--pageHashChanged : Is triggered when the page hash changes.
|--pageReActivated : Is triggered when the locatioin contains the same page which already was activated.
--pageActivated : Is triggered when the element is activated.
--pageDeActivated : Is triggered when another page is activated. Empty wire.
--pageQueryChanged : Is triggered when the page query changes.
--pageHashChanged : Is triggered when the page hash changes.
--pageReActivated : Is triggered when the locatioin contains the same page which already was activated.
Attributes and Properties # default # Set the default page to show. Methods # activatePage # activatePage(pageName *String* ) ⟹ void
→ fn-activate-page
Activate a page by name
pageName String pageName injectLocation # injectLocation(location \`\` ) ⟹ void
\`\` → fn-inject-location
Inject the location Object from furo-location. The page which is defined in location.pathSegments[0] will get activated.
To meke &ldquo;sub&rdquo; pages do not forget to enable the url-space-regex property on the furo-location component which feeds this component.
If the page/view does not exist and you have a page &ldquo;404&rdquo; defined, the 404 will be shown
If the page/view does not exist AND 404 does not exist, the default page gets activated.
location Slots # default # Type: HTMLElement [0..n]
default slot to add pages. `}),e.add({id:50,href:"/docs/modules/furo-route/furo-panel-coordinator/",title:"furo-panel-coordinator",section:"@furo/route",content:` furo-panel-coordinator # @furo/route v2.6.13 import '@furo/route/src/furo-panel-coordinator.js'; exports FuroPanelCoordinator js exports &lt;furo-panel-coordinator&gt; custom-element-definition superclass LitElement mixes FBP summary Complex content switcher based on furo-tree
furo-panel-coordinator
Attributes and Properties # Events # controls-ready # at-controls-ready → RepeaterNode
Fired when Controls for panels are ready, initially it starts with an empty set. Methods # showPage # showPage(NavigationNode \`\` ) ⟹ Promise&amp;lt;void&amp;gt;
\`\` → fn-show-page
Loads and shows the page based on the NavigationNode
NavigationNode closeAll # closeAll() ⟹ void
* → fn-close-all
This will trigger a close-request event all panels. Which should close themself then.
forceCloseAll # forceCloseAll() ⟹ void
* → fn-force-close-all
closes all open panels without asking
`}),e.add({id:51,href:"/docs/modules/furo-util/furo-pretty-json/",title:"furo-pretty-json",section:"@furo/util",content:` furo-pretty-json # @furo/util v2.1.19 import '@furo/util/src/furo-pretty-json.js'; exports FuroPrettyJson js exports &lt;furo-pretty-json&gt; custom-element-definition superclass LitElement mixes FBP summary pretty prints json data
furo-pretty-json Pretty json with highlighting
1 2 &lt;furo-pretty-json fn-inject-json=&#34;--data&#34;&gt;&lt;/furo-pretty-json&gt; Attributes and Properties # Methods # injectData # injectData(json JSON ) ⟹ void
JSON → fn-inject-data
Inject JSON data
json Json literal `}),e.add({id:52,href:"/docs/modules/furo-util/furo-put-clipboard/",title:"furo-put-clipboard",section:"@furo/util",content:` furo-put-clipboard # @furo/util v2.1.19 import '@furo/util/src/furo-put-clipboard.js'; exports FuroPutClipboard js exports &lt;furo-put-clipboard&gt; custom-element-definition superclass LitElement summary write content to clipboard
furo-put-clipboard put content to the clipboard of the OS.
1 2 3 4 5 &lt;furo-put-clipboard json fn-trigger=&#34;--data&#34; at-content-put=&#34;--contentInClipboard&#34; &gt;&lt;/furo-put-clipboard&gt; Attributes and Properties # json # json Boolean Stringify JSON content. Set this to true to auto stringify your JSON object with a 2 indention. Events # content-put # at-content-put → *
Fired when content is written to clipboard Methods # setData # setData(data Object ) ⟹ void
Object → fn-set-data
Set data that you want to put to clipboard.
data Serializable data to put trigger # trigger(data Object|null ) ⟹ void
Object|null → fn-trigger
Write data to the clipboard
If you trigger without data, the data which sas set with setData will be written to the clipboard.
data Serializable data `}),e.add({id:53,href:"/docs/modules/furo-data/furo-rel-exists/",title:"furo-rel-exists",section:"@furo/data",content:` furo-rel-exists # @furo/data v2.18.0 import '@furo/data/src/furo-rel-exists.js'; exports FuroRelExists js exports &lt;furo-rel-exists&gt; custom-element-definition superclass LitElement summary checks for a specific rel
furo-rel-exists Checks if a hateoas relation exists in a given hateaos Links array.
1 &lt;furo-rel-exists rel=&#34;update&#34; service=&#34;person.Personservice&#34; fn-inject=&#34;--HTS-array&#34;&gt;&lt;/furo-rel-exists&gt; Attributes and Properties # rel # rel String Name of the rel service # service String define the service if you want a specific check on the service also Events # furo-rel-exists # at-furo-rel-exists → Object Hateoas Link
Fired when rel exists in linkArray. rel-dont-exist # at-rel-dont-exist → void
Fired when rel does not exists in linkArray. Methods # inject # inject(linkArray [furo.Link] ) ⟹ boolean
[furo.Link] → fn-inject
Inject a HTS Link Array to receive a rel-exist or a rel-dont-exist event.
inject returns true for existing links and false for non existing links. TODO: implement bind data too TODO: emit a event with bool which is triggered on any change of the hts array or binded data
linkArray Array of furo links `}),e.add({id:54,href:"/docs/modules/furo-layout/furo-resizer/",title:"furo-resizer",section:"@furo/layout",content:` furo-resizer # @furo/layout v2.2.14 import '@furo/layout/src/furo-resizer.js'; exports FuroResizer js exports &lt;furo-resizer&gt; custom-element-definition superclass LitElement mixes FBP summary resizable box
furo-resizer container which let you resize its width.
Double-click on the handler to reset the width. You need a counter part which flexes.
1 2 3 4 5 6 7 &lt;furo-horizontal-flex&gt; &lt;div flex&gt; the flexible part &lt;/div&gt; &lt;!-- you have to set at leas one handle to resize the content --&gt; &lt;furo-resizer righthandle remember=&#34;logv&#34; minwidth=&#34;280&#34; maxwidth=&#34;780&#34;&gt; &lt;some-content&gt;&lt;/some-content&gt; &lt;/furo-resizer&gt; &lt;/furo-horizontal-flex&gt; Attributes and Properties # resetSize # removes remember and set to the initial size lefthandle # lefthandle Boolean add a handle to the left side righthandle # righthandle Boolean add a handle to the right side remember # remember String remember the size after resizing. Give the id for the rememberer, you can use the id on different views maxwidth # maxwidth Number Set the maximal width of the resizer minwidth # minwidth Number Set the minimal width of the resizer Methods # Slots # default # Type: HTMLElement [0..n]
default slot to add content. `}),e.add({id:55,href:"/docs/modules/furo-data/furo-reverse-deep-link/",title:"furo-reverse-deep-link",section:"@furo/data",content:` furo-reverse-deep-link # @furo/data v2.18.0 import '@furo/data/src/furo-reverse-deep-link.js'; exports FuroReverseDeepLink js exports &lt;furo-reverse-deep-link&gt; custom-element-definition superclass LitElement summary create query param object from HATEOAS
Converts hateoas to queryParams, which is useful for routing with app-flow
1 2 3 4 5 &lt;furo-reverse-deep-link service=&#34;TaskService&#34; rel=&#34;self&#34; at-converted=&#34;--queryParams&#34; fn-convert=&#34;--rawEntityOrCollection, --linksArray, --linkObject&#34; &gt;&lt;/furo-reverse-deep-link&gt; Attributes and Properties # service # service string default: ''
Name of service rel # rel String Optional rel to convert.
Not needed if you inject a link object.
If you insert an entity rel self is taken. If you insert a collection, rel list is used. Events # converted # at-converted → QueryParams
Fired when input was converted. Methods # convert # convert(data object ) ⟹ object
object → fn-convert
converts the href of a LinkObject
returns Error on undefined service
data rawEntity|rawCollection `}),e.add({id:56,href:"/docs/modules/furo-util/furo-show-flow/",title:"furo-show-flow",section:"@furo/util",content:` furo-show-flow # @furo/util v2.1.19 import '@furo/util/src/doc/graph/furo-show-flow.js'; exports FuroShowFlow js exports &lt;furo-show-flow&gt; custom-element-definition superclass LitElement mixes FBP summary internal helper component
furo-show-flow Renders a flow from dom node or html source
Attributes and Properties # Methods # parseHtml # parseHtml(source string ) ⟹ void
string → fn-parse-html
Parse html content
source parseTemplate # parseTemplate(template \`\` dom dom ) ⟹ void
\`\` dom → fn-parse-template
Parse a dom node
template dom node `}),e.add({id:57,href:"/docs/modules/furo-layout/furo-split-view/",title:"furo-split-view",section:"@furo/layout",content:` furo-split-view # @furo/layout v2.2.14 import '@furo/layout/src/furo-split-view.js'; exports FuroSplitView js exports &lt;furo-split-view&gt; custom-element-definition superclass LitElement mixes FBP summary splitted layout
furo-split-view is a layout component to visualise main / detail views (left right layout for master detail views). You can add the attribute scroll on the detail view to make the content scrollable.
1 2 3 4 &lt;furo-split-view&gt; &lt;div slot=&#34;master&#34;&gt;Master&lt;/div&gt; &lt;big-component scroll&gt; &lt;/big-component&gt; &lt;/furo-split-view&gt; Attributes and Properties # reverse # reverse Boolean flip the left and right side Methods # Slots # master # Type: HTMLElement [0..n]
default slot to add content to the main section. default # Type: HTMLElement [0..n]
default slot to add content to the detail section. Styling # The following custom properties available for styling:
Custom property Description --split-master-width width of the master slot default: 270px fallback: N/A `}),e.add({id:58,href:"/docs/modules/furo-data/furo-type-renderer/",title:"furo-type-renderer",section:"@furo/data",content:` furo-type-renderer # @furo/data v2.18.0 import '@furo/data/src/furo-type-renderer.js'; exports FuroTypeRenderer js exports &lt;furo-type-renderer&gt; custom-element-definition superclass LitElement mixes FBP summary dynamic type rendering
The furo-type-renderer is used to display type specific data. It uses display as default context and will warn you on the console if the requested context-[type-name] does not exist or was not imported.
There is a standard set of display components @furo/ui5/src/standard-type-renderers for rendering the individual types.
The standard ui5 set can be integrated with the import
import &lsquo;@furo/ui5/src/standard-type-renderers/display-registry.js&rsquo;. The standard material set can be integrated with the import
import &lsquo;@furo/data-ui/src/standard-type-renderers/display-registry.js&rsquo;. If you want to implement an individual display of a type, you need your own context-[type-name] component and import it.
for repeated fields you should write your own context-[type-name]-repeated component and import it. If no context-[type-name]-repeated exists, the renderer will use the display-[type] component as fallback and display it repeatedly, this is ok for a lot of cases.
Naming convention # display-google-type-timeofday ------- --------------------- | | context type-name # examples: cell-string celledit-string display-string yourcontext-string The method to evaluate the renderer is built as following: context-[(package.type).replaceAll(&#39;.&#39;, &#39;-&#39;).toLocaleLowerCase()] Basic Usage # 1 &lt;furo-type-renderer fn-bind-data=&#34;--dao(*.data.fieldname)&#34;&gt;&lt;/furo-type-renderer&gt; Writing your own renderer # The only API you need to implement in your component is the bindData() method. You just have to follow the naming convention for your renderer.
Attributes and Properties # context # context string default: 'display'
Set the context if you need another then display. Prebuilt context renderers exist for display, cell, celledit. disabled # disabled Boolean A Boolean attribute which, if present, means this field is displayed in disabled state. Methods # bindData # bindData(fieldNode FieldNode ) ⟹ void
FieldNode → fn-bind-data
Bind a fieldnode of any type
fieldNode Fieldnode of any type focus # focus() ⟹ void
* → fn-focus
forward the focus to the created element
`}),e.add({id:59,href:"/docs/modules/furo-layout/furo-vertical-flex/",title:"furo-vertical-flex",section:"@furo/layout",content:` furo-vertical-flex # @furo/layout v2.2.14 import '@furo/layout/src/furo-vertical-flex.js'; exports FuroVerticalFlex js exports &lt;furo-vertical-flex&gt; custom-element-definition superclass LitElement summary vertical alignment
furo-vertical-flex
With this component, any elements can be aligned vertically. Similar to css flex. The attribute &ldquo;flex&rdquo; must be set for growing elements. The component takes up 100% of the space
1 2 3 4 5 &lt;furo-vertical-flex&gt; &lt;div&gt;small&lt;/div&gt; &lt;div flex&gt;full width&lt;/div&gt; &lt;div&gt;small&lt;/div&gt; &lt;/furo-vertical-flex&gt; Tags: layout
Attributes and Properties # Methods # Slots # default # Type: HTMLElement [0..n]
default slot to add content. `}),e.add({id:60,href:"/docs/modules/furo-layout/furo-vertical-scroller/",title:"furo-vertical-scroller",section:"@furo/layout",content:` furo-vertical-scroller # @furo/layout v2.2.14 import '@furo/layout/src/furo-vertical-scroller.js'; exports FuroVerticalScroller js exports &lt;furo-vertical-scroller&gt; custom-element-definition superclass LitElement mixes FBP summary vertical scroll
furo-vertical-scroller
1 2 3 &lt;furo-vertical-scroller&gt; &lt;your-content&gt;&lt;/your-content&gt; &lt;/furo-vertical-scroller&gt; Attributes and Properties # Methods # Slots # default # Type: HTMLElement [0..n]
default slot to add content. Styling # The following custom properties available for styling:
Custom property Description --surface Background color scrollbar default: white fallback: N/A --on-surface Background color of the draggable scrolling element default: black fallback: N/A `}),e.add({id:61,href:"/docs/modules/furo-util/light-bulb/",title:"light-bulb",section:"@furo/util",content:` light-bulb # @furo/util v2.1.19 import '@furo/util/src/doc/light-bulb.js'; exports LightBulb js exports &lt;light-bulb&gt; custom-element-definition superclass LitElement mixes FBP summary a light bulb for the documentation
light-bulb
This component is for the documentation
Attributes and Properties # on # on Boolean Switch on the bulb off # off reflects boolean default: true
Switch of the bulb color # default: &quot;#fee753&quot;
Methods # setColor # setColor(color \`\` ) ⟹ void
\`\` → fn-set-color
color toggle # toggle() ⟹ void
* → fn-toggle
toggles the light bulb on off
`}),e.add({id:62,href:"/docs/modules/furo-data/",title:"@furo/data",section:"Packages",content:` @furo/data # @furo/data v2.18.0 Furo data components
These are probably the most important components of the furo web components.
The components builds the bridge from the ui implementations to the data sources by respecting the specs.
The agents in this module are responsible to communicate directly with the specified sources and will feed the data object with the needed data. furo-api-fetch, which is also used by the agents, can fetch any data from any sources and do the error and success &ldquo;handling&rdquo;.
flowchart LR I1(Input Component) -. data binding --- DO(Data Object); I2(Custom Component) -. data binding --- DO(Data Object); DO -- set data --> A(Entity Agent); A -- updates --> DO; A <-- fetch / update --> API[(Rest API)]; SB(Save Button) -- triggers --> A LB(Load Button) -- triggers --> A Shematic flow
Installation # npm:
1 npm i -S @furo/data\` What is inside # Components # furo-api-fetch fetch data from network furo-collection-agent interface component to handle collection requests furo-custom-method interface component to handle custom methods furo-data-flow-repeat automatic display of repeated fields furo-data-hide-content hide content with a boolean fieldnode furo-data-object Typed data object furo-deep-link Resolve deep links HATEOAS based on query params furo-entity-agent interface component to handle entity requests furo-entity-field interact with single field of a data object furo-hateoas-state disables or hide nodes based on hts furo-message-container-handler furo.MessageContainer handler furo-rel-exists checks for a specific rel furo-reverse-deep-link create query param object from HATEOAS furo-type-renderer dynamic type rendering `}),e.add({id:63,href:"/docs/modules/furo-fbp/",title:"@furo/fbp",section:"Packages",content:` @furo/fbp # @furo/fbp v6.11.0 Declarative programming with web-components.
フロー Furo Flow Based Programming # enables you to write your web applications following the flow based programming paradigm.
Fully Declarative - No “Code” needed # Instead of writing hundreds of lines of code with HTML element selectors and attaching EventListeners to them to write another HTML element selector for calling a simple method, simply express your intention and string them together.
Learn more about furo fbp
Installation # npm:
1 npm i -S @furo/fbp\` What is inside # Components # empty-fbp-node flow-bind Custom element to allow using furo-fbp's template features in a html document. flow-repeat Custom element to allow using FBPs template features in repeated template `}),e.add({id:64,href:"/docs/modules/furo-framework/",title:"@furo/framework",section:"Packages",content:` @furo/framework # @furo/framework v2.4.11 Furo framework libs
Installation # npm:
1 npm i -S @furo/framework\` What is inside # Components # `}),e.add({id:65,href:"/docs/modules/furo-layout/",title:"@furo/layout",section:"Packages",content:` @furo/layout # @furo/layout v2.2.14 Layout components for furo
Installation # npm:
1 npm i -S @furo/layout\` What is inside # Components # furo-backdrop-display Display component for furo-backdrop furo-backdrop show content with backdrop furo-empty-spacer fill the space in a furo-xxxx-flex furo-form-layouter Grid based form field row furo-horizontal-flex horizontal alignment furo-resizer resizable box furo-split-view splitted layout furo-vertical-flex vertical alignment furo-vertical-scroller vertical scroll `}),e.add({id:66,href:"/docs/modules/furo-route/",title:"@furo/route",section:"Packages",content:` @furo/route # @furo/route v2.6.13 Routing components
Installation # npm:
1 npm i -S @furo/route\` What is inside # Components # furo-app-flow-router Application Flow =&gt; routing furo-app-flow Application Flow =&gt; routing furo-document-title Document title furo-location-updater deep linking helper furo-location url watcher furo-lock-navigation Blocks the furo-location-updater from navigating away furo-pages Simple content switcher furo-panel-coordinator Complex content switcher based on furo-tree `}),e.add({id:67,href:"/docs/modules/furo-util/",title:"@furo/util",section:"Packages",content:` @furo/util # @furo/util v2.1.19 package sample
Installation # npm:
1 npm i -S @furo/util\` What is inside # Components # furo-config-loader load config files furo-config config access furo-de-bounce event de bouncer furo-feature-toggle flow based handler for feature toggles furo-fetch-json fetch json data furo-forth-stack forth like stack furo-get-clipboard get clipboard content furo-head-tail split an array furo-hp-35 calculator component furo-interval-pulse trigger an event in intervals furo-key-filter keyboard event filter furo-keydown keyboard event listener furo-markdown renders markdown data furo-navigation-pad keyboard navigation helper furo-pretty-json pretty prints json data furo-put-clipboard write content to clipboard furo-demo-snippet documentation helper light-bulb a light bulb for the documentation furo-graph-renderer paints a dagree graph as svg furo-show-flow internal helper component `}),e.add({id:68,href:"/docs/modules/furo-webtypes/",title:"@furo/web-types",section:"Packages",content:` @furo/web-types # @furo/web-types v0.0.5 Web-types for the furo fbp lang
Installation # npm:
1 npm i -S @furo/web-types\` What is inside # Components # `}),e.add({id:69,href:"/docs/modules/furo-data/AgentHelper/",title:"AgentHelper",section:"@furo/data",content:` AgentHelper # @furo/furo-data v2.18.0 import '@furo/data/src/lib/AgentHelper.js'; exports AgentHelper js
This is a helper class for the agents # Update query params a qp like {&ldquo;active&rdquo;:true} will just update the qp active
If the current value of the qp is not the same like the injected value, a qp-changed event will be fired
Attributes and Properties # Methods # updateQp # updateQp(caller *qp* ) ⟹ void
caller qp setQp # setQp(caller Object qp QueryParams ) ⟹ void
Set query params All existing query params are replaced by the transferred parameters If the transferred object is empty or undefined, all the values will be removed!
caller caller qp Queryparam Object getParams # getParams(caller *link* ) ⟹ Object
get existing params from href and append query params
caller link rebuildQPFromParams # rebuildQPFromParams(params \`\` ) ⟹ []
rebuild qp from params
params generateHeaderAccept # generateHeaderAccept(caller *services* rel \`\` ) ⟹ string
generate accept field for header
caller services rel generateReq # generateReq(link *qp* ) ⟹ string
generate request url from original link and qp
link qp `}),e.add({id:70,href:"/docs/modules/furo-route/BasePanel/",title:"BasePanel",section:"@furo/route",content:` BasePanel # @furo/furo-route v2.6.13 import '@furo/route/src/lib/BasePanel.js'; exports BasePanel js superclass LitElement mixes FBP
Extend BasePanel to build a panel which is controllable by furo-panel-coordinator.
Attributes and Properties # onCloseRequest # Callback function to interact with close requests Return a true if closing is allowed or false if not Methods # closePanel # closePanel() ⟹ void
Close the panel
`}),e.add({id:71,href:"/docs/modules/furo-framework/BaseSpecValidators/",title:"BaseSpecValidators",section:"@furo/framework",content:` BaseSpecValidators # @furo/furo-framework v2.4.11 import '@furo/framework/src/BaseSpecValidators/BaseSpecValidators.js'; exports BaseSpecValidators js
Validators for furo base types and google well known types
Attributes and Properties # Methods # registerAll # registerAll() ⟹ void
Register all validators. This should be done in your init phase of your app.
1 2 3 import {BaseSpecValidators} from &#39;@furo/framework/src/BaseSpecValidators/RegisterAll.js&#39;; BaseSpecValidators.registerAll() `}),e.add({id:72,href:"/docs/modules/furo-util/Config/",title:"Config",section:"@furo/util",content:` Config # @furo/furo-util v2.1.7 import '@furo/util/src/lib/Config.js'; exports Config js
Config Class for furo-config. Not intended for direct usage.
Attributes and Properties # Methods # append # append(section *obj* ) ⟹ void
section obj deepCreate # deepCreate(parent *section* obj \`\` ) ⟹ void
create nodes a long they are objects
parent section obj watch # watch(section *cb* ) ⟹ void
section cb `}),e.add({id:73,href:"/docs/modules/furo-util/ConfigTree/",title:"ConfigTree",section:"@furo/util",content:` ConfigTree # @furo/furo-util v2.1.19 import '@furo/util/src/lib/Config.js'; exports ConfigTree js exports Config js superclass EventTreeNode
Attributes and Properties # _value # _name # default: fieldName
__value # default: null
Methods # `}),e.add({id:74,href:"/docs/modules/furo-data/DataObject/",title:"DataObject",section:"@furo/data",content:` DataObject # @furo/furo-data v2.18.0 import '@furo/data/src/lib/DataObject.js'; exports DataObject js superclass EventTreeNode
EntityNode is usually the root node of an eventTree
Attributes and Properties # rawEntity # _value # This setter aliases to injectRaw. Added for compatibility reasons for the FieldNodeAdapter _spec # default: this.__specdefinitions[type]
_type # default: type
_pristine # default: true
_isValid # default: true
Methods # validateAllFields # validateAllFields() ⟹ void
clearAllErrors # clearAllErrors() ⟹ void
clears all errors on every fieldnode
setAllToPristine # setAllToPristine() ⟹ void
set all children to pristine useful for deltas
injectRaw # injectRaw(rawEntity \`\` ) ⟹ void
injects a raw model e.g. body data of a collection or entity
rawEntity reset # reset() ⟹ void
Resete zum letzten injected state zurück
_hasAncestorOfType # _hasAncestorOfType(type \`\` ) ⟹ void
type getJson # getJson() ⟹ *
Returns a json representation of your Data Object
getValidityMessage # getValidityMessage() ⟹ {}
Returns a json representation of all field validity messages
_updateFieldValuesAndMetaFromRawEntity # _updateFieldValuesAndMetaFromRawEntity(node *data* ) ⟹ void
node data _setInvalid # _setInvalid(error \`\` ) ⟹ void
error toString # toString() ⟹ void
`}),e.add({id:75,href:"/docs/modules/furo-fbp/DOMFBP/",title:"DOMFBP",section:"@furo/fbp",content:` DOMFBP # @furo/furo-fbp v6.11.0 import '@furo/fbp/src/DOMFBP.js'; exports DOMFBP js extends src/DOMFBP.js mixes FBP
DOMFBP allows you to append FBP to any dom element.
Usage:
1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 &lt;!DOCTYPE html&gt; &lt;html lang=&#34;en&#34;&gt; &lt;head&gt; &lt;meta charset=&#34;UTF-8&#34;&gt; &lt;title&gt;Title&lt;/title&gt; &lt;script type=&#34;module&#34; src=&#34;https://cdn.jsdelivr.net/npm/@furo/precompiled@2.3.0/dist/furo-fbp.js&#34;&gt;&lt;/script&gt; &lt;script&gt; import(&#34;https://cdn.jsdelivr.net/npm/@furo/precompiled@2.3.0/dist/DOMFBP.js&#34;).then(() =&gt; { // activate FBP on body const fbphandle = new DOMFBP(document.body) // enable tracing fbphandle._FBPTraceWires(); }) &lt;/script&gt; &lt;/head&gt; &lt;body&gt; &lt;button at-click=&#34;--buttonClicked&#34; fn-remove=&#34;--buttonClicked&#34;&gt;remove me&lt;/button&gt; &lt;/body&gt; &lt;/html&gt; 1 2 3 4 import {DOMFBP} from &#39;@furo/fbp/src/DOMFBP.js&#39;; // append fbp to the body new DOMFBP(document.body); Attributes and Properties # Methods # `}),e.add({id:76,href:"/docs/modules/furo-util/EmptyStackError/",title:"EmptyStackError",section:"@furo/util",content:` EmptyStackError # @furo/furo-util v2.1.19 import '@furo/util/src/lib/EmptyStackError.js'; exports EmptyStackError js extends src/lib/EmptyStackError.js superclass Error
Error for the furo-forth-stack component.
Attributes and Properties # Methods # `}),e.add({id:77,href:"/docs/modules/furo-framework/Env/",title:"Env",section:"@furo/framework",content:` Env # @furo/furo-framework v2.4.11 import '@furo/framework/src/environment.js'; exports Env js
This class stores your environment data,
like the api services and types, which is used by the data components the current locale, which is used by the i18n package the acceptLanguage, which is used by the data components Attributes and Properties # Methods # `}),e.add({id:78,href:"/docs/modules/furo-fbp/FBP/",title:"FBP",section:"@furo/fbp",content:` FBP # @furo/furo-fbp v6.11.0 import '@furo/fbp/src/fbp.js'; exports FBP js
Attributes and Properties # Methods # `}),e.add({id:79,href:"/docs/modules/furo-fbp/FbpBreakpoints/",title:"FbpBreakpoints",section:"@furo/fbp",content:` FbpBreakpoints # @furo/furo-fbp v6.11.0 import '@furo/fbp/src/FbpBreakpoints.js'; exports FbpBreakpoints js
Attributes and Properties # Methods # SetBreakpoints # SetBreakpoints(breakpoints \`\` ) ⟹ void
breakpoints Breakpoints # Breakpoints() ⟹ void
GetElementByPath # GetElementByPath(path \`\` ) ⟹ *
This will get the DOM Node for a path produced by FBP._getDomPath
path `}),e.add({id:80,href:"/docs/modules/furo-data/FieldNode/",title:"FieldNode",section:"@furo/data",content:` FieldNode # @furo/furo-data v2.18.0 import '@furo/data/src/lib/FieldNode.js'; exports FieldNode js superclass EventTreeNode
internal events # this-field-became-invalid, when a field gets invalid field-became-invalid bubbles, when a field gets invalid this-field-became-valid, when a field gets valid field-became-valid bubbles, when a field gets valid this-field-value-changed, when the value of a field changed field-value-changed bubbles, when the value of a field changed this-metas-changed, when the metas of a field changed metas-changed bubbles, when the meta of a field changed oneof-field-cleared, when a field in a oneof group was cleared oneof-field-changed, when a field in a oneof group was changed this-node-field-added, when a sub field was added to a field node-field-added bubbles, when a sub field was added to a field this-node-field-deleted, when a sub field was added to a field node-field-deleted bubbles, when a sub field was added to a field any-type-removed, fired before a node of type any changes its inner type any-type-created, fired when a node of type any is created or the type was changed internal broadcasted events # parent-readonly-meta-set, when readonly was set on a parent field Attributes and Properties # defaultvalue # Set the value of the field to the specified defaults. _spec # default: {type: vType}
Reference to the current spec definition of the fieldNode _pristine # default: true
Pristine state of the fieldNode, this is always set to true when new data is injected and is false if the value itself or the value of a child node gets changed. _isValid # default: true
Validity of the fieldNode, this is always set to true when new data is injected and is false if the value itself validates to false or the value of a child node validates to false. Methods # createField # createField(options &amp;#34;fieldName&amp;#34; ) ⟹ void
create a field in a FieldNode, this is useful when using map&lt;string,something&gt; set the value option to init with values
options :&quot;name&quot;,&quot;type&quot;:&quot;string&quot;, &quot;spec&quot;:{..}} spec is optional moveNode # moveNode(oldIndex *newIndex* ) ⟹ void
oldIndex newIndex reinit # reinit() ⟹ void
sets the field to the initial values from the spec default values are applied
_createVendorType # _createVendorType(type \`\` ) ⟹ void
type _checkConstraints # _checkConstraints(event \`\` ) ⟹ void
event _createAnyType # _createAnyType(val \`\` ) ⟹ void
val _updateKeyValueMap # _updateKeyValueMap(val *spec* ) ⟹ void
val spec deleteNode # deleteNode() ⟹ void
deletes the fieldnode
_clearInvalidity # _clearInvalidity() ⟹ void
_setState # _setState(state \`\` ) ⟹ void
state toString # toString() ⟹ void
`}),e.add({id:81,href:"/docs/modules/furo-data/FieldNodeAdapter/",title:"FieldNodeAdapter",section:"@furo/data",content:` FieldNodeAdapter # @furo/furo-data v2.18.0 import '@furo/data/src/lib/FieldNodeAdapter.js'; exports FieldNodeAdapter js
Binding methods for fieldNodes
Use this class to make your component bindable without handling with the internals of FieldNode.
Read more in the GUIDE section please.
Attributes and Properties # Methods # bindData # bindData(fieldNode FieldNode|RepeaterNode ) ⟹ void
Binds a fieldNode. Make sure the type of your field is accepted by the implemented component.
fieldNode FieldNode or RepeaterNode `}),e.add({id:82,href:"/docs/modules/furo-framework/FuroFeatureToggle/",title:"FuroFeatureToggle",section:"@furo/framework",content:` FuroFeatureToggle # @furo/furo-framework v2.4.11 import '@furo/framework/src/FuroFeatureToggler/FuroFeatureToggle.js'; exports FuroFeatureToggle js
Use the FuroFeatureToggle to control features from a central registry. FuroFeatureToggle only needs a key and a boolean value. These key can be set at any time. A requested key which was not set, is interpreted as false.
Available toggles # Following toggles are given, use the one which is appropriate to your problem. Sometimes you want to hide some parts if a key is true and sometimes you have to do the opposite.
data-furo-toggle-append Appends the element on true state of the key, removes the element on false state
data-furo-toggle-remove Removes the element on true state of the key, appends the element on false state
data-furo-toggle-hide Adds a hidden attribute to the element on true state of the key, removes the attribute on false state
data-furo-toggle-show Removes a hidden attribute from the element on true state of the key, adds the attribute on false state
data-furo-toggle-disable Adds a disabled attribute to the element on true state of the key, removes the attribute on false state
data-furo-toggle-enable Removes a disabled attribute from the element on true state of the key, adds the attribute on false state
data-furo-toggle-custom-add Adds the custom attribute to the element on true state of the key, removes the attribute on false state
data-furo-toggle-custom-remove Removes the custom attribute from the element on true state of the key, adds the attribute on false state
Example usage: # js # 1 2 3 4 5 6 7 8 9 10 11 12 // import FuroFeatureToggle import { FuroFeatureToggle } from &#39;@furo/framework/src/FuroFeatureToggler/FuroFeatureToggle.js&#39;; // enabling for a part of your component FuroFeatureToggle.parseDom(this.shadowRoot) // enabling for a part of your component FuroFeatureToggle.parseDom(this.shadowRoot.querySelector(&#39;#partial&#39;)) // setting a key FuroFeatureToggle.setKeyState(&#39;feature.key&#39;, true); html # 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 remove: &lt;span data-furo-toggle-remove=&#39;feature.key&#39;&gt; span is removed if key state is true, otherwise appended&lt;/span&gt; append: &lt;span data-furo-toggle-append=&#39;feature.key&#39;&gt; span is appended when key state true, otherwise removed&lt;/span&gt; enable: &lt;button data-furo-toggle-disable=&#39;feature.key&#39;&gt; button is enabled when state is true, otherwise disabled&lt;/button&gt; disable: &lt;button data-furo-toggle-enable=&#39;feature.key&#39;&gt; button is disabled when state is true, otherwise enabled&lt;/button&gt; hide: &lt;div data-furo-toggle-hide=&#39;feature.key&#39;&gt; Div will get a hidden attribute when the key state is true, otherwise hidden &lt;/div&gt; show: &lt;div data-furo-toggle-show=&#39;feature.key&#39;&gt; The hidden attribute will be removed when the key state is true, otherwise the hidden attribute will be set. &lt;/div&gt; custom add: &lt;div data-furo-toggle-custom-add=&#39;feature.key, ATTRIBUTE, VALUE&#39;&gt; Div will get a custom attribute when the key state is true, otherwise the custom attribute will be removed. &lt;/div&gt; custom remove: &lt;div data-furo-toggle-custom-remove=&#39;feature.key, ATTRIBUTE, VALUE&#39;&gt; The custom attribute will be removed when the key state is true, otherwise the custom attribute will be set. &lt;/div&gt; Attributes and Properties # Methods # parseDom # parseDom(root DOM ) ⟹ void
Parses the DOM for feature toggles and applies them.
root The dom root you want to be managed. setKeyState # setKeyState(key String state Boolean ) ⟹ void
Use this method to register a key with an initial state or to update a state.
key The key of a feature. state The state to set. registerKeyMap # registerKeyMap(keymap map ) ⟹ void
Use this method to bulk register feature toggles.
keymap String,Boolean} Object with keys and their initial state getKeyState # getKeyState(key String ) ⟹ Boolean
Reads the current state of a key
key The key of a feature. registerCallback # registerCallback(key String cb function(Boolean, KeyState) ) ⟹ void
Register a custom callback on a key.
The callback will be immediately executed when you register it and every time the key state changes.
key The key of a feature. cb The callback method signature is a boolean for the current state and the KeyState object. `}),e.add({id:83,href:"/docs/modules/furo-framework/i18n/",title:"i18n",section:"@furo/framework",content:` i18n # @furo/furo-framework v2.4.11 import '@furo/framework/src/i18n.js'; exports i18n js
The built in i18n is a trivial translation mechanism which translates keys (words) a method for pluralized keys (words with numbers) is available but not implemented.
You can override the builtin methods in your init file, as long you keep i18n.t and i18n.n
Usage # After you have registered a translation file, you can use i18n in your components.
1 2 3 4 5 6 7 8 9 10 11 // import i18n import {i18n} from &#34;@furo/framework/src/i18n&#34; // use it in your source let label = i18n.t(&#34;key&#34;); // use it in your template like this render() { // language=HTML return html\` &lt;div&gt;\${i18n.t(&#34;key&#34;)}&lt;/div&gt;\`; } Register a translation file and use custom translation methods # Register i18n in the init phase of your application.
1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 import {Init, i18n, Env, Iconset} from &#34;@furo/framework/src/furo.js&#34;; // import your translations import {Translations} from &#34;./translations&#34;; // register your translations i18n.registerResBundle(Translations); // Apply custom Intl methods i18n.t = (key) =&gt; { let b = i18n.resbundle[Env.locale.toLowerCase().replace(&#34;-&#34;, &#34;_&#34;)] || i18n.resbundle[&#39;de_ch&#39;]; if (b === undefined) { console.warn(&#39;No resource bundle with locale &#39; + Env.locale + &#39; exists.&#39;); return } const res = key.split(&#39;.&#39;).reduce((acc, part) =&gt; acc &amp;&amp; acc[part], b); return (res ? res : key + &#39;**&#39;); }; // Apply custom Intl methods for pluralized keys i18n.n = (key, num) =&gt; { let t = i18n.resbundle[Env.locale.toLowerCase().replace(&#34;-&#34;, &#34;_&#34;)] || i18n.resbundle[&#39;de_ch&#39;]; if (t === undefined) { console.warn(&#39;No resource bundle with locale &#39; + Env.locale + &#39; exists.&#39;); return } let p = key.split(&#34;.&#34;); for (let i = 0; i &lt; p.length; i++) { if (t[p[i]]) { t = t[p[i]]; } else { console.warn(&#34;key does not exist&#34;, key); return; } } if (t) { if (num === 1) { if (t.one) { return t.one(num); } else { console.warn(&#34;key does not exist&#34;, key + &#34;.one&#34;); return num; } } if (num &gt; 1) { if (t.many) { return t.many(num); } else { console.warn(&#34;key does not exist&#34;, key + &#34;.many&#34;); return num; } } if (t.none) { return t.none(num); } else { console.warn(&#34;key does not exist&#34;, key + &#34;.none&#34;); return num; } } }; Attributes and Properties # Methods # registerResBundle # registerResBundle(bundle \`\` ) ⟹ void
bundle t # t(key \`\` ) ⟹ void
key n # n(key *num* ) ⟹ void
key num `}),e.add({id:84,href:"/docs/modules/furo-framework/Init/",title:"Init",section:"@furo/framework",content:` Init # @furo/furo-framework v2.4.11 import '@furo/framework/src/system.js'; exports Init js exports Sys js
The init class is used to init your Env, the API services and the API types.
Use the init package in the init phase of your application
example init # 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 // -- initialize application env, theme, api import {Init,Iconset} from &#34;@furo/framework/src/furo.js&#34;; import {Services, Types} from &#34;@furo/specs/build/data_environment.js&#34; Init.registerApiServices(Services); Init.registerApiTypes(Types); //Attention: Styling is defined in main-stage import {FuroBaseIcons} from &#34;@furo/icon/assets/iconsets/baseIcons&#34;; import {MapsIcons} from &#34;@furo/icon/assets/iconsets/mapsIcons&#34;; import {PlacesIcons} from &#34;@furo/icon/assets/iconsets/placesIcons&#34;; import {CommunicationIcons} from &#34;@furo/icon/assets/iconsets/communicationIcons&#34;; import {NotificationIcons} from &#34;@furo/icon/assets/iconsets/notificationIcons&#34;; import {FuroDocIcons} from &#34;./assets/iconset&#34;; import {AvIcons} from &#34;@furo/icon/assets/iconsets/avIcons&#34;; import {DeviceIcons} from &#34;@furo/icon/assets/iconsets/deviceIcons&#34;; import {EditorIcons} from &#34;@furo/icon/assets/iconsets/editorIcons&#34;; import {SocialIcons} from &#34;@furo/icon/assets/iconsets/socialIcons&#34;; import {HardwareIcons} from &#34;@furo/icon/assets/iconsets/hardwareIcons&#34;; import {ImageIcons} from &#34;@furo/icon/assets/iconsets/imageIcons&#34;; Iconset.registerIconset(&#34;furo&#34;, FuroDocIcons); Iconset.registerIconset(&#34;default&#34;, FuroBaseIcons); Iconset.registerIconset(&#34;av&#34;, AvIcons); Iconset.registerIconset(&#34;communication&#34;, CommunicationIcons); Iconset.registerIconset(&#34;device&#34;, DeviceIcons); Iconset.registerIconset(&#34;editor&#34;, EditorIcons); Iconset.registerIconset(&#34;social&#34;, SocialIcons); Iconset.registerIconset(&#34;places&#34;, PlacesIcons); Iconset.registerIconset(&#34;notification&#34;, NotificationIcons); Iconset.registerIconset(&#34;map&#34;, MapsIcons); Iconset.registerIconset(&#34;hardware&#34;, HardwareIcons); Iconset.registerIconset(&#34;image&#34;, ImageIcons); Attributes and Properties # Methods # registerEnv # registerEnv(section *data* ) ⟹ void
section data registerApiServices # registerApiServices(services \`\` ) ⟹ void
services registerApiTypes # registerApiTypes(types \`\` ) ⟹ void
types registerCustomValidator # registerCustomValidator(typename String ValidatorClass Class ) ⟹ void
Register a validator for a specific type.
typename ValidatorClass addApiTypeSpec # addApiTypeSpec(typename *spec* ) ⟹ void
Add a single type spec to the registry
Attention: If the name already exist, the old entry is overwritten.
typename spec addApiServiceSpec # addApiServiceSpec(servicename *spec* ) ⟹ void
Add a single service spec to the registry
Attention: If the name already exist, the old entry is overwritten.
servicename spec applyCustomApiPrefixToServicesAndTypes # applyCustomApiPrefixToServicesAndTypes(prefix \`\` ) ⟹ void
Apply the prefix to all service deeplinks and to all furo.Reference types with defaults
prefix translateStaticTypeMessages # translateStaticTypeMessages() ⟹ void
Translates spec content like meta.label, hints
`}),e.add({id:85,href:"/docs/modules/furo-framework/KeyState/",title:"KeyState",section:"@furo/framework",content:` KeyState # @furo/furo-framework v2.4.11 import '@furo/framework/src/FuroFeatureToggler/KeyState.js'; exports KeyState js
Handler of a single key, this class is used by FuroFeatureToggle
Attributes and Properties # Methods # `}),e.add({id:86,href:"/docs/modules/furo-framework/NodeEvent/",title:"NodeEvent",section:"@furo/framework",content:` NodeEvent # @furo/furo-framework v2.4.11 import '@furo/framework/src/EventTreeNode.js'; exports NodeEvent js exports EventTreeNode js
Custom event type for the AST
Attributes and Properties # type # default: type
Event type / name path # default: []
target # default: undefined
bubbles # default: bubbles
should the Event bubble detail # default: detail
Event details cancelBubble # default: false
If you are in a parent element and set this to true it will not bubble cancelBroadcast # default: false
if you are in a child element and set this to true, the event will not broadcast downwards Methods # stopPropagation # stopPropagation() ⟹ void
do not propagate the events to parent nodes
stopBroadcast # stopBroadcast() ⟹ void
Do not broadcast to the children of this node anymore
`}),e.add({id:87,href:"/docs/modules/",title:"Packages",section:"Docs",content:" Overview # "}),e.add({id:88,href:"/docs/modules/furo-route/panelRegistry/",title:"panelRegistry",section:"@furo/route",content:` panelRegistry # @furo/furo-route v2.6.13 import '@furo/route/src/lib/panelRegistry.js'; exports panelRegistry js
Registry for the components which can handle a type in a specific context.
This class is used by the furo-panel-coordinator to find the component which suites best for the given data type.
The registry can be autogenerated from @furo/ui-builder
// -- register panels panelRegistry.registerType(&#34;auth.AuthEntity&#34;, { &#34;edit&#34; : &#34;auth-auth-update-panel&#34; }); Attributes and Properties # Methods # registerType # registerType(type *panel* ) ⟹ void
type panel getPanelName # getPanelName(type *suffix* ) ⟹ void
type suffix `}),e.add({id:89,href:"/docs/modules/furo-data/RepeaterNode/",title:"RepeaterNode",section:"@furo/data",content:` RepeaterNode # @furo/furo-data v2.18.0 import '@furo/data/src/lib/RepeaterNode.js'; exports RepeaterNode js superclass EventTreeNode
internal events # before-repeated-field-changed, fired before new data is injected this-metas-changed, when the metas of a field changed repeat-became-valid, fired when all sub items are valid, after one was invalid before repeat-became-invalid, fired when one sub item switches to a invalid state repeated-fields-changed, fired when this or any child repeaters was changed (new data, add, remove) this-repeated-field-changed, fired when this repeater was changed (new data, add, remove) repeated-fields-all-removed fired when all nodes of a repeater was deleted this-repeated-field-removed, fired whe a node of this repeater was deleted this-node-field-deleted, fired when this node was deleted *node-field-deleted, fired when a child node was deleted repeated-fields-added, fired when a node on this or any child repeater was added this-repeated-field-added, fired when a node on this repeater was added Attributes and Properties # _value # default: tmp
__specdefinitions # _isRepeater # default: true
repeats # default: []
_spec # default: spec
_name # default: fieldName
clearListOnNewData # default: false
Set this to true to clear the list on new data instead updating the current list. _pristine # default: true
_isValid # default: true
_validationDisabled # __initialValue # Methods # moveNode # moveNode(oldIndex *newIndex* ) ⟹ void
oldIndex newIndex reinit # reinit() ⟹ void
resets the field to the initial _values from the spec
reset # reset() ⟹ void
removes all children
removeAllChildren # removeAllChildren() ⟹ void
deletes all repeated fields on this node
_hasAncestorOfType # _hasAncestorOfType() ⟹ void
infinite recursive element protection we can return false here, because a repeater node is not created automatically
deleteNode # deleteNode() ⟹ void
__updateMetaAndConstraints # __updateMetaAndConstraints(metaAndConstraints \`\` ) ⟹ void
metaAndConstraints deleteChild # deleteChild(index \`\` ) ⟹ void
Deletes a repeated item by index
index _addSilent # _addSilent() ⟹ void
_setInvalid # _setInvalid(error \`\` ) ⟹ void
error _getPath # _getPath(deeppath \`\` ) ⟹ void
deeppath _setState # _setState(state \`\` ) ⟹ void
state add # add(data \`\` ) ⟹ void
data `}),e.add({id:90,href:"/docs/modules/furo-data/ScalarTypeHelper/",title:"ScalarTypeHelper",section:"@furo/data",content:` ScalarTypeHelper # @furo/furo-data v2.18.0 import '@furo/data/src/lib/ScalarTypeHelper.js'; exports ScalarTypeHelper js
Attributes and Properties # Methods # defaultForType # defaultForType(type \`\` ) ⟹ void
type indeterminateDefault # indeterminateDefault() ⟹ void
isNumericType # isNumericType(type \`\` ) ⟹ boolean
checks if a type is numeric (usefull when you want to compare min or max constraints)
type isScalarType # isScalarType(type \`\` ) ⟹ boolean
checks if a type is scalar
type `}),e.add({id:91,href:"/docs/modules/furo-data/ValidatorDefaultTypes/",title:"ValidatorDefaultTypes",section:"@furo/data",content:` ValidatorDefaultTypes # @furo/furo-data v2.18.0 import '@furo/data/src/lib/ValidatorDefaultTypes.js'; exports ValidatorDefaultTypes js
A class to validate constraints on type string&lt;/code
Attributes and Properties # Methods # validateConstraints # validateConstraints(field \`\` ) ⟹ Promise&amp;lt;unknown&amp;gt;
field `}),e.add({id:92,href:"/docs/modules/furo-data/ValidatorFuroBigDecimal/",title:"ValidatorFuroBigDecimal",section:"@furo/data",content:` ValidatorFuroBigDecimal # @furo/furo-data v2.3.0 import '@furo/data/src/lib/ValidatorFuroBigDecimal.js'; exports ValidatorFuroBigDecimal js
A class to validate constraints on type of furo.BigDecimal
Attributes and Properties # Methods # validateConstraints # validateConstraints(field \`\` ) ⟹ Promise&amp;lt;unknown&amp;gt;
field `}),e.add({id:93,href:"/docs/modules/furo-framework/ValidatorFuroBigDecimal/",title:"ValidatorFuroBigDecimal",section:"@furo/framework",content:` ValidatorFuroBigDecimal # @furo/furo-framework v2.4.11 import '@furo/framework/src/BaseSpecValidators/ValidatorFuroBigDecimal.js'; exports ValidatorFuroBigDecimal js
A class to validate constraints on type of furo.BigDecimal
Attributes and Properties # Methods # validateConstraints # validateConstraints(field \`\` ) ⟹ Promise&amp;lt;unknown&amp;gt;
field `}),e.add({id:94,href:"/docs/modules/furo-framework/ValidatorFuroFatNumeric/",title:"ValidatorFuroFatNumeric",section:"@furo/framework",content:` ValidatorFuroFatNumeric # @furo/furo-framework v2.4.11 import '@furo/framework/src/BaseSpecValidators/ValidatorFuroFatNumeric.js'; exports ValidatorFuroFatNumeric js
A class to validate constraints on type of google.protobuf.[Numeric type]Value, furo.fat.[Numeric type]
Attributes and Properties # Methods # validateConstraints # validateConstraints(field \`\` ) ⟹ Promise&amp;lt;unknown&amp;gt;
field `}),e.add({id:95,href:"/docs/modules/furo-framework/ValidatorFuroFatString/",title:"ValidatorFuroFatString",section:"@furo/framework",content:` ValidatorFuroFatString # @furo/furo-framework v2.4.11 import '@furo/framework/src/BaseSpecValidators/ValidatorFuroFatString.js'; exports ValidatorFuroFatString js
A class to validate constraints on type of google.protobuf.StringValue, furo.fat.String
Attributes and Properties # Methods # validateConstraints # validateConstraints(field \`\` ) ⟹ Promise&amp;lt;unknown&amp;gt;
field `}),e.add({id:96,href:"/docs/modules/furo-data/ValidatorFuroReference/",title:"ValidatorFuroReference",section:"@furo/data",content:` ValidatorFuroReference # @furo/furo-data v2.3.0 import '@furo/data/src/lib/ValidatorFuroReference.js'; exports ValidatorFuroReference js
A class to validate constraints on type furo.Reference&lt;/code
Attributes and Properties # Methods # validateConstraints # validateConstraints(field \`\` ) ⟹ Promise&amp;lt;unknown&amp;gt;
checks field constraints
field `}),e.add({id:97,href:"/docs/modules/furo-framework/ValidatorFuroReference/",title:"ValidatorFuroReference",section:"@furo/framework",content:` ValidatorFuroReference # @furo/furo-framework v2.4.11 import '@furo/framework/src/BaseSpecValidators/ValidatorFuroReference.js'; exports ValidatorFuroReference js
A class to validate constraints on type furo.Reference&lt;/code
Attributes and Properties # Methods # validateConstraints # validateConstraints(field \`\` ) ⟹ Promise&amp;lt;unknown&amp;gt;
checks field constraints
field `}),e.add({id:98,href:"/docs/modules/furo-data/ValidatorGoogleProtobufBoolValue/",title:"ValidatorGoogleProtobufBoolValue",section:"@furo/data",content:` ValidatorGoogleProtobufBoolValue # @furo/furo-data v2.3.0 import '@furo/data/src/lib/ValidatorGoogleProtobufBoolValue.js'; exports ValidatorGoogleProtobufBoolValue js
A class to validate constraints on type of google.protobuf.BoolValue
Attributes and Properties # Methods # validateConstraints # validateConstraints(field \`\` ) ⟹ Promise&amp;lt;unknown&amp;gt;
field `}),e.add({id:99,href:"/docs/modules/furo-framework/ValidatorGoogleProtobufBoolValue/",title:"ValidatorGoogleProtobufBoolValue",section:"@furo/framework",content:` ValidatorGoogleProtobufBoolValue # @furo/furo-framework v2.4.11 import '@furo/framework/src/BaseSpecValidators/ValidatorGoogleProtobufBoolValue.js'; exports ValidatorGoogleProtobufBoolValue js
A class to validate constraints on type of google.protobuf.BoolValue
Attributes and Properties # Methods # validateConstraints # validateConstraints(field \`\` ) ⟹ Promise&amp;lt;unknown&amp;gt;
field `}),e.add({id:100,href:"/docs/modules/furo-data/ValidatorGoogleProtobufFloatValue/",title:"ValidatorGoogleProtobufFloatValue",section:"@furo/data",content:` ValidatorGoogleProtobufFloatValue # @furo/furo-data v2.3.0 import '@furo/data/src/lib/ValidatorGoogleProtobufFloatValue.js'; exports ValidatorGoogleProtobufFloatValue js
A class to validate constraints on type of google.protobuf.FloatValue
Attributes and Properties # Methods # validateConstraints # validateConstraints(field \`\` ) ⟹ Promise&amp;lt;unknown&amp;gt;
field `}),e.add({id:101,href:"/docs/modules/furo-framework/ValidatorGoogleProtobufFloatValue/",title:"ValidatorGoogleProtobufFloatValue",section:"@furo/framework",content:` ValidatorGoogleProtobufFloatValue # @furo/furo-framework v2.4.11 import '@furo/framework/src/BaseSpecValidators/ValidatorGoogleProtobufFloatValue.js'; exports ValidatorGoogleProtobufFloatValue js
A class to validate constraints on type of google.protobuf.FloatValue
Attributes and Properties # Methods # validateConstraints # validateConstraints(field \`\` ) ⟹ Promise&amp;lt;unknown&amp;gt;
field `}),e.add({id:102,href:"/docs/modules/furo-data/ValidatorGoogleProtobufInt64Value/",title:"ValidatorGoogleProtobufInt64Value",section:"@furo/data",content:` ValidatorGoogleProtobufInt64Value # @furo/furo-data v2.3.0 import '@furo/data/src/lib/ValidatorGoogleProtobufInt64Value.js'; exports ValidatorGoogleProtobufInt64Value js
A class to validate constraints on type of google.protobuf.Int64Value
Attributes and Properties # Methods # validateConstraints # validateConstraints(field \`\` ) ⟹ Promise&amp;lt;unknown&amp;gt;
field `}),e.add({id:103,href:"/docs/modules/furo-framework/ValidatorGoogleProtobufInt64Value/",title:"ValidatorGoogleProtobufInt64Value",section:"@furo/framework",content:` ValidatorGoogleProtobufInt64Value # @furo/furo-framework v2.4.11 import '@furo/framework/src/BaseSpecValidators/ValidatorGoogleProtobufInt64Value.js'; exports ValidatorGoogleProtobufInt64Value js
A class to validate constraints on type of google.protobuf.Int64Value
Attributes and Properties # Methods # validateConstraints # validateConstraints(field \`\` ) ⟹ Promise&amp;lt;unknown&amp;gt;
field `}),e.add({id:104,href:"/docs/modules/furo-framework/ValidatorGoogleProtobufTimestamp/",title:"ValidatorGoogleProtobufTimestamp",section:"@furo/framework",content:` ValidatorGoogleProtobufTimestamp # @furo/furo-framework v2.4.11 import '@furo/framework/src/BaseSpecValidators/ValidatorGoogleProtobufTimestamp.js'; exports ValidatorGoogleProtobufTimestamp js
Attributes and Properties # Methods # validateConstraints # validateConstraints(field \`\` ) ⟹ Promise&amp;lt;unknown&amp;gt;
checks field constraints
field `}),e.add({id:105,href:"/docs/modules/furo-data/ValidatorGoogleTypeDate/",title:"ValidatorGoogleTypeDate",section:"@furo/data",content:` ValidatorGoogleTypeDate # @furo/furo-data v2.3.0 import '@furo/data/src/lib/ValidatorGoogleTypeDate.js'; exports ValidatorGoogleTypeDate js
A class to validate constraints on type google.type.Date&lt;/code
Attributes and Properties # Methods # validateConstraints # validateConstraints(field \`\` ) ⟹ Promise&amp;lt;unknown&amp;gt;
checks constraints
field isEmpty # isEmpty(field \`\` ) ⟹ void
checks if type date is empty
field `}),e.add({id:106,href:"/docs/modules/furo-framework/ValidatorGoogleTypeDate/",title:"ValidatorGoogleTypeDate",section:"@furo/framework",content:` ValidatorGoogleTypeDate # @furo/furo-framework v2.4.11 import '@furo/framework/src/BaseSpecValidators/ValidatorGoogleTypeDate.js'; exports ValidatorGoogleTypeDate js
A class to validate constraints on type google.type.Date&lt;/code
Attributes and Properties # Methods # validateConstraints # validateConstraints(field \`\` ) ⟹ Promise&amp;lt;unknown&amp;gt;
checks constraints
field isEmpty # isEmpty(field \`\` ) ⟹ void
checks if type date is empty
field `}),e.add({id:107,href:"/docs/modules/furo-data/ValidatorGoogleTypeMoney/",title:"ValidatorGoogleTypeMoney",section:"@furo/data",content:` ValidatorGoogleTypeMoney # @furo/furo-data v2.3.0 import '@furo/data/src/lib/ValidatorGoogleTypeMoney.js'; exports ValidatorGoogleTypeMoney js
A class to validate constraints on type google.type.Money&lt;/code
Attributes and Properties # Methods # validateConstraints # validateConstraints(field \`\` ) ⟹ Promise&amp;lt;unknown&amp;gt;
checks field constraints
field isEmpty # isEmpty(field \`\` ) ⟹ void
checks if type money is empty
field `}),e.add({id:108,href:"/docs/modules/furo-framework/ValidatorGoogleTypeMoney/",title:"ValidatorGoogleTypeMoney",section:"@furo/framework",content:` ValidatorGoogleTypeMoney # @furo/furo-framework v2.4.11 import '@furo/framework/src/BaseSpecValidators/ValidatorGoogleTypeMoney.js'; exports ValidatorGoogleTypeMoney js
A class to validate constraints on type google.type.Money&lt;/code
Attributes and Properties # Methods # validateConstraints # validateConstraints(field \`\` ) ⟹ Promise&amp;lt;unknown&amp;gt;
checks field constraints
field isEmpty # isEmpty(field \`\` ) ⟹ void
checks if type money is empty
field `}),e.add({id:109,href:"/docs/modules/furo-data/ValidatorNumericTypes/",title:"ValidatorNumericTypes",section:"@furo/data",content:` ValidatorNumericTypes # @furo/furo-data v2.18.0 import '@furo/data/src/lib/ValidatorNumericTypes.js'; exports ValidatorNumericTypes js
A class to validate constraints on numeric types
Attributes and Properties # Methods # validateConstraints # validateConstraints(field \`\` ) ⟹ Promise&amp;lt;unknown&amp;gt;
field `}),e.add({id:110,href:"/docs/modules/furo-framework/ValidatorRegistry/",title:"ValidatorRegistry",section:"@furo/framework",content:` ValidatorRegistry # @furo/furo-framework v2.4.11 import '@furo/framework/src/ValidatorRegistry.js'; exports ValidatorRegistry js
This is used by the FieldNode to validate against specified constraints. Scalar values must not be registered.
Attributes and Properties # Methods # register # register(typename String ValidatorClass Class ) ⟹ void
Register a validator for a specific type.
typename ValidatorClass getValidator # getValidator(typename String ) ⟹ *|boolean
Receive a validator for a specific complex type
typename `})})()