define('ember-data/-private', ['exports', 'ember-inflector', '@ember/ordered-set', 'ember-data/-debug', 'ember-data/version'], function (exports, emberInflector, EmberOrderedSet, Debug, VERSION) { 'use strict';

  EmberOrderedSet = EmberOrderedSet && EmberOrderedSet.hasOwnProperty('default') ? EmberOrderedSet['default'] : EmberOrderedSet;
  VERSION = VERSION && VERSION.hasOwnProperty('default') ? VERSION['default'] : VERSION;

  /**
    A `PromiseArray` is an object that acts like both an `Ember.Array`
    and a promise. When the promise is resolved the resulting value
    will be set to the `PromiseArray`'s `content` property. This makes
    it easy to create data bindings with the `PromiseArray` that will be
    updated when the promise resolves.

    For more information see the [Ember.PromiseProxyMixin
    documentation](/api/classes/Ember.PromiseProxyMixin.html).

    Example

    ```javascript
    let promiseArray = DS.PromiseArray.create({
      promise: $.getJSON('/some/remote/data.json')
    });

    promiseArray.get('length'); // 0

    promiseArray.then(function() {
      promiseArray.get('length'); // 100
    });
    ```

    @class PromiseArray
    @namespace DS
    @extends Ember.ArrayProxy
    @uses Ember.PromiseProxyMixin
  */
  var PromiseArray = Ember.ArrayProxy.extend(Ember.PromiseProxyMixin, {
    meta: Ember.computed.reads('content.meta')
  });
  /**
    A `PromiseObject` is an object that acts like both an `Ember.Object`
    and a promise. When the promise is resolved, then the resulting value
    will be set to the `PromiseObject`'s `content` property. This makes
    it easy to create data bindings with the `PromiseObject` that will
    be updated when the promise resolves.

    For more information see the [Ember.PromiseProxyMixin
    documentation](/api/classes/Ember.PromiseProxyMixin.html).

    Example

    ```javascript
    let promiseObject = DS.PromiseObject.create({
      promise: $.getJSON('/some/remote/data.json')
    });

    promiseObject.get('name'); // null

    promiseObject.then(function() {
      promiseObject.get('name'); // 'Tomster'
    });
    ```

    @class PromiseObject
    @namespace DS
    @extends Ember.ObjectProxy
    @uses Ember.PromiseProxyMixin
  */

  var PromiseObject = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);
  function promiseObject(promise, label) {
    return PromiseObject.create({
      promise: Ember.RSVP.Promise.resolve(promise, label)
    });
  }
  function promiseArray(promise, label) {
    return PromiseArray.create({
      promise: Ember.RSVP.Promise.resolve(promise, label)
    });
  }
  var PromiseBelongsTo = PromiseObject.extend({
    // we don't proxy meta because we would need to proxy it to the relationship state container
    //  however, meta on relationships does not trigger change notifications.
    //  if you need relationship meta, you should do `record.belongsTo(relationshipName).meta()`
    meta: Ember.computed(function () {
      (true && !(false) && Ember.assert('You attempted to access meta on the promise for the async belongsTo relationship ' + `${this.get('_belongsToState').internalModel.modelName}:${this.get('_belongsToState').key}'.` + '\nUse `record.belongsTo(relationshipName).meta()` instead.', false));
    }),

    reload(options) {
      (true && !(this.get('content') !== undefined) && Ember.assert('You are trying to reload an async belongsTo before it has been created', this.get('content') !== undefined));
      var state = this.get('_belongsToState');
      var key = state.key;
      var store = state.store;
      var resource = state.recordData.getResourceIdentifier();

      var internalModel = store._internalModelForResource(resource);

      return store.reloadBelongsTo(this, internalModel, key, options).then(() => this);
    }

  });
  /**
    A PromiseManyArray is a PromiseArray that also proxies certain method calls
    to the underlying manyArray.
    Right now we proxy:

      * `reload()`
      * `createRecord()`
      * `on()`
      * `one()`
      * `trigger()`
      * `off()`
      * `has()`

    @class PromiseManyArray
    @namespace DS
    @extends Ember.ArrayProxy
  */

  function proxyToContent(method) {
    return function () {
      return Ember.get(this, 'content')[method](...arguments);
    };
  }
  var PromiseManyArray = PromiseArray.extend({
    reload(options) {
      (true && !(Ember.get(this, 'content')) && Ember.assert('You are trying to reload an async manyArray before it has been created', Ember.get(this, 'content')));
      this.set('promise', this.get('content').reload(options));
      return this;
    },

    createRecord: proxyToContent('createRecord'),
    on: proxyToContent('on'),
    one: proxyToContent('one'),
    trigger: proxyToContent('trigger'),
    off: proxyToContent('off'),
    has: proxyToContent('has')
  });

  /**
  @module ember-data
  */

  /**
    Holds validation errors for a given record, organized by attribute names.

    Every `DS.Model` has an `errors` property that is an instance of
    `DS.Errors`. This can be used to display validation error
    messages returned from the server when a `record.save()` rejects.

    For Example, if you had a `User` model that looked like this:

    ```app/models/user.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      username: DS.attr('string'),
      email: DS.attr('string')
    });
    ```
    And you attempted to save a record that did not validate on the backend:

    ```javascript
    let user = store.createRecord('user', {
      username: 'tomster',
      email: 'invalidEmail'
    });
    user.save();
    ```

    Your backend would be expected to return an error response that described
    the problem, so that error messages can be generated on the app.

    API responses will be translated into instances of `DS.Errors` differently,
    depending on the specific combination of adapter and serializer used. You
    may want to check the documentation or the source code of the libraries
    that you are using, to know how they expect errors to be communicated.

    Errors can be displayed to the user by accessing their property name
    to get an array of all the error objects for that property. Each
    error object is a JavaScript object with two keys:

    - `message` A string containing the error message from the backend
    - `attribute` The name of the property associated with this error message

    ```handlebars
    <label>Username: {{input value=username}} </label>
    {{#each model.errors.username as |error|}}
      <div class="error">
        {{error.message}}
      </div>
    {{/each}}

    <label>Email: {{input value=email}} </label>
    {{#each model.errors.email as |error|}}
      <div class="error">
        {{error.message}}
      </div>
    {{/each}}
    ```

    You can also access the special `messages` property on the error
    object to get an array of all the error strings.

    ```handlebars
    {{#each model.errors.messages as |message|}}
      <div class="error">
        {{message}}
      </div>
    {{/each}}
    ```

    @class Errors
    @namespace DS
    @extends Ember.ArrayProxy
    @uses Ember.Evented
   */
  var Errors = Ember.ArrayProxy.extend(Ember.Evented, {
    /**
      Register with target handler
       @method _registerHandlers
      @private
    */
    _registerHandlers(target, becameInvalid, becameValid) {
      this.on('becameInvalid', target, becameInvalid);
      this.on('becameValid', target, becameValid);
    },

    /**
      @property errorsByAttributeName
      @type {MapWithDefault}
      @private
    */
    errorsByAttributeName: Ember.computed(function () {
      return new Map();
    }),

    /**
      Returns errors for a given attribute
       ```javascript
      let user = store.createRecord('user', {
        username: 'tomster',
        email: 'invalidEmail'
      });
      user.save().catch(function(){
        user.get('errors').errorsFor('email'); // returns:
        // [{attribute: "email", message: "Doesn't look like a valid email."}]
      });
      ```
       @method errorsFor
      @param {String} attribute
      @return {Array}
    */
    errorsFor(attribute) {
      var map = Ember.get(this, 'errorsByAttributeName');

      if (!map.has(attribute)) {
        map.set(attribute, new Ember.A());
      }

      return map.get(attribute);
    },

    /**
      An array containing all of the error messages for this
      record. This is useful for displaying all errors to the user.
       ```handlebars
      {{#each model.errors.messages as |message|}}
        <div class="error">
          {{message}}
        </div>
      {{/each}}
      ```
       @property messages
      @type {Array}
    */
    messages: Ember.computed.mapBy('content', 'message'),

    /**
      @property content
      @type {Array}
      @private
    */
    content: Ember.computed(function () {
      return Ember.A();
    }),

    /**
      @method unknownProperty
      @private
    */
    unknownProperty(attribute) {
      var errors = this.errorsFor(attribute);

      if (errors.length === 0) {
        return undefined;
      }

      return errors;
    },

    /**
      Total number of errors.
       @property length
      @type {Number}
      @readOnly
    */

    /**
      @property isEmpty
      @type {Boolean}
      @readOnly
    */
    isEmpty: Ember.computed.not('length').readOnly(),

    /**
     Manually adds errors to the record. This will triger the `becameInvalid` event/ lifecycle method on
      the record and transition the record into an `invalid` state.
      Example
     ```javascript
      let errors = get(user, 'errors');
      
      // add multiple errors
      errors.add('password', [
        'Must be at least 12 characters',
        'Must contain at least one symbol',
        'Cannot contain your name'
      ]);
      
      errors.errorsFor('password');
      // =>
      // [
      //   { attribute: 'password', message: 'Must be at least 12 characters' },
      //   { attribute: 'password', message: 'Must contain at least one symbol' },
      //   { attribute: 'password', message: 'Cannot contain your name' },
      // ]
      
      // add a single error
      errors.add('username', 'This field is required');
       errors.errorsFor('password');
      // =>
      // [
      //   { attribute: 'username', message: 'This field is required' },
      // ]
     ```
    @method add
    @param {string} attribute - the property name of an attribute or relationship
    @param {string[]|string} messages - an error message or array of error messages for the attribute
     */
    add(attribute, messages) {
      var wasEmpty = Ember.get(this, 'isEmpty');

      this._add(attribute, messages);

      if (wasEmpty && !Ember.get(this, 'isEmpty')) {
        this.trigger('becameInvalid');
      }
    },

    /**
      Adds error messages to a given attribute without sending event.
       @method _add
      @private
    */
    _add(attribute, messages) {
      messages = this._findOrCreateMessages(attribute, messages);
      this.addObjects(messages);
      this.errorsFor(attribute).addObjects(messages);
      this.notifyPropertyChange(attribute);
    },

    /**
      @method _findOrCreateMessages
      @private
    */
    _findOrCreateMessages(attribute, messages) {
      var errors = this.errorsFor(attribute);
      var messagesArray = Ember.makeArray(messages);

      var _messages = new Array(messagesArray.length);

      for (var i = 0; i < messagesArray.length; i++) {
        var message = messagesArray[i];
        var err = errors.findBy('message', message);

        if (err) {
          _messages[i] = err;
        } else {
          _messages[i] = {
            attribute: attribute,
            message: message
          };
        }
      }

      return _messages;
    },

    /**
     Manually removes all errors for a given member from the record.
       This will transition the record into a `valid` state, and
      triggers the `becameValid` event and lifecycle method.
      Example:
      ```javascript
      let errors = get('user', errors);
      errors.add('phone', ['error-1', 'error-2']);
      
      errors.errorsFor('phone');
      // =>
      // [
      //   { attribute: 'phone', message: 'error-1' },
      //   { attribute: 'phone', message: 'error-2' },
      // ]
      
      errors.remove('phone');
      
      errors.errorsFor('phone');
      // => undefined
     ```
     @method remove
     @param {string} member - the property name of an attribute or relationship
     */
    remove(attribute) {
      if (Ember.get(this, 'isEmpty')) {
        return;
      }

      this._remove(attribute);

      if (Ember.get(this, 'isEmpty')) {
        this.trigger('becameValid');
      }
    },

    /**
      Removes all error messages from the given attribute without sending event.
       @method _remove
      @private
    */
    _remove(attribute) {
      if (Ember.get(this, 'isEmpty')) {
        return;
      }

      var content = this.rejectBy('attribute', attribute);
      Ember.set(this, 'content', content);
      Ember.get(this, 'errorsByAttributeName').delete(attribute);
      this.notifyPropertyChange(attribute);
      this.notifyPropertyChange('length');
    },

    /**
     Manually clears all errors for the record.
       This will transition the record into a `valid` state, and
       will trigger the `becameValid` event and lifecycle method.
     
    Example:
     
     ```javascript
     let errors = get('user', errors);
     errors.add('username', ['error-a']);
     errors.add('phone', ['error-1', 'error-2']);
     
     errors.errorsFor('username');
     // =>
     // [
     //   { attribute: 'username', message: 'error-a' },
     // ]
     
     errors.errorsFor('phone');
     // =>
     // [
     //   { attribute: 'phone', message: 'error-1' },
     //   { attribute: 'phone', message: 'error-2' },
     // ]
     
     errors.clear();
     
     errors.errorsFor('username');
     // => undefined
     
     errors.errorsFor('phone');
     // => undefined
     
     errors.get('messages')
     // => []
     ```
     @method remove
     */
    clear() {
      if (Ember.get(this, 'isEmpty')) {
        return;
      }

      this._clear();

      this.trigger('becameValid');
    },

    /**
      Removes all error messages.
      to the record.
       @method _clear
      @private
    */
    _clear() {
      if (Ember.get(this, 'isEmpty')) {
        return;
      }

      var errorsByAttributeName = Ember.get(this, 'errorsByAttributeName');
      var attributes = [];
      errorsByAttributeName.forEach(function (_, attribute) {
        attributes.push(attribute);
      });
      errorsByAttributeName.clear();
      attributes.forEach(attribute => {
        this.notifyPropertyChange(attribute);
      });
      Ember.ArrayProxy.prototype.clear.call(this);
    },

    /**
      Checks if there are error messages for the given attribute.
       ```app/routes/user/edit.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        actions: {
          save: function(user) {
            if (user.get('errors').has('email')) {
              return alert('Please update your email before attempting to save.');
            }
            user.save();
          }
        }
      });
      ```
       @method has
      @param {String} attribute
      @return {Boolean} true if there some errors on given attribute
    */
    has(attribute) {
      return this.errorsFor(attribute).length > 0;
    }

  });

  // All modelNames are dasherized internally. Changing this function may
  // require changes to other normalization hooks (such as typeForRoot).

  /**
   This method normalizes a modelName into the format Ember Data uses
   internally.

    @method normalizeModelName
    @public
    @param {String} modelName
    @return {String} normalizedModelName
    @for DS
  */
  function normalizeModelName(modelName) {
    return Ember.String.dasherize(modelName);
  }

  function typeForRelationshipMeta(meta) {
    var modelName;
    modelName = meta.type || meta.key;
    modelName = normalizeModelName(modelName);

    if (meta.kind === 'hasMany') {
      modelName = emberInflector.singularize(modelName);
    }

    return modelName;
  }

  function shouldFindInverse(relationshipMeta) {
    var options = relationshipMeta.options;
    return !(options && options.inverse === null);
  }

  class RelationshipDefinition {
    constructor(meta) {
      this.meta = meta;
      this._type = '';
      this.__inverseKey = '';
      this.__inverseIsAsync = null;
      this.parentModelName = meta.parentModelName;
    }

    get key() {
      return this.meta.key;
    }

    get kind() {
      return this.meta.kind;
    }

    get type() {
      if (this._type) {
        return this._type;
      }

      this._type = typeForRelationshipMeta(this.meta);
      return this._type;
    }

    get options() {
      return this.meta.options;
    }

    get name() {
      return this.meta.name;
    }

    _inverseKey(store, modelClass) {
      if (this.__inverseKey === '') {
        this._calculateInverse(store, modelClass);
      }

      return this.__inverseKey;
    }

    _inverseIsAsync(store, modelClass) {
      if (this.__inverseIsAsync === null) {
        this._calculateInverse(store, modelClass);
      }

      return this.__inverseIsAsync;
    }

    _calculateInverse(store, modelClass) {
      var inverseKey, inverseIsAsync;
      var inverse = null;

      if (shouldFindInverse(this.meta)) {
        inverse = modelClass.inverseFor(this.key, store);
      } else {
        modelClass.typeForRelationship(this.key, store);
      }

      if (inverse) {
        inverseKey = inverse.name;
        inverseIsAsync = isInverseAsync(inverse);
      } else {
        inverseKey = null;
        inverseIsAsync = false;
      }

      this.__inverseKey = inverseKey;
      this.__inverseIsAsync = inverseIsAsync;
    }

  }

  function isInverseAsync(meta) {
    var inverseAsync = meta.options && meta.options.async;
    return typeof inverseAsync === 'undefined' ? true : inverseAsync;
  }

  function relationshipFromMeta(meta) {
    return new RelationshipDefinition(meta);
  }

  var relationshipsDescriptor = Ember.computed(function () {
    var map = new Map();
    var relationshipsByName = Ember.get(this, 'relationshipsByName'); // Loop through each computed property on the class

    relationshipsByName.forEach(desc => {
      var {
        type
      } = desc;

      if (!map.has(type)) {
        map.set(type, []);
      }

      map.get(type).push(desc);
    });
    return map;
  }).readOnly();
  var relatedTypesDescriptor = Ember.computed(function () {
    var parentModelName = this.modelName;
    var types = Ember.A(); // Loop through each computed property on the class,
    // and create an array of the unique types involved
    // in relationships

    this.eachComputedProperty((name, meta) => {
      if (meta.isRelationship) {
        meta.key = name;
        var modelName = typeForRelationshipMeta(meta);
        (true && !(modelName) && Ember.assert(`You specified a hasMany (${meta.type}) on ${parentModelName} but ${meta.type} was not found.`, modelName));

        if (!types.includes(modelName)) {
          (true && !(!!modelName) && Ember.assert(`Trying to sideload ${name} on ${this.toString()} but the type doesn't exist.`, !!modelName));
          types.push(modelName);
        }
      }
    });
    return types;
  }).readOnly();
  var relationshipsObjectDescriptor = Ember.computed(function () {
    var relationships = Object.create(null);
    var modelName = this.modelName;
    this.eachComputedProperty((name, meta) => {
      if (meta.isRelationship) {
        meta.key = name;
        meta.name = name;
        meta.parentModelName = modelName;
        relationships[name] = relationshipFromMeta(meta);
      }
    });
    return relationships;
  });
  var relationshipsByNameDescriptor = Ember.computed(function () {
    var map = new Map();
    var rels = Ember.get(this, 'relationshipsObject');
    var relationships = Object.keys(rels);

    for (var i = 0; i < relationships.length; i++) {
      var key = relationships[i];
      var value = rels[key];
      map.set(value.key, value);
    }

    return map;
  }).readOnly();

  /**
    @module ember-data
  */

  /*
    This file encapsulates the various states that a record can transition
    through during its lifecycle.
  */

  /**
    ### State

    Each record has a `currentState` property that explicitly tracks what
    state a record is in at any given time. For instance, if a record is
    newly created and has not yet been sent to the adapter to be saved,
    it would be in the `root.loaded.created.uncommitted` state.  If a
    record has had local modifications made to it that are in the
    process of being saved, the record would be in the
    `root.loaded.updated.inFlight` state. (This state path will be
    explained in more detail below.)

    Events are sent by the record or its store to the record's
    `currentState` property. How the state reacts to these events is
    dependent on which state it is in. In some states, certain events
    will be invalid and will cause an exception to be raised.

    States are hierarchical and every state is a sub-state of the
    `RootState`. For example, a record can be in the
    `root.deleted.uncommitted` state then transitions into the
    `root.deleted.inFlight` state. If a child state does not implement
    an event handler, the state manager will attempt to invoke the event
    on all parent states until the root state is reached. The state
    hierarchy of a record is described in terms of a path string. You
    can determine a record's current state by getting the state's
    `stateName` property:

    ```javascript
    record.get('currentState.stateName');
    //=> "root.created.uncommitted"
     ```

    The hierarchy of valid states that ship with ember data looks like
    this:

    ```text
    * root
      * deleted
        * saved
        * uncommitted
        * inFlight
      * empty
      * loaded
        * created
          * uncommitted
          * inFlight
        * saved
        * updated
          * uncommitted
          * inFlight
      * loading
    ```

    The `DS.Model` states are themselves stateless. What that means is
    that, the hierarchical states that each of *those* points to is a
    shared data structure. For performance reasons, instead of each
    record getting its own copy of the hierarchy of states, each record
    points to this global, immutable shared instance. How does a state
    know which record it should be acting on? We pass the record
    instance into the state's event handlers as the first argument.

    The record passed as the first parameter is where you should stash
    state about the record if needed; you should never store data on the state
    object itself.

    ### Events and Flags

    A state may implement zero or more events and flags.

    #### Events

    Events are named functions that are invoked when sent to a record. The
    record will first look for a method with the given name on the
    current state. If no method is found, it will search the current
    state's parent, and then its grandparent, and so on until reaching
    the top of the hierarchy. If the root is reached without an event
    handler being found, an exception will be raised. This can be very
    helpful when debugging new features.

    Here's an example implementation of a state with a `myEvent` event handler:

    ```javascript
    aState: DS.State.create({
      myEvent: function(manager, param) {
        console.log("Received myEvent with", param);
      }
    })
    ```

    To trigger this event:

    ```javascript
    record.send('myEvent', 'foo');
    //=> "Received myEvent with foo"
    ```

    Note that an optional parameter can be sent to a record's `send()` method,
    which will be passed as the second parameter to the event handler.

    Events should transition to a different state if appropriate. This can be
    done by calling the record's `transitionTo()` method with a path to the
    desired state. The state manager will attempt to resolve the state path
    relative to the current state. If no state is found at that path, it will
    attempt to resolve it relative to the current state's parent, and then its
    parent, and so on until the root is reached. For example, imagine a hierarchy
    like this:

        * created
          * uncommitted <-- currentState
          * inFlight
        * updated
          * inFlight

    If we are currently in the `uncommitted` state, calling
    `transitionTo('inFlight')` would transition to the `created.inFlight` state,
    while calling `transitionTo('updated.inFlight')` would transition to
    the `updated.inFlight` state.

    Remember that *only events* should ever cause a state transition. You should
    never call `transitionTo()` from outside a state's event handler. If you are
    tempted to do so, create a new event and send that to the state manager.

    #### Flags

    Flags are Boolean values that can be used to introspect a record's current
    state in a more user-friendly way than examining its state path. For example,
    instead of doing this:

    ```javascript
    var statePath = record.get('stateManager.currentPath');
    if (statePath === 'created.inFlight') {
      doSomething();
    }
    ```

    You can say:

    ```javascript
    if (record.get('isNew') && record.get('isSaving')) {
      doSomething();
    }
    ```

    If your state does not set a value for a given flag, the value will
    be inherited from its parent (or the first place in the state hierarchy
    where it is defined).

    The current set of flags are defined below. If you want to add a new flag,
    in addition to the area below, you will also need to declare it in the
    `DS.Model` class.


     * [isEmpty](DS.Model.html#property_isEmpty)
     * [isLoading](DS.Model.html#property_isLoading)
     * [isLoaded](DS.Model.html#property_isLoaded)
     * [hasDirtyAttributes](DS.Model.html#property_hasDirtyAttributes)
     * [isSaving](DS.Model.html#property_isSaving)
     * [isDeleted](DS.Model.html#property_isDeleted)
     * [isNew](DS.Model.html#property_isNew)
     * [isValid](DS.Model.html#property_isValid)

    @namespace DS
    @class RootState
  */
  function didSetProperty(internalModel, context) {
    if (context.isDirty) {
      internalModel.send('becomeDirty');
    } else {
      internalModel.send('propertyWasReset');
    }

    internalModel.updateRecordArrays();
  } // Implementation notes:
  //
  // Each state has a boolean value for all of the following flags:
  //
  // * isLoaded: The record has a populated `data` property. When a
  //   record is loaded via `store.find`, `isLoaded` is false
  //   until the adapter sets it. When a record is created locally,
  //   its `isLoaded` property is always true.
  // * isDirty: The record has local changes that have not yet been
  //   saved by the adapter. This includes records that have been
  //   created (but not yet saved) or deleted.
  // * isSaving: The record has been committed, but
  //   the adapter has not yet acknowledged that the changes have
  //   been persisted to the backend.
  // * isDeleted: The record was marked for deletion. When `isDeleted`
  //   is true and `isDirty` is true, the record is deleted locally
  //   but the deletion was not yet persisted. When `isSaving` is
  //   true, the change is in-flight. When both `isDirty` and
  //   `isSaving` are false, the change has persisted.
  // * isNew: The record was created on the client and the adapter
  //   did not yet report that it was successfully saved.
  // * isValid: The adapter did not report any server-side validation
  //   failures.
  // The dirty state is a abstract state whose functionality is
  // shared between the `created` and `updated` states.
  //
  // The deleted state shares the `isDirty` flag with the
  // subclasses of `DirtyState`, but with a very different
  // implementation.
  //
  // Dirty states have three child states:
  //
  // `uncommitted`: the store has not yet handed off the record
  //   to be saved.
  // `inFlight`: the store has handed off the record to be saved,
  //   but the adapter has not yet acknowledged success.
  // `invalid`: the record has invalid information and cannot be
  //   sent to the adapter yet.


  var DirtyState = {
    initialState: 'uncommitted',
    // FLAGS
    isDirty: true,
    // SUBSTATES
    // When a record first becomes dirty, it is `uncommitted`.
    // This means that there are local pending changes, but they
    // have not yet begun to be saved, and are not invalid.
    uncommitted: {
      // EVENTS
      didSetProperty,

      //TODO(Igor) reloading now triggers a
      //loadingData event, though it seems fine?
      loadingData() {},

      propertyWasReset(internalModel, name) {
        if (!internalModel.hasChangedAttributes()) {
          internalModel.send('rolledBack');
        }
      },

      pushedData(internalModel) {
        if (!internalModel.hasChangedAttributes()) {
          internalModel.transitionTo('loaded.saved');
        }
      },

      becomeDirty() {},

      willCommit(internalModel) {
        internalModel.transitionTo('inFlight');
      },

      reloadRecord(internalModel, {
        resolve,
        options
      }) {
        resolve(internalModel.store._reloadRecord(internalModel, options));
      },

      rolledBack(internalModel) {
        internalModel.transitionTo('loaded.saved');
        internalModel.triggerLater('rolledBack');
      },

      becameInvalid(internalModel) {
        internalModel.transitionTo('invalid');
      },

      rollback(internalModel) {
        internalModel.rollbackAttributes();
        internalModel.triggerLater('ready');
      }

    },
    // Once a record has been handed off to the adapter to be
    // saved, it is in the 'in flight' state. Changes to the
    // record cannot be made during this window.
    inFlight: {
      // FLAGS
      isSaving: true,
      // EVENTS
      didSetProperty,

      becomeDirty() {},

      pushedData() {},

      unloadRecord: assertAgainstUnloadRecord,

      // TODO: More robust semantics around save-while-in-flight
      willCommit() {},

      didCommit(internalModel) {
        internalModel.transitionTo('saved');
        internalModel.send('invokeLifecycleCallbacks', this.dirtyType);
      },

      rolledBack(internalModel) {
        internalModel.triggerLater('rolledBack');
      },

      becameInvalid(internalModel) {
        internalModel.transitionTo('invalid');
        internalModel.send('invokeLifecycleCallbacks');
      },

      becameError(internalModel) {
        internalModel.transitionTo('uncommitted');
        internalModel.triggerLater('becameError', internalModel);
      }

    },
    // A record is in the `invalid` if the adapter has indicated
    // the the record failed server-side invalidations.
    invalid: {
      // FLAGS
      isValid: false,

      // EVENTS
      deleteRecord(internalModel) {
        internalModel.transitionTo('deleted.uncommitted');
      },

      didSetProperty(internalModel, context) {
        internalModel.removeErrorMessageFromAttribute(context.name);
        didSetProperty(internalModel, context);

        if (!internalModel.hasErrors()) {
          this.becameValid(internalModel);
        }
      },

      becameInvalid() {},

      becomeDirty() {},

      pushedData() {},

      willCommit(internalModel) {
        internalModel.clearErrorMessages();
        internalModel.transitionTo('inFlight');
      },

      rolledBack(internalModel) {
        internalModel.clearErrorMessages();
        internalModel.transitionTo('loaded.saved');
        internalModel.triggerLater('ready');
      },

      becameValid(internalModel) {
        internalModel.transitionTo('uncommitted');
      },

      invokeLifecycleCallbacks(internalModel) {
        internalModel.triggerLater('becameInvalid', internalModel);
      }

    }
  }; // The created and updated states are created outside the state
  // chart so we can reopen their substates and add mixins as
  // necessary.

  function deepClone(object) {
    var clone = {};
    var value;

    for (var prop in object) {
      value = object[prop];

      if (value && typeof value === 'object') {
        clone[prop] = deepClone(value);
      } else {
        clone[prop] = value;
      }
    }

    return clone;
  }

  function mixin(original, hash) {
    for (var prop in hash) {
      original[prop] = hash[prop];
    }

    return original;
  }

  function dirtyState(options) {
    var newState = deepClone(DirtyState);
    return mixin(newState, options);
  }

  var createdState = dirtyState({
    dirtyType: 'created',
    // FLAGS
    isNew: true
  });

  createdState.invalid.rolledBack = function (internalModel) {
    internalModel.transitionTo('deleted.saved');
    internalModel.triggerLater('rolledBack');
  };

  createdState.uncommitted.rolledBack = function (internalModel) {
    internalModel.transitionTo('deleted.saved');
    internalModel.triggerLater('rolledBack');
  };

  var updatedState = dirtyState({
    dirtyType: 'updated'
  });

  function createdStateDeleteRecord(internalModel) {
    internalModel.transitionTo('deleted.saved');
    internalModel.send('invokeLifecycleCallbacks');
  }

  createdState.uncommitted.deleteRecord = createdStateDeleteRecord;
  createdState.invalid.deleteRecord = createdStateDeleteRecord;

  createdState.uncommitted.rollback = function (internalModel) {
    DirtyState.uncommitted.rollback.apply(this, arguments);
    internalModel.transitionTo('deleted.saved');
  };

  createdState.uncommitted.pushedData = function (internalModel) {
    internalModel.transitionTo('loaded.updated.uncommitted');
    internalModel.triggerLater('didLoad');
  };

  createdState.uncommitted.propertyWasReset = function () {};

  function assertAgainstUnloadRecord(internalModel) {
    (true && !(false) && Ember.assert('You can only unload a record which is not inFlight. `' + internalModel + '`', false));
  }

  updatedState.invalid.becameValid = function (internalModel) {
    // we're eagerly transition into the loaded.saved state, even though we could
    // be still dirty; but the setup hook of the loaded.saved state checks for
    // dirty attributes and transitions into the corresponding dirty state
    internalModel.transitionTo('loaded.saved');
  };

  updatedState.inFlight.unloadRecord = assertAgainstUnloadRecord;

  updatedState.uncommitted.deleteRecord = function (internalModel) {
    internalModel.transitionTo('deleted.uncommitted');
  };

  updatedState.invalid.rolledBack = function (internalModel) {
    internalModel.clearErrorMessages();
    internalModel.transitionTo('loaded.saved');
    internalModel.triggerLater('rolledBack');
  };

  var RootState = {
    // FLAGS
    isEmpty: false,
    isLoading: false,
    isLoaded: false,
    isDirty: false,
    isSaving: false,
    isDeleted: false,
    isNew: false,
    isValid: true,

    // DEFAULT EVENTS
    // Trying to roll back if you're not in the dirty state
    // doesn't change your state. For example, if you're in the
    // in-flight state, rolling back the record doesn't move
    // you out of the in-flight state.
    rolledBack() {},

    unloadRecord(internalModel) {},

    propertyWasReset() {},

    // SUBSTATES
    // A record begins its lifecycle in the `empty` state.
    // If its data will come from the adapter, it will
    // transition into the `loading` state. Otherwise, if
    // the record is being created on the client, it will
    // transition into the `created` state.
    empty: {
      isEmpty: true,

      // EVENTS
      loadingData(internalModel, promise) {
        internalModel._promiseProxy = promise;
        internalModel.transitionTo('loading');
      },

      loadedData(internalModel) {
        internalModel.transitionTo('loaded.created.uncommitted');
        internalModel.triggerLater('ready');
      },

      pushedData(internalModel) {
        internalModel.transitionTo('loaded.saved');
        internalModel.triggerLater('didLoad');
        internalModel.triggerLater('ready');
      }

    },
    // A record enters this state when the store asks
    // the adapter for its data. It remains in this state
    // until the adapter provides the requested data.
    //
    // Usually, this process is asynchronous, using an
    // XHR to retrieve the data.
    loading: {
      // FLAGS
      isLoading: true,

      exit(internalModel) {
        internalModel._promiseProxy = null;
      },

      // EVENTS
      pushedData(internalModel) {
        internalModel.transitionTo('loaded.saved');
        internalModel.triggerLater('didLoad');
        internalModel.triggerLater('ready'); //TODO this seems out of place here

        internalModel.didCleanError();
      },

      becameError(internalModel) {
        internalModel.triggerLater('becameError', internalModel);
      },

      notFound(internalModel) {
        internalModel.transitionTo('empty');
      }

    },
    // A record enters this state when its data is populated.
    // Most of a record's lifecycle is spent inside substates
    // of the `loaded` state.
    loaded: {
      initialState: 'saved',
      // FLAGS
      isLoaded: true,

      //TODO(Igor) Reloading now triggers a loadingData event,
      //but it should be ok?
      loadingData() {},

      // SUBSTATES
      // If there are no local changes to a record, it remains
      // in the `saved` state.
      saved: {
        setup(internalModel) {
          if (internalModel.hasChangedAttributes()) {
            internalModel.adapterDidDirty();
          }
        },

        // EVENTS
        didSetProperty,

        pushedData() {},

        becomeDirty(internalModel) {
          internalModel.transitionTo('updated.uncommitted');
        },

        willCommit(internalModel) {
          internalModel.transitionTo('updated.inFlight');
        },

        reloadRecord(internalModel, {
          resolve,
          options
        }) {
          resolve(internalModel.store._reloadRecord(internalModel, options));
        },

        deleteRecord(internalModel) {
          internalModel.transitionTo('deleted.uncommitted');
        },

        unloadRecord(internalModel) {},

        didCommit() {},

        // loaded.saved.notFound would be triggered by a failed
        // `reload()` on an unchanged record
        notFound() {}

      },
      // A record is in this state after it has been locally
      // created but before the adapter has indicated that
      // it has been saved.
      created: createdState,
      // A record is in this state if it has already been
      // saved to the server, but there are new local changes
      // that have not yet been saved.
      updated: updatedState
    },
    // A record is in this state if it was deleted from the store.
    deleted: {
      initialState: 'uncommitted',
      dirtyType: 'deleted',
      // FLAGS
      isDeleted: true,
      isLoaded: true,
      isDirty: true,

      // TRANSITIONS
      setup(internalModel) {
        internalModel.updateRecordArrays();
      },

      // SUBSTATES
      // When a record is deleted, it enters the `start`
      // state. It will exit this state when the record
      // starts to commit.
      uncommitted: {
        // EVENTS
        willCommit(internalModel) {
          internalModel.transitionTo('inFlight');
        },

        rollback(internalModel) {
          internalModel.rollbackAttributes();
          internalModel.triggerLater('ready');
        },

        pushedData() {},

        becomeDirty() {},

        deleteRecord() {},

        rolledBack(internalModel) {
          internalModel.transitionTo('loaded.saved');
          internalModel.triggerLater('ready');
          internalModel.triggerLater('rolledBack');
        }

      },
      // After a record starts committing, but
      // before the adapter indicates that the deletion
      // has saved to the server, a record is in the
      // `inFlight` substate of `deleted`.
      inFlight: {
        // FLAGS
        isSaving: true,
        // EVENTS
        unloadRecord: assertAgainstUnloadRecord,

        // TODO: More robust semantics around save-while-in-flight
        willCommit() {},

        didCommit(internalModel) {
          internalModel.transitionTo('saved');
          internalModel.send('invokeLifecycleCallbacks');
        },

        becameError(internalModel) {
          internalModel.transitionTo('uncommitted');
          internalModel.triggerLater('becameError', internalModel);
        },

        becameInvalid(internalModel) {
          internalModel.transitionTo('invalid');
          internalModel.triggerLater('becameInvalid', internalModel);
        }

      },
      // Once the adapter indicates that the deletion has
      // been saved, the record enters the `saved` substate
      // of `deleted`.
      saved: {
        // FLAGS
        isDirty: false,

        setup(internalModel) {
          internalModel.removeFromInverseRelationships();
        },

        invokeLifecycleCallbacks(internalModel) {
          internalModel.triggerLater('didDelete', internalModel);
          internalModel.triggerLater('didCommit', internalModel);
        },

        willCommit() {},

        didCommit() {},

        pushedData() {}

      },
      invalid: {
        isValid: false,

        didSetProperty(internalModel, context) {
          internalModel.removeErrorMessageFromAttribute(context.name);
          didSetProperty(internalModel, context);

          if (!internalModel.hasErrors()) {
            this.becameValid(internalModel);
          }
        },

        becameInvalid() {},

        becomeDirty() {},

        deleteRecord() {},

        willCommit() {},

        rolledBack(internalModel) {
          internalModel.clearErrorMessages();
          internalModel.transitionTo('loaded.saved');
          internalModel.triggerLater('ready');
        },

        becameValid(internalModel) {
          internalModel.transitionTo('uncommitted');
        }

      }
    },

    invokeLifecycleCallbacks(internalModel, dirtyType) {
      if (dirtyType === 'created') {
        internalModel.triggerLater('didCreate', internalModel);
      } else {
        internalModel.triggerLater('didUpdate', internalModel);
      }

      internalModel.triggerLater('didCommit', internalModel);
    }

  };

  function wireState(object, parent, name) {
    // TODO: Use Object.create and copy instead
    object = mixin(parent ? Object.create(parent) : {}, object);
    object.parentState = parent;
    object.stateName = name;

    for (var prop in object) {
      if (!object.hasOwnProperty(prop) || prop === 'parentState' || prop === 'stateName') {
        continue;
      }

      if (typeof object[prop] === 'object') {
        object[prop] = wireState(object[prop], object, name + '.' + prop);
      }
    }

    return object;
  }

  var RootState$1 = wireState(RootState, null, 'root');

  /**
    @module ember-data
  */

  /**
    @class Snapshot
    @namespace DS
    @private
    @constructor
    @param {DS.Model} internalModel The model to create a snapshot from
  */
  class Snapshot {
    constructor(internalModel, options = {}) {
      this.__attributes = null;
      this._belongsToRelationships = Object.create(null);
      this._belongsToIds = Object.create(null);
      this._hasManyRelationships = Object.create(null);
      this._hasManyIds = Object.create(null);
      this._internalModel = internalModel;
      /*
        If the internalModel does not yet have a record, then we are
        likely a snapshot being provided to a find request, so we
        populate __attributes lazily. Else, to preserve the "moment
        in time" in which a snapshot is created, we greedily grab
        the values.
       */

      if (internalModel.hasRecord) {
        this._attributes;
      }
      /**O
       The id of the snapshot's underlying record
        Example
        ```javascript
       // store.push('post', { id: 1, author: 'Tomster', title: 'Ember.js rocks' });
       postSnapshot.id; // => '1'
       ```
        @property id
       @type {String}
       */


      this.id = internalModel.id;
      /**
       A hash of adapter options
       @property adapterOptions
       @type {Object}
       */

      this.adapterOptions = options.adapterOptions;
      this.include = options.include;
      /**
       The name of the type of the underlying record for this snapshot, as a string.
        @property modelName
       @type {String}
       */

      this.modelName = internalModel.modelName;
      this._changedAttributes = internalModel.changedAttributes();
    }
    /**
     The underlying record for this snapshot. Can be used to access methods and
     properties defined on the record.
      Example
      ```javascript
     let json = snapshot.record.toJSON();
     ```
      @property record
     @type {DS.Model}
     */


    get record() {
      return this._internalModel.getRecord();
    }

    get _attributes() {
      var attributes = this.__attributes;

      if (attributes === null) {
        var record = this.record;
        attributes = this.__attributes = Object.create(null);
        record.eachAttribute(keyName => attributes[keyName] = Ember.get(record, keyName));
      }

      return attributes;
    }
    /**
     The type of the underlying record for this snapshot, as a DS.Model.
      @property type
     @type {DS.Model}
     */


    get type() {
      // TODO @runspired we should deprecate this in favor of modelClass but only once
      // we've cleaned up the internals enough that a public change to follow suite is
      // uncontroversial.
      return this._internalModel.modelClass;
    }
    /**
     Returns the value of an attribute.
      Example
      ```javascript
     // store.push('post', { id: 1, author: 'Tomster', title: 'Ember.js rocks' });
     postSnapshot.attr('author'); // => 'Tomster'
     postSnapshot.attr('title'); // => 'Ember.js rocks'
     ```
      Note: Values are loaded eagerly and cached when the snapshot is created.
      @method attr
     @param {String} keyName
     @return {Object} The attribute value or undefined
     */


    attr(keyName) {
      if (keyName in this._attributes) {
        return this._attributes[keyName];
      }

      throw new Ember.Error("Model '" + Ember.inspect(this.record) + "' has no attribute named '" + keyName + "' defined.");
    }
    /**
     Returns all attributes and their corresponding values.
      Example
      ```javascript
     // store.push('post', { id: 1, author: 'Tomster', title: 'Ember.js rocks' });
     postSnapshot.attributes(); // => { author: 'Tomster', title: 'Ember.js rocks' }
     ```
      @method attributes
     @return {Object} All attributes of the current snapshot
     */


    attributes() {
      return Ember.assign({}, this._attributes);
    }
    /**
     Returns all changed attributes and their old and new values.
      Example
      ```javascript
     // store.push('post', { id: 1, author: 'Tomster', title: 'Ember.js rocks' });
     postModel.set('title', 'Ember.js rocks!');
     postSnapshot.changedAttributes(); // => { title: ['Ember.js rocks', 'Ember.js rocks!'] }
     ```
      @method changedAttributes
     @return {Object} All changed attributes of the current snapshot
     */


    changedAttributes() {
      var changedAttributes = Object.create(null);
      var changedAttributeKeys = Object.keys(this._changedAttributes);

      for (var i = 0, length = changedAttributeKeys.length; i < length; i++) {
        var key = changedAttributeKeys[i];
        changedAttributes[key] = this._changedAttributes[key].slice();
      }

      return changedAttributes;
    }
    /**
     Returns the current value of a belongsTo relationship.
      `belongsTo` takes an optional hash of options as a second parameter,
     currently supported options are:
      - `id`: set to `true` if you only want the ID of the related record to be
     returned.
      Example
      ```javascript
     // store.push('post', { id: 1, title: 'Hello World' });
     // store.createRecord('comment', { body: 'Lorem ipsum', post: post });
     commentSnapshot.belongsTo('post'); // => DS.Snapshot
     commentSnapshot.belongsTo('post', { id: true }); // => '1'
      // store.push('comment', { id: 1, body: 'Lorem ipsum' });
     commentSnapshot.belongsTo('post'); // => undefined
     ```
      Calling `belongsTo` will return a new Snapshot as long as there's any known
     data for the relationship available, such as an ID. If the relationship is
     known but unset, `belongsTo` will return `null`. If the contents of the
     relationship is unknown `belongsTo` will return `undefined`.
      Note: Relationships are loaded lazily and cached upon first access.
      @method belongsTo
     @param {String} keyName
     @param {Object} [options]
     @return {(DS.Snapshot|String|null|undefined)} A snapshot or ID of a known
     relationship or null if the relationship is known but unset. undefined
     will be returned if the contents of the relationship is unknown.
     */


    belongsTo(keyName, options) {
      var id = options && options.id;
      var relationship;
      var inverseInternalModel;
      var result;
      var store = this._internalModel.store;

      if (id && keyName in this._belongsToIds) {
        return this._belongsToIds[keyName];
      }

      if (!id && keyName in this._belongsToRelationships) {
        return this._belongsToRelationships[keyName];
      }

      var relationshipMeta = store._relationshipMetaFor(this.modelName, null, keyName);

      if (!(relationshipMeta && relationshipMeta.kind === 'belongsTo')) {
        throw new Ember.Error("Model '" + Ember.inspect(this.record) + "' has no belongsTo relationship named '" + keyName + "' defined.");
      }

      relationship = this._internalModel._recordData._relationships.get(keyName);
      var value = relationship.getData();
      var data = value && value.data;
      inverseInternalModel = data && store._internalModelForResource(data);

      if (value && value.data !== undefined) {
        if (inverseInternalModel && !inverseInternalModel.isDeleted()) {
          if (id) {
            result = Ember.get(inverseInternalModel, 'id');
          } else {
            result = inverseInternalModel.createSnapshot();
          }
        } else {
          result = null;
        }
      }

      if (id) {
        this._belongsToIds[keyName] = result;
      } else {
        this._belongsToRelationships[keyName] = result;
      }

      return result;
    }
    /**
     Returns the current value of a hasMany relationship.
      `hasMany` takes an optional hash of options as a second parameter,
     currently supported options are:
      - `ids`: set to `true` if you only want the IDs of the related records to be
     returned.
      Example
      ```javascript
     // store.push('post', { id: 1, title: 'Hello World', comments: [2, 3] });
     postSnapshot.hasMany('comments'); // => [DS.Snapshot, DS.Snapshot]
     postSnapshot.hasMany('comments', { ids: true }); // => ['2', '3']
      // store.push('post', { id: 1, title: 'Hello World' });
     postSnapshot.hasMany('comments'); // => undefined
     ```
      Note: Relationships are loaded lazily and cached upon first access.
      @method hasMany
     @param {String} keyName
     @param {Object} [options]
     @return {(Array|undefined)} An array of snapshots or IDs of a known
     relationship or an empty array if the relationship is known but unset.
     undefined will be returned if the contents of the relationship is unknown.
     */


    hasMany(keyName, options) {
      var ids = options && options.ids;
      var relationship;
      var results;

      if (ids && keyName in this._hasManyIds) {
        return this._hasManyIds[keyName];
      }

      if (!ids && keyName in this._hasManyRelationships) {
        return this._hasManyRelationships[keyName];
      }

      var store = this._internalModel.store;

      var relationshipMeta = store._relationshipMetaFor(this.modelName, null, keyName);

      if (!(relationshipMeta && relationshipMeta.kind === 'hasMany')) {
        throw new Ember.Error("Model '" + Ember.inspect(this.record) + "' has no hasMany relationship named '" + keyName + "' defined.");
      }

      relationship = this._internalModel._recordData._relationships.get(keyName);
      var value = relationship.getData();

      if (value.data) {
        results = [];
        value.data.forEach(member => {
          var internalModel = store._internalModelForResource(member);

          if (!internalModel.isDeleted()) {
            if (ids) {
              results.push(member.id);
            } else {
              results.push(internalModel.createSnapshot());
            }
          }
        });
      }

      if (ids) {
        this._hasManyIds[keyName] = results;
      } else {
        this._hasManyRelationships[keyName] = results;
      }

      return results;
    }
    /**
      Iterates through all the attributes of the model, calling the passed
      function on each attribute.
       Example
       ```javascript
      snapshot.eachAttribute(function(name, meta) {
        // ...
      });
      ```
       @method eachAttribute
      @param {Function} callback the callback to execute
      @param {Object} [binding] the value to which the callback's `this` should be bound
    */


    eachAttribute(callback, binding) {
      this.record.eachAttribute(callback, binding);
    }
    /**
      Iterates through all the relationships of the model, calling the passed
      function on each relationship.
       Example
       ```javascript
      snapshot.eachRelationship(function(name, relationship) {
        // ...
      });
      ```
       @method eachRelationship
      @param {Function} callback the callback to execute
      @param {Object} [binding] the value to which the callback's `this` should be bound
    */


    eachRelationship(callback, binding) {
      this.record.eachRelationship(callback, binding);
    }
    /**
      Serializes the snapshot using the serializer for the model.
       Example
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.Adapter.extend({
        createRecord(store, type, snapshot) {
          var data = snapshot.serialize({ includeId: true });
          var url = `/${type.modelName}`;
           return fetch(url, {
            method: 'POST',
            body: data,
          }).then((response) => response.json())
        }
      });
      ```
       @method serialize
      @param {Object} options
      @return {Object} an object whose values are primitive JSON values only
     */


    serialize(options) {
      return this.record.store.serializerFor(this.modelName).serialize(this, options);
    }

  }

  class EmberDataOrderedSet extends EmberOrderedSet {
    static create() {
      return new this();
    }

    addWithIndex(obj, idx) {
      var guid = Ember.guidFor(obj);
      var presenceSet = this.presenceSet;
      var list = this.list;

      if (presenceSet[guid] === true) {
        return;
      }

      presenceSet[guid] = true;

      if (idx === undefined || idx === null) {
        list.push(obj);
      } else {
        list.splice(idx, 0, obj);
      }

      this.size += 1;
      return this;
    }

  }

  function _bind(fn, ...args) {
    return function () {
      return fn.apply(undefined, args);
    };
  }
  function _guard(promise, test) {
    var guarded = promise.finally(() => {
      if (!test()) {
        guarded._subscribers.length = 0;
      }
    });
    return guarded;
  }
  function _objectIsAlive(object) {
    return !(Ember.get(object, 'isDestroyed') || Ember.get(object, 'isDestroying'));
  }
  function guardDestroyedStore(promise, store, label) {
    var token;

    {
      token = store._trackAsyncRequestStart(label);
    }

    var wrapperPromise = Ember.RSVP.resolve(promise, label).then(v => promise);
    return _guard(wrapperPromise, () => {
      {
        store._trackAsyncRequestEnd(token);
      }

      return _objectIsAlive(store);
    });
  }

  /**
    @namespace
    @method diffArray
    @private
    @param {Array} oldArray the old array
    @param {Array} newArray the new array
    @return {hash} {
        firstChangeIndex: <integer>,  // null if no change
        addedCount: <integer>,        // 0 if no change
        removedCount: <integer>       // 0 if no change
      }
  */
  function diffArray(oldArray, newArray) {
    var oldLength = oldArray.length;
    var newLength = newArray.length;
    var shortestLength = Math.min(oldLength, newLength);
    var firstChangeIndex = null; // null signifies no changes
    // find the first change

    for (var i = 0; i < shortestLength; i++) {
      // compare each item in the array
      if (oldArray[i] !== newArray[i]) {
        firstChangeIndex = i;
        break;
      }
    }

    if (firstChangeIndex === null && newLength !== oldLength) {
      // no change found in the overlapping block
      // and array lengths differ,
      // so change starts at end of overlap
      firstChangeIndex = shortestLength;
    }

    var addedCount = 0;
    var removedCount = 0;

    if (firstChangeIndex !== null) {
      // we found a change, find the end of the change
      var unchangedEndBlockLength = shortestLength - firstChangeIndex; // walk back from the end of both arrays until we find a change

      for (var _i = 1; _i <= shortestLength; _i++) {
        // compare each item in the array
        if (oldArray[oldLength - _i] !== newArray[newLength - _i]) {
          unchangedEndBlockLength = _i - 1;
          break;
        }
      }

      addedCount = newLength - unchangedEndBlockLength - firstChangeIndex;
      removedCount = oldLength - unchangedEndBlockLength - firstChangeIndex;
    }

    return {
      firstChangeIndex,
      addedCount,
      removedCount
    };
  }

  /**
    @module ember-data
  */
  /**
    A `ManyArray` is a `MutableArray` that represents the contents of a has-many
    relationship.

    The `ManyArray` is instantiated lazily the first time the relationship is
    requested.

    ### Inverses

    Often, the relationships in Ember Data applications will have
    an inverse. For example, imagine the following models are
    defined:

    ```app/models/post.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      comments: DS.hasMany('comment')
    });
    ```

    ```app/models/comment.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      post: DS.belongsTo('post')
    });
    ```

    If you created a new instance of `App.Post` and added
    a `App.Comment` record to its `comments` has-many
    relationship, you would expect the comment's `post`
    property to be set to the post that contained
    the has-many.

    We call the record to which a relationship belongs-to the
    relationship's _owner_.

    @class ManyArray
    @namespace DS
    @extends Ember.Object
    @uses Ember.MutableArray, Ember.Evented
  */

  var ManyArray = Ember.Object.extend(Ember.MutableArray, Ember.Evented, {
    init() {
      this._super(...arguments);
      /**
      The loading state of this array
       @property {Boolean} isLoaded
      */


      this.isLoaded = false;
      this.length = 0;
      /**
      Used for async `hasMany` arrays
      to keep track of when they will resolve.
       @property {Ember.RSVP.Promise} promise
      @private
      */

      this.promise = null;
      /**
      Metadata associated with the request for async hasMany relationships.
       Example
       Given that the server returns the following JSON payload when fetching a
      hasMany relationship:
       ```js
      {
        "comments": [{
          "id": 1,
          "comment": "This is the first comment",
        }, {
      // ...
        }],
         "meta": {
          "page": 1,
          "total": 5
        }
      }
      ```
       You can then access the metadata via the `meta` property:
       ```js
      post.get('comments').then(function(comments) {
        var meta = comments.get('meta');
       // meta.page => 1
      // meta.total => 5
      });
      ```
       @property {Object} meta
      @public
      */
      // TODO this is likely broken in our refactor

      this.meta = this.meta || null;
      /**
      `true` if the relationship is polymorphic, `false` otherwise.
       @property {Boolean} isPolymorphic
      @private
      */

      this.isPolymorphic = this.isPolymorphic || false;
      /**
      The relationship which manages this array.
       @property {ManyRelationship} relationship
      @private
      */

      this.currentState = [];
      this.flushCanonical(this.initialState, false);
    },

    // TODO: if(DEBUG)
    anyUnloaded() {
      var unloaded = this.currentState.find(im => im._isDematerializing || !im.isLoaded());
      return !!unloaded;
    },

    removeUnloadedInternalModel() {
      for (var i = 0; i < this.currentState.length; ++i) {
        var internalModel = this.currentState[i];

        if (internalModel._isDematerializing || !internalModel.isLoaded()) {
          this.arrayContentWillChange(i, 1, 0);
          this.currentState.splice(i, 1);
          this.set('length', this.currentState.length);
          this.arrayContentDidChange(i, 1, 0);
          return true;
        }
      }

      return false;
    },

    objectAt(index) {
      // TODO we likely need to force flush here

      /*
      if (this.relationship._willUpdateManyArray) {
        this.relationship._flushPendingManyArrayUpdates();
      }
      */
      var internalModel = this.currentState[index];

      if (internalModel === undefined) {
        return;
      }

      return internalModel.getRecord();
    },

    flushCanonical(toSet, isInitialized = true) {
      // It’s possible the parent side of the relationship may have been unloaded by this point
      if (!_objectIsAlive(this)) {
        return;
      } // diff to find changes


      var diff = diffArray(this.currentState, toSet);

      if (diff.firstChangeIndex !== null) {
        // it's null if no change found
        // we found a change
        this.arrayContentWillChange(diff.firstChangeIndex, diff.removedCount, diff.addedCount);
        this.set('length', toSet.length);
        this.currentState = toSet.slice();
        this.arrayContentDidChange(diff.firstChangeIndex, diff.removedCount, diff.addedCount);

        if (isInitialized && diff.addedCount > 0) {
          //notify only on additions
          //TODO only notify if unloaded
          this.internalModel.manyArrayRecordAdded(this.get('key'));
        }
      }
    },

    replace(idx, amt, objects) {
      var internalModels;

      if (amt > 0) {
        internalModels = this.currentState.slice(idx, idx + amt);
        this.get('recordData').removeFromHasMany(this.get('key'), internalModels.map(im => im._recordData));
      }

      if (objects) {
        this.get('recordData').addToHasMany(this.get('key'), objects.map(obj => obj._internalModel._recordData), idx); //this.get('relationship').addInternalModels(objects.map(obj => obj._internalModel), idx);
      }

      this.retrieveLatest();
    },

    // Ok this is kinda funky because if buggy we might lose positions, etc.
    // but current code is this way so shouldn't be too big of a problem
    retrieveLatest() {
      var jsonApi = this.get('recordData').getHasMany(this.get('key')); // TODO this is odd, why should ManyArray ever tell itself to resync?

      var internalModels = this.store._getHasManyByJsonApiResource(jsonApi);

      if (jsonApi.meta) {
        this.set('meta', jsonApi.meta);
      }

      this.flushCanonical(internalModels, true);
    },

    /**
      Reloads all of the records in the manyArray. If the manyArray
      holds a relationship that was originally fetched using a links url
      Ember Data will revisit the original links url to repopulate the
      relationship.
       If the manyArray holds the result of a `store.query()` reload will
      re-run the original query.
       Example
       ```javascript
      var user = store.peekRecord('user', 1)
      user.login().then(function() {
        user.get('permissions').then(function(permissions) {
          return permissions.reload();
        });
      });
      ```
       @method reload
      @public
    */
    reload(options) {
      // TODO this is odd, we don't ask the store for anything else like this?
      return this.get('store').reloadManyArray(this, this.get('internalModel'), this.get('key'), options);
    },

    /**
      Saves all of the records in the `ManyArray`.
       Example
       ```javascript
      store.findRecord('inbox', 1).then(function(inbox) {
        inbox.get('messages').then(function(messages) {
          messages.forEach(function(message) {
            message.set('isRead', true);
          });
          messages.save()
        });
      });
      ```
       @method save
      @return {DS.PromiseArray} promise
    */
    save() {
      var manyArray = this;
      var promiseLabel = 'DS: ManyArray#save ' + Ember.get(this, 'type');
      var promise = Ember.RSVP.all(this.invoke('save'), promiseLabel).then(() => manyArray, null, 'DS: ManyArray#save return ManyArray');
      return PromiseArray.create({
        promise
      });
    },

    /**
      Create a child record within the owner
       @method createRecord
      @private
      @param {Object} hash
      @return {DS.Model} record
    */
    createRecord(hash) {
      var store = Ember.get(this, 'store');
      var type = Ember.get(this, 'type');
      (true && !(!Ember.get(this, 'isPolymorphic')) && Ember.assert(`You cannot add '${type.modelName}' records to this polymorphic relationship.`, !Ember.get(this, 'isPolymorphic')));
      var record = store.createRecord(type.modelName, hash);
      this.pushObject(record);
      return record;
    }

  });

  /*
    Check if the passed model has a `type` attribute or a relationship named `type`.

    @method modelHasAttributeOrRelationshipNamedType
    @param modelClass
   */
  function modelHasAttributeOrRelationshipNamedType(modelClass) {
    return Ember.get(modelClass, 'attributes').has('type') || Ember.get(modelClass, 'relationshipsByName').has('type');
  }
  /*
    ember-container-inject-owner is a new feature in Ember 2.3 that finally provides a public
    API for looking items up.  This function serves as a super simple polyfill to avoid
    triggering deprecations.
   */


  function getOwner(context) {
    var owner;

    if (Ember.getOwner) {
      owner = Ember.getOwner(context);
    } else if (context.container) {
      owner = context.container;
    }

    if (owner && owner.lookupFactory && !owner._lookupFactory) {
      // `owner` is a container, we are just making this work
      owner._lookupFactory = function () {
        return owner.lookupFactory(...arguments);
      };

      owner.register = function () {
        var registry = owner.registry || owner._registry || owner;
        return registry.register(...arguments);
      };
    }

    return owner;
  }

  /*
    We're using this to detect arrays and "array-like" objects.

    This is a copy of the `isArray` method found in `ember-runtime/utils` as we're
    currently unable to import non-exposed modules.

    This method was previously exposed as `Ember.isArray` but since
    https://github.com/emberjs/ember.js/pull/11463 `Ember.isArray` is an alias of
    `Array.isArray` hence removing the "array-like" part.
   */
  function isArrayLike(obj) {
    if (!obj || obj.setInterval) {
      return false;
    }

    if (Array.isArray(obj)) {
      return true;
    }

    if (Ember.Array.detect(obj)) {
      return true;
    }

    var type = Ember.typeOf(obj);

    if ('array' === type) {
      return true;
    }

    if (obj.length !== undefined && 'object' === type) {
      return true;
    }

    return false;
  }

  var Reference = function (store, internalModel) {
    this.store = store;
    this.internalModel = internalModel;
    this.recordData = internalModel._recordData;
  };

  Reference.prototype = {
    constructor: Reference
  };
  /**
     This returns a string that represents how the reference will be
     looked up when it is loaded. If the relationship has a link it will
     use the "link" otherwise it defaults to "id".

     Example

     ```app/models/post.js
     export default DS.Model.extend({
       comments: DS.hasMany({ async: true })
     });
     ```

     ```javascript
     let post = store.push({
       data: {
         type: 'post',
         id: 1,
         relationships: {
           comments: {
             data: [{ type: 'comment', id: 1 }]
           }
         }
       }
     });

     let commentsRef = post.hasMany('comments');

     // get the identifier of the reference
     if (commentsRef.remoteType() === "ids") {
       let ids = commentsRef.ids();
     } else if (commentsRef.remoteType() === "link") {
       let link = commentsRef.link();
     }
     ```

     @method remoteType
     @return {String} The name of the remote type. This should either be "link" or "ids"
  */

  Reference.prototype.remoteType = function () {
    var value = this._resource();

    if (value && value.links && value.links.related) {
      return 'link';
    }

    return 'id';
  };
  /**
     The link Ember Data will use to fetch or reload this belongs-to
     relationship.

     Example

     ```javascript
      // models/blog.js
      export default DS.Model.extend({
        user: DS.belongsTo({ async: true })
      });

      let blog = store.push({
        data: {
          type: 'blog',
          id: 1,
          relationships: {
            user: {
              links: {
                related: '/articles/1/author'
              }
            }
          }
        }
      });
      let userRef = blog.belongsTo('user');

      // get the identifier of the reference
      if (userRef.remoteType() === "link") {
        let link = userRef.link();
      }
      ```

     @method link
     @return {String} The link Ember Data will use to fetch or reload this belongs-to relationship.
  */


  Reference.prototype.link = function () {
    var link = null;

    var resource = this._resource();

    if (resource && resource.links && resource.links.related) {
      link = resource.links.related;
    }

    return link;
  };
  /**
     The meta data for the belongs-to relationship.

     Example

     ```javascript
      // models/blog.js
      export default DS.Model.extend({
        user: DS.belongsTo({ async: true })
      });

      let blog = store.push({
        data: {
          type: 'blog',
          id: 1,
          relationships: {
            user: {
              links: {
                related: {
                  href: '/articles/1/author',
                  meta: {
                    lastUpdated: 1458014400000
                  }
                }
              }
            }
          }
        }
      });

      let userRef = blog.belongsTo('user');

      userRef.meta() // { lastUpdated: 1458014400000 }
      ```

     @method meta
     @return {Object} The meta information for the belongs-to relationship.
  */


  Reference.prototype.meta = function () {
    var meta = null;

    var resource = this._resource();

    if (resource && resource.meta) {
      meta = resource.meta;
    }

    return meta;
  };

  /**
     An RecordReference is a low-level API that allows users and
     addon author to perform meta-operations on a record.

     @class RecordReference
     @namespace DS
  */

  class RecordReference extends Reference {
    constructor(store, internalModel) {
      super(store, internalModel);
      this.type = internalModel.modelName;
      this._id = internalModel.id;
    }
    /**
       The `id` of the record that this reference refers to.
        Together, the `type` and `id` properties form a composite key for
       the identity map.
        Example
        ```javascript
       let userRef = store.getReference('user', 1);
        userRef.id(); // '1'
       ```
        @method id
       @return {String} The id of the record.
    */


    id() {
      return this._id;
    }
    /**
       How the reference will be looked up when it is loaded: Currently
       this always return `identity` to signifying that a record will be
       loaded by the `type` and `id`.
        Example
        ```javascript
       const userRef = store.getReference('user', 1);
        userRef.remoteType(); // 'identity'
       ```
        @method remoteType
       @return {String} 'identity'
    */


    remoteType() {
      return 'identity';
    }
    /**
      This API allows you to provide a reference with new data. The
      simplest usage of this API is similar to `store.push`: you provide a
      normalized hash of data and the object represented by the reference
      will update.
       If you pass a promise to `push`, Ember Data will not ask the adapter
      for the data if another attempt to fetch it is made in the
      interim. When the promise resolves, the underlying object is updated
      with the new data, and the promise returned by *this function* is resolved
      with that object.
       For example, `recordReference.push(promise)` will be resolved with a
      record.
        Example
        ```javascript
       let userRef = store.getReference('user', 1);
        // provide data for reference
       userRef.push({ data: { id: 1, username: "@user" }}).then(function(user) {
         userRef.value() === user;
       });
       ```
       @method push
      @param objectOrPromise {Promise|Object}
      @return Promise<record> a promise for the value (record or relationship)
    */


    push(objectOrPromise) {
      return Ember.RSVP.resolve(objectOrPromise).then(data => {
        return this.store.push(data);
      });
    }
    /**
      If the entity referred to by the reference is already loaded, it is
      present as `reference.value`. Otherwise the value returned by this function
      is `null`.
        Example
        ```javascript
       let userRef = store.getReference('user', 1);
        userRef.value(); // user
       ```
        @method value
       @return {DS.Model} the record for this RecordReference
    */


    value() {
      if (this.internalModel.hasRecord) {
        return this.internalModel.getRecord();
      }

      return null;
    }
    /**
       Triggers a fetch for the backing entity based on its `remoteType`
       (see `remoteType` definitions per reference type).
        Example
        ```javascript
       let userRef = store.getReference('user', 1);
        // load user (via store.find)
       userRef.load().then(...)
       ```
        @method load
       @return {Promise<record>} the record for this RecordReference
    */


    load() {
      return this.store.findRecord(this.type, this._id);
    }
    /**
       Reloads the record if it is already loaded. If the record is not
       loaded it will load the record via `store.findRecord`
        Example
        ```javascript
       let userRef = store.getReference('user', 1);
        // or trigger a reload
       userRef.reload().then(...)
       ```
        @method reload
       @return {Promise<record>} the record for this RecordReference
    */


    reload() {
      var record = this.value();

      if (record) {
        return record.reload();
      }

      return this.load();
    }

  }

  /**
   A BelongsToReference is a low-level API that allows users and
   addon author to perform meta-operations on a belongs-to
   relationship.

   @class BelongsToReference
   @namespace DS
   @extends DS.Reference
   */

  class BelongsToReference extends Reference {
    constructor(store, parentInternalModel, belongsToRelationship, key) {
      super(store, parentInternalModel);
      this.key = key;
      this.belongsToRelationship = belongsToRelationship;
      this.type = belongsToRelationship.relationshipMeta.type;
      this.parent = parentInternalModel.recordReference;
      this.parentInternalModel = parentInternalModel; // TODO inverse
    }
    /**
     The `id` of the record that this reference refers to. Together, the
     `type()` and `id()` methods form a composite key for the identity
     map. This can be used to access the id of an async relationship
     without triggering a fetch that would normally happen if you
     attempted to use `record.get('relationship.id')`.
      Example
      ```javascript
     // models/blog.js
     export default DS.Model.extend({
        user: DS.belongsTo({ async: true })
      });
      let blog = store.push({
        data: {
          type: 'blog',
          id: 1,
          relationships: {
            user: {
              data: { type: 'user', id: 1 }
            }
          }
        }
      });
     let userRef = blog.belongsTo('user');
      // get the identifier of the reference
     if (userRef.remoteType() === "id") {
        let id = userRef.id();
      }
     ```
      @method id
     @return {String} The id of the record in this belongsTo relationship.
     */


    id() {
      var id = null;

      var resource = this._resource();

      if (resource && resource.data && resource.data.id) {
        id = resource.data.id;
      }

      return id;
    }

    _resource() {
      return this.recordData.getBelongsTo(this.key);
    }
    /**
     `push` can be used to update the data in the relationship and Ember
     Data will treat the new data as the conanical value of this
     relationship on the backend.
      Example
      ```javascript
     // models/blog.js
     export default DS.Model.extend({
        user: DS.belongsTo({ async: true })
      });
      let blog = store.push({
        data: {
          type: 'blog',
          id: 1,
          relationships: {
            user: {
              data: { type: 'user', id: 1 }
            }
          }
        }
      });
     let userRef = blog.belongsTo('user');
      // provide data for reference
     userRef.push({
        data: {
          type: 'user',
          id: 1,
          attributes: {
            username: "@user"
          }
        }
      }).then(function(user) {
        userRef.value() === user;
      });
     ```
      @method push
     @param {Object|Promise} objectOrPromise a promise that resolves to a JSONAPI document object describing the new value of this relationship.
     @return {Promise<record>} A promise that resolves with the new value in this belongs-to relationship.
     */


    push(objectOrPromise) {
      return Ember.RSVP.resolve(objectOrPromise).then(data => {
        var record; // TODO deprecate data as Model

        if (data instanceof Model) {
          record = data;
        } else {
          record = this.store.push(data);
        }

        Debug.assertPolymorphicType(this.internalModel, this.belongsToRelationship.relationshipMeta, record._internalModel, this.store); //TODO Igor cleanup, maybe move to relationship push

        this.belongsToRelationship.setCanonicalRecordData(record._internalModel._recordData);
        return record;
      });
    }
    /**
     `value()` synchronously returns the current value of the belongs-to
     relationship. Unlike `record.get('relationshipName')`, calling
     `value()` on a reference does not trigger a fetch if the async
     relationship is not yet loaded. If the relationship is not loaded
     it will always return `null`.
      Example
      ```javascript
     // models/blog.js
     export default DS.Model.extend({
        user: DS.belongsTo({ async: true })
      });
      let blog = store.push({
        data: {
          type: 'blog',
          id: 1,
          relationships: {
            user: {
              data: { type: 'user', id: 1 }
            }
          }
        }
      });
     let userRef = blog.belongsTo('user');
      userRef.value(); // null
      // provide data for reference
     userRef.push({
        data: {
          type: 'user',
          id: 1,
          attributes: {
            username: "@user"
          }
        }
      }).then(function(user) {
        userRef.value(); // user
      });
     ```
      @method value
     @return {DS.Model} the record in this relationship
     */


    value() {
      var store = this.parentInternalModel.store;

      var resource = this._resource();

      if (resource && resource.data) {
        var inverseInternalModel = store._internalModelForResource(resource.data);

        if (inverseInternalModel && inverseInternalModel.isLoaded()) {
          return inverseInternalModel.getRecord();
        }
      }

      return null;
    }
    /**
     Loads a record in a belongs to relationship if it is not already
     loaded. If the relationship is already loaded this method does not
     trigger a new load.
      Example
      ```javascript
     // models/blog.js
     export default DS.Model.extend({
        user: DS.belongsTo({ async: true })
      });
      let blog = store.push({
        data: {
          type: 'blog',
          id: 1,
          relationships: {
            user: {
              data: { type: 'user', id: 1 }
            }
          }
        }
      });
     let userRef = blog.belongsTo('user');
      userRef.value(); // null
      userRef.load().then(function(user) {
        userRef.value() === user
      });
     ```
      You may also pass in an options object whose properties will be
     fed forward. This enables you to pass `adapterOptions` into the
     request given to the adapter via the reference.
      Example
      ```javascript
     userRef.load({ adapterOptions: { isPrivate: true } }).then(function(user) {
       userRef.value() === user;
     });
     ```
      ```app/adapters/user.js
     export default ApplicationAdapter.extend({
       findRecord(store, type, id, snapshot) {
         // In the adapter you will have access to adapterOptions.
         let adapterOptions = snapshot.adapterOptions;
       }
     });
     ```
      @method load
     @param {Object} options the options to pass in.
     @return {Promise} a promise that resolves with the record in this belongs-to relationship.
     */


    load(options) {
      return this.parentInternalModel.getBelongsTo(this.key, options);
    }
    /**
     Triggers a reload of the value in this relationship. If the
     remoteType is `"link"` Ember Data will use the relationship link to
     reload the relationship. Otherwise it will reload the record by its
     id.
      Example
      ```javascript
     // models/blog.js
     export default DS.Model.extend({
        user: DS.belongsTo({ async: true })
      });
      let blog = store.push({
        data: {
          type: 'blog',
          id: 1,
          relationships: {
            user: {
              data: { type: 'user', id: 1 }
            }
          }
        }
      });
     let userRef = blog.belongsTo('user');
      userRef.reload().then(function(user) {
        userRef.value() === user
      });
     ```
      You may also pass in an options object whose properties will be
     fed forward. This enables you to pass `adapterOptions` into the
     request given to the adapter via the reference. A full example
     can be found in the `load` method.
      Example
      ```javascript
     userRef.reload({ adapterOptions: { isPrivate: true } })
     ```
      @method reload
     @param {Object} options the options to pass in.
     @return {Promise} a promise that resolves with the record in this belongs-to relationship after the reload has completed.
     */
    // TODO IGOR CHECK FOR OBJECT PROXIES


    reload(options) {
      var resource = this._resource();

      if (resource && resource.links && resource.links.related) {
        return this.store._fetchBelongsToLinkFromResource(resource, this.parentInternalModel, this.belongsToRelationship.relationshipMeta, options);
      }

      if (resource && resource.data) {
        if (resource.data && (resource.data.id || resource.data.clientId)) {
          var internalModel = this.store._internalModelForResource(resource.data);

          if (internalModel.isLoaded()) {
            return internalModel.reload(options).then(internalModel => {
              if (internalModel) {
                return internalModel.getRecord();
              }

              return null;
            });
          } else {
            return this.store._findByInternalModel(internalModel, options);
          }
        }
      }
    }

  }

  /**
   A HasManyReference is a low-level API that allows users and addon
   author to perform meta-operations on a has-many relationship.

   @class HasManyReference
   @namespace DS
   */

  class HasManyReference extends Reference {
    constructor(store, parentInternalModel, hasManyRelationship, key) {
      super(store, parentInternalModel);
      this.key = key;
      this.hasManyRelationship = hasManyRelationship;
      this.type = hasManyRelationship.relationshipMeta.type;
      this.parent = parentInternalModel.recordReference;
      this.parentInternalModel = parentInternalModel; // TODO inverse
    }

    _resource() {
      return this.recordData.getHasMany(this.key);
    }
    /**
     This returns a string that represents how the reference will be
     looked up when it is loaded. If the relationship has a link it will
     use the "link" otherwise it defaults to "id".
      Example
      ```app/models/post.js
     export default DS.Model.extend({
       comments: DS.hasMany({ async: true })
     });
     ```
      ```javascript
     let post = store.push({
       data: {
         type: 'post',
         id: 1,
         relationships: {
           comments: {
             data: [{ type: 'comment', id: 1 }]
           }
         }
       }
     });
      let commentsRef = post.hasMany('comments');
      // get the identifier of the reference
     if (commentsRef.remoteType() === "ids") {
       let ids = commentsRef.ids();
     } else if (commentsRef.remoteType() === "link") {
       let link = commentsRef.link();
     }
     ```
      @method remoteType
     @return {String} The name of the remote type. This should either be `link` or `ids`
     */


    remoteType() {
      var value = this._resource();

      if (value && value.links && value.links.related) {
        return 'link';
      }

      return 'ids';
    }
    /**
     `ids()` returns an array of the record IDs in this relationship.
      Example
      ```app/models/post.js
     export default DS.Model.extend({
       comments: DS.hasMany({ async: true })
     });
     ```
      ```javascript
     let post = store.push({
       data: {
         type: 'post',
         id: 1,
         relationships: {
           comments: {
             data: [{ type: 'comment', id: 1 }]
           }
         }
       }
     });
      let commentsRef = post.hasMany('comments');
      commentsRef.ids(); // ['1']
     ```
      @method ids
     @return {Array} The ids in this has-many relationship
     */


    ids() {
      var resource = this._resource();

      var ids = [];

      if (resource.data) {
        ids = resource.data.map(data => data.id);
      }

      return ids;
    }
    /**
     `push` can be used to update the data in the relationship and Ember
     Data will treat the new data as the canonical value of this
     relationship on the backend.
      Example
      ```app/models/post.js
     export default DS.Model.extend({
       comments: DS.hasMany({ async: true })
     });
     ```
      ```
     let post = store.push({
       data: {
         type: 'post',
         id: 1,
         relationships: {
           comments: {
             data: [{ type: 'comment', id: 1 }]
           }
         }
       }
     });
      let commentsRef = post.hasMany('comments');
      commentsRef.ids(); // ['1']
      commentsRef.push([
     [{ type: 'comment', id: 2 }],
     [{ type: 'comment', id: 3 }],
     ])
      commentsRef.ids(); // ['2', '3']
     ```
      @method push
     @param {Array|Promise} objectOrPromise a promise that resolves to a JSONAPI document object describing the new value of this relationship.
     @return {DS.ManyArray}
     */


    push(objectOrPromise) {
      return Ember.RSVP.resolve(objectOrPromise).then(payload => {
        var array = payload;

        if (typeof payload === 'object' && payload.data) {
          array = payload.data;
        }

        var internalModels = array.map(obj => {
          var record = this.store.push(obj);

          {
            var relationshipMeta = this.hasManyRelationship.relationshipMeta;
            Debug.assertPolymorphicType(this.internalModel, relationshipMeta, record._internalModel, this.store);
          }

          return record._internalModel._recordData;
        });
        this.hasManyRelationship.computeChanges(internalModels);
        return this.internalModel.getHasMany(this.hasManyRelationship.key); // TODO IGOR it seems wrong that we were returning the many array here
        //return this.hasManyRelationship.manyArray;
      });
    }

    _isLoaded() {
      var hasRelationshipDataProperty = Ember.get(this.hasManyRelationship, 'hasAnyRelationshipData');

      if (!hasRelationshipDataProperty) {
        return false;
      }

      var members = this.hasManyRelationship.members.toArray(); //TODO Igor cleanup

      return members.every(recordData => {
        var store = this.parentInternalModel.store;

        var internalModel = store._internalModelForRecordData(recordData);

        return internalModel.isLoaded() === true;
      });
    }
    /**
     `value()` synchronously returns the current value of the has-many
     relationship. Unlike `record.get('relationshipName')`, calling
     `value()` on a reference does not trigger a fetch if the async
     relationship is not yet loaded. If the relationship is not loaded
     it will always return `null`.
      Example
      ```app/models/post.js
     export default DS.Model.extend({
       comments: DS.hasMany({ async: true })
     });
     ```
      ```javascript
     let post = store.push({
       data: {
         type: 'post',
         id: 1,
         relationships: {
           comments: {
             data: [{ type: 'comment', id: 1 }]
           }
         }
       }
     });
      let commentsRef = post.hasMany('comments');
      post.get('comments').then(function(comments) {
       commentsRef.value() === comments
     })
     ```
      @method value
     @return {DS.ManyArray}
     */


    value() {
      if (this._isLoaded()) {
        return this.internalModel.getManyArray(this.key);
      }

      return null;
    }
    /**
     Loads the relationship if it is not already loaded.  If the
     relationship is already loaded this method does not trigger a new
     load.
      Example
      ```app/models/post.js
     export default DS.Model.extend({
       comments: DS.hasMany({ async: true })
     });
     ```
      ```javascript
     let post = store.push({
       data: {
         type: 'post',
         id: 1,
         relationships: {
           comments: {
             data: [{ type: 'comment', id: 1 }]
           }
         }
       }
     });
      let commentsRef = post.hasMany('comments');
      commentsRef.load().then(function(comments) {
       //...
     });
     ```
      You may also pass in an options object whose properties will be
     fed forward. This enables you to pass `adapterOptions` into the
     request given to the adapter via the reference.
      Example
      ```javascript
     commentsRef.load({ adapterOptions: { isPrivate: true } })
       .then(function(comments) {
         //...
       });
     ```
      ```app/adapters/comment.js
     export default ApplicationAdapter.extend({
       findMany(store, type, id, snapshots) {
         // In the adapter you will have access to adapterOptions.
         let adapterOptions = snapshots[0].adapterOptions;
       }
     });
     ```
      @method load
     @param {Object} options the options to pass in.
     @return {Promise} a promise that resolves with the ManyArray in
     this has-many relationship.
     */


    load(options) {
      return this.internalModel.getHasMany(this.key, options);
    }
    /**
     Reloads this has-many relationship.
      Example
      ```app/models/post.js
     export default DS.Model.extend({
       comments: DS.hasMany({ async: true })
     });
     ```
      ```javascript
     let post = store.push({
       data: {
         type: 'post',
         id: 1,
         relationships: {
           comments: {
             data: [{ type: 'comment', id: 1 }]
           }
         }
       }
     });
      let commentsRef = post.hasMany('comments');
      commentsRef.reload().then(function(comments) {
       //...
     });
     ```
      You may also pass in an options object whose properties will be
     fed forward. This enables you to pass `adapterOptions` into the
     request given to the adapter via the reference. A full example
     can be found in the `load` method.
      Example
      ```javascript
     commentsRef.reload({ adapterOptions: { isPrivate: true } })
     ```
      @method reload
     @param {Object} options the options to pass in.
     @return {Promise} a promise that resolves with the ManyArray in this has-many relationship.
     */


    reload(options) {
      return this.internalModel.reloadHasMany(this.key, options);
    }

  }

  /*
    The TransitionChainMap caches the `state.enters`, `state.setups`, and final state reached
    when transitioning from one state to another, so that future transitions can replay the
    transition without needing to walk the state tree, collect these hook calls and determine
     the state to transition into.

     A future optimization would be to build a single chained method out of the collected enters
     and setups. It may also be faster to do a two level cache (from: { to }) instead of caching based
     on a key that adds the two together.
   */

  var TransitionChainMap = Object.create(null);

  var _extractPivotNameCache = Object.create(null);

  var _splitOnDotCache = Object.create(null);

  function splitOnDot(name) {
    return _splitOnDotCache[name] || (_splitOnDotCache[name] = name.split('.'));
  }

  function extractPivotName(name) {
    return _extractPivotNameCache[name] || (_extractPivotNameCache[name] = splitOnDot(name)[0]);
  } // this (and all heimdall instrumentation) will be stripped by a babel transform
  //  https://github.com/heimdalljs/babel5-plugin-strip-heimdall


  var InternalModelReferenceId = 1;
  /*
    `InternalModel` is the Model class that we use internally inside Ember Data to represent models.
    Internal ED methods should only deal with `InternalModel` objects. It is a fast, plain Javascript class.

    We expose `DS.Model` to application code, by materializing a `DS.Model` from `InternalModel` lazily, as
    a performance optimization.

    `InternalModel` should never be exposed to application code. At the boundaries of the system, in places
    like `find`, `push`, etc. we convert between Models and InternalModels.

    We need to make sure that the properties from `InternalModel` are correctly exposed/proxied on `Model`
    if they are needed.

    @private
    @class InternalModel
  */

  class InternalModel {
    constructor(modelName, id, store, data, clientId) {
      this.id = id;
      this.store = store;
      this.modelName = modelName;
      this.clientId = clientId;
      this.__recordData = null; // this ensure ordered set can quickly identify this as unique

      this[Ember.GUID_KEY] = InternalModelReferenceId++ + 'internal-model';
      this._promiseProxy = null;
      this._record = null;
      this._isDestroyed = false;
      this.isError = false;
      this._pendingRecordArrayManagerFlush = false; // used by the recordArrayManager
      // During dematerialization we don't want to rematerialize the record.  The
      // reason this might happen is that dematerialization removes records from
      // record arrays,  and Ember arrays will always `objectAt(0)` and
      // `objectAt(len - 1)` to test whether or not `firstObject` or `lastObject`
      // have changed.

      this._isDematerializing = false;
      this._scheduledDestroy = null;
      this.resetRecord(); // caches for lazy getters

      this._modelClass = null;
      this.__deferredTriggers = null;
      this.__recordArrays = null;
      this._references = null;
      this._recordReference = null;
      this._manyArrayCache = Object.create(null); // The previous ManyArrays for this relationship which will be destroyed when
      // we create a new ManyArray, but in the interim the retained version will be
      // updated if inverse internal models are unloaded.

      this._retainedManyArrayCache = Object.create(null);
      this._relationshipPromisesCache = Object.create(null);
    }

    get modelClass() {
      return this._modelClass || (this._modelClass = this.store.modelFor(this.modelName));
    }

    get type() {
      return this.modelClass;
    }

    get recordReference() {
      if (this._recordReference === null) {
        this._recordReference = new RecordReference(this.store, this);
      }

      return this._recordReference;
    }

    get _recordData() {
      if (this.__recordData === null) {
        this._recordData = this.store._createRecordData(this.modelName, this.id, this.clientId, this);
      }

      return this.__recordData;
    }

    set _recordData(newValue) {
      this.__recordData = newValue;
    }

    get _recordArrays() {
      if (this.__recordArrays === null) {
        this.__recordArrays = new EmberDataOrderedSet();
      }

      return this.__recordArrays;
    }

    get references() {
      if (this._references === null) {
        this._references = Object.create(null);
      }

      return this._references;
    }

    get _deferredTriggers() {
      if (this.__deferredTriggers === null) {
        this.__deferredTriggers = [];
      }

      return this.__deferredTriggers;
    }

    isHiddenFromRecordArrays() {
      // During dematerialization we don't want to rematerialize the record.
      // recordWasDeleted can cause other records to rematerialize because it
      // removes the internal model from the array and Ember arrays will always
      // `objectAt(0)` and `objectAt(len -1)` to check whether `firstObject` or
      // `lastObject` have changed.  When this happens we don't want those
      // models to rematerialize their records.
      return this._isDematerializing || this.hasScheduledDestroy() || this.isDestroyed || this.currentState.stateName === 'root.deleted.saved' || this.isEmpty();
    }

    isRecordInUse() {
      var record = this._record;
      return record && !(record.get('isDestroyed') || record.get('isDestroying'));
    }

    isEmpty() {
      return this.currentState.isEmpty;
    }

    isLoading() {
      return this.currentState.isLoading;
    }

    isLoaded() {
      return this.currentState.isLoaded;
    }

    hasDirtyAttributes() {
      return this.currentState.hasDirtyAttributes;
    }

    isSaving() {
      return this.currentState.isSaving;
    }

    isDeleted() {
      return this.currentState.isDeleted;
    }

    isNew() {
      return this.currentState.isNew;
    }

    isValid() {
      return this.currentState.isValid;
    }

    dirtyType() {
      return this.currentState.dirtyType;
    } // DO NOT USE : purely to ease the transition in tests


    get _attributes() {
      return this._recordData._attributes;
    } // DO NOT USE : purely to ease the transition in tests


    get _relationships() {
      return this._recordData._relationships;
    }

    getRecord(properties) {
      if (!this._record && !this._isDematerializing) {
        var {
          store
        } = this; // lookupFactory should really return an object that creates
        // instances with the injections applied

        var createOptions = {
          store,
          _internalModel: this,
          currentState: this.currentState,
          isError: this.isError,
          adapterError: this.error
        };

        if (properties !== undefined) {
          (true && !(typeof properties === 'object' && properties !== null) && Ember.assert(`You passed '${properties}' as properties for record creation instead of an object.`, typeof properties === 'object' && properties !== null));

          if ('id' in properties) {
            this.setId(properties.id);
          } // convert relationship Records to RecordDatas before passing to RecordData


          var defs = store._relationshipsDefinitionFor(this.modelName);

          if (defs !== null) {
            var keys = Object.keys(properties);
            var relationshipValue;

            for (var i = 0; i < keys.length; i++) {
              var prop = keys[i];
              var def = defs[prop];

              if (def !== undefined) {
                if (def.kind === 'hasMany') {
                  {
                    assertRecordsPassedToHasMany(properties[prop]);
                  }

                  relationshipValue = extractRecordDatasFromRecords(properties[prop]);
                } else {
                  relationshipValue = extractRecordDataFromRecord(properties[prop]);
                }

                properties[prop] = relationshipValue;
              }
            }
          }
        }

        var additionalCreateOptions = this._recordData._initRecordCreateOptions(properties);

        Ember.assign(createOptions, additionalCreateOptions);

        if (Ember.setOwner) {
          // ensure that `getOwner(this)` works inside a model instance
          Ember.setOwner(createOptions, getOwner(store));
        } else {
          createOptions.container = store.container;
        }

        this._record = store._modelFactoryFor(this.modelName).create(createOptions);

        this._triggerDeferredTriggers();
      }

      return this._record;
    }

    resetRecord() {
      this._record = null;
      this.isReloading = false;
      this.error = null;
      this.currentState = RootState$1.empty;
    }

    dematerializeRecord() {
      this._isDematerializing = true; // TODO IGOR add a test that fails when this is missing, something that involves canceliing a destroy
      // and the destroy not happening, and then later on trying to destroy

      this._doNotDestroy = false;

      if (this._record) {
        this._record.destroy();

        Object.keys(this._relationshipPromisesCache).forEach(key => {
          // TODO Igor cleanup the guard
          if (this._relationshipPromisesCache[key].destroy) {
            this._relationshipPromisesCache[key].destroy();
          }

          delete this._relationshipPromisesCache[key];
        });
        Object.keys(this._manyArrayCache).forEach(key => {
          var manyArray = this._retainedManyArrayCache[key] = this._manyArrayCache[key];
          delete this._manyArrayCache[key];

          if (manyArray && !manyArray._inverseIsAsync) {
            /*
              If the manyArray is for a sync relationship, we should clear it
                to preserve the semantics of client-side delete.
               It is likely in this case instead of retaining we should destroy
                - @runspired
            */
            manyArray.clear();
          }
        });
      } // move to an empty never-loaded state


      this._recordData.unloadRecord();

      this.resetRecord();
      this.updateRecordArrays();
    }

    deleteRecord() {
      this.send('deleteRecord');
    }

    save(options) {
      var promiseLabel = 'DS: Model#save ' + this;
      var resolver = Ember.RSVP.defer(promiseLabel);
      this.store.scheduleSave(this, resolver, options);
      return resolver.promise;
    }

    startedReloading() {
      this.isReloading = true;

      if (this.hasRecord) {
        Ember.set(this._record, 'isReloading', true);
      }
    }

    linkWasLoadedForRelationship(key, data) {
      var relationships = {};
      relationships[key] = data;

      this._recordData.pushData({
        id: this.id,
        type: this.modelName,
        relationships
      });
    }

    finishedReloading() {
      this.isReloading = false;

      if (this.hasRecord) {
        Ember.set(this._record, 'isReloading', false);
      }
    }

    reload(options) {
      this.startedReloading();
      var internalModel = this;
      var promiseLabel = 'DS: Model#reload of ' + this;
      return new Ember.RSVP.Promise(function (resolve) {
        internalModel.send('reloadRecord', {
          resolve,
          options
        });
      }, promiseLabel).then(function () {
        internalModel.didCleanError();
        return internalModel;
      }, function (error) {
        internalModel.didError(error);
        throw error;
      }, 'DS: Model#reload complete, update flags').finally(function () {
        internalModel.finishedReloading();
        internalModel.updateRecordArrays();
      });
    }
    /*
      Unload the record for this internal model. This will cause the record to be
      destroyed and freed up for garbage collection. It will also do a check
      for cleaning up internal models.
       This check is performed by first computing the set of related internal
      models. If all records in this set are unloaded, then the entire set is
      destroyed. Otherwise, nothing in the set is destroyed.
       This means that this internal model will be freed up for garbage collection
      once all models that refer to it via some relationship are also unloaded.
    */


    unloadRecord() {
      if (this.isDestroyed) {
        return;
      }

      this.send('unloadRecord');
      this.dematerializeRecord();

      if (this._scheduledDestroy === null) {
        this._scheduledDestroy = Ember.run.backburner.schedule('destroy', this, '_checkForOrphanedInternalModels');
      }
    }

    hasScheduledDestroy() {
      return !!this._scheduledDestroy;
    }

    cancelDestroy() {
      (true && !(!this.isDestroyed) && Ember.assert(`You cannot cancel the destruction of an InternalModel once it has already been destroyed`, !this.isDestroyed));
      this._doNotDestroy = true;
      this._isDematerializing = false;
      Ember.run.cancel(this._scheduledDestroy);
      this._scheduledDestroy = null;
    } // typically, we prefer to async destroy this lets us batch cleanup work.
    // Unfortunately, some scenarios where that is not possible. Such as:
    //
    // ```js
    // const record = store.find(‘record’, 1);
    // record.unloadRecord();
    // store.createRecord(‘record’, 1);
    // ```
    //
    // In those scenarios, we make that model's cleanup work, sync.
    //


    destroySync() {
      if (this._isDematerializing) {
        this.cancelDestroy();
      }

      this._checkForOrphanedInternalModels();

      if (this.isDestroyed || this.isDestroying) {
        return;
      } // just in-case we are not one of the orphaned, we should still
      // still destroy ourselves


      this.destroy();
    }

    _checkForOrphanedInternalModels() {
      this._isDematerializing = false;
      this._scheduledDestroy = null;

      if (this.isDestroyed) {
        return;
      }
    }

    eachRelationship(callback, binding) {
      return this.modelClass.eachRelationship(callback, binding);
    }

    getBelongsTo(key, options) {
      var resource = this._recordData.getBelongsTo(key);

      var relationshipMeta = this.store._relationshipMetaFor(this.modelName, null, key);

      var store = this.store;
      var parentInternalModel = this;
      var async = relationshipMeta.options.async;
      var isAsync = typeof async === 'undefined' ? true : async;

      if (isAsync) {
        var internalModel = resource && resource.data ? store._internalModelForResource(resource.data) : null;
        return PromiseBelongsTo.create({
          _belongsToState: resource._relationship,
          promise: store._findBelongsToByJsonApiResource(resource, parentInternalModel, relationshipMeta, options),
          content: internalModel ? internalModel.getRecord() : null
        });
      } else {
        if (!resource || !resource.data) {
          return null;
        } else {
          var _internalModel = store._internalModelForResource(resource.data);

          var toReturn = _internalModel.getRecord();

          (true && !(toReturn === null || !toReturn.get('isEmpty')) && Ember.assert("You looked up the '" + key + "' relationship on a '" + parentInternalModel.modelName + "' with id " + parentInternalModel.id + ' but some of the associated records were not loaded. Either make sure they are all loaded together with the parent record, or specify that the relationship is async (`DS.belongsTo({ async: true })`)', toReturn === null || !toReturn.get('isEmpty')));
          return toReturn;
        }
      }
    } // TODO Igor consider getting rid of initial state


    getManyArray(key) {
      var relationshipMeta = this.store._relationshipMetaFor(this.modelName, null, key);

      var jsonApi = this._recordData.getHasMany(key);

      var manyArray = this._manyArrayCache[key];
      (true && !(!manyArray || !this._retainedManyArrayCache[key]) && Ember.assert(`Error: relationship ${this.modelName}:${key} has both many array and retained many array`, !manyArray || !this._retainedManyArrayCache[key]));

      if (!manyArray) {
        var initialState = this.store._getHasManyByJsonApiResource(jsonApi);

        manyArray = ManyArray.create({
          store: this.store,
          type: this.store.modelFor(relationshipMeta.type),
          recordData: this._recordData,
          meta: jsonApi.meta,
          key,
          isPolymorphic: relationshipMeta.options.polymorphic,
          initialState: initialState.slice(),
          _inverseIsAsync: jsonApi._relationship._inverseIsAsync(),
          internalModel: this
        });
        this._manyArrayCache[key] = manyArray;
      }

      if (this._retainedManyArrayCache[key]) {
        this._retainedManyArrayCache[key].destroy();

        delete this._retainedManyArrayCache[key];
      }

      return manyArray;
    }

    fetchAsyncHasMany(relationshipMeta, jsonApi, manyArray, options) {
      var promise = this.store._findHasManyByJsonApiResource(jsonApi, this, relationshipMeta, options);

      promise = promise.then(initialState => {
        // TODO why don't we do this in the store method
        manyArray.retrieveLatest();
        manyArray.set('isLoaded', true);
        return manyArray;
      });
      return promise;
    }

    getHasMany(key, options) {
      var jsonApi = this._recordData.getHasMany(key);

      var relationshipMeta = this.store._relationshipMetaFor(this.modelName, null, key);

      var async = relationshipMeta.options.async;
      var isAsync = typeof async === 'undefined' ? true : async;
      var manyArray = this.getManyArray(key);

      if (isAsync) {
        var promiseArray$$1 = this._relationshipPromisesCache[key];

        if (!promiseArray$$1) {
          promiseArray$$1 = PromiseManyArray.create({
            promise: this.fetchAsyncHasMany(relationshipMeta, jsonApi, manyArray, options),
            content: manyArray
          });
          this._relationshipPromisesCache[key] = promiseArray$$1;
        }

        return promiseArray$$1;
      } else {
        manyArray.set('isLoaded', true);
        (true && !(!manyArray.anyUnloaded()) && Ember.assert(`You looked up the '${key}' relationship on a '${this.type.modelName}' with id ${this.id} but some of the associated records were not loaded. Either make sure they are all loaded together with the parent record, or specify that the relationship is async ('DS.hasMany({ async: true })')`, !manyArray.anyUnloaded()));
        return manyArray;
      }
    }

    _updateLoadingPromiseForHasMany(key, promise, content) {
      var loadingPromise = this._relationshipPromisesCache[key];

      if (loadingPromise) {
        if (content) {
          loadingPromise.set('content', content);
        }

        loadingPromise.set('promise', promise);
      } else {
        this._relationshipPromisesCache[key] = PromiseManyArray.create({
          promise,
          content
        });
      }

      return this._relationshipPromisesCache[key];
    }

    reloadHasMany(key, options) {
      var loadingPromise = this._relationshipPromisesCache[key];

      if (loadingPromise) {
        if (loadingPromise.get('isPending')) {
          return loadingPromise;
        }
        /* TODO Igor check wtf this is about
        if (loadingPromise.get('isRejected')) {
          manyArray.set('isLoaded', manyArrayLoadedState);
        }
        */

      }

      var jsonApi = this._recordData.getHasMany(key);

      jsonApi._relationship.setRelationshipIsStale(true);

      var relationshipMeta = this.store._relationshipMetaFor(this.modelName, null, key);

      var manyArray = this.getManyArray(key);
      var promise = this.fetchAsyncHasMany(relationshipMeta, jsonApi, manyArray, options); // TODO igor Seems like this would mess with promiseArray wrapping, investigate

      this._updateLoadingPromiseForHasMany(key, promise);

      return promise;
    }

    reloadBelongsTo(key, options) {
      var resource = this._recordData.getBelongsTo(key);

      resource._relationship.setRelationshipIsStale(true);

      var relationshipMeta = this.store._relationshipMetaFor(this.modelName, null, key);

      return this.store._findBelongsToByJsonApiResource(resource, this, relationshipMeta, options);
    }

    destroyFromRecordData() {
      if (this._doNotDestroy) {
        this._doNotDestroy = false;
        return;
      }

      this.destroy();
    }

    destroy() {
      (true && !(!this._record || this._record.get('isDestroyed') || this._record.get('isDestroying')) && Ember.assert('Cannot destroy an internalModel while its record is materialized', !this._record || this._record.get('isDestroyed') || this._record.get('isDestroying')));
      this.isDestroying = true;
      Object.keys(this._retainedManyArrayCache).forEach(key => {
        this._retainedManyArrayCache[key].destroy();

        delete this._retainedManyArrayCache[key];
      });

      this.store._removeFromIdMap(this);

      this._isDestroyed = true;
    }

    eachAttribute(callback, binding) {
      return this.modelClass.eachAttribute(callback, binding);
    }

    inverseFor(key) {
      return this.modelClass.inverseFor(key);
    }

    setupData(data) {
      var changedKeys = this._recordData.pushData(data, this.hasRecord);

      if (this.hasRecord) {
        this._record._notifyProperties(changedKeys);
      }

      this.pushedData();
    }

    getAttributeValue(key) {
      return this._recordData.getAttr(key);
    }

    setDirtyHasMany(key, records) {
      assertRecordsPassedToHasMany(records);
      return this._recordData.setDirtyHasMany(key, extractRecordDatasFromRecords(records));
    }

    setDirtyBelongsTo(key, value) {
      if (value && !value.then) {
        value = extractRecordDataFromRecord(value);
      }

      return this._recordData.setDirtyBelongsTo(key, value);
    }

    setDirtyAttribute(key, value) {
      if (this.isDeleted()) {
        throw new Ember.Error(`Attempted to set '${key}' to '${value}' on the deleted record ${this}`);
      }

      var currentValue = this.getAttributeValue(key);

      if (currentValue !== value) {
        this._recordData.setDirtyAttribute(key, value);

        var isDirty = this._recordData.isAttrDirty(key);

        this.send('didSetProperty', {
          name: key,
          isDirty: isDirty
        });
      }

      return value;
    }

    get isDestroyed() {
      return this._isDestroyed;
    }

    get hasRecord() {
      return !!this._record;
    }
    /*
      @method createSnapshot
      @private
    */


    createSnapshot(options) {
      return new Snapshot(this, options);
    }
    /*
      @method loadingData
      @private
      @param {Promise} promise
    */


    loadingData(promise) {
      this.send('loadingData', promise);
    }
    /*
      @method loadedData
      @private
    */


    loadedData() {
      this.send('loadedData');
    }
    /*
      @method notFound
      @private
    */


    notFound() {
      this.send('notFound');
    }
    /*
      @method pushedData
      @private
    */


    pushedData() {
      this.send('pushedData');
    }

    hasChangedAttributes() {
      if (this.isLoading() && !this.isReloading) {
        // no need to instantiate _recordData in this case
        return false;
      }

      return this._recordData.hasChangedAttributes();
    }
    /*
      Returns an object, whose keys are changed properties, and value is an
      [oldProp, newProp] array.
       @method changedAttributes
      @private
    */


    changedAttributes() {
      if (this.isLoading() && !this.isReloading) {
        // no need to calculate changed attributes when calling `findRecord`
        return {};
      }

      return this._recordData.changedAttributes();
    }
    /*
      @method adapterWillCommit
      @private
    */


    adapterWillCommit() {
      this._recordData.willCommit();

      this.send('willCommit');
    }
    /*
      @method adapterDidDirty
      @private
    */


    adapterDidDirty() {
      this.send('becomeDirty');
      this.updateRecordArrays();
    }
    /*
      @method send
      @private
      @param {String} name
      @param {Object} context
    */


    send(name, context) {
      var currentState = this.currentState;

      if (!currentState[name]) {
        this._unhandledEvent(currentState, name, context);
      }

      return currentState[name](this, context);
    }

    manyArrayRecordAdded(key) {
      if (this.hasRecord) {
        this._record.notifyHasManyAdded(key);
      }
    }

    notifyHasManyChange(key, record, idx) {
      if (this.hasRecord) {
        var manyArray = this._manyArrayCache[key];

        if (manyArray) {
          // TODO: this will "resurrect" previously unloaded records
          // see test '1:many async unload many side'
          //  in `tests/integration/records/unload-test.js`
          //  probably we don't want to retrieve latest eagerly when notifyhasmany changed
          //  but rather lazily when someone actually asks for a manyarray
          //
          //  that said, also not clear why we haven't moved this to retainedmanyarray so maybe that's the bit that's just not workign
          manyArray.retrieveLatest(); // TODO Igor be rigorous about when to delete this
          // TODO: igor check for case where we later unload again

          if (this._relationshipPromisesCache[key] && manyArray.anyUnloaded()) {
            delete this._relationshipPromisesCache[key];
          }
        }

        this.updateRecordArrays();
      }
    }

    notifyBelongsToChange(key, record) {
      if (this.hasRecord) {
        this._record.notifyBelongsToChange(key, record);

        this.updateRecordArrays();
      }
    }

    notifyPropertyChange(key) {
      if (this.hasRecord) {
        this._record.notifyPropertyChange(key);

        this.updateRecordArrays();
      }

      var manyArray = this._manyArrayCache[key] || this._retainedManyArrayCache[key];

      if (manyArray) {
        var didRemoveUnloadedModel = manyArray.removeUnloadedInternalModel();

        if (this._manyArrayCache[key] && didRemoveUnloadedModel) {
          this._retainedManyArrayCache[key] = this._manyArrayCache[key];
          delete this._manyArrayCache[key];
        }
      }

      if (this._relationshipPromisesCache[key]) {
        this._relationshipPromisesCache[key].destroy();

        delete this._relationshipPromisesCache[key];
      }
    }

    didCreateRecord() {
      this._recordData.clientDidCreate();
    }

    rollbackAttributes() {
      var dirtyKeys = this._recordData.rollbackAttributes();

      if (Ember.get(this, 'isError')) {
        this.didCleanError();
      }

      this.send('rolledBack');

      if (this._record && dirtyKeys && dirtyKeys.length > 0) {
        this._record._notifyProperties(dirtyKeys);
      }
    }
    /*
      @method transitionTo
      @private
      @param {String} name
    */


    transitionTo(name) {
      // POSSIBLE TODO: Remove this code and replace with
      // always having direct reference to state objects
      var pivotName = extractPivotName(name);
      var state = this.currentState;
      var transitionMapId = `${state.stateName}->${name}`;

      do {
        if (state.exit) {
          state.exit(this);
        }

        state = state.parentState;
      } while (!state[pivotName]);

      var setups;
      var enters;
      var i;
      var l;
      var map = TransitionChainMap[transitionMapId];

      if (map) {
        setups = map.setups;
        enters = map.enters;
        state = map.state;
      } else {
        setups = [];
        enters = [];
        var path = splitOnDot(name);

        for (i = 0, l = path.length; i < l; i++) {
          state = state[path[i]];

          if (state.enter) {
            enters.push(state);
          }

          if (state.setup) {
            setups.push(state);
          }
        }

        TransitionChainMap[transitionMapId] = {
          setups,
          enters,
          state
        };
      }

      for (i = 0, l = enters.length; i < l; i++) {
        enters[i].enter(this);
      }

      this.currentState = state;

      if (this.hasRecord) {
        Ember.set(this._record, 'currentState', state);
      }

      for (i = 0, l = setups.length; i < l; i++) {
        setups[i].setup(this);
      }

      this.updateRecordArrays();
    }

    _unhandledEvent(state, name, context) {
      var errorMessage = 'Attempted to handle event `' + name + '` ';
      errorMessage += 'on ' + String(this) + ' while in state ';
      errorMessage += state.stateName + '. ';

      if (context !== undefined) {
        errorMessage += 'Called with ' + Ember.inspect(context) + '.';
      }

      throw new Ember.Error(errorMessage);
    }

    triggerLater(...args) {
      if (this._deferredTriggers.push(args) !== 1) {
        return;
      }

      this.store._updateInternalModel(this);
    }

    _triggerDeferredTriggers() {
      //TODO: Before 1.0 we want to remove all the events that happen on the pre materialized record,
      //but for now, we queue up all the events triggered before the record was materialized, and flush
      //them once we have the record
      if (!this.hasRecord) {
        return;
      }

      var triggers = this._deferredTriggers;
      var record = this._record;
      var trigger = record.trigger;

      for (var i = 0, l = triggers.length; i < l; i++) {
        trigger.apply(record, triggers[i]);
      }

      triggers.length = 0;
    }

    removeFromInverseRelationships(isNew = false) {
      this._recordData.removeFromInverseRelationships(isNew);
    }
    /*
      When a find request is triggered on the store, the user can optionally pass in
      attributes and relationships to be preloaded. These are meant to behave as if they
      came back from the server, except the user obtained them out of band and is informing
      the store of their existence. The most common use case is for supporting client side
      nested URLs, such as `/posts/1/comments/2` so the user can do
      `store.findRecord('comment', 2, { preload: { post: 1 } })` without having to fetch the post.
       Preloaded data can be attributes and relationships passed in either as IDs or as actual
      models.
       @method preloadData
      @private
      @param {Object} preload
    */


    preloadData(preload) {
      var jsonPayload = {}; //TODO(Igor) consider the polymorphic case

      Object.keys(preload).forEach(key => {
        var preloadValue = Ember.get(preload, key);
        var relationshipMeta = this.modelClass.metaForProperty(key);

        if (relationshipMeta.isRelationship) {
          if (!jsonPayload.relationships) {
            jsonPayload.relationships = {};
          }

          jsonPayload.relationships[key] = this._preloadRelationship(key, preloadValue);
        } else {
          if (!jsonPayload.attributes) {
            jsonPayload.attributes = {};
          }

          jsonPayload.attributes[key] = preloadValue;
        }
      });

      this._recordData.pushData(jsonPayload);
    }

    _preloadRelationship(key, preloadValue) {
      var relationshipMeta = this.modelClass.metaForProperty(key);
      var modelClass = relationshipMeta.type;
      var data;

      if (relationshipMeta.kind === 'hasMany') {
        (true && !(Array.isArray(preloadValue)) && Ember.assert('You need to pass in an array to set a hasMany property on a record', Array.isArray(preloadValue)));
        data = preloadValue.map(value => this._convertPreloadRelationshipToJSON(value, modelClass));
      } else {
        data = this._convertPreloadRelationshipToJSON(preloadValue, modelClass);
      }

      return {
        data
      };
    }

    _convertPreloadRelationshipToJSON(value, modelClass) {
      if (typeof value === 'string' || typeof value === 'number') {
        return {
          type: modelClass,
          id: value
        };
      }

      var internalModel;

      if (value._internalModel) {
        internalModel = value._internalModel;
      } else {
        internalModel = value;
      } // TODO IGOR DAVID assert if no id is present


      return {
        type: internalModel.modelName,
        id: internalModel.id
      };
    }
    /*
      Used to notify the store to update FilteredRecordArray membership.
       @method updateRecordArrays
      @private
    */


    updateRecordArrays() {
      this.store.recordArrayManager.recordDidChange(this);
    }

    setId(id) {
      (true && !(this.id === null || this.id === id || this.isNew()) && Ember.assert("A record's id cannot be changed once it is in the loaded state", this.id === null || this.id === id || this.isNew()));
      var didChange = id !== this.id;
      this.id = id;

      if (didChange && this.hasRecord) {
        this._record.notifyPropertyChange('id');
      }
    }

    didError(error) {
      this.error = error;
      this.isError = true;

      if (this.hasRecord) {
        this._record.setProperties({
          isError: true,
          adapterError: error
        });
      }
    }

    didCleanError() {
      this.error = null;
      this.isError = false;

      if (this.hasRecord) {
        this._record.setProperties({
          isError: false,
          adapterError: null
        });
      }
    }
    /*
      If the adapter did not return a hash in response to a commit,
      merge the changed attributes and relationships into the existing
      saved data.
       @method adapterDidCommit
    */


    adapterDidCommit(data) {
      this.didCleanError();

      var changedKeys = this._recordData.didCommit(data);

      this.send('didCommit');
      this.updateRecordArrays();

      if (!data) {
        return;
      }

      this._record._notifyProperties(changedKeys);
    }

    addErrorMessageToAttribute(attribute, message) {
      Ember.get(this.getRecord(), 'errors')._add(attribute, message);
    }

    removeErrorMessageFromAttribute(attribute) {
      Ember.get(this.getRecord(), 'errors')._remove(attribute);
    }

    clearErrorMessages() {
      Ember.get(this.getRecord(), 'errors')._clear();
    }

    hasErrors() {
      var errors = Ember.get(this.getRecord(), 'errors');
      return errors.get('length') > 0;
    } // FOR USE DURING COMMIT PROCESS

    /*
      @method adapterDidInvalidate
      @private
    */


    adapterDidInvalidate(errors) {
      var attribute;

      for (attribute in errors) {
        if (errors.hasOwnProperty(attribute)) {
          this.addErrorMessageToAttribute(attribute, errors[attribute]);
        }
      }

      this.send('becameInvalid');

      this._recordData.commitWasRejected();
    }
    /*
      @method adapterDidError
      @private
    */


    adapterDidError(error) {
      this.send('becameError');
      this.didError(error);

      this._recordData.commitWasRejected();
    }

    toString() {
      return `<${this.modelName}:${this.id}>`;
    }

    referenceFor(kind, name) {
      var reference = this.references[name];

      if (!reference) {
        // TODO IGOR AND DAVID REFACTOR
        var relationship = this._recordData._relationships.get(name);

        {
          var modelName = this.modelName;
          (true && !(relationship) && Ember.assert(`There is no ${kind} relationship named '${name}' on a model of modelClass '${modelName}'`, relationship));
          var actualRelationshipKind = relationship.relationshipMeta.kind;
          (true && !(actualRelationshipKind === kind) && Ember.assert(`You tried to get the '${name}' relationship on a '${modelName}' via record.${kind}('${name}'), but the relationship is of kind '${actualRelationshipKind}'. Use record.${actualRelationshipKind}('${name}') instead.`, actualRelationshipKind === kind));
        }

        if (kind === 'belongsTo') {
          reference = new BelongsToReference(this.store, this, relationship, name);
        } else if (kind === 'hasMany') {
          reference = new HasManyReference(this.store, this, relationship, name);
        }

        this.references[name] = reference;
      }

      return reference;
    }

  }

  function assertRecordsPassedToHasMany(records) {
    (true && !(isArrayLike(records)) && Ember.assert(`You must pass an array of records to set a hasMany relationship`, isArrayLike(records)));
    (true && !(function () {
      return Ember.A(records).every(record => record.hasOwnProperty('_internalModel') === true);
    }()) && Ember.assert(`All elements of a hasMany relationship must be instances of DS.Model, you passed ${Ember.inspect(records)}`, function () {
      return Ember.A(records).every(record => record.hasOwnProperty('_internalModel') === true);
    }()));
  }

  function extractRecordDatasFromRecords(records) {
    return records.map(extractRecordDataFromRecord);
  }

  function extractRecordDataFromRecord(recordOrPromiseProxy) {
    // TODO @runspired async createRecord would resolve this issue
    // we leak record promises to RecordData by necessity :'(
    if (!recordOrPromiseProxy || recordOrPromiseProxy && recordOrPromiseProxy.then) {
      return recordOrPromiseProxy;
    }

    return recordOrPromiseProxy._internalModel._recordData;
  }

  var {
    changeProperties
  } = Ember;
  /**
    @module ember-data
  */

  function findPossibleInverses(type, inverseType, name, relationshipsSoFar) {
    var possibleRelationships = relationshipsSoFar || [];
    var relationshipMap = Ember.get(inverseType, 'relationships');

    if (!relationshipMap) {
      return possibleRelationships;
    }

    var relationshipsForType = relationshipMap.get(type.modelName);
    var relationships = Array.isArray(relationshipsForType) ? relationshipsForType.filter(relationship => {
      var optionsForRelationship = inverseType.metaForProperty(relationship.name).options;

      if (!optionsForRelationship.inverse && optionsForRelationship.inverse !== null) {
        return true;
      }

      return name === optionsForRelationship.inverse;
    }) : null;

    if (relationships) {
      possibleRelationships.push.apply(possibleRelationships, relationships);
    } //Recurse to support polymorphism


    if (type.superclass) {
      findPossibleInverses(type.superclass, inverseType, name, possibleRelationships);
    }

    return possibleRelationships;
  }

  var retrieveFromCurrentState = Ember.computed('currentState', function (key) {
    return Ember.get(this._internalModel.currentState, key);
  }).readOnly();
  /**

    The model class that all Ember Data records descend from.
    This is the public API of Ember Data models. If you are using Ember Data
    in your application, this is the class you should use.

    @class Model
    @namespace DS
    @extends Ember.Object
    @uses Ember.Evented
  */

  var Model = Ember.Object.extend(Ember.Evented, {
    // until: "3.9" as we need to support 2.18
    __defineNonEnumerable(property) {
      this[property.name] = property.descriptor.value;
    },

    /**
      If this property is `true` the record is in the `empty`
      state. Empty is the first state all records enter after they have
      been created. Most records created by the store will quickly
      transition to the `loading` state if data needs to be fetched from
      the server or the `created` state if the record is created on the
      client. A record can also enter the empty state if the adapter is
      unable to locate the record.
       @property isEmpty
      @type {Boolean}
      @readOnly
    */
    isEmpty: retrieveFromCurrentState,

    /**
      If this property is `true` the record is in the `loading` state. A
      record enters this state when the store asks the adapter for its
      data. It remains in this state until the adapter provides the
      requested data.
       @property isLoading
      @type {Boolean}
      @readOnly
    */
    isLoading: retrieveFromCurrentState,

    /**
      If this property is `true` the record is in the `loaded` state. A
      record enters this state when its data is populated. Most of a
      record's lifecycle is spent inside substates of the `loaded`
      state.
       Example
       ```javascript
      let record = store.createRecord('model');
      record.get('isLoaded'); // true
       store.findRecord('model', 1).then(function(model) {
        model.get('isLoaded'); // true
      });
      ```
       @property isLoaded
      @type {Boolean}
      @readOnly
    */
    isLoaded: retrieveFromCurrentState,

    /**
      If this property is `true` the record is in the `dirty` state. The
      record has local changes that have not yet been saved by the
      adapter. This includes records that have been created (but not yet
      saved) or deleted.
       Example
       ```javascript
      let record = store.createRecord('model');
      record.get('hasDirtyAttributes'); // true
       store.findRecord('model', 1).then(function(model) {
        model.get('hasDirtyAttributes'); // false
        model.set('foo', 'some value');
        model.get('hasDirtyAttributes'); // true
      });
      ```
       @since 1.13.0
      @property hasDirtyAttributes
      @type {Boolean}
      @readOnly
    */
    hasDirtyAttributes: Ember.computed('currentState.isDirty', function () {
      return this.get('currentState.isDirty');
    }),

    /**
      If this property is `true` the record is in the `saving` state. A
      record enters the saving state when `save` is called, but the
      adapter has not yet acknowledged that the changes have been
      persisted to the backend.
       Example
       ```javascript
      let record = store.createRecord('model');
      record.get('isSaving'); // false
      let promise = record.save();
      record.get('isSaving'); // true
      promise.then(function() {
        record.get('isSaving'); // false
      });
      ```
       @property isSaving
      @type {Boolean}
      @readOnly
    */
    isSaving: retrieveFromCurrentState,

    /**
      If this property is `true` the record is in the `deleted` state
      and has been marked for deletion. When `isDeleted` is true and
      `hasDirtyAttributes` is true, the record is deleted locally but the deletion
      was not yet persisted. When `isSaving` is true, the change is
      in-flight. When both `hasDirtyAttributes` and `isSaving` are false, the
      change has persisted.
       Example
       ```javascript
      let record = store.createRecord('model');
      record.get('isDeleted');    // false
      record.deleteRecord();
       // Locally deleted
      record.get('isDeleted');           // true
      record.get('hasDirtyAttributes');  // true
      record.get('isSaving');            // false
       // Persisting the deletion
      let promise = record.save();
      record.get('isDeleted');    // true
      record.get('isSaving');     // true
       // Deletion Persisted
      promise.then(function() {
        record.get('isDeleted');          // true
        record.get('isSaving');           // false
        record.get('hasDirtyAttributes'); // false
      });
      ```
       @property isDeleted
      @type {Boolean}
      @readOnly
    */
    isDeleted: retrieveFromCurrentState,

    /**
      If this property is `true` the record is in the `new` state. A
      record will be in the `new` state when it has been created on the
      client and the adapter has not yet report that it was successfully
      saved.
       Example
       ```javascript
      let record = store.createRecord('model');
      record.get('isNew'); // true
       record.save().then(function(model) {
        model.get('isNew'); // false
      });
      ```
       @property isNew
      @type {Boolean}
      @readOnly
    */
    isNew: retrieveFromCurrentState,

    /**
      If this property is `true` the record is in the `valid` state.
       A record will be in the `valid` state when the adapter did not report any
      server-side validation failures.
       @property isValid
      @type {Boolean}
      @readOnly
    */
    isValid: retrieveFromCurrentState,

    /**
      If the record is in the dirty state this property will report what
      kind of change has caused it to move into the dirty
      state. Possible values are:
       - `created` The record has been created by the client and not yet saved to the adapter.
      - `updated` The record has been updated by the client and not yet saved to the adapter.
      - `deleted` The record has been deleted by the client and not yet saved to the adapter.
       Example
       ```javascript
      let record = store.createRecord('model');
      record.get('dirtyType'); // 'created'
      ```
       @property dirtyType
      @type {String}
      @readOnly
    */
    dirtyType: retrieveFromCurrentState,

    /**
      If `true` the adapter reported that it was unable to save local
      changes to the backend for any reason other than a server-side
      validation error.
       Example
       ```javascript
      record.get('isError'); // false
      record.set('foo', 'valid value');
      record.save().then(null, function() {
        record.get('isError'); // true
      });
      ```
       @property isError
      @type {Boolean}
      @readOnly
    */
    isError: false,

    /**
      If `true` the store is attempting to reload the record from the adapter.
       Example
       ```javascript
      record.get('isReloading'); // false
      record.reload();
      record.get('isReloading'); // true
      ```
       @property isReloading
      @type {Boolean}
      @readOnly
    */
    isReloading: false,

    /**
      All ember models have an id property. This is an identifier
      managed by an external source. These are always coerced to be
      strings before being used internally. Note when declaring the
      attributes for a model it is an error to declare an id
      attribute.
       ```javascript
      let record = store.createRecord('model');
      record.get('id'); // null
       store.findRecord('model', 1).then(function(model) {
        model.get('id'); // '1'
      });
      ```
       @property id
      @type {String}
    */

    /**
      @property currentState
      @private
      @type {Object}
    */
    currentState: RootState$1.empty,
    // defined here to avoid triggering setUnknownProperty

    /**
     @property _internalModel
     @private
     @type {Object}
     */
    _internalModel: null,
    // defined here to avoid triggering setUnknownProperty

    /**
     @property recordData
     @private
     @type undefined (reserved)
     */
    // will be defined here to avoid triggering setUnknownProperty

    /**
     @property store
     */
    store: null,
    // defined here to avoid triggering setUnknownProperty

    /**
      When the record is in the `invalid` state this object will contain
      any errors returned by the adapter. When present the errors hash
      contains keys corresponding to the invalid property names
      and values which are arrays of Javascript objects with two keys:
       - `message` A string containing the error message from the backend
      - `attribute` The name of the property associated with this error message
       ```javascript
      record.get('errors.length'); // 0
      record.set('foo', 'invalid value');
      record.save().catch(function() {
        record.get('errors').get('foo');
        // [{message: 'foo should be a number.', attribute: 'foo'}]
      });
      ```
       The `errors` property us useful for displaying error messages to
      the user.
       ```handlebars
      <label>Username: {{input value=username}} </label>
      {{#each model.errors.username as |error|}}
        <div class="error">
          {{error.message}}
        </div>
      {{/each}}
      <label>Email: {{input value=email}} </label>
      {{#each model.errors.email as |error|}}
        <div class="error">
          {{error.message}}
        </div>
      {{/each}}
      ```
        You can also access the special `messages` property on the error
      object to get an array of all the error strings.
       ```handlebars
      {{#each model.errors.messages as |message|}}
        <div class="error">
          {{message}}
        </div>
      {{/each}}
      ```
       @property errors
      @type {DS.Errors}
    */
    errors: Ember.computed(function () {
      var errors = Errors.create();

      errors._registerHandlers(this._internalModel, function () {
        this.send('becameInvalid');
      }, function () {
        this.send('becameValid');
      });

      return errors;
    }).readOnly(),

    /**
      This property holds the `DS.AdapterError` object with which
      last adapter operation was rejected.
       @property adapterError
      @type {DS.AdapterError}
    */
    adapterError: null,

    /**
      Create a JSON representation of the record, using the serialization
      strategy of the store's adapter.
      `serialize` takes an optional hash as a parameter, currently
      supported options are:
      - `includeId`: `true` if the record's ID should be included in the
        JSON representation.
       @method serialize
      @param {Object} options
      @return {Object} an object whose values are primitive JSON values only
    */
    serialize(options) {
      return this._internalModel.createSnapshot().serialize(options);
    },

    /**
      Use [DS.JSONSerializer](DS.JSONSerializer.html) to
      get the JSON representation of a record.
       `toJSON` takes an optional hash as a parameter, currently
      supported options are:
       - `includeId`: `true` if the record's ID should be included in the
        JSON representation.
       @method toJSON
      @param {Object} options
      @return {Object} A JSON representation of the object.
    */
    toJSON(options) {
      // container is for lazy transform lookups
      var serializer = this._internalModel.store.serializerFor('-default');

      var snapshot = this._internalModel.createSnapshot();

      return serializer.serialize(snapshot, options);
    },

    /**
      Fired when the record is ready to be interacted with,
      that is either loaded from the server or created locally.
       @event ready
    */
    ready: null,

    /**
      Fired when the record is loaded from the server.
       @event didLoad
    */
    didLoad: null,

    /**
      Fired when the record is updated.
       @event didUpdate
    */
    didUpdate: null,

    /**
      Fired when a new record is commited to the server.
       @event didCreate
    */
    didCreate: null,

    /**
      Fired when the record is deleted.
       @event didDelete
    */
    didDelete: null,

    /**
      Fired when the record becomes invalid.
       @event becameInvalid
    */
    becameInvalid: null,

    /**
      Fired when the record enters the error state.
       @event becameError
    */
    becameError: null,

    /**
      Fired when the record is rolled back.
       @event rolledBack
    */
    rolledBack: null,

    //TODO Do we want to deprecate these?

    /**
      @method send
      @private
      @param {String} name
      @param {Object} context
    */
    send(name, context) {
      return this._internalModel.send(name, context);
    },

    /**
      @method transitionTo
      @private
      @param {String} name
    */
    transitionTo(name) {
      return this._internalModel.transitionTo(name);
    },

    /**
      Marks the record as deleted but does not save it. You must call
      `save` afterwards if you want to persist it. You might use this
      method if you want to allow the user to still `rollbackAttributes()`
      after a delete was made.
       Example
       ```app/routes/model/delete.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        actions: {
          softDelete() {
            this.get('controller.model').deleteRecord();
          },
          confirm() {
            this.get('controller.model').save();
          },
          undo() {
            this.get('controller.model').rollbackAttributes();
          }
        }
      });
      ```
       @method deleteRecord
    */
    deleteRecord() {
      this._internalModel.deleteRecord();
    },

    /**
      Same as `deleteRecord`, but saves the record immediately.
       Example
       ```app/routes/model/delete.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        actions: {
          delete() {
            this.get('controller.model').destroyRecord().then(function() {
              controller.transitionToRoute('model.index');
            });
          }
        }
      });
      ```
       If you pass an object on the `adapterOptions` property of the options
      argument it will be passed to your adapter via the snapshot
       ```js
      record.destroyRecord({ adapterOptions: { subscribe: false } });
      ```
       ```app/adapters/post.js
      import MyCustomAdapter from './custom-adapter';
       export default MyCustomAdapter.extend({
        deleteRecord(store, type, snapshot) {
          if (snapshot.adapterOptions.subscribe) {
            // ...
          }
          // ...
        }
      });
      ```
       @method destroyRecord
      @param {Object} options
      @return {Promise} a promise that will be resolved when the adapter returns
      successfully or rejected if the adapter returns with an error.
    */
    destroyRecord(options) {
      this.deleteRecord();
      return this.save(options);
    },

    /**
      Unloads the record from the store. This will cause the record to be destroyed and freed up for garbage collection.
       @method unloadRecord
    */
    unloadRecord() {
      if (this.isDestroyed) {
        return;
      }

      this._internalModel.unloadRecord();
    },

    /**
      @method _notifyProperties
      @private
    */
    _notifyProperties(keys) {
      // changeProperties defers notifications until after the delegate
      // and protects with a try...finally block
      // previously used begin...endPropertyChanges but this is private API
      changeProperties(() => {
        var key;

        for (var i = 0, length = keys.length; i < length; i++) {
          key = keys[i];
          this.notifyPropertyChange(key);
        }
      });
    },

    /**
      Returns an object, whose keys are changed properties, and value is
      an [oldProp, newProp] array.
       The array represents the diff of the canonical state with the local state
      of the model. Note: if the model is created locally, the canonical state is
      empty since the adapter hasn't acknowledged the attributes yet:
       Example
       ```app/models/mascot.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        name: DS.attr('string'),
        isAdmin: DS.attr('boolean', {
          defaultValue: false
        })
      });
      ```
       ```javascript
      let mascot = store.createRecord('mascot');
       mascot.changedAttributes(); // {}
       mascot.set('name', 'Tomster');
      mascot.changedAttributes(); // { name: [undefined, 'Tomster'] }
       mascot.set('isAdmin', true);
      mascot.changedAttributes(); // { isAdmin: [undefined, true], name: [undefined, 'Tomster'] }
       mascot.save().then(function() {
        mascot.changedAttributes(); // {}
         mascot.set('isAdmin', false);
        mascot.changedAttributes(); // { isAdmin: [true, false] }
      });
      ```
       @method changedAttributes
      @return {Object} an object, whose keys are changed properties,
        and value is an [oldProp, newProp] array.
    */
    changedAttributes() {
      return this._internalModel.changedAttributes();
    },

    /**
      If the model `hasDirtyAttributes` this function will discard any unsaved
      changes. If the model `isNew` it will be removed from the store.
       Example
       ```javascript
      record.get('name'); // 'Untitled Document'
      record.set('name', 'Doc 1');
      record.get('name'); // 'Doc 1'
      record.rollbackAttributes();
      record.get('name'); // 'Untitled Document'
      ```
       @since 1.13.0
      @method rollbackAttributes
    */
    rollbackAttributes() {
      this._internalModel.rollbackAttributes();
    },

    /*
      @method _createSnapshot
      @private
    */
    _createSnapshot() {
      return this._internalModel.createSnapshot();
    },

    toStringExtension() {
      // the _internalModel guard exists, because some dev-only deprecation code
      // (addListener via validatePropertyInjections) invokes toString before the
      // object is real.
      return this._internalModel && this._internalModel.id;
    },

    /**
      Save the record and persist any changes to the record to an
      external source via the adapter.
       Example
       ```javascript
      record.set('name', 'Tomster');
      record.save().then(function() {
        // Success callback
      }, function() {
        // Error callback
      });
      ```
      If you pass an object using the `adapterOptions` property of the options
     argument it will be passed to your adapter via the snapshot.
       ```js
      record.save({ adapterOptions: { subscribe: false } });
      ```
       ```app/adapters/post.js
      import MyCustomAdapter from './custom-adapter';
       export default MyCustomAdapter.extend({
        updateRecord(store, type, snapshot) {
          if (snapshot.adapterOptions.subscribe) {
            // ...
          }
          // ...
        }
      });
      ```
       @method save
      @param {Object} options
      @return {Promise} a promise that will be resolved when the adapter returns
      successfully or rejected if the adapter returns with an error.
    */
    save(options) {
      return PromiseObject.create({
        promise: this._internalModel.save(options).then(() => this)
      });
    },

    /**
      Reload the record from the adapter.
       This will only work if the record has already finished loading.
       Example
       ```app/routes/model/view.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        actions: {
          reload() {
            this.controller.get('model').reload().then(function(model) {
              // do something with the reloaded model
            });
          }
        }
      });
      ```
       @method reload
      @param {Object} options optional, may include `adapterOptions` hash which will be passed to adapter request
      @return {Promise} a promise that will be resolved with the record when the
      adapter returns successfully or rejected if the adapter returns
      with an error.
    */
    reload(options) {
      var wrappedAdapterOptions;

      if (typeof options === 'object' && options !== null && options.adapterOptions) {
        wrappedAdapterOptions = {
          adapterOptions: options.adapterOptions
        };
      }

      return PromiseObject.create({
        promise: this._internalModel.reload(wrappedAdapterOptions).then(() => this)
      });
    },

    /**
      Override the default event firing from Ember.Evented to
      also call methods with the given name.
       @method trigger
      @private
      @param {String} name
    */
    trigger(name) {
      var fn = this[name];

      if (typeof fn === 'function') {
        var length = arguments.length;
        var args = new Array(length - 1);

        for (var i = 1; i < length; i++) {
          args[i - 1] = arguments[i];
        }

        fn.apply(this, args);
      }

      this._super(...arguments);
    },

    attr() {
      (true && !(false) && Ember.assert('The `attr` method is not available on DS.Model, a DS.Snapshot was probably expected. Are you passing a DS.Model instead of a DS.Snapshot to your serializer?', false));
    },

    /**
      Get the reference for the specified belongsTo relationship.
       Example
       ```app/models/blog.js
      export default DS.Model.extend({
        user: DS.belongsTo({ async: true })
      });
      ```
       ```javascript
      let blog = store.push({
        data: {
          type: 'blog',
          id: 1,
          relationships: {
            user: {
              data: { type: 'user', id: 1 }
            }
          }
        }
      });
      let userRef = blog.belongsTo('user');
       // check if the user relationship is loaded
      let isLoaded = userRef.value() !== null;
       // get the record of the reference (null if not yet available)
      let user = userRef.value();
       // get the identifier of the reference
      if (userRef.remoteType() === "id") {
        let id = userRef.id();
      } else if (userRef.remoteType() === "link") {
        let link = userRef.link();
      }
       // load user (via store.findRecord or store.findBelongsTo)
      userRef.load().then(...)
       // or trigger a reload
      userRef.reload().then(...)
       // provide data for reference
      userRef.push({
        type: 'user',
        id: 1,
        attributes: {
          username: "@user"
        }
      }).then(function(user) {
        userRef.value() === user;
      });
      ```
       @method belongsTo
      @param {String} name of the relationship
      @since 2.5.0
      @return {BelongsToReference} reference for this relationship
    */
    belongsTo(name) {
      return this._internalModel.referenceFor('belongsTo', name);
    },

    /**
      Get the reference for the specified hasMany relationship.
       Example
       ```javascript
      // models/blog.js
      export default DS.Model.extend({
        comments: DS.hasMany({ async: true })
      });
       let blog = store.push({
        data: {
          type: 'blog',
          id: 1,
          relationships: {
            comments: {
              data: [
                { type: 'comment', id: 1 },
                { type: 'comment', id: 2 }
              ]
            }
          }
        }
      });
      let commentsRef = blog.hasMany('comments');
       // check if the comments are loaded already
      let isLoaded = commentsRef.value() !== null;
       // get the records of the reference (null if not yet available)
      let comments = commentsRef.value();
       // get the identifier of the reference
      if (commentsRef.remoteType() === "ids") {
        let ids = commentsRef.ids();
      } else if (commentsRef.remoteType() === "link") {
        let link = commentsRef.link();
      }
       // load comments (via store.findMany or store.findHasMany)
      commentsRef.load().then(...)
       // or trigger a reload
      commentsRef.reload().then(...)
       // provide data for reference
      commentsRef.push([{ type: 'comment', id: 1 }, { type: 'comment', id: 2 }]).then(function(comments) {
        commentsRef.value() === comments;
      });
      ```
       @method hasMany
      @param {String} name of the relationship
      @since 2.5.0
      @return {HasManyReference} reference for this relationship
    */
    hasMany(name) {
      return this._internalModel.referenceFor('hasMany', name);
    },

    /**
     Provides info about the model for debugging purposes
     by grouping the properties into more semantic groups.
      Meant to be used by debugging tools such as the Chrome Ember Extension.
      - Groups all attributes in "Attributes" group.
     - Groups all belongsTo relationships in "Belongs To" group.
     - Groups all hasMany relationships in "Has Many" group.
     - Groups all flags in "Flags" group.
     - Flags relationship CPs as expensive properties.
      @method _debugInfo
     @for DS.Model
     @private
     */
    _debugInfo() {
      var attributes = ['id'];
      var relationships = {};
      var expensiveProperties = [];
      this.eachAttribute((name, meta) => attributes.push(name));
      var groups = [{
        name: 'Attributes',
        properties: attributes,
        expand: true
      }];
      this.eachRelationship((name, relationship) => {
        var properties = relationships[relationship.kind];

        if (properties === undefined) {
          properties = relationships[relationship.kind] = [];
          groups.push({
            name: relationship.name,
            properties,
            expand: true
          });
        }

        properties.push(name);
        expensiveProperties.push(name);
      });
      groups.push({
        name: 'Flags',
        properties: ['isLoaded', 'hasDirtyAttributes', 'isSaving', 'isDeleted', 'isError', 'isNew', 'isValid']
      });
      return {
        propertyInfo: {
          // include all other mixins / properties (not just the grouped ones)
          includeOtherProperties: true,
          groups: groups,
          // don't pre-calculate unless cached
          expensiveProperties: expensiveProperties
        }
      };
    },

    notifyBelongsToChange(key) {
      this.notifyPropertyChange(key);
    },

    /**
     Given a callback, iterates over each of the relationships in the model,
     invoking the callback with the name of each relationship and its relationship
     descriptor.
       The callback method you provide should have the following signature (all
     parameters are optional):
      ```javascript
     function(name, descriptor);
     ```
      - `name` the name of the current property in the iteration
     - `descriptor` the meta object that describes this relationship
      The relationship descriptor argument is an object with the following properties.
      - **key** <span class="type">String</span> the name of this relationship on the Model
     - **kind** <span class="type">String</span> "hasMany" or "belongsTo"
     - **options** <span class="type">Object</span> the original options hash passed when the relationship was declared
     - **parentType** <span class="type">DS.Model</span> the type of the Model that owns this relationship
     - **type** <span class="type">String</span> the type name of the related Model
      Note that in addition to a callback, you can also pass an optional target
     object that will be set as `this` on the context.
      Example
      ```app/serializers/application.js
     import DS from 'ember-data';
      export default DS.JSONSerializer.extend({
      serialize: function(record, options) {
        let json = {};
         record.eachRelationship(function(name, descriptor) {
          if (descriptor.kind === 'hasMany') {
            let serializedHasManyName = name.toUpperCase() + '_IDS';
            json[serializedHasManyName] = record.get(name).mapBy('id');
          }
        });
         return json;
      }
    });
     ```
      @method eachRelationship
     @param {Function} callback the callback to invoke
     @param {any} binding the value to which the callback's `this` should be bound
     */
    eachRelationship(callback, binding) {
      this.constructor.eachRelationship(callback, binding);
    },

    relationshipFor(name) {
      return Ember.get(this.constructor, 'relationshipsByName').get(name);
    },

    inverseFor(key) {
      return this.constructor.inverseFor(key, this._internalModel.store);
    },

    notifyHasManyAdded(key) {
      //We need to notifyPropertyChange in the adding case because we need to make sure
      //we fetch the newly added record in case it is unloaded
      //TODO(Igor): Consider whether we could do this only if the record state is unloaded
      this.notifyPropertyChange(key);
    },

    eachAttribute(callback, binding) {
      this.constructor.eachAttribute(callback, binding);
    }

  });
  /**
   @property data
   @private
   @deprecated
   @type {Object}
   */

  Object.defineProperty(Model.prototype, 'data', {
    configurable: false,

    get() {
      (true && !(false) && Ember.deprecate(`Model.data was private and it's use has been deprecated. For public access, use the RecordData API or iterate attributes`, false, {
        id: 'ember-data:Model.data',
        until: '3.9'
      }));
      return this._internalModel._recordData._data;
    }

  });
  var ID_DESCRIPTOR = {
    configurable: false,

    set(id) {
      this._internalModel.setId(id);
    },

    get() {
      // the _internalModel guard exists, because some dev-only deprecation code
      // (addListener via validatePropertyInjections) invokes toString before the
      // object is real.
      return this._internalModel && this._internalModel.id;
    }

  };
  Object.defineProperty(Model.prototype, 'id', ID_DESCRIPTOR);

  {
    var lookupDescriptor = function lookupDescriptor(obj, keyName) {
      var current = obj;

      do {
        var descriptor = Object.getOwnPropertyDescriptor(current, keyName);

        if (descriptor !== undefined) {
          return descriptor;
        }

        current = Object.getPrototypeOf(current);
      } while (current !== null);

      return null;
    };

    var isBasicDesc = function isBasicDesc(desc) {
      return !desc || !desc.get && !desc.set && desc.enumerable === true && desc.writable === true && desc.configurable === true;
    };

    var isDefaultEmptyDescriptor = function isDefaultEmptyDescriptor(obj, keyName) {
      var instanceDesc = lookupDescriptor(obj, keyName);
      return isBasicDesc(instanceDesc) && lookupDescriptor(obj.constructor, keyName) === null;
    };

    Model.reopen({
      init() {
        this._super(...arguments);

        if (!this._internalModel) {
          throw new Ember.Error('You should not call `create` on a model. Instead, call `store.createRecord` with the attributes you would like to set.');
        }

        if (!isDefaultEmptyDescriptor(this, '_internalModel') || !(this._internalModel instanceof InternalModel)) {
          throw new Error(`'_internalModel' is a reserved property name on instances of classes extending Model. Please choose a different property name for ${this.constructor.toString()}`);
        }

        if (!isDefaultEmptyDescriptor(this, 'recordData') || this.recordData !== undefined || this.recordData !== this._internalModel.recordData) {
          throw new Error(`'recordData' is a reserved property name on instances of classes extending Model. Please choose a different property name for ${this.constructor.toString()}`);
        }

        if (!isDefaultEmptyDescriptor(this, 'currentState') || this.get('currentState') !== this._internalModel.currentState) {
          throw new Error(`'currentState' is a reserved property name on instances of classes extending Model. Please choose a different property name for ${this.constructor.toString()}`);
        }

        var idDesc = lookupDescriptor(this, 'id');

        if (idDesc.get !== ID_DESCRIPTOR.get) {
          throw new Ember.Error(`You may not set 'id' as an attribute on your model. Please remove any lines that look like: \`id: DS.attr('<type>')\` from ${this.constructor.toString()}`);
        }
      }

    });
  }

  Model.reopenClass({
    isModel: true,

    /**
      Create should only ever be called by the store. To create an instance of a
      `DS.Model` in a dirty state use `store.createRecord`.
      To create instances of `DS.Model` in a clean state, use `store.push`
       @method create
      @private
      @static
    */

    /**
     Represents the model's class name as a string. This can be used to look up the model's class name through
     `DS.Store`'s modelFor method.
      `modelName` is generated for you by Ember Data. It will be a lowercased, dasherized string.
     For example:
      ```javascript
     store.modelFor('post').modelName; // 'post'
     store.modelFor('blog-post').modelName; // 'blog-post'
     ```
      The most common place you'll want to access `modelName` is in your serializer's `payloadKeyFromModelName` method. For example, to change payload
     keys to underscore (instead of dasherized), you might use the following code:
      ```javascript
     import { underscore } from '@ember/string';
      export default const PostSerializer = DS.RESTSerializer.extend({
       payloadKeyFromModelName(modelName) {
         return underscore(modelName);
       }
     });
     ```
     @property modelName
     @type String
     @readonly
     @static
    */
    modelName: null,

    /*
     These class methods below provide relationship
     introspection abilities about relationships.
      A note about the computed properties contained here:
      **These properties are effectively sealed once called for the first time.**
     To avoid repeatedly doing expensive iteration over a model's fields, these
     values are computed once and then cached for the remainder of the runtime of
     your application.
      If your application needs to modify a class after its initial definition
     (for example, using `reopen()` to add additional attributes), make sure you
     do it before using your model with the store, which uses these properties
     extensively.
     */

    /**
     For a given relationship name, returns the model type of the relationship.
      For example, if you define a model like this:
      ```app/models/post.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        comments: DS.hasMany('comment')
      });
     ```
      Calling `store.modelFor('post').typeForRelationship('comments', store)` will return `Comment`.
      @method typeForRelationship
     @static
     @param {String} name the name of the relationship
     @param {store} store an instance of DS.Store
     @return {DS.Model} the type of the relationship, or undefined
     */
    typeForRelationship(name, store) {
      var relationship = Ember.get(this, 'relationshipsByName').get(name);
      return relationship && store.modelFor(relationship.type);
    },

    inverseMap: Ember.computed(function () {
      return Object.create(null);
    }),

    /**
     Find the relationship which is the inverse of the one asked for.
      For example, if you define models like this:
      ```app/models/post.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        comments: DS.hasMany('message')
      });
     ```
      ```app/models/message.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        owner: DS.belongsTo('post')
      });
     ```
      ``` js
     store.modelFor('post').inverseFor('comments', store) // { type: App.Message, name: 'owner', kind: 'belongsTo' }
     store.modelFor('message').inverseFor('owner', store) // { type: App.Post, name: 'comments', kind: 'hasMany' }
     ```
      @method inverseFor
     @static
     @param {String} name the name of the relationship
     @param {DS.Store} store
     @return {Object} the inverse relationship, or null
     */
    inverseFor(name, store) {
      var inverseMap = Ember.get(this, 'inverseMap');

      if (inverseMap[name]) {
        return inverseMap[name];
      } else {
        var inverse = this._findInverseFor(name, store);

        inverseMap[name] = inverse;
        return inverse;
      }
    },

    //Calculate the inverse, ignoring the cache
    _findInverseFor(name, store) {
      var inverseType = this.typeForRelationship(name, store);

      if (!inverseType) {
        return null;
      }

      var propertyMeta = this.metaForProperty(name); //If inverse is manually specified to be null, like  `comments: DS.hasMany('message', { inverse: null })`

      var options = propertyMeta.options;

      if (options.inverse === null) {
        return null;
      }

      var inverseName, inverseKind, inverse, inverseOptions; //If inverse is specified manually, return the inverse

      if (options.inverse) {
        inverseName = options.inverse;
        inverse = Ember.get(inverseType, 'relationshipsByName').get(inverseName);
        (true && !(!Ember.isNone(inverse)) && Ember.assert("We found no inverse relationships by the name of '" + inverseName + "' on the '" + inverseType.modelName + "' model. This is most likely due to a missing attribute on your model definition.", !Ember.isNone(inverse))); // TODO probably just return the whole inverse here

        inverseKind = inverse.kind;
        inverseOptions = inverse.options;
      } else {
        //No inverse was specified manually, we need to use a heuristic to guess one
        if (propertyMeta.type === propertyMeta.parentModelName) {
          (true && Ember.warn(`Detected a reflexive relationship by the name of '${name}' without an inverse option. Look at https://guides.emberjs.com/current/models/relationships/#toc_reflexive-relations for how to explicitly specify inverses.`, false, {
            id: 'ds.model.reflexive-relationship-without-inverse'
          }));
        }

        var possibleRelationships = findPossibleInverses(this, inverseType, name);

        if (possibleRelationships.length === 0) {
          return null;
        }

        var filteredRelationships = possibleRelationships.filter(possibleRelationship => {
          var optionsForRelationship = inverseType.metaForProperty(possibleRelationship.name).options;
          return name === optionsForRelationship.inverse;
        });
        (true && !(filteredRelationships.length < 2) && Ember.assert("You defined the '" + name + "' relationship on " + this + ', but you defined the inverse relationships of type ' + inverseType.toString() + ' multiple times. Look at https://guides.emberjs.com/current/models/relationships/#toc_explicit-inverses for how to explicitly specify inverses', filteredRelationships.length < 2));

        if (filteredRelationships.length === 1) {
          possibleRelationships = filteredRelationships;
        }

        (true && !(possibleRelationships.length === 1) && Ember.assert("You defined the '" + name + "' relationship on " + this + ', but multiple possible inverse relationships of type ' + this + ' were found on ' + inverseType + '. Look at https://guides.emberjs.com/current/models/relationships/#toc_explicit-inverses for how to explicitly specify inverses', possibleRelationships.length === 1));
        inverseName = possibleRelationships[0].name;
        inverseKind = possibleRelationships[0].kind;
        inverseOptions = possibleRelationships[0].options;
      }

      (true && !(!inverseOptions || inverseOptions.inverse !== null) && Ember.assert(`The ${inverseType.modelName}:${inverseName} relationship declares 'inverse: null', but it was resolved as the inverse for ${this.modelName}:${name}.`, !inverseOptions || inverseOptions.inverse !== null));
      return {
        type: inverseType,
        name: inverseName,
        kind: inverseKind,
        options: inverseOptions
      };
    },

    /**
     The model's relationships as a map, keyed on the type of the
     relationship. The value of each entry is an array containing a descriptor
     for each relationship with that type, describing the name of the relationship
     as well as the type.
      For example, given the following model definition:
      ```app/models/blog.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        users: DS.hasMany('user'),
        owner: DS.belongsTo('user'),
        posts: DS.hasMany('post')
      });
     ```
      This computed property would return a map describing these
     relationships, like this:
      ```javascript
     import Ember from 'ember';
     import Blog from 'app/models/blog';
     import User from 'app/models/user';
     import Post from 'app/models/post';
      let relationships = Ember.get(Blog, 'relationships');
     relationships.get(User);
     //=> [ { name: 'users', kind: 'hasMany' },
     //     { name: 'owner', kind: 'belongsTo' } ]
     relationships.get(Post);
     //=> [ { name: 'posts', kind: 'hasMany' } ]
     ```
      @property relationships
     @static
     @type Map
     @readOnly
     */
    relationships: relationshipsDescriptor,

    /**
     A hash containing lists of the model's relationships, grouped
     by the relationship kind. For example, given a model with this
     definition:
      ```app/models/blog.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        users: DS.hasMany('user'),
        owner: DS.belongsTo('user'),
         posts: DS.hasMany('post')
      });
     ```
      This property would contain the following:
      ```javascript
     import Ember from 'ember';
     import Blog from 'app/models/blog';
      let relationshipNames = Ember.get(Blog, 'relationshipNames');
     relationshipNames.hasMany;
     //=> ['users', 'posts']
     relationshipNames.belongsTo;
     //=> ['owner']
     ```
      @property relationshipNames
     @static
     @type Object
     @readOnly
     */
    relationshipNames: Ember.computed(function () {
      var names = {
        hasMany: [],
        belongsTo: []
      };
      this.eachComputedProperty((name, meta) => {
        if (meta.isRelationship) {
          names[meta.kind].push(name);
        }
      });
      return names;
    }),

    /**
     An array of types directly related to a model. Each type will be
     included once, regardless of the number of relationships it has with
     the model.
      For example, given a model with this definition:
      ```app/models/blog.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        users: DS.hasMany('user'),
        owner: DS.belongsTo('user'),
         posts: DS.hasMany('post')
      });
     ```
      This property would contain the following:
      ```javascript
     import Ember from 'ember';
     import Blog from 'app/models/blog';
      let relatedTypes = Ember.get(Blog, 'relatedTypes');
     //=> [ User, Post ]
     ```
      @property relatedTypes
     @static
     @type Ember.Array
     @readOnly
     */
    relatedTypes: relatedTypesDescriptor,

    /**
     A map whose keys are the relationships of a model and whose values are
     relationship descriptors.
      For example, given a model with this
     definition:
      ```app/models/blog.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        users: DS.hasMany('user'),
        owner: DS.belongsTo('user'),
         posts: DS.hasMany('post')
      });
     ```
      This property would contain the following:
      ```javascript
     import Ember from 'ember';
     import Blog from 'app/models/blog';
      let relationshipsByName = Ember.get(Blog, 'relationshipsByName');
     relationshipsByName.get('users');
     //=> { key: 'users', kind: 'hasMany', type: 'user', options: Object, isRelationship: true }
     relationshipsByName.get('owner');
     //=> { key: 'owner', kind: 'belongsTo', type: 'user', options: Object, isRelationship: true }
     ```
      @property relationshipsByName
     @static
     @type Map
     @readOnly
     */
    relationshipsByName: relationshipsByNameDescriptor,
    relationshipsObject: relationshipsObjectDescriptor,

    /**
     A map whose keys are the fields of the model and whose values are strings
     describing the kind of the field. A model's fields are the union of all of its
     attributes and relationships.
      For example:
      ```app/models/blog.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        users: DS.hasMany('user'),
        owner: DS.belongsTo('user'),
         posts: DS.hasMany('post'),
         title: DS.attr('string')
      });
     ```
      ```js
     import Ember from 'ember';
     import Blog from 'app/models/blog';
      let fields = Ember.get(Blog, 'fields');
     fields.forEach(function(kind, field) {
        console.log(field, kind);
      });
      // prints:
     // users, hasMany
     // owner, belongsTo
     // posts, hasMany
     // title, attribute
     ```
      @property fields
     @static
     @type Map
     @readOnly
     */
    fields: Ember.computed(function () {
      var map = new Map();
      this.eachComputedProperty((name, meta) => {
        if (meta.isRelationship) {
          map.set(name, meta.kind);
        } else if (meta.isAttribute) {
          map.set(name, 'attribute');
        }
      });
      return map;
    }).readOnly(),

    /**
     Given a callback, iterates over each of the relationships in the model,
     invoking the callback with the name of each relationship and its relationship
     descriptor.
      @method eachRelationship
     @static
     @param {Function} callback the callback to invoke
     @param {any} binding the value to which the callback's `this` should be bound
     */
    eachRelationship(callback, binding) {
      Ember.get(this, 'relationshipsByName').forEach((relationship, name) => {
        callback.call(binding, name, relationship);
      });
    },

    /**
     Given a callback, iterates over each of the types related to a model,
     invoking the callback with the related type's class. Each type will be
     returned just once, regardless of how many different relationships it has
     with a model.
      @method eachRelatedType
     @static
     @param {Function} callback the callback to invoke
     @param {any} binding the value to which the callback's `this` should be bound
     */
    eachRelatedType(callback, binding) {
      var relationshipTypes = Ember.get(this, 'relatedTypes');

      for (var i = 0; i < relationshipTypes.length; i++) {
        var type = relationshipTypes[i];
        callback.call(binding, type);
      }
    },

    determineRelationshipType(knownSide, store) {
      var knownKey = knownSide.key;
      var knownKind = knownSide.kind;
      var inverse = this.inverseFor(knownKey, store); // let key;

      var otherKind;

      if (!inverse) {
        return knownKind === 'belongsTo' ? 'oneToNone' : 'manyToNone';
      } // key = inverse.name;


      otherKind = inverse.kind;

      if (otherKind === 'belongsTo') {
        return knownKind === 'belongsTo' ? 'oneToOne' : 'manyToOne';
      } else {
        return knownKind === 'belongsTo' ? 'oneToMany' : 'manyToMany';
      }
    },

    /**
     A map whose keys are the attributes of the model (properties
     described by DS.attr) and whose values are the meta object for the
     property.
      Example
      ```app/models/person.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        firstName: DS.attr('string'),
        lastName: DS.attr('string'),
        birthday: DS.attr('date')
      });
     ```
      ```javascript
     import Ember from 'ember';
     import Person from 'app/models/person';
      let attributes = Ember.get(Person, 'attributes')
      attributes.forEach(function(meta, name) {
        console.log(name, meta);
      });
      // prints:
     // firstName {type: "string", isAttribute: true, options: Object, parentType: function, name: "firstName"}
     // lastName {type: "string", isAttribute: true, options: Object, parentType: function, name: "lastName"}
     // birthday {type: "date", isAttribute: true, options: Object, parentType: function, name: "birthday"}
     ```
      @property attributes
     @static
     @type {Map}
     @readOnly
     */
    attributes: Ember.computed(function () {
      var map = new Map();
      this.eachComputedProperty((name, meta) => {
        if (meta.isAttribute) {
          (true && !(name !== 'id') && Ember.assert("You may not set `id` as an attribute on your model. Please remove any lines that look like: `id: DS.attr('<type>')` from " + this.toString(), name !== 'id'));
          meta.name = name;
          map.set(name, meta);
        }
      });
      return map;
    }).readOnly(),

    /**
     A map whose keys are the attributes of the model (properties
     described by DS.attr) and whose values are type of transformation
     applied to each attribute. This map does not include any
     attributes that do not have an transformation type.
      Example
      ```app/models/person.js
     import DS from 'ember-data';
      export default DS.Model.extend({
        firstName: DS.attr(),
        lastName: DS.attr('string'),
        birthday: DS.attr('date')
      });
     ```
      ```javascript
     import Ember from 'ember';
     import Person from 'app/models/person';
      let transformedAttributes = Ember.get(Person, 'transformedAttributes')
      transformedAttributes.forEach(function(field, type) {
        console.log(field, type);
      });
      // prints:
     // lastName string
     // birthday date
     ```
      @property transformedAttributes
     @static
     @type {Map}
     @readOnly
     */
    transformedAttributes: Ember.computed(function () {
      var map = new Map();
      this.eachAttribute((key, meta) => {
        if (meta.type) {
          map.set(key, meta.type);
        }
      });
      return map;
    }).readOnly(),

    /**
     Iterates through the attributes of the model, calling the passed function on each
     attribute.
      The callback method you provide should have the following signature (all
     parameters are optional):
      ```javascript
     function(name, meta);
     ```
      - `name` the name of the current property in the iteration
     - `meta` the meta object for the attribute property in the iteration
      Note that in addition to a callback, you can also pass an optional target
     object that will be set as `this` on the context.
      Example
      ```javascript
     import DS from 'ember-data';
      let Person = DS.Model.extend({
        firstName: DS.attr('string'),
        lastName: DS.attr('string'),
        birthday: DS.attr('date')
      });
      Person.eachAttribute(function(name, meta) {
        console.log(name, meta);
      });
      // prints:
     // firstName {type: "string", isAttribute: true, options: Object, parentType: function, name: "firstName"}
     // lastName {type: "string", isAttribute: true, options: Object, parentType: function, name: "lastName"}
     // birthday {type: "date", isAttribute: true, options: Object, parentType: function, name: "birthday"}
     ```
      @method eachAttribute
     @param {Function} callback The callback to execute
     @param {Object} [binding] the value to which the callback's `this` should be bound
     @static
     */
    eachAttribute(callback, binding) {
      Ember.get(this, 'attributes').forEach((meta, name) => {
        callback.call(binding, name, meta);
      });
    },

    /**
     Iterates through the transformedAttributes of the model, calling
     the passed function on each attribute. Note the callback will not be
     called for any attributes that do not have an transformation type.
      The callback method you provide should have the following signature (all
     parameters are optional):
      ```javascript
     function(name, type);
     ```
      - `name` the name of the current property in the iteration
     - `type` a string containing the name of the type of transformed
     applied to the attribute
      Note that in addition to a callback, you can also pass an optional target
     object that will be set as `this` on the context.
      Example
      ```javascript
     import DS from 'ember-data';
      let Person = DS.Model.extend({
        firstName: DS.attr(),
        lastName: DS.attr('string'),
        birthday: DS.attr('date')
      });
      Person.eachTransformedAttribute(function(name, type) {
        console.log(name, type);
      });
      // prints:
     // lastName string
     // birthday date
     ```
      @method eachTransformedAttribute
     @param {Function} callback The callback to execute
     @param {Object} [binding] the value to which the callback's `this` should be bound
     @static
     */
    eachTransformedAttribute(callback, binding) {
      Ember.get(this, 'transformedAttributes').forEach((type, name) => {
        callback.call(binding, name, type);
      });
    },

    /**
     Returns the name of the model class.
      @method toString
     @static
     */
    toString() {
      return `model:${Ember.get(this, 'modelName')}`;
    }

  });

  var SOURCE_POINTER_REGEXP = /^\/?data\/(attributes|relationships)\/(.*)/;
  var SOURCE_POINTER_PRIMARY_REGEXP = /^\/?data/;
  var PRIMARY_ATTRIBUTE_KEY = 'base';
  /**
    A `DS.AdapterError` is used by an adapter to signal that an error occurred
    during a request to an external API. It indicates a generic error, and
    subclasses are used to indicate specific error states. The following
    subclasses are provided:

    - `DS.InvalidError`
    - `DS.TimeoutError`
    - `DS.AbortError`
    - `DS.UnauthorizedError`
    - `DS.ForbiddenError`
    - `DS.NotFoundError`
    - `DS.ConflictError`
    - `DS.ServerError`

    To create a custom error to signal a specific error state in communicating
    with an external API, extend the `DS.AdapterError`. For example, if the
    external API exclusively used HTTP `503 Service Unavailable` to indicate
    it was closed for maintenance:

    ```app/adapters/maintenance-error.js
    import DS from 'ember-data';

    export default DS.AdapterError.extend({ message: "Down for maintenance." });
    ```

    This error would then be returned by an adapter's `handleResponse` method:

    ```app/adapters/application.js
    import DS from 'ember-data';
    import MaintenanceError from './maintenance-error';

    export default DS.JSONAPIAdapter.extend({
      handleResponse(status) {
        if (503 === status) {
          return new MaintenanceError();
        }

        return this._super(...arguments);
      }
    });
    ```

    And can then be detected in an application and used to send the user to an
    `under-maintenance` route:

    ```app/routes/application.js
    import Route from '@ember/routing/route';
    import MaintenanceError from '../adapters/maintenance-error';

    export default Route.extend({
      actions: {
        error(error, transition) {
          if (error instanceof MaintenanceError) {
            this.transitionTo('under-maintenance');
            return;
          }

          // ...other error handling logic
        }
      }
    });
    ```

    @class AdapterError
    @namespace DS
  */

  function AdapterError(errors, message = 'Adapter operation failed') {
    this.isAdapterError = true;
    Ember.Error.call(this, message);
    this.errors = errors || [{
      title: 'Adapter Error',
      detail: message
    }];
  }

  function extendFn(ErrorClass) {
    return function ({
      message: defaultMessage
    } = {}) {
      return extend(ErrorClass, defaultMessage);
    };
  }

  function extend(ParentErrorClass, defaultMessage) {
    var ErrorClass = function (errors, message) {
      (true && !(Array.isArray(errors || [])) && Ember.assert('`AdapterError` expects json-api formatted errors array.', Array.isArray(errors || [])));
      ParentErrorClass.call(this, errors, message || defaultMessage);
    };

    ErrorClass.prototype = Object.create(ParentErrorClass.prototype);
    ErrorClass.extend = extendFn(ErrorClass);
    return ErrorClass;
  }

  AdapterError.prototype = Object.create(Ember.Error.prototype);
  AdapterError.extend = extendFn(AdapterError);
  /**
    A `DS.InvalidError` is used by an adapter to signal the external API
    was unable to process a request because the content was not
    semantically correct or meaningful per the API. Usually, this means a
    record failed some form of server-side validation. When a promise
    from an adapter is rejected with a `DS.InvalidError` the record will
    transition to the `invalid` state and the errors will be set to the
    `errors` property on the record.

    For Ember Data to correctly map errors to their corresponding
    properties on the model, Ember Data expects each error to be
    a valid JSON-API error object with a `source/pointer` that matches
    the property name. For example, if you had a Post model that
    looked like this.

    ```app/models/post.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      title: DS.attr('string'),
      content: DS.attr('string')
    });
    ```

    To show an error from the server related to the `title` and
    `content` properties your adapter could return a promise that
    rejects with a `DS.InvalidError` object that looks like this:

    ```app/adapters/post.js
    import RSVP from 'RSVP';
    import DS from 'ember-data';

    export default DS.RESTAdapter.extend({
      updateRecord() {
        // Fictional adapter that always rejects
        return RSVP.reject(new DS.InvalidError([
          {
            detail: 'Must be unique',
            source: { pointer: '/data/attributes/title' }
          },
          {
            detail: 'Must not be blank',
            source: { pointer: '/data/attributes/content'}
          }
        ]));
      }
    });
    ```

    Your backend may use different property names for your records the
    store will attempt to extract and normalize the errors using the
    serializer's `extractErrors` method before the errors get added to
    the model. As a result, it is safe for the `InvalidError` to
    wrap the error payload unaltered.

    @class InvalidError
    @namespace DS
  */

  var InvalidError = extend(AdapterError, 'The adapter rejected the commit because it was invalid');
  /**
    A `DS.TimeoutError` is used by an adapter to signal that a request
    to the external API has timed out. I.e. no response was received from
    the external API within an allowed time period.

    An example use case would be to warn the user to check their internet
    connection if an adapter operation has timed out:

    ```app/routes/application.js
    import Route from '@ember/routing/route';
    import DS from 'ember-data';

    const { TimeoutError } = DS;

    export default Route.extend({
      actions: {
        error(error, transition) {
          if (error instanceof TimeoutError) {
            // alert the user
            alert('Are you still connected to the internet?');
            return;
          }

          // ...other error handling logic
        }
      }
    });
    ```

    @class TimeoutError
    @namespace DS
  */

  var TimeoutError = extend(AdapterError, 'The adapter operation timed out');
  /**
    A `DS.AbortError` is used by an adapter to signal that a request to
    the external API was aborted. For example, this can occur if the user
    navigates away from the current page after a request to the external API
    has been initiated but before a response has been received.

    @class AbortError
    @namespace DS
  */

  var AbortError = extend(AdapterError, 'The adapter operation was aborted');
  /**
    A `DS.UnauthorizedError` equates to a HTTP `401 Unauthorized` response
    status. It is used by an adapter to signal that a request to the external
    API was rejected because authorization is required and has failed or has not
    yet been provided.

    An example use case would be to redirect the user to a login route if a
    request is unauthorized:

    ```app/routes/application.js
    import Route from '@ember/routing/route';
    import DS from 'ember-data';

    const { UnauthorizedError } = DS;

    export default Route.extend({
      actions: {
        error(error, transition) {
          if (error instanceof UnauthorizedError) {
            // go to the sign in route
            this.transitionTo('login');
            return;
          }

          // ...other error handling logic
        }
      }
    });
    ```

    @class UnauthorizedError
    @namespace DS
  */

  var UnauthorizedError = extend(AdapterError, 'The adapter operation is unauthorized');
  /**
    A `DS.ForbiddenError` equates to a HTTP `403 Forbidden` response status.
    It is used by an adapter to signal that a request to the external API was
    valid but the server is refusing to respond to it. If authorization was
    provided and is valid, then the authenticated user does not have the
    necessary permissions for the request.

    @class ForbiddenError
    @namespace DS
  */

  var ForbiddenError = extend(AdapterError, 'The adapter operation is forbidden');
  /**
    A `DS.NotFoundError` equates to a HTTP `404 Not Found` response status.
    It is used by an adapter to signal that a request to the external API
    was rejected because the resource could not be found on the API.

    An example use case would be to detect if the user has entered a route
    for a specific model that does not exist. For example:

    ```app/routes/post.js
    import Route from '@ember/routing/route';
    import DS from 'ember-data';

    const { NotFoundError } = DS;

    export default Route.extend({
      model(params) {
        return this.get('store').findRecord('post', params.post_id);
      },

      actions: {
        error(error, transition) {
          if (error instanceof NotFoundError) {
            // redirect to a list of all posts instead
            this.transitionTo('posts');
          } else {
            // otherwise let the error bubble
            return true;
          }
        }
      }
    });
    ```

    @class NotFoundError
    @namespace DS
  */

  var NotFoundError = extend(AdapterError, 'The adapter could not find the resource');
  /**
    A `DS.ConflictError` equates to a HTTP `409 Conflict` response status.
    It is used by an adapter to indicate that the request could not be processed
    because of a conflict in the request. An example scenario would be when
    creating a record with a client-generated ID but that ID is already known
    to the external API.

    @class ConflictError
    @namespace DS
  */

  var ConflictError = extend(AdapterError, 'The adapter operation failed due to a conflict');
  /**
    A `DS.ServerError` equates to a HTTP `500 Internal Server Error` response
    status. It is used by the adapter to indicate that a request has failed
    because of an error in the external API.

    @class ServerError
    @namespace DS
  */

  var ServerError = extend(AdapterError, 'The adapter operation failed due to a server error');
  /**
    Convert an hash of errors into an array with errors in JSON-API format.

    ```javascript
    import DS from 'ember-data';

    const { errorsHashToArray } = DS;

    let errors = {
      base: 'Invalid attributes on saving this record',
      name: 'Must be present',
      age: ['Must be present', 'Must be a number']
    };

    let errorsArray = errorsHashToArray(errors);
    // [
    //   {
    //     title: "Invalid Document",
    //     detail: "Invalid attributes on saving this record",
    //     source: { pointer: "/data" }
    //   },
    //   {
    //     title: "Invalid Attribute",
    //     detail: "Must be present",
    //     source: { pointer: "/data/attributes/name" }
    //   },
    //   {
    //     title: "Invalid Attribute",
    //     detail: "Must be present",
    //     source: { pointer: "/data/attributes/age" }
    //   },
    //   {
    //     title: "Invalid Attribute",
    //     detail: "Must be a number",
    //     source: { pointer: "/data/attributes/age" }
    //   }
    // ]
    ```

    @method errorsHashToArray
    @public
    @namespace
    @for DS
    @param {Object} errors hash with errors as properties
    @return {Array} array of errors in JSON-API format
  */

  function errorsHashToArray(errors) {
    var out = [];

    if (Ember.isPresent(errors)) {
      Object.keys(errors).forEach(key => {
        var messages = Ember.makeArray(errors[key]);

        for (var i = 0; i < messages.length; i++) {
          var title = 'Invalid Attribute';
          var pointer = `/data/attributes/${key}`;

          if (key === PRIMARY_ATTRIBUTE_KEY) {
            title = 'Invalid Document';
            pointer = `/data`;
          }

          out.push({
            title: title,
            detail: messages[i],
            source: {
              pointer: pointer
            }
          });
        }
      });
    }

    return out;
  }
  /**
    Convert an array of errors in JSON-API format into an object.

    ```javascript
    import DS from 'ember-data';

    const { errorsArrayToHash } = DS;

    let errorsArray = [
      {
        title: 'Invalid Attribute',
        detail: 'Must be present',
        source: { pointer: '/data/attributes/name' }
      },
      {
        title: 'Invalid Attribute',
        detail: 'Must be present',
        source: { pointer: '/data/attributes/age' }
      },
      {
        title: 'Invalid Attribute',
        detail: 'Must be a number',
        source: { pointer: '/data/attributes/age' }
      }
    ];

    let errors = errorsArrayToHash(errorsArray);
    // {
    //   "name": ["Must be present"],
    //   "age":  ["Must be present", "must be a number"]
    // }
    ```

    @method errorsArrayToHash
    @public
    @namespace
    @for DS
    @param {Array} errors array of errors in JSON-API format
    @return {Object}
  */

  function errorsArrayToHash(errors) {
    var out = {};

    if (Ember.isPresent(errors)) {
      errors.forEach(error => {
        if (error.source && error.source.pointer) {
          var key = error.source.pointer.match(SOURCE_POINTER_REGEXP);

          if (key) {
            key = key[2];
          } else if (error.source.pointer.search(SOURCE_POINTER_PRIMARY_REGEXP) !== -1) {
            key = PRIMARY_ATTRIBUTE_KEY;
          }

          if (key) {
            out[key] = out[key] || [];
            out[key].push(error.detail || error.title);
          }
        }
      });
    }

    return out;
  }

  /**
   `InternalModelMap` is a custom storage map for internalModels of a given modelName
   used by `IdentityMap`.

   It was extracted from an implicit pojo based "internalModel map" and preserves
   that interface while we work towards a more official API.

   @class InternalModelMap
   @private
   */

  class InternalModelMap {
    constructor(modelName) {
      this.modelName = modelName;
      this._idToModel = Object.create(null);
      this._models = [];
      this._metadata = null;
    }
    /**
     * @method get
     * @param id {String}
     * @return {InternalModel}
     */


    get(id) {
      return this._idToModel[id];
    }

    has(id) {
      return !!this._idToModel[id];
    }

    get length() {
      return this._models.length;
    }

    set(id, internalModel) {
      (true && !(id) && Ember.assert(`You cannot index an internalModel by an empty id'`, id));
      (true && !(internalModel instanceof InternalModel) && Ember.assert(`You cannot set an index for an internalModel to something other than an internalModel`, internalModel instanceof InternalModel));
      (true && !(this.contains(internalModel)) && Ember.assert(`You cannot set an index for an internalModel that is not in the InternalModelMap`, this.contains(internalModel)));
      (true && !(!this.has(id) || this.get(id) === internalModel) && Ember.assert(`You cannot update the id index of an InternalModel once set. Attempted to update ${id}.`, !this.has(id) || this.get(id) === internalModel));
      this._idToModel[id] = internalModel;
    }

    add(internalModel, id) {
      (true && !(!this.contains(internalModel)) && Ember.assert(`You cannot re-add an already present InternalModel to the InternalModelMap.`, !this.contains(internalModel)));

      if (id) {
        (true && !(!this.has(id) || this.get(id) === internalModel) && Ember.assert(`Duplicate InternalModel for ${this.modelName}:${id} detected.`, !this.has(id) || this.get(id) === internalModel));
        this._idToModel[id] = internalModel;
      }

      this._models.push(internalModel);
    }

    remove(internalModel, id) {
      delete this._idToModel[id];

      var loc = this._models.indexOf(internalModel);

      if (loc !== -1) {
        this._models.splice(loc, 1);
      }
    }

    contains(internalModel) {
      return this._models.indexOf(internalModel) !== -1;
    }
    /**
     An array of all models of this modelName
     @property models
     @type Array
     */


    get models() {
      return this._models;
    }
    /**
     * meta information about internalModels
     * @property metadata
     * @type Object
     */


    get metadata() {
      return this._metadata || (this._metadata = Object.create(null));
    }
    /**
     deprecated (and unsupported) way of accessing modelClass
      @property type
     @deprecated
     */


    get type() {
      throw new Error('InternalModelMap.type is no longer available');
    }
    /**
     Destroy all models in the internalModelTest and wipe metadata.
      @method clear
     */


    clear() {
      var models = this._models;
      this._models = [];

      for (var i = 0; i < models.length; i++) {
        var model = models[i];
        model.unloadRecord();
      }

      this._metadata = null;
    }

  }

  /**
   `IdentityMap` is a custom storage map for records by modelName
   used by `DS.Store`.

   @class IdentityMap
   @private
   */

  class IdentityMap {
    constructor() {
      this._map = Object.create(null);
    }
    /**
     Retrieves the `InternalModelMap` for a given modelName,
     creating one if one did not already exist. This is
     similar to `getWithDefault` or `get` on a `MapWithDefault`
      @method retrieve
     @param modelName a previously normalized modelName
     @return {InternalModelMap} the InternalModelMap for the given modelName
     */


    retrieve(modelName) {
      var map = this._map[modelName];

      if (map === undefined) {
        map = this._map[modelName] = new InternalModelMap(modelName);
      }

      return map;
    }
    /**
     Clears the contents of all known `RecordMaps`, but does
     not remove the InternalModelMap instances.
      @method clear
     */


    clear() {
      var map = this._map;
      var keys = Object.keys(map);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        map[key].clear();
      }
    }

  }

  class RecordDataWrapper {
    constructor(store) {
      this.store = store;
      this._willUpdateManyArrays = false;
      this._pendingManyArrayUpdates = null;
    }

    _scheduleManyArrayUpdate(modelName, id, clientId, key) {
      var pending = this._pendingManyArrayUpdates = this._pendingManyArrayUpdates || [];
      pending.push(modelName, id, clientId, key);

      if (this._willUpdateManyArrays === true) {
        return;
      }

      this._willUpdateManyArrays = true;
      var backburner = this.store._backburner;
      backburner.join(() => {
        backburner.schedule('syncRelationships', this, this._flushPendingManyArrayUpdates);
      });
    }

    _flushPendingManyArrayUpdates() {
      if (this._willUpdateManyArrays === false) {
        return;
      }

      var pending = this._pendingManyArrayUpdates;
      this._pendingManyArrayUpdates = [];
      this._willUpdateManyArrays = false;
      var store = this.store;

      for (var i = 0; i < pending.length; i += 4) {
        var modelName = pending[i];
        var id = pending[i + 1];
        var clientId = pending[i + 2];
        var key = pending[i + 3];

        var internalModel = store._getInternalModelForId(modelName, id, clientId);

        internalModel.notifyHasManyChange(key);
      }
    }

    attributesDefinitionFor(modelName) {
      return this.store._attributesDefinitionFor(modelName);
    }

    relationshipsDefinitionFor(modelName) {
      return this.store._relationshipsDefinitionFor(modelName);
    }

    inverseForRelationship(modelName, key) {
      var modelClass = this.store.modelFor(modelName);
      return this.relationshipsDefinitionFor(modelName)[key]._inverseKey(this.store, modelClass);
    } // TODO Igor David cleanup


    inverseIsAsyncForRelationship(modelName, key) {
      var modelClass = this.store.modelFor(modelName);
      return this.relationshipsDefinitionFor(modelName)[key]._inverseIsAsync(this.store, modelClass);
    }

    notifyPropertyChange(modelName, id, clientId, key) {
      var internalModel = this.store._getInternalModelForId(modelName, id, clientId);

      internalModel.notifyPropertyChange(key);
    }

    notifyHasManyChange(modelName, id, clientId, key) {
      this._scheduleManyArrayUpdate(modelName, id, clientId, key);
    }

    notifyBelongsToChange(modelName, id, clientId, key) {
      var internalModel = this.store._getInternalModelForId(modelName, id, clientId);

      internalModel.notifyBelongsToChange(key);
    }

    recordDataFor(modelName, id, clientId) {
      return this.store.recordDataFor(modelName, id, clientId);
    }

    setRecordId(modelName, id, clientId) {
      this.store.setRecordId(modelName, id, clientId);
    }

    isRecordInUse(modelName, id, clientId) {
      var internalModel = this.store._getInternalModelForId(modelName, id, clientId);

      if (!internalModel) {
        return false;
      }

      return internalModel.isRecordInUse();
    }

    disconnectRecord(modelName, id, clientId) {
      var internalModel = this.store._getInternalModelForId(modelName, id, clientId);

      if (internalModel) {
        internalModel.destroyFromRecordData();
      }
    }

  }

  /*
    This is a helper method that validates a JSON API top-level document

    The format of a document is described here:
    http://jsonapi.org/format/#document-top-level

    @method validateDocumentStructure
    @param {Object} doc JSON API document
    @return {array} An array of errors found in the document structure
  */
  function validateDocumentStructure(doc) {
    var errors = [];

    if (!doc || typeof doc !== 'object') {
      errors.push('Top level of a JSON API document must be an object');
    } else {
      if (!('data' in doc) && !('errors' in doc) && !('meta' in doc)) {
        errors.push('One or more of the following keys must be present: "data", "errors", "meta".');
      } else {
        if ('data' in doc && 'errors' in doc) {
          errors.push('Top level keys "errors" and "data" cannot both be present in a JSON API document');
        }
      }

      if ('data' in doc) {
        if (!(doc.data === null || Array.isArray(doc.data) || typeof doc.data === 'object')) {
          errors.push('data must be null, an object, or an array');
        }
      }

      if ('meta' in doc) {
        if (typeof doc.meta !== 'object') {
          errors.push('meta must be an object');
        }
      }

      if ('errors' in doc) {
        if (!Array.isArray(doc.errors)) {
          errors.push('errors must be an array');
        }
      }

      if ('links' in doc) {
        if (typeof doc.links !== 'object') {
          errors.push('links must be an object');
        }
      }

      if ('jsonapi' in doc) {
        if (typeof doc.jsonapi !== 'object') {
          errors.push('jsonapi must be an object');
        }
      }

      if ('included' in doc) {
        if (typeof doc.included !== 'object') {
          errors.push('included must be an array');
        }
      }
    }

    return errors;
  }
  /*
    This is a helper method that always returns a JSON-API Document.

    @method normalizeResponseHelper
    @param {DS.Serializer} serializer
    @param {DS.Store} store
    @param {subclass of DS.Model} modelClass
    @param {Object} payload
    @param {String|Number} id
    @param {String} requestType
    @return {Object} JSON-API Document
  */

  function normalizeResponseHelper(serializer, store, modelClass, payload, id, requestType) {
    var normalizedResponse = serializer.normalizeResponse(store, modelClass, payload, id, requestType);
    var validationErrors = [];

    {
      validationErrors = validateDocumentStructure(normalizedResponse);
    }

    (true && !(validationErrors.length === 0) && Ember.assert(`normalizeResponse must return a valid JSON API document:\n\t* ${validationErrors.join('\n\t* ')}`, validationErrors.length === 0));
    return normalizedResponse;
  }

  function serializerForAdapter(store, adapter, modelName) {
    var serializer = adapter.serializer;

    if (serializer === undefined) {
      serializer = store.serializerFor(modelName);
    }

    if (serializer === null || serializer === undefined) {
      serializer = {
        extract(store, type, payload) {
          return payload;
        }

      };
    }

    return serializer;
  }

  function payloadIsNotBlank(adapterPayload) {
    if (Array.isArray(adapterPayload)) {
      return true;
    } else {
      return Object.keys(adapterPayload || {}).length;
    }
  }

  function _find(adapter, store, modelClass, id, internalModel, options) {
    var snapshot = internalModel.createSnapshot(options);
    var {
      modelName
    } = internalModel;
    var promise = Ember.RSVP.Promise.resolve().then(() => {
      return adapter.findRecord(store, modelClass, id, snapshot);
    });
    var label = `DS: Handle Adapter#findRecord of '${modelName}' with id: '${id}'`;
    promise = guardDestroyedStore(promise, store, label);
    return promise.then(adapterPayload => {
      (true && !(payloadIsNotBlank(adapterPayload)) && Ember.assert(`You made a 'findRecord' request for a '${modelName}' with id '${id}', but the adapter's response did not have any data`, payloadIsNotBlank(adapterPayload)));
      var serializer = serializerForAdapter(store, adapter, modelName);
      var payload = normalizeResponseHelper(serializer, store, modelClass, adapterPayload, id, 'findRecord');
      (true && !(!Array.isArray(payload.data)) && Ember.assert(`Ember Data expected the primary data returned from a 'findRecord' response to be an object but instead it found an array.`, !Array.isArray(payload.data)));
      (true && Ember.warn(`You requested a record of type '${modelName}' with id '${id}' but the adapter returned a payload with primary data having an id of '${payload.data.id}'. Use 'store.findRecord()' when the requested id is the same as the one returned by the adapter. In other cases use 'store.queryRecord()' instead https://emberjs.com/api/data/classes/DS.Store.html#method_queryRecord`, payload.data.id === id, {
        id: 'ds.store.findRecord.id-mismatch'
      }));
      return store._push(payload);
    }, error => {
      internalModel.notFound();

      if (internalModel.isEmpty()) {
        internalModel.unloadRecord();
      }

      throw error;
    }, `DS: Extract payload of '${modelName}'`);
  }
  function _findMany(adapter, store, modelName, ids, internalModels, optionsMap) {
    var snapshots = Ember.A(internalModels.map(internalModel => internalModel.createSnapshot(optionsMap.get(internalModel))));
    var modelClass = store.modelFor(modelName); // `adapter.findMany` gets the modelClass still

    var promise = adapter.findMany(store, modelClass, ids, snapshots);
    var label = `DS: Handle Adapter#findMany of '${modelName}'`;

    if (promise === undefined) {
      throw new Error('adapter.findMany returned undefined, this was very likely a mistake');
    }

    promise = guardDestroyedStore(promise, store, label);
    return promise.then(adapterPayload => {
      (true && !(payloadIsNotBlank(adapterPayload)) && Ember.assert(`You made a 'findMany' request for '${modelName}' records with ids '[${ids}]', but the adapter's response did not have any data`, payloadIsNotBlank(adapterPayload)));
      var serializer = serializerForAdapter(store, adapter, modelName);
      var payload = normalizeResponseHelper(serializer, store, modelClass, adapterPayload, null, 'findMany');
      return store._push(payload);
    }, null, `DS: Extract payload of ${modelName}`);
  }

  function iterateData(data, fn) {
    if (Array.isArray(data)) {
      return data.map(fn);
    } else {
      return fn(data);
    }
  } // sync
  // iterate over records in payload.data
  // for each record
  //   assert that record.relationships[inverse] is either undefined (so we can fix it)
  //     or provide a data: {id, type} that matches the record that requested it
  //   return the relationship data for the parent


  function syncRelationshipDataFromLink(store, payload, parentInternalModel, relationship) {
    // ensure the right hand side (incoming payload) points to the parent record that
    // requested this relationship
    var relationshipData = iterateData(payload.data, (data, index) => {
      var {
        id,
        type
      } = data;
      ensureRelationshipIsSetToParent(data, parentInternalModel, store, relationship, index);
      return {
        id,
        type
      };
    }); // now, push the left hand side (the parent record) to ensure things are in sync, since
    // the payload will be pushed with store._push

    store.push({
      data: {
        id: parentInternalModel.id,
        type: parentInternalModel.modelName,
        relationships: {
          [relationship.key]: {
            data: relationshipData
          }
        }
      }
    });
  }

  function ensureRelationshipIsSetToParent(payload, parentInternalModel, store, parentRelationship, index) {
    var {
      id,
      type
    } = payload;

    if (!payload.relationships) {
      payload.relationships = {};
    }

    var {
      relationships
    } = payload;
    var inverse = getInverse(store, parentInternalModel, parentRelationship, type);

    if (inverse) {
      var {
        inverseKey,
        kind
      } = inverse;
      var relationshipData = relationships[inverseKey] && relationships[inverseKey].data;

      if (true
      /* DEBUG */
      && typeof relationshipData !== 'undefined' && !relationshipDataPointsToParent(relationshipData, parentInternalModel)) {
        var quotedType = Ember.inspect(type);
        var quotedInverse = Ember.inspect(inverseKey);
        var expected = Ember.inspect({
          id: parentInternalModel.id,
          type: parentInternalModel.modelName
        });
        var expectedModel = Ember.inspect(parentInternalModel);
        var got = Ember.inspect(relationshipData);
        var prefix = typeof index === 'number' ? `data[${index}]` : `data`;
        var path = `${prefix}.relationships.${inverse}.data`;
        var other = relationshipData ? `<${relationshipData.type}:${relationshipData.id}>` : null;
        var relationshipFetched = `${Ember.inspect(parentInternalModel)}.${parentRelationship.kind}("${parentRelationship.name}")`;
        var includedRecord = `<${type}:${id}>`;
        var message = [`Encountered mismatched relationship: Ember Data expected ${path} in the payload from ${relationshipFetched} to include ${expected} but got ${got} instead.\n`, `The ${includedRecord} record loaded at ${prefix} in the payload specified ${other} as its ${quotedInverse}, but should have specified ${expectedModel} (the record the relationship is being loaded from) as its ${quotedInverse} instead.`, `This could mean that the response for ${relationshipFetched} may have accidentally returned ${quotedType} records that aren't related to ${expectedModel} and could be related to a different ${parentInternalModel.modelName} record instead.`, `Ember Data has corrected the ${includedRecord} record's ${quotedInverse} relationship to ${expectedModel} so that ${relationshipFetched} will include ${includedRecord}.`, `Please update the response from the server or change your serializer to either ensure that the response for only includes ${quotedType} records that specify ${expectedModel} as their ${quotedInverse}, or omit the ${quotedInverse} relationship from the response.`].join('\n'); // this should eventually throw instead of deprecating.

        (true && !(false) && Ember.deprecate(message + '\n', false, {
          id: 'mismatched-inverse-relationship-data-from-payload',
          until: '3.8'
        }));
      }

      relationships[inverseKey] = relationships[inverseKey] || {};
      relationships[inverseKey].data = fixRelationshipData(relationshipData, kind, parentInternalModel);
    }
  }

  function getInverse(store, parentInternalModel, parentRelationship, type) {
    if (store.recordDataWrapper) {
      return recordDataFindInverseRelationshipInfo(store, parentInternalModel, parentRelationship, type);
    } else {
      return legacyFindInverseRelationshipInfo(store, parentInternalModel, parentRelationship);
    }
  }

  function recordDataFindInverseRelationshipInfo({
    recordDataWrapper
  }, parentInternalModel, parentRelationship, type) {
    var {
      name: lhs_relationshipName
    } = parentRelationship;
    var {
      modelName
    } = parentInternalModel;
    var inverseKey = recordDataWrapper.inverseForRelationship(modelName, lhs_relationshipName);

    if (inverseKey) {
      var {
        meta: {
          kind
        }
      } = recordDataWrapper.relationshipsDefinitionFor(type)[inverseKey];
      return {
        inverseKey,
        kind
      };
    }
  }

  function legacyFindInverseRelationshipInfo(store, parentInternalModel, parentRelationship) {
    var {
      name: lhs_relationshipName
    } = parentRelationship;
    var {
      modelName
    } = parentInternalModel;

    var relationshipInfo = store._relationshipsPayloads.getRelationshipInfo(modelName, lhs_relationshipName);

    var {
      hasInverse,
      rhs_relationshipName: inverseKey,
      rhs_relationshipMeta
    } = relationshipInfo;

    if (hasInverse) {
      var {
        meta: {
          kind
        }
      } = rhs_relationshipMeta;
      return {
        inverseKey,
        kind
      };
    }
  }

  function relationshipDataPointsToParent(relationshipData, internalModel) {
    if (relationshipData === null) {
      return false;
    }

    if (Array.isArray(relationshipData)) {
      if (relationshipData.length === 0) {
        return false;
      }

      for (var i = 0; i < relationshipData.length; i++) {
        var entry = relationshipData[i];

        if (validateRelationshipEntry(entry, internalModel)) {
          return true;
        }
      }
    } else {
      return validateRelationshipEntry(relationshipData, internalModel);
    }

    return false;
  }

  function fixRelationshipData(relationshipData, relationshipKind, {
    id,
    modelName
  }) {
    var parentRelationshipData = {
      id,
      type: modelName
    };
    var payload;

    if (relationshipKind === 'hasMany') {
      payload = relationshipData || [];
      payload.push(parentRelationshipData);
    } else {
      payload = relationshipData || {};
      Ember.merge(payload, parentRelationshipData);
    }

    return payload;
  }

  function validateRelationshipEntry({
    id
  }, {
    id: parentModelID
  }) {
    return id && id.toString() === parentModelID;
  }

  function _findHasMany(adapter, store, internalModel, link, relationship, options) {
    var snapshot = internalModel.createSnapshot(options);
    var modelClass = store.modelFor(relationship.type);
    var promise = adapter.findHasMany(store, snapshot, link, relationship);
    var label = `DS: Handle Adapter#findHasMany of '${internalModel.modelName}' : '${relationship.type}'`;
    promise = guardDestroyedStore(promise, store, label);
    promise = _guard(promise, _bind(_objectIsAlive, internalModel));
    return promise.then(adapterPayload => {
      (true && !(payloadIsNotBlank(adapterPayload)) && Ember.assert(`You made a 'findHasMany' request for a ${internalModel.modelName}'s '${relationship.key}' relationship, using link '${link}' , but the adapter's response did not have any data`, payloadIsNotBlank(adapterPayload)));
      var serializer = serializerForAdapter(store, adapter, relationship.type);
      var payload = normalizeResponseHelper(serializer, store, modelClass, adapterPayload, null, 'findHasMany');
      syncRelationshipDataFromLink(store, payload, internalModel, relationship);

      var internalModelArray = store._push(payload);

      internalModelArray.meta = payload.meta;
      return internalModelArray;
    }, null, `DS: Extract payload of '${internalModel.modelName}' : hasMany '${relationship.type}'`);
  }
  function _findBelongsTo(adapter, store, internalModel, link, relationship, options) {
    var snapshot = internalModel.createSnapshot(options);
    var modelClass = store.modelFor(relationship.type);
    var promise = adapter.findBelongsTo(store, snapshot, link, relationship);
    var label = `DS: Handle Adapter#findBelongsTo of ${internalModel.modelName} : ${relationship.type}`;
    promise = guardDestroyedStore(promise, store, label);
    promise = _guard(promise, _bind(_objectIsAlive, internalModel));
    return promise.then(adapterPayload => {
      var serializer = serializerForAdapter(store, adapter, relationship.type);
      var payload = normalizeResponseHelper(serializer, store, modelClass, adapterPayload, null, 'findBelongsTo');

      if (!payload.data) {
        return null;
      }

      syncRelationshipDataFromLink(store, payload, internalModel, relationship);
      return store._push(payload);
    }, null, `DS: Extract payload of ${internalModel.modelName} : ${relationship.type}`);
  }
  function _findAll(adapter, store, modelName, sinceToken, options) {
    var modelClass = store.modelFor(modelName); // adapter.findAll depends on the class

    var recordArray = store.peekAll(modelName);

    var snapshotArray = recordArray._createSnapshot(options);

    var promise = Ember.RSVP.Promise.resolve().then(() => adapter.findAll(store, modelClass, sinceToken, snapshotArray));
    var label = 'DS: Handle Adapter#findAll of ' + modelClass;
    promise = guardDestroyedStore(promise, store, label);
    return promise.then(adapterPayload => {
      (true && !(payloadIsNotBlank(adapterPayload)) && Ember.assert(`You made a 'findAll' request for '${modelName}' records, but the adapter's response did not have any data`, payloadIsNotBlank(adapterPayload)));
      var serializer = serializerForAdapter(store, adapter, modelName);
      var payload = normalizeResponseHelper(serializer, store, modelClass, adapterPayload, null, 'findAll');

      store._push(payload);

      store._didUpdateAll(modelName);

      return recordArray;
    }, null, 'DS: Extract payload of findAll ${modelName}');
  }
  function _query(adapter, store, modelName, query, recordArray, options) {
    var modelClass = store.modelFor(modelName); // adapter.query needs the class

    var promise;
    var createRecordArray = adapter.query.length > 3 || adapter.query.wrappedFunction && adapter.query.wrappedFunction.length > 3;

    if (createRecordArray) {
      recordArray = recordArray || store.recordArrayManager.createAdapterPopulatedRecordArray(modelName, query);
      promise = Ember.RSVP.Promise.resolve().then(() => adapter.query(store, modelClass, query, recordArray, options));
    } else {
      promise = Ember.RSVP.Promise.resolve().then(() => adapter.query(store, modelClass, query));
    }

    var label = `DS: Handle Adapter#query of ${modelName}`;
    promise = guardDestroyedStore(promise, store, label);
    return promise.then(adapterPayload => {
      var serializer = serializerForAdapter(store, adapter, modelName);
      var payload = normalizeResponseHelper(serializer, store, modelClass, adapterPayload, null, 'query');

      var internalModels = store._push(payload);

      (true && !(Array.isArray(internalModels)) && Ember.assert('The response to store.query is expected to be an array but it was a single record. Please wrap your response in an array or use `store.queryRecord` to query for a single record.', Array.isArray(internalModels)));

      if (recordArray) {
        recordArray._setInternalModels(internalModels, payload);
      } else {
        recordArray = store.recordArrayManager.createAdapterPopulatedRecordArray(modelName, query, internalModels, payload);
      }

      return recordArray;
    }, null, `DS: Extract payload of query ${modelName}`);
  }
  function _queryRecord(adapter, store, modelName, query, options) {
    var modelClass = store.modelFor(modelName); // adapter.queryRecord needs the class

    var promise = Ember.RSVP.Promise.resolve().then(() => adapter.queryRecord(store, modelClass, query, options));
    var label = `DS: Handle Adapter#queryRecord of ${modelName}`;
    promise = guardDestroyedStore(promise, store, label);
    return promise.then(adapterPayload => {
      var serializer = serializerForAdapter(store, adapter, modelName);
      var payload = normalizeResponseHelper(serializer, store, modelClass, adapterPayload, null, 'queryRecord');
      (true && !(!Array.isArray(payload.data)) && Ember.assert(`Expected the primary data returned by the serializer for a 'queryRecord' response to be a single object or null but instead it was an array.`, !Array.isArray(payload.data), {
        id: 'ds.store.queryRecord-array-response'
      }));
      return store._push(payload);
    }, null, `DS: Extract payload of queryRecord ${modelName}`);
  }

  // Used by the store to normalize IDs entering the store.  Despite the fact
  // that developers may provide IDs as numbers (e.g., `store.findRecord('person', 1)`),
  // it is important that internally we use strings, since IDs may be serialized
  // and lose type information.  For example, Ember's router may put a record's
  // ID into the URL, and if we later try to deserialize that URL and find the
  // corresponding record, we will not know if it is a string or a number.
  function coerceId(id) {
    if (id === null || id === undefined || id === '') {
      return null;
    }

    if (typeof id === 'string') {
      return id;
    }

    return '' + id;
  }

  function cloneNull(source) {
    var clone = Object.create(null);

    for (var key in source) {
      clone[key] = source[key];
    }

    return clone;
  }

  /**
    @module ember-data
  */

  /**
    @class SnapshotRecordArray
    @namespace DS
    @private
    @constructor
    @param {Array} snapshots An array of snapshots
    @param {Object} meta
  */
  class SnapshotRecordArray {
    constructor(recordArray, meta, options = {}) {
      /**
        An array of snapshots
        @private
        @property _snapshots
        @type {Array}
      */
      this._snapshots = null;
      /**
        An array of records
        @private
        @property _recordArray
        @type {Array}
      */

      this._recordArray = recordArray;
      /**
        Number of records in the array
         Example
         ```app/adapters/post.js
        import DS from 'ember-data'
         export default DS.JSONAPIAdapter.extend({
          shouldReloadAll(store, snapshotRecordArray) {
            return !snapshotRecordArray.length;
          },
        });
        ```
         @property length
        @type {Number}
      */

      this.length = recordArray.get('length');
      this._type = null;
      /**
        Meta objects for the record array.
         Example
         ```app/adapters/post.js
        import DS from 'ember-data'
         export default DS.JSONAPIAdapter.extend({
          shouldReloadAll(store, snapshotRecordArray) {
            var lastRequestTime = snapshotRecordArray.meta.lastRequestTime;
            var twentyMinutes = 20 * 60 * 1000;
            return Date.now() > lastRequestTime + twentyMinutes;
          },
        });
        ```
         @property meta
        @type {Object}
      */

      this.meta = meta;
      /**
        A hash of adapter options passed into the store method for this request.
         Example
         ```app/adapters/post.js
        import MyCustomAdapter from './custom-adapter';
         export default MyCustomAdapter.extend({
          findAll(store, type, sinceToken, snapshotRecordArray) {
            if (snapshotRecordArray.adapterOptions.subscribe) {
              // ...
            }
            // ...
          }
        });
        ```
         @property adapterOptions
        @type {Object}
      */

      this.adapterOptions = options.adapterOptions;
      /**
        The relationships to include for this request.
         Example
         ```app/adapters/application.js
        import DS from 'ember-data';
         export default DS.Adapter.extend({
          findAll(store, type, snapshotRecordArray) {
            var url = `/${type.modelName}?include=${encodeURIComponent(snapshotRecordArray.include)}`;
             return fetch(url).then((response) => response.json())
          }
        });
         @property include
        @type {String|Array}
      */

      this.include = options.include;
    }
    /**
      The type of the underlying records for the snapshots in the array, as a DS.Model
      @property type
      @type {DS.Model}
    */


    get type() {
      return this._type || (this._type = this._recordArray.get('type'));
    }
    /**
      Get snapshots of the underlying record array
       Example
       ```app/adapters/post.js
      import DS from 'ember-data'
       export default DS.JSONAPIAdapter.extend({
        shouldReloadAll(store, snapshotArray) {
          var snapshots = snapshotArray.snapshots();
           return snapshots.any(function(ticketSnapshot) {
            var timeDiff = moment().diff(ticketSnapshot.attr('lastAccessedAt'), 'minutes');
            if (timeDiff > 20) {
              return true;
            } else {
              return false;
            }
          });
        }
      });
      ```
       @method snapshots
      @return {Array} Array of snapshots
    */


    snapshots() {
      if (this._snapshots !== null) {
        return this._snapshots;
      }

      this._snapshots = this._recordArray._takeSnapshot();
      return this._snapshots;
    }

  }

  /**
    @module ember-data
  */
  /**
    A record array is an array that contains records of a certain modelName. The record
    array materializes records as needed when they are retrieved for the first
    time. You should not create record arrays yourself. Instead, an instance of
    `DS.RecordArray` or its subclasses will be returned by your application's store
    in response to queries.

    @class RecordArray
    @namespace DS
    @extends Ember.ArrayProxy
    @uses Ember.Evented
  */

  var RecordArray = Ember.ArrayProxy.extend(Ember.Evented, {
    init() {
      this._super(...arguments);
      /**
        The array of client ids backing the record array. When a
        record is requested from the record array, the record
        for the client id at the same index is materialized, if
        necessary, by the store.
         @property content
        @private
        @type Ember.Array
        */


      this.set('content', this.content || null);
      /**
      The flag to signal a `RecordArray` is finished loading data.
       Example
       ```javascript
      var people = store.peekAll('person');
      people.get('isLoaded'); // true
      ```
       @property isLoaded
      @type Boolean
      */

      this.isLoaded = this.isLoaded || false;
      /**
      The flag to signal a `RecordArray` is currently loading data.
       Example
       ```javascript
      var people = store.peekAll('person');
      people.get('isUpdating'); // false
      people.update();
      people.get('isUpdating'); // true
      ```
       @property isUpdating
      @type Boolean
      */

      this.isUpdating = false;
      /**
      The store that created this record array.
       @property store
      @private
      @type DS.Store
      */

      this.store = this.store || null;
      this._updatingPromise = null;
    },

    replace() {
      throw new Error(`The result of a server query (for all ${this.modelName} types) is immutable. To modify contents, use toArray()`);
    },

    /**
     The modelClass represented by this record array.
      @property type
     @type DS.Model
     */
    type: Ember.computed('modelName', function () {
      if (!this.modelName) {
        return null;
      }

      return this.store.modelFor(this.modelName);
    }).readOnly(),

    /**
      Retrieves an object from the content by index.
       @method objectAtContent
      @private
      @param {Number} index
      @return {DS.Model} record
    */
    objectAtContent(index) {
      var internalModel = Ember.get(this, 'content').objectAt(index);
      return internalModel && internalModel.getRecord();
    },

    /**
      Used to get the latest version of all of the records in this array
      from the adapter.
       Example
       ```javascript
      var people = store.peekAll('person');
      people.get('isUpdating'); // false
       people.update().then(function() {
        people.get('isUpdating'); // false
      });
       people.get('isUpdating'); // true
      ```
       @method update
    */
    update() {
      if (Ember.get(this, 'isUpdating')) {
        return this._updatingPromise;
      }

      this.set('isUpdating', true);

      var updatingPromise = this._update().finally(() => {
        this._updatingPromise = null;

        if (this.get('isDestroying') || this.get('isDestroyed')) {
          return;
        }

        this.set('isUpdating', false);
      });

      this._updatingPromise = updatingPromise;
      return updatingPromise;
    },

    /*
      Update this RecordArray and return a promise which resolves once the update
      is finished.
     */
    _update() {
      return this.store.findAll(this.modelName, {
        reload: true
      });
    },

    /**
      Adds an internal model to the `RecordArray` without duplicates
       @method _pushInternalModels
      @private
      @param {InternalModel} internalModel
    */
    _pushInternalModels(internalModels) {
      // pushObjects because the internalModels._recordArrays set was already
      // consulted for inclusion, so addObject and its on .contains call is not
      // required.
      Ember.get(this, 'content').pushObjects(internalModels);
    },

    /**
      Removes an internalModel to the `RecordArray`.
       @method removeInternalModel
      @private
      @param {InternalModel} internalModel
    */
    _removeInternalModels(internalModels) {
      Ember.get(this, 'content').removeObjects(internalModels);
    },

    /**
      Saves all of the records in the `RecordArray`.
       Example
       ```javascript
      var messages = store.peekAll('message');
      messages.forEach(function(message) {
        message.set('hasBeenSeen', true);
      });
      messages.save();
      ```
       @method save
      @return {DS.PromiseArray} promise
    */
    save() {
      var promiseLabel = `DS: RecordArray#save ${this.modelName}`;
      var promise = Ember.RSVP.Promise.all(this.invoke('save'), promiseLabel).then(() => this, null, 'DS: RecordArray#save return RecordArray');
      return PromiseArray.create({
        promise
      });
    },

    _dissociateFromOwnRecords() {
      this.get('content').forEach(internalModel => {
        var recordArrays = internalModel.__recordArrays;

        if (recordArrays) {
          recordArrays.delete(this);
        }
      });
    },

    /**
      @method _unregisterFromManager
      @private
    */
    _unregisterFromManager() {
      this.manager.unregisterRecordArray(this);
    },

    willDestroy() {
      this._unregisterFromManager();

      this._dissociateFromOwnRecords(); // TODO: we should not do work during destroy:
      //   * when objects are destroyed, they should simply be left to do
      //   * if logic errors do to this, that logic needs to be more careful during
      //    teardown (ember provides isDestroying/isDestroyed) for this reason
      //   * the exception being: if an dominator has a reference to this object,
      //     and must be informed to release e.g. e.g. removing itself from th
      //     recordArrayMananger


      Ember.set(this, 'content', null);
      Ember.set(this, 'length', 0);

      this._super(...arguments);
    },

    /*
      @method _createSnapshot
      @private
    */
    _createSnapshot(options) {
      // this is private for users, but public for ember-data internals
      return new SnapshotRecordArray(this, this.get('meta'), options);
    },

    /*
      @method _takeSnapshot
      @private
    */
    _takeSnapshot() {
      return Ember.get(this, 'content').map(internalModel => internalModel.createSnapshot());
    }

  });

  /**
    Represents an ordered list of records whose order and membership is
    determined by the adapter. For example, a query sent to the adapter
    may trigger a search on the server, whose results would be loaded
    into an instance of the `AdapterPopulatedRecordArray`.

    ---

    If you want to update the array and get the latest records from the
    adapter, you can invoke [`update()`](#method_update):

    Example

    ```javascript
    // GET /users?isAdmin=true
    store.query('user', { isAdmin: true }).then(function(admins) {

      admins.then(function() {
        console.log(admins.get("length")); // 42
      });

      // somewhere later in the app code, when new admins have been created
      // in the meantime
      //
      // GET /users?isAdmin=true
      admins.update().then(function() {
        admins.get('isUpdating'); // false
        console.log(admins.get("length")); // 123
      });

      admins.get('isUpdating'); // true
    }
    ```

    @class AdapterPopulatedRecordArray
    @namespace DS
    @extends DS.RecordArray
  */

  var AdapterPopulatedRecordArray = RecordArray.extend({
    init() {
      // yes we are touching `this` before super, but ArrayProxy has a bug that requires this.
      this.set('content', this.get('content') || Ember.A());

      this._super(...arguments);

      this.query = this.query || null;
      this.links = this.links || null;
    },

    replace() {
      throw new Error(`The result of a server query (on ${this.modelName}) is immutable.`);
    },

    _update() {
      var store = Ember.get(this, 'store');
      var query = Ember.get(this, 'query');
      return store._query(this.modelName, query, this);
    },

    /**
      @method _setInternalModels
      @param {Array} internalModels
      @param {Object} payload normalized payload
      @private
    */
    _setInternalModels(internalModels, payload) {
      // TODO: initial load should not cause change events at all, only
      // subsequent. This requires changing the public api of adapter.query, but
      // hopefully we can do that soon.
      this.get('content').setObjects(internalModels);
      this.setProperties({
        isLoaded: true,
        isUpdating: false,
        meta: cloneNull(payload.meta),
        links: cloneNull(payload.links)
      });

      this.manager._associateWithRecordArray(internalModels, this); // TODO: should triggering didLoad event be the last action of the runLoop?


      Ember.run.once(this, 'trigger', 'didLoad');
    }

  });

  /**
    @module ember-data
  */

  /**
    @module ember-data
  */
  var emberRun = Ember.run.backburner;

  /**
    @class RecordArrayManager
    @namespace DS
    @private
  */
  class RecordArrayManager {
    constructor(options) {
      this.store = options.store;
      this.isDestroying = false;
      this.isDestroyed = false;
      this._liveRecordArrays = Object.create(null);
      this._pending = Object.create(null);
      this._adapterPopulatedRecordArrays = [];
    }

    recordDidChange(internalModel) {
      // TODO: change name
      // TODO: track that it was also a change
      this.internalModelDidChange(internalModel);
    }

    recordWasLoaded(internalModel) {
      // TODO: change name
      // TODO: track that it was also that it was first loaded
      this.internalModelDidChange(internalModel);
    }

    internalModelDidChange(internalModel) {
      var modelName = internalModel.modelName;

      if (internalModel._pendingRecordArrayManagerFlush) {
        return;
      }

      internalModel._pendingRecordArrayManagerFlush = true;
      var pending = this._pending;
      var models = pending[modelName] = pending[modelName] || [];

      if (models.push(internalModel) !== 1) {
        return;
      }

      emberRun.schedule('actions', this, this._flush);
    }

    _flushPendingInternalModelsForModelName(modelName, internalModels) {
      var modelsToRemove = [];

      for (var j = 0; j < internalModels.length; j++) {
        var internalModel = internalModels[j]; // mark internalModels, so they can once again be processed by the
        // recordArrayManager

        internalModel._pendingRecordArrayManagerFlush = false; // build up a set of models to ensure we have purged correctly;

        if (internalModel.isHiddenFromRecordArrays()) {
          modelsToRemove.push(internalModel);
        }
      }

      var array = this._liveRecordArrays[modelName];

      if (array) {
        // TODO: skip if it only changed
        // process liveRecordArrays
        this.updateLiveRecordArray(array, internalModels);
      } // process adapterPopulatedRecordArrays


      if (modelsToRemove.length > 0) {
        removeFromAdapterPopulatedRecordArrays(modelsToRemove);
      }
    }

    _flush() {
      var pending = this._pending;
      this._pending = Object.create(null);

      for (var modelName in pending) {
        this._flushPendingInternalModelsForModelName(modelName, pending[modelName]);
      }
    }

    updateLiveRecordArray(array, internalModels) {
      return updateLiveRecordArray(array, internalModels);
    }

    _syncLiveRecordArray(array, modelName) {
      (true && !(typeof modelName === 'string') && Ember.assert(`recordArrayManger.syncLiveRecordArray expects modelName not modelClass as the second param`, typeof modelName === 'string'));
      var pending = this._pending[modelName];
      var hasPendingChanges = Array.isArray(pending);
      var hasNoPotentialDeletions = !hasPendingChanges || pending.length === 0;

      var map = this.store._internalModelsFor(modelName);

      var hasNoInsertionsOrRemovals = Ember.get(map, 'length') === Ember.get(array, 'length');
      /*
        Ideally the recordArrayManager has knowledge of the changes to be applied to
        liveRecordArrays, and is capable of strategically flushing those changes and applying
        small diffs if desired.  However, until we've refactored recordArrayManager, this dirty
        check prevents us from unnecessarily wiping out live record arrays returned by peekAll.
        */

      if (hasNoPotentialDeletions && hasNoInsertionsOrRemovals) {
        return;
      }

      if (hasPendingChanges) {
        this._flushPendingInternalModelsForModelName(modelName, pending);

        delete pending[modelName];
      }

      var internalModels = this._visibleInternalModelsByType(modelName);

      var modelsToAdd = [];

      for (var i = 0; i < internalModels.length; i++) {
        var internalModel = internalModels[i];
        var recordArrays = internalModel._recordArrays;

        if (recordArrays.has(array) === false) {
          recordArrays.add(array);
          modelsToAdd.push(internalModel);
        }
      }

      if (modelsToAdd.length) {
        array._pushInternalModels(modelsToAdd);
      }
    }

    _didUpdateAll(modelName) {
      var recordArray = this._liveRecordArrays[modelName];

      if (recordArray) {
        Ember.set(recordArray, 'isUpdating', false);
      }
    }
    /**
      Get the `DS.RecordArray` for a modelName, which contains all loaded records of
      given modelName.
       @method liveRecordArrayFor
      @param {String} modelName
      @return {DS.RecordArray}
    */


    liveRecordArrayFor(modelName) {
      (true && !(typeof modelName === 'string') && Ember.assert(`recordArrayManger.liveRecordArrayFor expects modelName not modelClass as the param`, typeof modelName === 'string'));
      var array = this._liveRecordArrays[modelName];

      if (array) {
        // if the array already exists, synchronize
        this._syncLiveRecordArray(array, modelName);
      } else {
        // if the array is being newly created merely create it with its initial
        // content already set. This prevents unneeded change events.
        var internalModels = this._visibleInternalModelsByType(modelName);

        array = this.createRecordArray(modelName, internalModels);
        this._liveRecordArrays[modelName] = array;
      }

      return array;
    }

    _visibleInternalModelsByType(modelName) {
      var all = this.store._internalModelsFor(modelName)._models;

      var visible = [];

      for (var i = 0; i < all.length; i++) {
        var model = all[i];

        if (model.isHiddenFromRecordArrays() === false) {
          visible.push(model);
        }
      }

      return visible;
    }
    /**
      Create a `DS.RecordArray` for a modelName.
       @method createRecordArray
      @param {String} modelName
      @param {Array} _content (optional|private)
      @return {DS.RecordArray}
    */


    createRecordArray(modelName, content) {
      (true && !(typeof modelName === 'string') && Ember.assert(`recordArrayManger.createRecordArray expects modelName not modelClass as the param`, typeof modelName === 'string'));
      var array = RecordArray.create({
        modelName,
        content: Ember.A(content || []),
        store: this.store,
        isLoaded: true,
        manager: this
      });

      if (Array.isArray(content)) {
        associateWithRecordArray(content, array);
      }

      return array;
    }
    /**
      Create a `DS.AdapterPopulatedRecordArray` for a modelName with given query.
       @method createAdapterPopulatedRecordArray
      @param {String} modelName
      @param {Object} query
      @return {DS.AdapterPopulatedRecordArray}
    */


    createAdapterPopulatedRecordArray(modelName, query, internalModels, payload) {
      (true && !(typeof modelName === 'string') && Ember.assert(`recordArrayManger.createAdapterPopulatedRecordArray expects modelName not modelClass as the first param, received ${modelName}`, typeof modelName === 'string'));
      var array;

      if (Array.isArray(internalModels)) {
        array = AdapterPopulatedRecordArray.create({
          modelName,
          query: query,
          content: Ember.A(internalModels),
          store: this.store,
          manager: this,
          isLoaded: true,
          isUpdating: false,
          meta: cloneNull(payload.meta),
          links: cloneNull(payload.links)
        });
        associateWithRecordArray(internalModels, array);
      } else {
        array = AdapterPopulatedRecordArray.create({
          modelName,
          query: query,
          content: Ember.A(),
          store: this.store,
          manager: this
        });
      }

      this._adapterPopulatedRecordArrays.push(array);

      return array;
    }
    /**
      Unregister a RecordArray.
      So manager will not update this array.
       @method unregisterRecordArray
      @param {DS.RecordArray} array
    */


    unregisterRecordArray(array) {
      var modelName = array.modelName; // remove from adapter populated record array

      var removedFromAdapterPopulated = remove(this._adapterPopulatedRecordArrays, array);

      if (!removedFromAdapterPopulated) {
        var liveRecordArrayForType = this._liveRecordArrays[modelName]; // unregister live record array

        if (liveRecordArrayForType) {
          if (array === liveRecordArrayForType) {
            delete this._liveRecordArrays[modelName];
          }
        }
      }
    }

    _associateWithRecordArray(internalModels, array) {
      associateWithRecordArray(internalModels, array);
    }

    willDestroy() {
      Object.keys(this._liveRecordArrays).forEach(modelName => this._liveRecordArrays[modelName].destroy());

      this._adapterPopulatedRecordArrays.forEach(destroy);

      this.isDestroyed = true;
    }

    destroy() {
      this.isDestroying = true;
      emberRun.schedule('actions', this, this.willDestroy);
    }

  }

  function destroy(entry) {
    entry.destroy();
  }

  function remove(array, item) {
    var index = array.indexOf(item);

    if (index !== -1) {
      array.splice(index, 1);
      return true;
    }

    return false;
  }

  function updateLiveRecordArray(array, internalModels) {
    var modelsToAdd = [];
    var modelsToRemove = [];

    for (var i = 0; i < internalModels.length; i++) {
      var internalModel = internalModels[i];
      var isDeleted = internalModel.isHiddenFromRecordArrays();
      var recordArrays = internalModel._recordArrays;

      if (!isDeleted && !internalModel.isEmpty()) {
        if (!recordArrays.has(array)) {
          modelsToAdd.push(internalModel);
          recordArrays.add(array);
        }
      }

      if (isDeleted) {
        modelsToRemove.push(internalModel);
        recordArrays.delete(array);
      }
    }

    if (modelsToAdd.length > 0) {
      array._pushInternalModels(modelsToAdd);
    }

    if (modelsToRemove.length > 0) {
      array._removeInternalModels(modelsToRemove);
    } // return whether we performed an update.
    // Necessary until 3.5 allows us to finish off ember-data-filter support.


    return (modelsToAdd.length || modelsToRemove.length) > 0;
  }

  function removeFromAdapterPopulatedRecordArrays(internalModels) {
    for (var i = 0; i < internalModels.length; i++) {
      var internalModel = internalModels[i];
      var list = internalModel._recordArrays.list;

      for (var j = 0; j < list.length; j++) {
        // TODO: group by arrays, so we can batch remove
        list[j]._removeInternalModels([internalModel]);
      }

      internalModel._recordArrays.clear();
    }
  }

  function associateWithRecordArray(internalModels, array) {
    for (var i = 0, l = internalModels.length; i < l; i++) {
      var internalModel = internalModels[i];

      internalModel._recordArrays.add(array);
    }
  }

  function featureIsEnabled() {
    return Ember.FEATURES.isEnabled(...arguments);
  }

  /*
    This method normalizes a link to an "links object". If the passed link is
    already an object it's returned without any modifications.

    See http://jsonapi.org/format/#document-links for more information.

    @method _normalizeLink
    @private
    @param {String} link
    @return {Object|null}
    @for DS
  */
  function _normalizeLink(link) {
    switch (typeof link) {
      case 'object':
        return link;

      case 'string':
        return {
          href: link
        };
    }

    return null;
  }

  /* global heimdall */
  class Relationship {
    constructor(store, inverseKey, relationshipMeta, recordData, inverseIsAsync) {
      this.inverseIsAsync = inverseIsAsync;
      this.kind = relationshipMeta.kind;
      var async = relationshipMeta.options.async;
      var polymorphic = relationshipMeta.options.polymorphic;
      this.recordData = recordData;
      this.members = new EmberDataOrderedSet();
      this.canonicalMembers = new EmberDataOrderedSet();
      this.store = store;
      this.key = relationshipMeta.key;
      this.inverseKey = inverseKey;
      this.isAsync = typeof async === 'undefined' ? true : async;
      this.isPolymorphic = typeof polymorphic === 'undefined' ? false : polymorphic;
      this.relationshipMeta = relationshipMeta; //This probably breaks for polymorphic relationship in complex scenarios, due to
      //multiple possible modelNames

      this.inverseKeyForImplicit = this._tempModelName + this.key;
      this.meta = null;
      this.__inverseMeta = undefined;
      /*
       This flag forces fetch. `true` for a single request once `reload()`
         has been called `false` at all other times.
      */

      this.shouldForceReload = false;
      /*
         This flag indicates whether we should
          re-fetch the relationship the next time
          it is accessed.
           The difference between this flag and `shouldForceReload`
          is in how we treat the presence of partially missing data:
            - for a forced reload, we will reload the link or EVERY record
            - for a stale reload, we will reload the link (if present) else only MISSING records
           Ideally these flags could be merged, but because we don't give the
          request layer the option of deciding how to resolve the data being queried
          we are forced to differentiate for now.
           It is also possible for a relationship to remain stale after a forced reload; however,
          in this case `hasFailedLoadAttempt` ought to be `true`.
         false when
          => recordData.isNew() on initial setup
          => a previously triggered request has resolved
          => we get relationship data via push
         true when
          => !recordData.isNew() on initial setup
          => an inverse has been unloaded
          => we get a new link for the relationship
         TODO @runspired unskip the acceptance tests and fix these flags
       */

      this.relationshipIsStale = false;
      /*
       This flag indicates whether we should
        **partially** re-fetch the relationship the
        next time it is accessed.
       false when
        => initial setup
        => a previously triggered request has resolved
       true when
        => an inverse has been unloaded
      */

      this.hasDematerializedInverse = false;
      /*
        This flag indicates whether we should consider the content
         of this relationship "known".
         If we have no relationship knowledge, and the relationship
         is `async`, we will attempt to fetch the relationship on
         access if it is also stale.
        Snapshot uses this to tell the difference between unknown
        (`undefined`) or empty (`null`). The reason for this is that
        we wouldn't want to serialize  unknown relationships as `null`
        as that might overwrite remote state.
         All relationships for a newly created (`store.createRecord()`) are
         considered known (`hasAnyRelationshipData === true`).
         true when
          => we receive a push with either new data or explicit empty (`[]` or `null`)
          => the relationship is a belongsTo and we have received data from
               the other side.
         false when
          => we have received no signal about what data belongs in this relationship
          => the relationship is a hasMany and we have only received data from
              the other side.
       */

      this.hasAnyRelationshipData = false;
      /*
        Flag that indicates whether an empty relationship is explicitly empty
          (signaled by push giving us an empty array or null relationship)
          e.g. an API response has told us that this relationship is empty.
         Thus far, it does not appear that we actually need this flag; however,
          @runspired has found it invaluable when debugging relationship tests
          to determine whether (and why if so) we are in an incorrect state.
         true when
          => we receive a push with explicit empty (`[]` or `null`)
          => we have received no signal about what data belongs in this relationship
          => on initial create (as no signal is known yet)
         false at all other times
       */

      this.relationshipIsEmpty = true;
      /*
        Flag def here for reference, defined as getter in has-many.js / belongs-to.js
         true when
          => hasAnyRelationshipData is true
          AND
          => members (NOT canonicalMembers) @each !isEmpty
         TODO, consider changing the conditional here from !isEmpty to !hiddenFromRecordArrays
      */
      // TODO do we want this anymore? Seems somewhat useful
      //   especially if we rename to `hasUpdatedLink`
      //   which would tell us slightly more about why the
      //   relationship is stale
      // this.updatedLink = false;
    }

    get isNew() {
      return this.recordData.isNew();
    }

    _inverseIsAsync() {
      return this.inverseIsAsync;
    }

    _inverseIsSync() {
      return this.inverseKey && !this.inverseIsAsync;
    }

    _hasSupportForImplicitRelationships(recordData) {
      return recordData._implicitRelationships !== undefined && recordData._implicitRelationships !== null;
    }

    _hasSupportForRelationships(recordData) {
      return recordData._relationships !== undefined && recordData._relationships !== null;
    }

    get _inverseMeta() {
      if (this.__inverseMeta === undefined) {
        var inverseMeta = null;

        if (this.inverseKey) {
          var inverseModelClass = this.store.modelFor(this.relationshipMeta.type);
          var inverseRelationships = Ember.get(inverseModelClass, 'relationshipsByName');
          inverseMeta = inverseRelationships.get(this.inverseKey);
        }

        this.__inverseMeta = inverseMeta;
      }

      return this.__inverseMeta;
    }

    get parentType() {
      return this.internalModel.modelName;
    }

    recordDataDidDematerialize() {
      if (!this.inverseKey) {
        return;
      } // TODO @runspired fairly sure we need to become stale here
      // this.setRelationshipIsStale(true);
      // we actually want a union of members and canonicalMembers
      // they should be disjoint but currently are not due to a bug


      this.forAllMembers(inverseRecordData => {
        if (!this._hasSupportForRelationships(inverseRecordData)) {
          return;
        }

        var relationship = inverseRecordData._relationships.get(this.inverseKey);

        relationship.inverseDidDematerialize(this.recordData);
      });
    }

    forAllMembers(callback) {
      var seen = Object.create(null);

      for (var i = 0; i < this.members.list.length; i++) {
        var inverseInternalModel = this.members.list[i];
        var id = Ember.guidFor(inverseInternalModel);

        if (!seen[id]) {
          seen[id] = true;
          callback(inverseInternalModel);
        }
      }

      for (var _i = 0; _i < this.canonicalMembers.list.length; _i++) {
        var _inverseInternalModel = this.canonicalMembers.list[_i];

        var _id = Ember.guidFor(_inverseInternalModel);

        if (!seen[_id]) {
          seen[_id] = true;
          callback(_inverseInternalModel);
        }
      }
    }

    inverseDidDematerialize(inverseRecordData) {
      if (!this.isAsync) {
        // unloading inverse of a sync relationship is treated as a client-side
        // delete, so actually remove the models don't merely invalidate the cp
        // cache.
        this.removeRecordDataFromOwn(inverseRecordData);
        this.removeCanonicalRecordDataFromOwn(inverseRecordData);
        this.setRelationshipIsEmpty(true);
      } else {
        this.setHasDematerializedInverse(true);
      }
    }

    updateMeta(meta) {
      this.meta = meta;
    }

    clear() {
      var members = this.members.list;

      while (members.length > 0) {
        var member = members[0];
        this.removeRecordData(member);
      }

      var canonicalMembers = this.canonicalMembers.list;

      while (canonicalMembers.length > 0) {
        var _member = canonicalMembers[0];
        this.removeCanonicalRecordData(_member);
      }
    }

    removeAllRecordDatasFromOwn() {
      this.setRelationshipIsStale(true);
      this.members.clear();
    }

    removeAllCanonicalRecordDatasFromOwn() {
      this.canonicalMembers.clear();
      this.flushCanonicalLater();
    }

    removeRecordDatas(recordDatas) {
      recordDatas.forEach(recordData => this.removeRecordData(recordData));
    }

    addRecordDatas(recordDatas, idx) {
      recordDatas.forEach(recordData => {
        this.addRecordData(recordData, idx);

        if (idx !== undefined) {
          idx++;
        }
      });
    }

    addCanonicalRecordDatas(recordDatas, idx) {
      for (var i = 0; i < recordDatas.length; i++) {
        if (idx !== undefined) {
          this.addCanonicalRecordData(recordDatas[i], i + idx);
        } else {
          this.addCanonicalRecordData(recordDatas[i]);
        }
      }
    }

    addCanonicalRecordData(recordData, idx) {
      if (!this.canonicalMembers.has(recordData)) {
        this.canonicalMembers.add(recordData);
        this.setupInverseRelationship(recordData);
      }

      this.flushCanonicalLater();
      this.setHasAnyRelationshipData(true);
    }

    setupInverseRelationship(recordData) {
      if (this.inverseKey) {
        if (!this._hasSupportForRelationships(recordData)) {
          return;
        }

        var relationships = recordData._relationships;
        var relationship = relationships.get(this.inverseKey); // if we have only just initialized the inverse relationship, then it
        // already has this.recordData in its canonicalMembers, so skip the
        // unnecessary work.  The exception to this is polymorphic
        // relationships whose members are determined by their inverse, as those
        // relationships cannot efficiently find their inverse payloads.

        relationship.addCanonicalRecordData(this.recordData);
      } else {
        if (!this._hasSupportForImplicitRelationships(recordData)) {
          return;
        }

        var _relationships = recordData._implicitRelationships;
        var _relationship = _relationships[this.inverseKeyForImplicit];

        if (!_relationship) {
          _relationship = _relationships[this.inverseKeyForImplicit] = new Relationship(this.store, this.key, {
            options: {
              async: this.isAsync
            }
          }, recordData);
        }

        _relationship.addCanonicalRecordData(this.recordData);
      }
    }

    removeCanonicalRecordDatas(recordDatas, idx) {
      for (var i = 0; i < recordDatas.length; i++) {
        if (idx !== undefined) {
          this.removeCanonicalRecordData(recordDatas[i], i + idx);
        } else {
          this.removeCanonicalRecordData(recordDatas[i]);
        }
      }
    }

    removeCanonicalRecordData(recordData, idx) {
      if (this.canonicalMembers.has(recordData)) {
        this.removeCanonicalRecordDataFromOwn(recordData);

        if (this.inverseKey) {
          this.removeCanonicalRecordDataFromInverse(recordData);
        } else {
          if (this._hasSupportForImplicitRelationships(recordData) && recordData._implicitRelationships[this.inverseKeyForImplicit]) {
            recordData._implicitRelationships[this.inverseKeyForImplicit].removeCanonicalRecordData(this.recordData);
          }
        }
      }

      this.flushCanonicalLater();
    }

    addRecordData(recordData, idx) {
      if (!this.members.has(recordData)) {
        this.members.addWithIndex(recordData, idx);
        this.notifyRecordRelationshipAdded(recordData, idx);

        if (this._hasSupportForRelationships(recordData) && this.inverseKey) {
          recordData._relationships.get(this.inverseKey).addRecordData(this.recordData);
        } else {
          if (this._hasSupportForImplicitRelationships(recordData)) {
            if (!recordData._implicitRelationships[this.inverseKeyForImplicit]) {
              recordData._implicitRelationships[this.inverseKeyForImplicit] = new Relationship(this.store, this.key, {
                options: {
                  async: this.isAsync
                }
              }, recordData, this.isAsync);
            }

            recordData._implicitRelationships[this.inverseKeyForImplicit].addRecordData(this.recordData);
          }
        }
      }

      this.setHasAnyRelationshipData(true);
    }

    removeRecordData(recordData) {
      if (this.members.has(recordData)) {
        this.removeRecordDataFromOwn(recordData);

        if (this.inverseKey) {
          this.removeRecordDataFromInverse(recordData);
        } else {
          if (this._hasSupportForImplicitRelationships(recordData) && recordData._implicitRelationships[this.inverseKeyForImplicit]) {
            recordData._implicitRelationships[this.inverseKeyForImplicit].removeRecordData(this.recordData);
          }
        }
      }
    }

    removeRecordDataFromInverse(recordData) {
      if (!this._hasSupportForRelationships(recordData)) {
        return;
      }

      var inverseRelationship = recordData._relationships.get(this.inverseKey); //Need to check for existence, as the record might unloading at the moment


      if (inverseRelationship) {
        inverseRelationship.removeRecordDataFromOwn(this.recordData);
      }
    }

    removeRecordDataFromOwn(recordData) {
      this.members.delete(recordData);
    }

    removeCanonicalRecordDataFromInverse(recordData) {
      if (!this._hasSupportForRelationships(recordData)) {
        return;
      }

      var inverseRelationship = recordData._relationships.get(this.inverseKey); //Need to check for existence, as the record might unloading at the moment


      if (inverseRelationship) {
        inverseRelationship.removeCanonicalRecordDataFromOwn(this.recordData);
      }
    }

    removeCanonicalRecordDataFromOwn(recordData) {
      this.canonicalMembers.delete(recordData);
      this.flushCanonicalLater();
    }
    /*
      Call this method once a record deletion has been persisted
      to purge it from BOTH current and canonical state of all
      relationships.
       @method removeCompletelyFromInverse
      @private
     */


    removeCompletelyFromInverse() {
      if (!this.inverseKey) {
        return;
      } // we actually want a union of members and canonicalMembers
      // they should be disjoint but currently are not due to a bug


      var seen = Object.create(null);
      var recordData = this.recordData;

      var unload = inverseRecordData => {
        var id = Ember.guidFor(inverseRecordData);

        if (this._hasSupportForRelationships(inverseRecordData) && seen[id] === undefined) {
          var relationship = inverseRecordData._relationships.get(this.inverseKey);

          relationship.removeCompletelyFromOwn(recordData);
          seen[id] = true;
        }
      };

      this.members.forEach(unload);
      this.canonicalMembers.forEach(unload);

      if (!this.isAsync) {
        this.clear();
      }
    }
    /*
      Removes the given RecordData from BOTH canonical AND current state.
       This method is useful when either a deletion or a rollback on a new record
      needs to entirely purge itself from an inverse relationship.
     */


    removeCompletelyFromOwn(recordData) {
      this.canonicalMembers.delete(recordData);
      this.members.delete(recordData);
    }

    flushCanonical() {
      var list = this.members.list;
      this.willSync = false; //a hack for not removing new RecordDatas
      //TODO remove once we have proper diffing

      var newRecordDatas = [];

      for (var i = 0; i < list.length; i++) {
        // TODO Igor deal with this
        if (list[i].isNew()) {
          newRecordDatas.push(list[i]);
        }
      } //TODO(Igor) make this less abysmally slow


      this.members = this.canonicalMembers.copy();

      for (var _i2 = 0; _i2 < newRecordDatas.length; _i2++) {
        this.members.add(newRecordDatas[_i2]);
      }
    }

    flushCanonicalLater() {
      if (this.willSync) {
        return;
      }

      this.willSync = true; // Reaching back into the store to use ED's runloop

      this.store._updateRelationshipState(this);
    }

    updateLink(link) {
      (true && Ember.warn(`You pushed a record of type '${this.recordData.modelName}' with a relationship '${this.key}' configured as 'async: false'. You've included a link but no primary data, this may be an error in your payload. EmberData will treat this relationship as known-to-be-empty.`, this.isAsync || this.hasAnyRelationshipData, {
        id: 'ds.store.push-link-for-sync-relationship'
      }));
      (true && !(typeof link === 'string' || link === null) && Ember.assert(`You have pushed a record of type '${this.recordData.modelName}' with '${this.key}' as a link, but the value of that link is not a string.`, typeof link === 'string' || link === null));
      this.link = link;
    }

    updateRecordDatasFromAdapter(recordDatas) {
      this.setHasAnyRelationshipData(true); //TODO(Igor) move this to a proper place
      //TODO Once we have adapter support, we need to handle updated and canonical changes

      this.computeChanges(recordDatas);
    }

    notifyRecordRelationshipAdded() {}

    setHasAnyRelationshipData(value) {
      this.hasAnyRelationshipData = value;
    }

    setHasDematerializedInverse(value) {
      this.hasDematerializedInverse = value;
    }

    setRelationshipIsStale(value) {
      this.relationshipIsStale = value;
    }

    setRelationshipIsEmpty(value) {
      this.relationshipIsEmpty = value;
    }
    /*
     `push` for a relationship allows the store to push a JSON API Relationship
     Object onto the relationship. The relationship will then extract and set the
     meta, data and links of that relationship.
      `push` use `updateMeta`, `updateData` and `updateLink` to update the state
     of the relationship.
     */


    push(payload, initial) {
      var hasRelationshipDataProperty = false;
      var hasLink = false;

      if (payload.meta) {
        this.updateMeta(payload.meta);
      }

      if (payload.data !== undefined) {
        hasRelationshipDataProperty = true;
        this.updateData(payload.data, initial);
      } else if (this.isAsync === false) {
        hasRelationshipDataProperty = true;
        var data = this.kind === 'hasMany' ? [] : null;
        this.updateData(data, initial);
      }

      if (payload.links && payload.links.related) {
        var relatedLink = _normalizeLink(payload.links.related);

        if (relatedLink && relatedLink.href && relatedLink.href !== this.link) {
          hasLink = true;
          this.updateLink(relatedLink.href);
        }
      }
      /*
       Data being pushed into the relationship might contain only data or links,
       or a combination of both.
        IF contains only data
       IF contains both links and data
        relationshipIsEmpty -> true if is empty array (has-many) or is null (belongs-to)
        hasAnyRelationshipData -> true
        hasDematerializedInverse -> false
        relationshipIsStale -> false
        allInverseRecordsAreLoaded -> run-check-to-determine
        IF contains only links
        relationshipIsStale -> true
       */


      if (hasRelationshipDataProperty) {
        var relationshipIsEmpty = payload.data === null || Array.isArray(payload.data) && payload.data.length === 0;
        this.setHasAnyRelationshipData(true);
        this.setRelationshipIsStale(false);
        this.setHasDematerializedInverse(false);
        this.setRelationshipIsEmpty(relationshipIsEmpty);
      } else if (hasLink) {
        this.setRelationshipIsStale(true);

        if (!initial) {
          var recordData = this.recordData;
          var storeWrapper = this.recordData.storeWrapper;
          storeWrapper.notifyPropertyChange(recordData.modelName, recordData.id, recordData.clientId, this.key);
        }
      }
    }

    localStateIsEmpty() {}

    updateData() {}

    destroy() {}

  }

  class ManyRelationship extends Relationship {
    constructor(store, inverseKey, relationshipMeta, recordData, inverseIsAsync) {
      super(store, inverseKey, relationshipMeta, recordData, inverseIsAsync);
      this.canonicalState = [];
      this.currentState = [];
      this._willUpdateManyArray = false;
      this._pendingManyArrayUpdates = null;
    }

    removeInverseRelationships() {
      super.removeInverseRelationships();
      /* TODO Igor make sure this is still working
      if (this._promiseProxy) {
        this._promiseProxy.destroy();
      }
      */
    }

    addCanonicalRecordData(recordData, idx) {
      if (this.canonicalMembers.has(recordData)) {
        return;
      }

      if (idx !== undefined) {
        this.canonicalState.splice(idx, 0, recordData);
      } else {
        this.canonicalState.push(recordData);
      }

      super.addCanonicalRecordData(recordData, idx);
    }

    inverseDidDematerialize(inverseRecordData) {
      super.inverseDidDematerialize(inverseRecordData);

      if (this.isAsync) {
        this.notifyManyArrayIsStale();
      }
    }

    addRecordData(recordData, idx) {
      if (this.members.has(recordData)) {
        return;
      }

      Debug.assertPolymorphicType(this.recordData, this.relationshipMeta, recordData, this.store);
      super.addRecordData(recordData, idx); // make lazy later

      if (idx === undefined) {
        idx = this.currentState.length;
      }

      this.currentState.splice(idx, 0, recordData); // TODO Igor consider making direct to remove the indirection
      // We are not lazily accessing the manyArray here because the change is coming from app side
      // this.manyArray.flushCanonical(this.currentState);

      this.notifyHasManyChange();
    }

    removeCanonicalRecordDataFromOwn(recordData, idx) {
      var i = idx;

      if (!this.canonicalMembers.has(recordData)) {
        return;
      }

      if (i === undefined) {
        i = this.canonicalState.indexOf(recordData);
      }

      if (i > -1) {
        this.canonicalState.splice(i, 1);
      }

      super.removeCanonicalRecordDataFromOwn(recordData, idx); //TODO(Igor) Figure out what to do here
    }

    removeAllCanonicalRecordDatasFromOwn() {
      super.removeAllCanonicalRecordDatasFromOwn();
      this.canonicalMembers.clear();
      this.canonicalState.splice(0, this.canonicalState.length);
      super.removeAllCanonicalRecordDatasFromOwn();
    } //TODO(Igor) DO WE NEED THIS?


    removeCompletelyFromOwn(recordData) {
      super.removeCompletelyFromOwn(recordData); // TODO SkEPTICAL

      var canonicalIndex = this.canonicalState.indexOf(recordData);

      if (canonicalIndex !== -1) {
        this.canonicalState.splice(canonicalIndex, 1);
      }

      this.removeRecordDataFromOwn(recordData);
    }

    flushCanonical() {
      var toSet = this.canonicalState; //a hack for not removing new records
      //TODO remove once we have proper diffing

      var newRecordDatas = this.currentState.filter( // only add new internalModels which are not yet in the canonical state of this
      // relationship (a new internalModel can be in the canonical state if it has
      // been 'acknowleged' to be in the relationship via a store.push)
      //TODO Igor deal with this
      recordData => recordData.isNew() && toSet.indexOf(recordData) === -1);
      toSet = toSet.concat(newRecordDatas);
      /*
      if (this._manyArray) {
        this._manyArray.flushCanonical(toSet);
      }
      */

      this.currentState = toSet;
      super.flushCanonical(); // Once we clean up all the flushing, we will be left with at least the notifying part

      this.notifyHasManyChange();
    } //TODO(Igor) idx not used currently, fix


    removeRecordDataFromOwn(recordData, idx) {
      super.removeRecordDataFromOwn(recordData, idx);
      var index = idx || this.currentState.indexOf(recordData); //TODO IGOR DAVID INVESTIGATE

      if (index === -1) {
        return;
      }

      this.currentState.splice(index, 1); // TODO Igor consider making direct to remove the indirection
      // We are not lazily accessing the manyArray here because the change is coming from app side

      this.notifyHasManyChange(); // this.manyArray.flushCanonical(this.currentState);
    }

    notifyRecordRelationshipAdded() {
      this.notifyHasManyChange();
    }

    computeChanges(recordDatas = []) {
      var members = this.canonicalMembers;
      var recordDatasToRemove = [];
      var recordDatasSet = setForArray(recordDatas);
      members.forEach(member => {
        if (recordDatasSet.has(member)) {
          return;
        }

        recordDatasToRemove.push(member);
      });
      this.removeCanonicalRecordDatas(recordDatasToRemove);

      for (var i = 0, l = recordDatas.length; i < l; i++) {
        var recordData = recordDatas[i];
        this.removeCanonicalRecordData(recordData);
        this.addCanonicalRecordData(recordData, i);
      }
    }

    setInitialRecordDatas(recordDatas) {
      if (Array.isArray(recordDatas) === false || recordDatas.length === 0) {
        return;
      }

      for (var i = 0; i < recordDatas.length; i++) {
        var recordData = recordDatas[i];

        if (this.canonicalMembers.has(recordData)) {
          continue;
        }

        this.canonicalMembers.add(recordData);
        this.members.add(recordData);
        this.setupInverseRelationship(recordData);
      }

      this.canonicalState = this.canonicalMembers.toArray();
    }
    /*
      This is essentially a "sync" version of
        notifyHasManyChange. We should work to unify
        these worlds
         - @runspired
    */


    notifyManyArrayIsStale() {
      var recordData = this.recordData;
      var storeWrapper = recordData.storeWrapper;
      storeWrapper.notifyPropertyChange(recordData.modelName, recordData.id, recordData.clientId, this.key);
    }

    notifyHasManyChange() {
      var recordData = this.recordData;
      var storeWrapper = recordData.storeWrapper;
      storeWrapper.notifyHasManyChange(recordData.modelName, recordData.id, recordData.clientId, this.key);
    }

    getData() {
      var payload = {};

      if (this.hasAnyRelationshipData) {
        payload.data = this.currentState.map(recordData => recordData.getResourceIdentifier());
      }

      if (this.link) {
        payload.links = {
          related: this.link
        };
      }

      if (this.meta) {
        payload.meta = this.meta;
      } // TODO @runspired: the @igor refactor is too limiting for relationship state
      //   we should reconsider where we fetch from.


      payload._relationship = this;
      return payload;
    }

    updateData(data, initial) {
      var recordDatas;

      if (Ember.isNone(data)) {
        recordDatas = undefined;
      } else {
        recordDatas = new Array(data.length);

        for (var i = 0; i < data.length; i++) {
          recordDatas[i] = this.recordData.storeWrapper.recordDataFor(data[i].type, data[i].id);
        }
      }

      if (initial) {
        this.setInitialRecordDatas(recordDatas);
      } else {
        this.updateRecordDatasFromAdapter(recordDatas);
      }
    }
    /**
     * Flag indicating whether all inverse records are available
     *
     * true if inverse records exist and are all loaded (all not empty)
     * true if there are no inverse records
     * false if the inverse records exist and any are not loaded (any empty)
     *
     * @return {boolean}
     */


    get allInverseRecordsAreLoaded() {
      // check currentState for unloaded records
      var hasEmptyRecords = this.currentState.reduce((hasEmptyModel, i) => {
        return hasEmptyModel || i.isEmpty();
      }, false); // check un-synced state for unloaded records

      if (!hasEmptyRecords && this.willSync) {
        hasEmptyRecords = this.canonicalState.reduce((hasEmptyModel, i) => {
          return hasEmptyModel || !i.isEmpty();
        }, false);
      }

      return !hasEmptyRecords;
    }

  }

  function setForArray(array) {
    var set = new EmberDataOrderedSet();

    if (array) {
      for (var i = 0, l = array.length; i < l; i++) {
        set.add(array[i]);
      }
    }

    return set;
  }

  class BelongsToRelationship extends Relationship {
    constructor(store, inverseKey, relationshipMeta, recordData, inverseIsAsync) {
      super(store, inverseKey, relationshipMeta, recordData, inverseIsAsync);
      this.key = relationshipMeta.key;
      this.inverseRecordData = null;
      this.canonicalState = null;
    }

    setRecordData(recordData) {
      if (recordData) {
        this.addRecordData(recordData);
      } else if (this.inverseRecordData) {
        this.removeRecordData(this.inverseRecordData);
      }

      this.setHasAnyRelationshipData(true);
      this.setRelationshipIsStale(false);
      this.setRelationshipIsEmpty(false);
    }

    setCanonicalRecordData(recordData) {
      if (recordData) {
        this.addCanonicalRecordData(recordData);
      } else if (this.canonicalState) {
        this.removeCanonicalRecordData(this.canonicalState);
      }

      this.flushCanonicalLater();
    }

    setInitialCanonicalRecordData(recordData) {
      if (!recordData) {
        return;
      } // When we initialize a belongsTo relationship, we want to avoid work like
      // notifying our internalModel that we've "changed" and excessive thrash on
      // setting up inverse relationships


      this.canonicalMembers.add(recordData);
      this.members.add(recordData);
      this.inverseRecordData = this.canonicalState = recordData;
      this.setupInverseRelationship(recordData);
    }

    addCanonicalRecordData(recordData) {
      if (this.canonicalMembers.has(recordData)) {
        return;
      }

      if (this.canonicalState) {
        this.removeCanonicalRecordData(this.canonicalState);
      }

      this.canonicalState = recordData;
      super.addCanonicalRecordData(recordData);
      this.setHasAnyRelationshipData(true);
      this.setRelationshipIsEmpty(false);
    }

    inverseDidDematerialize() {
      super.inverseDidDematerialize(this.inverseRecordData);
      this.notifyBelongsToChange();
    }

    removeCompletelyFromOwn(recordData) {
      super.removeCompletelyFromOwn(recordData);

      if (this.canonicalState === recordData) {
        this.canonicalState = null;
      }

      if (this.inverseRecordData === recordData) {
        this.inverseRecordData = null;
        this.notifyBelongsToChange();
      }
    }

    removeCompletelyFromInverse() {
      super.removeCompletelyFromInverse();
      this.inverseRecordData = null;
    }

    flushCanonical() {
      //temporary fix to not remove newly created records if server returned null.
      //TODO remove once we have proper diffing
      if (this.inverseRecordData && this.inverseRecordData.isNew() && !this.canonicalState) {
        this.willSync = false;
        return;
      }

      if (this.inverseRecordData !== this.canonicalState) {
        this.inverseRecordData = this.canonicalState;
        this.notifyBelongsToChange();
      }

      super.flushCanonical();
    }

    addRecordData(recordData) {
      if (this.members.has(recordData)) {
        return;
      } // TODO Igor cleanup


      Debug.assertPolymorphicType(this.recordData, this.relationshipMeta, recordData, this.store);

      if (this.inverseRecordData) {
        this.removeRecordData(this.inverseRecordData);
      }

      this.inverseRecordData = recordData;
      super.addRecordData(recordData);
      this.notifyBelongsToChange();
    }

    setRecordPromise(newPromise) {
      var content = newPromise.get && newPromise.get('content');
      (true && !(content !== undefined) && Ember.assert('You passed in a promise that did not originate from an EmberData relationship. You can only pass promises that come from a belongsTo or hasMany relationship to the get call.', content !== undefined)); // TODO Igor deal with this

      this.setRecordData(content ? content._internalModel._recordData : content);
    }

    removeRecordDataFromOwn(recordData) {
      if (!this.members.has(recordData)) {
        return;
      }

      this.inverseRecordData = null;
      super.removeRecordDataFromOwn(recordData);
      this.notifyBelongsToChange();
    }

    removeAllRecordDatasFromOwn() {
      super.removeAllRecordDatasFromOwn();
      this.inverseRecordData = null;
      this.notifyBelongsToChange();
    }

    notifyBelongsToChange() {
      var recordData = this.recordData;
      var storeWrapper = this.recordData.storeWrapper;
      storeWrapper.notifyBelongsToChange(recordData.modelName, recordData.id, recordData.clientId, this.key);
    }

    removeCanonicalRecordDataFromOwn(recordData) {
      if (!this.canonicalMembers.has(recordData)) {
        return;
      }

      this.canonicalState = null;
      this.setHasAnyRelationshipData(true);
      this.setRelationshipIsEmpty(true);
      super.removeCanonicalRecordDataFromOwn(recordData);
    }

    removeAllCanonicalRecordDatasFromOwn() {
      super.removeAllCanonicalRecordDatasFromOwn();
      this.canonicalState = null;
    }

    getData() {
      var data;
      var payload = {};

      if (this.inverseRecordData) {
        data = this.inverseRecordData.getResourceIdentifier();
      }

      if (this.inverseRecordData === null && this.hasAnyRelationshipData) {
        data = null;
      }

      if (this.link) {
        payload.links = {
          related: this.link
        };
      }

      if (data !== undefined) {
        payload.data = data;
      }

      if (this.meta) {
        payload.meta = this.meta;
      }

      payload._relationship = this;
      return payload;
    }
    /**
     * Flag indicating whether all inverse records are available
     *
     * true if the inverse exists and is loaded (not empty)
     * true if there is no inverse
     * false if the inverse exists and is not loaded (empty)
     *
     * @return {boolean}
     */


    get allInverseRecordsAreLoaded() {
      var recordData = this.inverseRecordData;
      var isEmpty = recordData !== null && recordData.isEmpty();
      return !isEmpty;
    }

    updateData(data, initial) {
      var recordData;

      if (Ember.isNone(data)) {
        recordData = null;
      }

      (true && !(data === null || data.id !== undefined && data.type !== undefined) && Ember.assert(`Ember Data expected the data for the ${this.key} relationship on a ${this.recordData.toString()} to be in a JSON API format and include an \`id\` and \`type\` property but it found ${Ember.inspect(data)}. Please check your serializer and make sure it is serializing the relationship payload into a JSON API format.`, data === null || data.id !== undefined && data.type !== undefined));

      if (recordData !== null) {
        recordData = this.recordData.storeWrapper.recordDataFor(data.type, data.id);
      }

      if (initial) {
        this.setInitialCanonicalRecordData(recordData);
      } else {
        this.setCanonicalRecordData(recordData);
      }
    }

  }

  function createRelationshipFor(relationshipMeta, store, recordData, key) {
    var inverseKey = recordData.storeWrapper.inverseForRelationship(recordData.modelName, key);
    var inverseIsAsync = recordData.storeWrapper.inverseIsAsyncForRelationship(recordData.modelName, key);

    if (relationshipMeta.kind === 'hasMany') {
      return new ManyRelationship(store, inverseKey, relationshipMeta, recordData, inverseIsAsync);
    } else {
      return new BelongsToRelationship(store, inverseKey, relationshipMeta, recordData, inverseIsAsync);
    }
  }

  class Relationships {
    constructor(recordData) {
      this.recordData = recordData;
      this.initializedRelationships = Object.create(null);
    }

    has(key) {
      return !!this.initializedRelationships[key];
    }

    forEach(cb) {
      var rels = this.initializedRelationships;
      Object.keys(rels).forEach(name => {
        cb(name, rels[name]);
      });
    }

    get(key) {
      var relationships = this.initializedRelationships;
      var relationship = relationships[key];

      if (!relationship) {
        var recordData = this.recordData;
        var rel = this.recordData.storeWrapper.relationshipsDefinitionFor(this.recordData.modelName)[key];

        if (rel) {
          relationship = relationships[key] = createRelationshipFor(rel, recordData.store, recordData, key);
        }
      }

      return relationship;
    }

  }

  var nextBfsId = 1;
  class RecordData {
    constructor(modelName, id, clientId, storeWrapper, store) {
      this.store = store;
      this.modelName = modelName;
      this.__relationships = null;
      this.__implicitRelationships = null;
      this.clientId = clientId;
      this.id = id;
      this.storeWrapper = storeWrapper;
      this.isDestroyed = false;
      this._isNew = false; // Used during the mark phase of unloading to avoid checking the same internal
      // model twice in the same scan

      this._bfsId = 0;
      this.reset();
    } // PUBLIC API


    getResourceIdentifier() {
      return {
        id: this.id,
        type: this.modelName,
        clientId: this.clientId
      };
    }

    pushData(data, calculateChange) {
      var changedKeys;

      if (calculateChange) {
        changedKeys = this._changedKeys(data.attributes);
      }

      Ember.assign(this._data, data.attributes);

      if (this.__attributes) {
        // only do if we have attribute changes
        this._updateChangedAttributes();
      }

      if (data.relationships) {
        this._setupRelationships(data);
      }

      if (data.id) {
        this.id = coerceId(data.id);
      }

      return changedKeys;
    }

    willCommit() {
      this._inFlightAttributes = this._attributes;
      this._attributes = null;
    }

    hasChangedAttributes() {
      return this.__attributes !== null && Object.keys(this.__attributes).length > 0;
    } // this is a hack bc we don't have access to the state machine
    //   and relationships need this info and @runspired didn't see
    //   how to get it just yet from storeWrapper.


    isEmpty() {
      return this.__attributes === null && this.__inFlightAttributes === null && this.__data === null;
    }

    reset() {
      this.__attributes = null;
      this.__inFlightAttributes = null;
      this.__data = null;
    }

    _setupRelationships(data) {
      var relationships = this.storeWrapper.relationshipsDefinitionFor(this.modelName);
      var keys = Object.keys(relationships);

      for (var i = 0; i < keys.length; i++) {
        var relationshipName = keys[i];

        if (!data.relationships[relationshipName]) {
          continue;
        } // in debug, assert payload validity eagerly


        var relationshipData = data.relationships[relationshipName];

        {
          var store = this.store;
          var recordData = this;
          var relationshipMeta = relationships[relationshipName];

          if (!relationshipData || !relationshipMeta) {
            continue;
          }

          if (relationshipData.links) {
            var isAsync = relationshipMeta.options && relationshipMeta.options.async !== false;
            (true && Ember.warn(`You pushed a record of type '${this.modelName}' with a relationship '${relationshipName}' configured as 'async: false'. You've included a link but no primary data, this may be an error in your payload. EmberData will treat this relationship as known-to-be-empty.`, isAsync || relationshipData.data, {
              id: 'ds.store.push-link-for-sync-relationship'
            }));
          } else if (relationshipData.data) {
            if (relationshipMeta.kind === 'belongsTo') {
              (true && !(!Array.isArray(relationshipData.data)) && Ember.assert(`A ${this.modelName} record was pushed into the store with the value of ${relationshipName} being ${Ember.inspect(relationshipData.data)}, but ${relationshipName} is a belongsTo relationship so the value must not be an array. You should probably check your data payload or serializer.`, !Array.isArray(relationshipData.data)));
              assertRelationshipData(store, recordData, relationshipData.data, relationshipMeta);
            } else if (relationshipMeta.kind === 'hasMany') {
              (true && !(Array.isArray(relationshipData.data)) && Ember.assert(`A ${this.modelName} record was pushed into the store with the value of ${relationshipName} being '${Ember.inspect(relationshipData.data)}', but ${relationshipName} is a hasMany relationship so the value must be an array. You should probably check your data payload or serializer.`, Array.isArray(relationshipData.data)));

              if (Array.isArray(relationshipData.data)) {
                for (var _i = 0; _i < relationshipData.data.length; _i++) {
                  assertRelationshipData(store, recordData, relationshipData.data[_i], relationshipMeta);
                }
              }
            }
          }
        }

        var relationship = this._relationships.get(relationshipName);

        relationship.push(relationshipData);
      }
    }
    /*
      Checks if the attributes which are considered as changed are still
      different to the state which is acknowledged by the server.
       This method is needed when data for the internal model is pushed and the
      pushed data might acknowledge dirty attributes as confirmed.
       @method updateChangedAttributes
      @private
     */


    _updateChangedAttributes() {
      var changedAttributes = this.changedAttributes();
      var changedAttributeNames = Object.keys(changedAttributes);
      var attrs = this._attributes;

      for (var i = 0, length = changedAttributeNames.length; i < length; i++) {
        var attribute = changedAttributeNames[i];
        var data = changedAttributes[attribute];
        var oldData = data[0];
        var newData = data[1];

        if (oldData === newData) {
          delete attrs[attribute];
        }
      }
    }
    /*
      Returns an object, whose keys are changed properties, and value is an
      [oldProp, newProp] array.
       @method changedAttributes
      @private
    */


    changedAttributes() {
      var oldData = this._data;
      var currentData = this._attributes;
      var inFlightData = this._inFlightAttributes;
      var newData = Ember.assign({}, inFlightData, currentData);
      var diffData = Object.create(null);
      var newDataKeys = Object.keys(newData);

      for (var i = 0, length = newDataKeys.length; i < length; i++) {
        var key = newDataKeys[i];
        diffData[key] = [oldData[key], newData[key]];
      }

      return diffData;
    }

    isNew() {
      return this._isNew;
    }

    rollbackAttributes() {
      var dirtyKeys;

      if (this.hasChangedAttributes()) {
        dirtyKeys = Object.keys(this._attributes);
        this._attributes = null;
      }

      if (this.isNew()) {
        this.removeFromInverseRelationships(true);
      }

      this._inFlightAttributes = null;
      return dirtyKeys;
    }

    didCommit(data) {
      this._isNew = false;

      if (data) {
        // this.store._internalModelDidReceiveRelationshipData(this.modelName, this.id, data.relationships);
        if (data.relationships) {
          this._setupRelationships(data);
        }

        if (data.id) {
          // didCommit provided an ID, notify the store of it
          this.storeWrapper.setRecordId(this.modelName, data.id, this.clientId);
          this.id = coerceId(data.id);
        }

        data = data.attributes;
      }

      var changedKeys = this._changedKeys(data);

      Ember.assign(this._data, this.__inFlightAttributes, data);
      this._inFlightAttributes = null;

      this._updateChangedAttributes();

      return changedKeys;
    } // get ResourceIdentifiers for "current state"


    getHasMany(key) {
      return this._relationships.get(key).getData();
    } // set a new "current state" via ResourceIdentifiers


    setDirtyHasMany(key, recordDatas) {
      var relationship = this._relationships.get(key);

      relationship.clear();
      relationship.addRecordDatas(recordDatas);
    } // append to "current state" via RecordDatas


    addToHasMany(key, recordDatas, idx) {
      this._relationships.get(key).addRecordDatas(recordDatas, idx);
    } // remove from "current state" via RecordDatas


    removeFromHasMany(key, recordDatas) {
      this._relationships.get(key).removeRecordDatas(recordDatas);
    }

    commitWasRejected() {
      var keys = Object.keys(this._inFlightAttributes);

      if (keys.length > 0) {
        var attrs = this._attributes;

        for (var i = 0; i < keys.length; i++) {
          if (attrs[keys[i]] === undefined) {
            attrs[keys[i]] = this._inFlightAttributes[keys[i]];
          }
        }
      }

      this._inFlightAttributes = null;
    }

    getBelongsTo(key) {
      return this._relationships.get(key).getData();
    }

    setDirtyBelongsTo(key, recordDataOrPromise) {
      if (recordDataOrPromise === undefined) {
        recordDataOrPromise = null;
      }

      if (recordDataOrPromise && recordDataOrPromise.then) {
        this._relationships.get(key).setRecordPromise(recordDataOrPromise);
      } else {
        this._relationships.get(key).setRecordData(recordDataOrPromise);
      }
    }

    setDirtyAttribute(key, value) {
      var originalValue; // Add the new value to the changed attributes hash

      this._attributes[key] = value;

      if (key in this._inFlightAttributes) {
        originalValue = this._inFlightAttributes[key];
      } else {
        originalValue = this._data[key];
      } // If we went back to our original value, we shouldn't keep the attribute around anymore


      if (value === originalValue) {
        delete this._attributes[key];
      }
    }

    getAttr(key) {
      if (key in this._attributes) {
        return this._attributes[key];
      } else if (key in this._inFlightAttributes) {
        return this._inFlightAttributes[key];
      } else {
        return this._data[key];
      }
    }

    hasAttr(key) {
      return key in this._attributes || key in this._inFlightAttributes || key in this._data;
    }

    unloadRecord() {
      if (this.isDestroyed) {
        return;
      }

      this._destroyRelationships();

      this.reset();

      if (!this._scheduledDestroy) {
        this._scheduledDestroy = Ember.run.backburner.schedule('destroy', this, '_cleanupOrphanedRecordDatas');
      }
    }

    _cleanupOrphanedRecordDatas() {
      var relatedRecordDatas = this._allRelatedRecordDatas();

      if (areAllModelsUnloaded(relatedRecordDatas)) {
        for (var i = 0; i < relatedRecordDatas.length; ++i) {
          var recordData = relatedRecordDatas[i];

          if (!recordData.isDestroyed) {
            recordData.destroy();
          }
        }
      }

      this._scheduledDestroy = null;
    }

    destroy() {
      this._relationships.forEach((name, rel) => rel.destroy());

      this.isDestroyed = true;
      this.storeWrapper.disconnectRecord(this.modelName, this.id, this.clientId);
    }

    isRecordInUse() {
      return this.storeWrapper.isRecordInUse(this.modelName, this.id, this.clientId);
    }
    /**
      Computes the set of internal models reachable from `this` across exactly one
      relationship.
       @return {Array} An array containing the internal models that `this` belongs
      to or has many.
     */


    _directlyRelatedRecordDatas() {
      var array = [];

      this._relationships.forEach((name, rel) => {
        var members = rel.members.list;
        var canonicalMembers = rel.canonicalMembers.list;
        array = array.concat(members, canonicalMembers);
      });

      return array;
    }
    /**
      Computes the set of internal models reachable from this internal model.
       Reachability is determined over the relationship graph (ie a graph where
      nodes are internal models and edges are belongs to or has many
      relationships).
       @return {Array} An array including `this` and all internal models reachable
      from `this`.
    */


    _allRelatedRecordDatas() {
      var array = [];
      var queue = [];
      var bfsId = nextBfsId++;
      queue.push(this);
      this._bfsId = bfsId;

      while (queue.length > 0) {
        var node = queue.shift();
        array.push(node);

        var related = node._directlyRelatedRecordDatas();

        for (var i = 0; i < related.length; ++i) {
          var recordData = related[i];

          if (recordData instanceof RecordData) {
            (true && !(recordData._bfsId <= bfsId) && Ember.assert('Internal Error: seen a future bfs iteration', recordData._bfsId <= bfsId));

            if (recordData._bfsId < bfsId) {
              queue.push(recordData);
              recordData._bfsId = bfsId;
            }
          }
        }
      }

      return array;
    }

    isAttrDirty(key) {
      if (this._attributes[key] === undefined) {
        return false;
      }

      var originalValue;

      if (this._inFlightAttributes[key] !== undefined) {
        originalValue = this._inFlightAttributes[key];
      } else {
        originalValue = this._data[key];
      }

      return originalValue !== this._attributes[key];
    }

    get _attributes() {
      if (this.__attributes === null) {
        this.__attributes = Object.create(null);
      }

      return this.__attributes;
    }

    set _attributes(v) {
      this.__attributes = v;
    }

    get _relationships() {
      if (this.__relationships === null) {
        this.__relationships = new Relationships(this);
      }

      return this.__relationships;
    }

    get _data() {
      if (this.__data === null) {
        this.__data = Object.create(null);
      }

      return this.__data;
    }

    set _data(v) {
      this.__data = v;
    }
    /*
     implicit relationships are relationship which have not been declared but the inverse side exists on
     another record somewhere
     For example if there was
      ```app/models/comment.js
     import DS from 'ember-data';
      export default DS.Model.extend({
     name: DS.attr()
     })
     ```
      but there is also
      ```app/models/post.js
     import DS from 'ember-data';
      export default DS.Model.extend({
     name: DS.attr(),
     comments: DS.hasMany('comment')
     })
     ```
      would have a implicit post relationship in order to be do things like remove ourselves from the post
     when we are deleted
    */


    get _implicitRelationships() {
      if (this.__implicitRelationships === null) {
        this.__implicitRelationships = Object.create(null);
      }

      return this.__implicitRelationships;
    }

    get _inFlightAttributes() {
      if (this.__inFlightAttributes === null) {
        this.__inFlightAttributes = Object.create(null);
      }

      return this.__inFlightAttributes;
    }

    set _inFlightAttributes(v) {
      this.__inFlightAttributes = v;
    }
    /**
     * Receives options passed to `store.createRecord` and is given the opportunity
     * to handle them.
     *
     * The return value is an object of options to pass to `Record.create()`
     *
     * @param options
     * @private
     */


    _initRecordCreateOptions(options) {
      var createOptions = {};

      if (options !== undefined) {
        var {
          modelName,
          storeWrapper
        } = this;
        var attributeDefs = storeWrapper.attributesDefinitionFor(modelName);
        var relationshipDefs = storeWrapper.relationshipsDefinitionFor(modelName);
        var relationships = this._relationships;
        var propertyNames = Object.keys(options);

        for (var i = 0; i < propertyNames.length; i++) {
          var name = propertyNames[i];
          var propertyValue = options[name];

          if (name === 'id') {
            this.id = propertyValue;
            continue;
          }

          var fieldType = relationshipDefs[name] || attributeDefs[name];
          var kind = fieldType !== undefined ? fieldType.kind : null;
          var relationship = void 0;

          switch (kind) {
            case 'attribute':
              this.setDirtyAttribute(name, propertyValue);
              break;

            case 'belongsTo':
              this.setDirtyBelongsTo(name, propertyValue);
              relationship = relationships.get(name);
              relationship.setHasAnyRelationshipData(true);
              relationship.setRelationshipIsEmpty(false);
              break;

            case 'hasMany':
              this.setDirtyHasMany(name, propertyValue);
              relationship = relationships.get(name);
              relationship.setHasAnyRelationshipData(true);
              relationship.setRelationshipIsEmpty(false);
              break;

            default:
              // reflect back (pass-thru) unknown properties
              createOptions[name] = propertyValue;
          }
        }
      }

      return createOptions;
    }
    /*
        TODO IGOR AND DAVID this shouldn't be public
     This method should only be called by records in the `isNew()` state OR once the record
     has been deleted and that deletion has been persisted.
      It will remove this record from any associated relationships.
      If `isNew` is true (default false), it will also completely reset all
      relationships to an empty state as well.
       @method removeFromInverseRelationships
      @param {Boolean} isNew whether to unload from the `isNew` perspective
      @private
     */


    removeFromInverseRelationships(isNew = false) {
      this._relationships.forEach((name, rel) => {
        rel.removeCompletelyFromInverse();

        if (isNew === true) {
          rel.clear();
        }
      });

      var implicitRelationships = this._implicitRelationships;
      this.__implicitRelationships = null;
      Object.keys(implicitRelationships).forEach(key => {
        var rel = implicitRelationships[key];
        rel.removeCompletelyFromInverse();

        if (isNew === true) {
          rel.clear();
        }
      });
    }

    _destroyRelationships() {
      var relationships = this._relationships;
      relationships.forEach((name, rel) => destroyRelationship(rel));
      var implicitRelationships = this._implicitRelationships;
      this.__implicitRelationships = null;
      Object.keys(implicitRelationships).forEach(key => {
        var rel = implicitRelationships[key];
        destroyRelationship(rel);
      });
    }

    clientDidCreate() {
      this._isNew = true;
    }
    /*
      Ember Data has 3 buckets for storing the value of an attribute on an internalModel.
       `_data` holds all of the attributes that have been acknowledged by
      a backend via the adapter. When rollbackAttributes is called on a model all
      attributes will revert to the record's state in `_data`.
       `_attributes` holds any change the user has made to an attribute
      that has not been acknowledged by the adapter. Any values in
      `_attributes` are have priority over values in `_data`.
       `_inFlightAttributes`. When a record is being synced with the
      backend the values in `_attributes` are copied to
      `_inFlightAttributes`. This way if the backend acknowledges the
      save but does not return the new state Ember Data can copy the
      values from `_inFlightAttributes` to `_data`. Without having to
      worry about changes made to `_attributes` while the save was
      happenign.
        Changed keys builds a list of all of the values that may have been
      changed by the backend after a successful save.
       It does this by iterating over each key, value pair in the payload
      returned from the server after a save. If the `key` is found in
      `_attributes` then the user has a local changed to the attribute
      that has not been synced with the server and the key is not
      included in the list of changed keys.
    
      If the value, for a key differs from the value in what Ember Data
      believes to be the truth about the backend state (A merger of the
      `_data` and `_inFlightAttributes` objects where
      `_inFlightAttributes` has priority) then that means the backend
      has updated the value and the key is added to the list of changed
      keys.
       @method _changedKeys
      @private
    */

    /*
        TODO IGOR DAVID
        There seems to be a potential bug here, where we will return keys that are not
        in the schema
    */


    _changedKeys(updates) {
      var changedKeys = [];

      if (updates) {
        var original, i, value, key;
        var keys = Object.keys(updates);
        var length = keys.length;
        var hasAttrs = this.hasChangedAttributes();
        var attrs;

        if (hasAttrs) {
          attrs = this._attributes;
        }

        original = Ember.assign(Object.create(null), this._data, this.__inFlightAttributes);

        for (i = 0; i < length; i++) {
          key = keys[i];
          value = updates[key]; // A value in _attributes means the user has a local change to
          // this attributes. We never override this value when merging
          // updates from the backend so we should not sent a change
          // notification if the server value differs from the original.

          if (hasAttrs === true && attrs[key] !== undefined) {
            continue;
          }

          if (!Ember.isEqual(original[key], value)) {
            changedKeys.push(key);
          }
        }
      }

      return changedKeys;
    }

    toString() {
      return `<${this.modelName}:${this.id}>`;
    }

  }

  if (featureIsEnabled('ds-rollback-attribute')) {
    /*
       Returns the latest truth for an attribute - the canonical value, or the
       in-flight value.
        @method lastAcknowledgedValue
       @private
    */
    RecordData.prototype.lastAcknowledgedValue = function lastAcknowledgedValue(key) {
      if (key in this._inFlightAttributes) {
        return this._inFlightAttributes[key];
      } else {
        return this._data[key];
      }
    };
  }

  function assertRelationshipData(store, recordData, data, meta) {
    (true && !(!Array.isArray(data)) && Ember.assert(`A ${recordData.modelName} record was pushed into the store with the value of ${meta.key} being '${JSON.stringify(data)}', but ${meta.key} is a belongsTo relationship so the value must not be an array. You should probably check your data payload or serializer.`, !Array.isArray(data)));
    (true && !(data === null || typeof data.type === 'string' && data.type.length) && Ember.assert(`Encountered a relationship identifier without a type for the ${meta.kind} relationship '${meta.key}' on ${recordData}, expected a json-api identifier with type '${meta.type}' but found '${JSON.stringify(data)}'. Please check your serializer and make sure it is serializing the relationship payload into a JSON API format.`, data === null || typeof data.type === 'string' && data.type.length));
    (true && !(data === null || coerceId(data.id)) && Ember.assert(`Encountered a relationship identifier without an id for the ${meta.kind} relationship '${meta.key}' on ${recordData}, expected a json-api identifier but found '${JSON.stringify(data)}'. Please check your serializer and make sure it is serializing the relationship payload into a JSON API format.`, data === null || coerceId(data.id)));
    (true && !(data === null || !data.type || store._hasModelFor(data.type)) && Ember.assert(`Encountered a relationship identifier with type '${data.type}' for the ${meta.kind} relationship '${meta.key}' on ${recordData}, Expected a json-api identifier with type '${meta.type}'. No model was found for '${data.type}'.`, data === null || !data.type || store._hasModelFor(data.type)));
  } // Handle dematerialization for relationship `rel`.  In all cases, notify the
  // relatinoship of the dematerialization: this is done so the relationship can
  // notify its inverse which needs to update state
  //
  // If the inverse is sync, unloading this record is treated as a client-side
  // delete, so we remove the inverse records from this relationship to
  // disconnect the graph.  Because it's not async, we don't need to keep around
  // the internalModel as an id-wrapper for references and because the graph is
  // disconnected we can actually destroy the internalModel when checking for
  // orphaned models.


  function destroyRelationship(rel) {
    rel.recordDataDidDematerialize();

    if (rel._inverseIsSync()) {
      rel.removeAllRecordDatasFromOwn();
      rel.removeAllCanonicalRecordDatasFromOwn();
    }
  }

  function areAllModelsUnloaded(recordDatas) {
    for (var i = 0; i < recordDatas.length; ++i) {
      if (recordDatas[i].isRecordInUse()) {
        return false;
      }
    }

    return true;
  }

  var backburner = new Ember._Backburner(['normalizeRelationships', 'syncRelationships', 'finished']);

  {
    Ember.Test.registerWaiter(() => {
      return !backburner.currentInstance && !backburner.hasTimers();
    });
  }

  /**
    @module ember-data
  */
  var badIdFormatAssertion = '`id` passed to `findRecord()` has to be non-empty string or number';
  var emberRun$1 = Ember.run.backburner;
  var {
    ENV
  } = Ember;
  var globalClientIdCounter = 1; //Get the materialized model from the internalModel/promise that returns
  //an internal model and return it in a promiseObject. Useful for returning
  //from find methods

  function promiseRecord(internalModelPromise, label) {
    var toReturn = internalModelPromise.then(internalModel => internalModel.getRecord());
    return promiseObject(toReturn, label);
  }

  var Store; // Implementors Note:
  //
  //   The variables in this file are consistently named according to the following
  //   scheme:
  //
  //   * +id+ means an identifier managed by an external source, provided inside
  //     the data provided by that source. These are always coerced to be strings
  //     before being used internally.
  //   * +clientId+ means a transient numerical identifier generated at runtime by
  //     the data store. It is important primarily because newly created objects may
  //     not yet have an externally generated id.
  //   * +internalModel+ means a record internalModel object, which holds metadata about a
  //     record, even if it has not yet been fully materialized.
  //   * +type+ means a DS.Model.

  /**
    The store contains all of the data for records loaded from the server.
    It is also responsible for creating instances of `DS.Model` that wrap
    the individual data for a record, so that they can be bound to in your
    Handlebars templates.

    Define your application's store like this:

    ```app/services/store.js
    import DS from 'ember-data';

    export default DS.Store.extend({
    });
    ```

    Most Ember.js applications will only have a single `DS.Store` that is
    automatically created by their `Ember.Application`.

    You can retrieve models from the store in several ways. To retrieve a record
    for a specific id, use `DS.Store`'s `findRecord()` method:

    ```javascript
    store.findRecord('person', 123).then(function (person) {
    });
    ```

    By default, the store will talk to your backend using a standard
    REST mechanism. You can customize how the store talks to your
    backend by specifying a custom adapter:

    ```app/adapters/application.js
    import DS from 'ember-data';

    export default DS.Adapter.extend({
    });
    ```

    You can learn more about writing a custom adapter by reading the `DS.Adapter`
    documentation.

    ### Store createRecord() vs. push() vs. pushPayload()

    The store provides multiple ways to create new record objects. They have
    some subtle differences in their use which are detailed below:

    [createRecord](#method_createRecord) is used for creating new
    records on the client side. This will return a new record in the
    `created.uncommitted` state. In order to persist this record to the
    backend, you will need to call `record.save()`.

    [push](#method_push) is used to notify Ember Data's store of new or
    updated records that exist in the backend. This will return a record
    in the `loaded.saved` state. The primary use-case for `store#push` is
    to notify Ember Data about record updates (full or partial) that happen
    outside of the normal adapter methods (for example
    [SSE](http://dev.w3.org/html5/eventsource/) or [Web
    Sockets](http://www.w3.org/TR/2009/WD-websockets-20091222/)).

    [pushPayload](#method_pushPayload) is a convenience wrapper for
    `store#push` that will deserialize payloads if the
    Serializer implements a `pushPayload` method.

    Note: When creating a new record using any of the above methods
    Ember Data will update `DS.RecordArray`s such as those returned by
    `store#peekAll()` or `store#findAll()`. This means any
    data bindings or computed properties that depend on the RecordArray
    will automatically be synced to include the new or updated record
    values.

    @class Store
    @namespace DS
    @extends Ember.Service
  */
  Store = Ember.Service.extend({
    /**
      @method init
      @private
    */
    init() {
      this._super(...arguments);

      this._backburner = backburner; // internal bookkeeping; not observable

      this.recordArrayManager = new RecordArrayManager({
        store: this
      });
      this._identityMap = new IdentityMap(); // To keep track of clientIds for newly created records

      this._newlyCreated = new IdentityMap();
      this._pendingSave = [];
      this._modelFactoryCache = Object.create(null);
      this._relationshipsDefCache = Object.create(null);
      this._attributesDefCache = Object.create(null);
      /*
        Ember Data uses several specialized micro-queues for organizing
        and coalescing similar async work.
         These queues are currently controlled by a flush scheduled into
        ember-data's custom backburner instance.
       */
      // used for coalescing record save requests

      this._pendingSave = []; // used for coalescing relationship updates

      this._updatedRelationships = []; // used for coalescing relationship setup needs

      this._pushedInternalModels = []; // used for coalescing internal model updates

      this._updatedInternalModels = []; // used to keep track of all the find requests that need to be coalesced

      this._pendingFetch = new Map();
      this._adapterCache = Object.create(null);
      this._serializerCache = Object.create(null);
      this.recordDataWrapper = new RecordDataWrapper(this);

      {
        this.shouldAssertMethodCallsOnDestroyedStore = this.shouldAssertMethodCallsOnDestroyedStore || false;

        if (this.shouldTrackAsyncRequests === undefined) {
          this.shouldTrackAsyncRequests = false;
        }

        if (this.generateStackTracesForTrackedRequests === undefined) {
          this.generateStackTracesForTrackedRequests = false;
        }

        this._trackedAsyncRequests = [];

        this._trackAsyncRequestStart = label => {
          var trace = 'set `store.generateStackTracesForTrackedRequests = true;` to get a detailed trace for where this request originated';

          if (this.generateStackTracesForTrackedRequests) {
            try {
              throw new Error(`EmberData TrackedRequest: ${label}`);
            } catch (e) {
              trace = e;
            }
          }

          var token = Object.freeze({
            label,
            trace
          });

          this._trackedAsyncRequests.push(token);

          return token;
        };

        this._trackAsyncRequestEnd = token => {
          var index = this._trackedAsyncRequests.indexOf(token);

          if (index === -1) {
            throw new Error(`Attempted to end tracking for the following request but it was not being tracked:\n${token}`);
          }

          this._trackedAsyncRequests.splice(index, 1);
        };

        this.__asyncWaiter = () => {
          var shouldTrack = this.shouldTrackAsyncRequests;
          var tracked = this._trackedAsyncRequests;
          var isSettled = tracked.length === 0;
          return shouldTrack !== true || isSettled;
        };

        Ember.Test.registerWaiter(this.__asyncWaiter);
      }
    },

    /**
      The default adapter to use to communicate to a backend server or
      other persistence layer. This will be overridden by an application
      adapter if present.
       If you want to specify `app/adapters/custom.js` as a string, do:
       ```js
      import DS from 'ember-data';
       export default DS.Store.extend({
        adapter: 'custom',
      });
      ```
       @property adapter
      @default '-json-api'
      @type {String}
    */
    adapter: '-json-api',

    /**
      This property returns the adapter, after resolving a possible
      string key.
       If the supplied `adapter` was a class, or a String property
      path resolved to a class, this property will instantiate the
      class.
       This property is cacheable, so the same instance of a specified
      adapter class should be used for the lifetime of the store.
       @property defaultAdapter
      @private
      @return DS.Adapter
    */
    defaultAdapter: Ember.computed('adapter', function () {
      var adapter = Ember.get(this, 'adapter');
      (true && !(typeof adapter === 'string') && Ember.assert('You tried to set `adapter` property to an instance of `DS.Adapter`, where it should be a name', typeof adapter === 'string'));
      return this.adapterFor(adapter);
    }),

    // .....................
    // . CREATE NEW RECORD .
    // .....................

    /**
      Create a new record in the current store. The properties passed
      to this method are set on the newly created record.
       To create a new instance of a `Post`:
       ```js
      store.createRecord('post', {
        title: 'Rails is omakase'
      });
      ```
       To create a new instance of a `Post` that has a relationship with a `User` record:
       ```js
      let user = this.store.peekRecord('user', 1);
      store.createRecord('post', {
        title: 'Rails is omakase',
        user: user
      });
      ```
       @method createRecord
      @param {String} modelName
      @param {Object} inputProperties a hash of properties to set on the
        newly created record.
      @return {DS.Model} record
    */
    createRecord(modelName, inputProperties) {
      {
        assertDestroyingStore(this, 'createRecord');
      }

      (true && !(Ember.isPresent(modelName)) && Ember.assert(`You need to pass a model name to the store's createRecord method`, Ember.isPresent(modelName)));
      (true && !(typeof modelName === 'string') && Ember.assert(`Passing classes to store methods has been removed. Please pass a dasherized string instead of ${modelName}`, typeof modelName === 'string')); // This is wrapped in a `run.join` so that in test environments users do not need to manually wrap
      //   calls to `createRecord`. The run loop usage here is because we batch the joining and updating
      //   of record-arrays via ember's run loop, not our own.
      //
      //   to remove this, we would need to move to a new `async` API.

      return emberRun$1.join(() => {
        return this._backburner.join(() => {
          var normalizedModelName = normalizeModelName(modelName);
          var properties = Ember.assign({}, inputProperties); // If the passed properties do not include a primary key,
          // give the adapter an opportunity to generate one. Typically,
          // client-side ID generators will use something like uuid.js
          // to avoid conflicts.

          if (Ember.isNone(properties.id)) {
            properties.id = this._generateId(normalizedModelName, properties);
          } // Coerce ID to a string


          properties.id = coerceId(properties.id);

          var internalModel = this._buildInternalModel(normalizedModelName, properties.id);

          internalModel.loadedData(); // TODO this exists just to proxy `isNew` to RecordData which is weird

          internalModel.didCreateRecord();
          return internalModel.getRecord(properties);
        });
      });
    },

    /**
      If possible, this method asks the adapter to generate an ID for
      a newly created record.
       @method _generateId
      @private
      @param {String} modelName
      @param {Object} properties from the new record
      @return {String} if the adapter can generate one, an ID
    */
    _generateId(modelName, properties) {
      var adapter = this.adapterFor(modelName);

      if (adapter && adapter.generateIdForRecord) {
        return adapter.generateIdForRecord(this, modelName, properties);
      }

      return null;
    },

    // .................
    // . DELETE RECORD .
    // .................

    /**
      For symmetry, a record can be deleted via the store.
       Example
       ```javascript
      let post = store.createRecord('post', {
        title: 'Rails is omakase'
      });
       store.deleteRecord(post);
      ```
       @method deleteRecord
      @param {DS.Model} record
    */
    deleteRecord(record) {
      {
        assertDestroyingStore(this, 'deleteRecord');
      }

      record.deleteRecord();
    },

    /**
      For symmetry, a record can be unloaded via the store.
      This will cause the record to be destroyed and freed up for garbage collection.
       Example
       ```javascript
      store.findRecord('post', 1).then(function(post) {
        store.unloadRecord(post);
      });
      ```
       @method unloadRecord
      @param {DS.Model} record
    */
    unloadRecord(record) {
      {
        assertDestroyingStore(this, 'unloadRecord');
      }

      record.unloadRecord();
    },

    // ................
    // . FIND RECORDS .
    // ................

    /**
      @method find
      @param {String} modelName
      @param {String|Integer} id
      @param {Object} options
      @return {Promise} promise
      @private
    */
    find(modelName, id, options) {
      {
        assertDestroyingStore(this, 'find');
      } // The default `model` hook in Route calls `find(modelName, id)`,
      // that's why we have to keep this method around even though `findRecord` is
      // the public way to get a record by modelName and id.


      (true && !(arguments.length !== 1) && Ember.assert(`Using store.find(type) has been removed. Use store.findAll(modelName) to retrieve all records for a given type.`, arguments.length !== 1));
      (true && !(!options) && Ember.assert(`Calling store.find(modelName, id, { preload: preload }) is no longer supported. Use store.findRecord(modelName, id, { preload: preload }) instead.`, !options));
      (true && !(arguments.length === 2) && Ember.assert(`You need to pass the model name and id to the store's find method`, arguments.length === 2));
      (true && !(typeof id === 'string' || typeof id === 'number') && Ember.assert(`You cannot pass '${id}' as id to the store's find method`, typeof id === 'string' || typeof id === 'number'));
      (true && !(typeof id !== 'object') && Ember.assert(`Calling store.find() with a query object is no longer supported. Use store.query() instead.`, typeof id !== 'object'));
      (true && !(typeof modelName === 'string') && Ember.assert(`Passing classes to store methods has been removed. Please pass a dasherized string instead of ${modelName}`, typeof modelName === 'string'));
      return this.findRecord(modelName, id);
    },

    /**
      This method returns a record for a given type and id combination.
       The `findRecord` method will always resolve its promise with the same
      object for a given type and `id`.
       The `findRecord` method will always return a **promise** that will be
      resolved with the record.
       Example
       ```app/routes/post.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        model(params) {
          return this.store.findRecord('post', params.post_id);
        }
      });
      ```
       If the record is not yet available, the store will ask the adapter's `find`
      method to find the necessary data. If the record is already present in the
      store, it depends on the reload behavior _when_ the returned promise
      resolves.
       ### Preloading
       You can optionally `preload` specific attributes and relationships that you know of
      by passing them via the passed `options`.
       For example, if your Ember route looks like `/posts/1/comments/2` and your API route
      for the comment also looks like `/posts/1/comments/2` if you want to fetch the comment
      without fetching the post you can pass in the post to the `findRecord` call:
       ```javascript
      store.findRecord('comment', 2, { preload: { post: 1 } });
      ```
       If you have access to the post model you can also pass the model itself:
       ```javascript
      store.findRecord('post', 1).then(function (myPostModel) {
        store.findRecord('comment', 2, { post: myPostModel });
      });
      ```
       ### Reloading
       The reload behavior is configured either via the passed `options` hash or
      the result of the adapter's `shouldReloadRecord`.
       If `{ reload: true }` is passed or `adapter.shouldReloadRecord` evaluates
      to `true`, then the returned promise resolves once the adapter returns
      data, regardless if the requested record is already in the store:
       ```js
      store.push({
        data: {
          id: 1,
          type: 'post',
          revision: 1
        }
      });
       // adapter#findRecord resolves with
      // [
      //   {
      //     id: 1,
      //     type: 'post',
      //     revision: 2
      //   }
      // ]
      store.findRecord('post', 1, { reload: true }).then(function(post) {
        post.get('revision'); // 2
      });
      ```
       If no reload is indicated via the abovementioned ways, then the promise
      immediately resolves with the cached version in the store.
       ### Background Reloading
       Optionally, if `adapter.shouldBackgroundReloadRecord` evaluates to `true`,
      then a background reload is started, which updates the records' data, once
      it is available:
       ```js
      // app/adapters/post.js
      import ApplicationAdapter from "./application";
       export default ApplicationAdapter.extend({
        shouldReloadRecord(store, snapshot) {
          return false;
        },
         shouldBackgroundReloadRecord(store, snapshot) {
          return true;
        }
      });
       // ...
       store.push({
        data: {
          id: 1,
          type: 'post',
          revision: 1
        }
      });
       let blogPost = store.findRecord('post', 1).then(function(post) {
        post.get('revision'); // 1
      });
       // later, once adapter#findRecord resolved with
      // [
      //   {
      //     id: 1,
      //     type: 'post',
      //     revision: 2
      //   }
      // ]
       blogPost.get('revision'); // 2
      ```
       If you would like to force or prevent background reloading, you can set a
      boolean value for `backgroundReload` in the options object for
      `findRecord`.
       ```app/routes/post/edit.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        model(params) {
          return this.store.findRecord('post', params.post_id, { backgroundReload: false });
        }
      });
      ```
       If you pass an object on the `adapterOptions` property of the options
      argument it will be passed to you adapter via the snapshot
       ```app/routes/post/edit.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        model(params) {
          return this.store.findRecord('post', params.post_id, {
            adapterOptions: { subscribe: false }
          });
        }
      });
      ```
       ```app/adapters/post.js
      import MyCustomAdapter from './custom-adapter';
       export default MyCustomAdapter.extend({
        findRecord(store, type, id, snapshot) {
          if (snapshot.adapterOptions.subscribe) {
            // ...
          }
          // ...
        }
      });
      ```
       See [peekRecord](#method_peekRecord) to get the cached version of a record.
       ### Retrieving Related Model Records
       If you use an adapter such as Ember's default
      [`JSONAPIAdapter`](https://emberjs.com/api/data/classes/DS.JSONAPIAdapter.html)
      that supports the [JSON API specification](http://jsonapi.org/) and if your server
      endpoint supports the use of an
      ['include' query parameter](http://jsonapi.org/format/#fetching-includes),
      you can use `findRecord()` to automatically retrieve additional records related to
      the one you request by supplying an `include` parameter in the `options` object.
       For example, given a `post` model that has a `hasMany` relationship with a `comment`
      model, when we retrieve a specific post we can have the server also return that post's
      comments in the same request:
       ```app/routes/post.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        model(params) {
          return this.store.findRecord('post', params.post_id, { include: 'comments' });
        }
      });
       ```
      In this case, the post's comments would then be available in your template as
      `model.comments`.
       Multiple relationships can be requested using an `include` parameter consisting of a
      comma-separated list (without white-space) while nested relationships can be specified
      using a dot-separated sequence of relationship names. So to request both the post's
      comments and the authors of those comments the request would look like this:
       ```app/routes/post.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        model(params) {
          return this.store.findRecord('post', params.post_id, { include: 'comments,comments.author' });
        }
      });
       ```
       @since 1.13.0
      @method findRecord
      @param {String} modelName
      @param {(String|Integer)} id
      @param {Object} preload - optional set of attributes and relationships passed in either as IDs or as actual models
      @param {Object} options
      @return {Promise} promise
    */
    findRecord(modelName, id, options) {
      {
        assertDestroyingStore(this, 'findRecord');
      }

      (true && !(Ember.isPresent(modelName)) && Ember.assert(`You need to pass a model name to the store's findRecord method`, Ember.isPresent(modelName)));
      (true && !(typeof modelName === 'string') && Ember.assert(`Passing classes to store methods has been removed. Please pass a dasherized string instead of ${modelName}`, typeof modelName === 'string'));
      (true && !(typeof id === 'string' && id.length > 0 || typeof id === 'number' && !isNaN(id)) && Ember.assert(badIdFormatAssertion, typeof id === 'string' && id.length > 0 || typeof id === 'number' && !isNaN(id)));
      var normalizedModelName = normalizeModelName(modelName);

      var internalModel = this._internalModelForId(normalizedModelName, id);

      options = options || {};

      if (!this.hasRecordForId(normalizedModelName, id)) {
        return this._findByInternalModel(internalModel, options);
      }

      var fetchedInternalModel = this._findRecord(internalModel, options);

      return promiseRecord(fetchedInternalModel, `DS: Store#findRecord ${normalizedModelName} with id: ${id}`);
    },

    _findRecord(internalModel, options) {
      // Refetch if the reload option is passed
      if (options.reload) {
        return this._scheduleFetch(internalModel, options);
      }

      var snapshot = internalModel.createSnapshot(options);
      var adapter = this.adapterFor(internalModel.modelName); // Refetch the record if the adapter thinks the record is stale

      if (adapter.shouldReloadRecord(this, snapshot)) {
        return this._scheduleFetch(internalModel, options);
      }

      if (options.backgroundReload === false) {
        return Ember.RSVP.Promise.resolve(internalModel);
      } // Trigger the background refetch if backgroundReload option is passed


      if (options.backgroundReload || adapter.shouldBackgroundReloadRecord(this, snapshot)) {
        this._scheduleFetch(internalModel, options);
      } // Return the cached record


      return Ember.RSVP.Promise.resolve(internalModel);
    },

    _findByInternalModel(internalModel, options = {}) {
      if (options.preload) {
        internalModel.preloadData(options.preload);
      }

      var fetchedInternalModel = this._findEmptyInternalModel(internalModel, options);

      return promiseRecord(fetchedInternalModel, `DS: Store#findRecord ${internalModel.modelName} with id: ${internalModel.id}`);
    },

    _findEmptyInternalModel(internalModel, options) {
      if (internalModel.isEmpty()) {
        return this._scheduleFetch(internalModel, options);
      } //TODO double check about reloading


      if (internalModel.isLoading()) {
        return internalModel._promiseProxy;
      }

      return Ember.RSVP.Promise.resolve(internalModel);
    },

    /**
      This method makes a series of requests to the adapter's `find` method
      and returns a promise that resolves once they are all loaded.
       @private
      @method findByIds
      @param {String} modelName
      @param {Array} ids
      @return {Promise} promise
    */
    findByIds(modelName, ids) {
      {
        assertDestroyingStore(this, 'findByIds');
      }

      (true && !(Ember.isPresent(modelName)) && Ember.assert(`You need to pass a model name to the store's findByIds method`, Ember.isPresent(modelName)));
      (true && !(typeof modelName === 'string') && Ember.assert(`Passing classes to store methods has been removed. Please pass a dasherized string instead of ${modelName}`, typeof modelName === 'string'));
      var promises = new Array(ids.length);
      var normalizedModelName = normalizeModelName(modelName);

      for (var i = 0; i < ids.length; i++) {
        promises[i] = this.findRecord(normalizedModelName, ids[i]);
      }

      return promiseArray(Ember.RSVP.all(promises).then(Ember.A, null, `DS: Store#findByIds of ${normalizedModelName} complete`));
    },

    /**
      This method is called by `findRecord` if it discovers that a particular
      type/id pair hasn't been loaded yet to kick off a request to the
      adapter.
       @method _fetchRecord
      @private
      @param {InternalModel} internalModel model
      @return {Promise} promise
     */
    _fetchRecord(internalModel, options) {
      var modelName = internalModel.modelName;
      var adapter = this.adapterFor(modelName);
      (true && !(adapter) && Ember.assert(`You tried to find a record but you have no adapter (for ${modelName})`, adapter));
      (true && !(typeof adapter.findRecord === 'function') && Ember.assert(`You tried to find a record but your adapter (for ${modelName}) does not implement 'findRecord'`, typeof adapter.findRecord === 'function'));
      return _find(adapter, this, internalModel.type, internalModel.id, internalModel, options);
    },

    _scheduleFetchMany(internalModels, options) {
      var fetches = new Array(internalModels.length);

      for (var i = 0; i < internalModels.length; i++) {
        fetches[i] = this._scheduleFetch(internalModels[i], options);
      }

      return Ember.RSVP.Promise.all(fetches);
    },

    _scheduleFetch(internalModel, options) {
      if (internalModel._promiseProxy) {
        return internalModel._promiseProxy;
      }

      var {
        id,
        modelName
      } = internalModel;
      var resolver = Ember.RSVP.defer(`Fetching ${modelName}' with id: ${id}`);
      var pendingFetchItem = {
        internalModel,
        resolver,
        options
      };

      {
        if (this.generateStackTracesForTrackedRequests === true) {
          var trace;

          try {
            throw new Error(`Trace Origin for scheduled fetch for ${modelName}:${id}.`);
          } catch (e) {
            trace = e;
          } // enable folks to discover the origin of this findRecord call when
          // debugging. Ideally we would have a tracked queue for requests with
          // labels or local IDs that could be used to merge this trace with
          // the trace made available when we detect an async leak


          pendingFetchItem.trace = trace;
        }
      }

      var promise = resolver.promise;
      internalModel.loadingData(promise);

      if (this._pendingFetch.size === 0) {
        emberRun$1.schedule('actions', this, this.flushAllPendingFetches);
      }

      var fetches = this._pendingFetch;

      if (!fetches.has(modelName)) {
        fetches.set(modelName, []);
      }

      fetches.get(modelName).push(pendingFetchItem);
      return promise;
    },

    flushAllPendingFetches() {
      if (this.isDestroyed || this.isDestroying) {
        return;
      }

      this._pendingFetch.forEach(this._flushPendingFetchForType, this);

      this._pendingFetch.clear();
    },

    _flushPendingFetchForType(pendingFetchItems, modelName) {
      var store = this;
      var adapter = store.adapterFor(modelName);
      var shouldCoalesce = !!adapter.findMany && adapter.coalesceFindRequests;
      var totalItems = pendingFetchItems.length;
      var internalModels = new Array(totalItems);
      var seeking = Object.create(null);
      var optionsMap = new WeakMap();

      for (var _i = 0; _i < totalItems; _i++) {
        var pendingItem = pendingFetchItems[_i];
        var _internalModel = pendingItem.internalModel;
        internalModels[_i] = _internalModel;
        optionsMap.set(_internalModel, pendingItem.options);
        seeking[_internalModel.id] = pendingItem;
      }

      for (var _i2 = 0; _i2 < totalItems; _i2++) {
        var _internalModel2 = internalModels[_i2]; // We may have unloaded the record after scheduling this fetch, in which
        // case we must cancel the destroy.  This is because we require a record
        // to build a snapshot.  This is not fundamental: this cancelation code
        // can be removed when snapshots can be created for internal models that
        // have no records.

        if (_internalModel2.hasScheduledDestroy()) {
          internalModels[_i2].cancelDestroy();
        }
      }

      function _fetchRecord(recordResolverPair) {
        var recordFetch = store._fetchRecord(recordResolverPair.internalModel, recordResolverPair.options);

        recordResolverPair.resolver.resolve(recordFetch);
      }

      function handleFoundRecords(foundInternalModels, expectedInternalModels) {
        // resolve found records
        var found = Object.create(null);

        for (var _i3 = 0, _l = foundInternalModels.length; _i3 < _l; _i3++) {
          var _internalModel3 = foundInternalModels[_i3];
          var _pair = seeking[_internalModel3.id];
          found[_internalModel3.id] = _internalModel3;

          if (_pair) {
            var resolver = _pair.resolver;
            resolver.resolve(_internalModel3);
          }
        } // reject missing records


        var missingInternalModels = [];

        for (var _i4 = 0, _l2 = expectedInternalModels.length; _i4 < _l2; _i4++) {
          var _internalModel4 = expectedInternalModels[_i4];

          if (!found[_internalModel4.id]) {
            missingInternalModels.push(_internalModel4);
          }
        }

        if (missingInternalModels.length) {
          (true && Ember.warn('Ember Data expected to find records with the following ids in the adapter response but they were missing: [ "' + missingInternalModels.map(r => r.id).join('", "') + '" ]', false, {
            id: 'ds.store.missing-records-from-adapter'
          }));
          rejectInternalModels(missingInternalModels);
        }
      }

      function rejectInternalModels(internalModels, error) {
        for (var _i5 = 0, _l3 = internalModels.length; _i5 < _l3; _i5++) {
          var _internalModel5 = internalModels[_i5];
          var _pair2 = seeking[_internalModel5.id];

          if (_pair2) {
            _pair2.resolver.reject(error || new Error(`Expected: '${_internalModel5}' to be present in the adapter provided payload, but it was not found.`));
          }
        }
      }

      if (shouldCoalesce) {
        // TODO: Improve records => snapshots => records => snapshots
        //
        // We want to provide records to all store methods and snapshots to all
        // adapter methods. To make sure we're doing that we're providing an array
        // of snapshots to adapter.groupRecordsForFindMany(), which in turn will
        // return grouped snapshots instead of grouped records.
        //
        // But since the _findMany() finder is a store method we need to get the
        // records from the grouped snapshots even though the _findMany() finder
        // will once again convert the records to snapshots for adapter.findMany()
        var snapshots = new Array(totalItems);

        for (var _i6 = 0; _i6 < totalItems; _i6++) {
          snapshots[_i6] = internalModels[_i6].createSnapshot(optionsMap.get(internalModel));
        }

        var groups = adapter.groupRecordsForFindMany(this, snapshots);

        for (var i = 0, l = groups.length; i < l; i++) {
          var group = groups[i];
          var totalInGroup = groups[i].length;
          var ids = new Array(totalInGroup);
          var groupedInternalModels = new Array(totalInGroup);

          for (var j = 0; j < totalInGroup; j++) {
            var internalModel = group[j]._internalModel;
            groupedInternalModels[j] = internalModel;
            ids[j] = internalModel.id;
          }

          if (totalInGroup > 1) {
            (function (groupedInternalModels) {
              _findMany(adapter, store, modelName, ids, groupedInternalModels, optionsMap).then(function (foundInternalModels) {
                handleFoundRecords(foundInternalModels, groupedInternalModels);
              }).catch(function (error) {
                rejectInternalModels(groupedInternalModels, error);
              });
            })(groupedInternalModels);
          } else if (ids.length === 1) {
            var pair = seeking[groupedInternalModels[0].id];

            _fetchRecord(pair);
          } else {
            (true && !(false) && Ember.assert("You cannot return an empty array from adapter's method groupRecordsForFindMany", false));
          }
        }
      } else {
        for (var _i7 = 0; _i7 < totalItems; _i7++) {
          _fetchRecord(pendingFetchItems[_i7]);
        }
      }
    },

    /**
      Get the reference for the specified record.
       Example
       ```javascript
      let userRef = store.getReference('user', 1);
       // check if the user is loaded
      let isLoaded = userRef.value() !== null;
       // get the record of the reference (null if not yet available)
      let user = userRef.value();
       // get the identifier of the reference
      if (userRef.remoteType() === 'id') {
      let id = userRef.id();
      }
       // load user (via store.find)
      userRef.load().then(...)
       // or trigger a reload
      userRef.reload().then(...)
       // provide data for reference
      userRef.push({ id: 1, username: '@user' }).then(function(user) {
        userRef.value() === user;
      });
      ```
       @method getReference
      @param {String} modelName
      @param {String|Integer} id
      @since 2.5.0
      @return {RecordReference}
    */
    getReference(modelName, id) {
      {
        assertDestroyingStore(this, 'getReference');
      }

      var normalizedModelName = normalizeModelName(modelName);
      return this._internalModelForId(normalizedModelName, id).recordReference;
    },

    /**
      Get a record by a given type and ID without triggering a fetch.
       This method will synchronously return the record if it is available in the store,
      otherwise it will return `null`. A record is available if it has been fetched earlier, or
      pushed manually into the store.
       See [findRecord](#method_findRecord) if you would like to request this record from the backend.
       _Note: This is a synchronous method and does not return a promise._
       ```js
      let post = store.peekRecord('post', 1);
       post.get('id'); // 1
      ```
       @since 1.13.0
      @method peekRecord
      @param {String} modelName
      @param {String|Integer} id
      @return {DS.Model|null} record
    */
    peekRecord(modelName, id) {
      {
        assertDestroyingStore(this, 'peekRecord');
      }

      (true && !(Ember.isPresent(modelName)) && Ember.assert(`You need to pass a model name to the store's peekRecord method`, Ember.isPresent(modelName)));
      (true && !(Ember.isPresent(modelName) && Ember.isPresent(id)) && Ember.assert(`You need to pass both a model name and id to the store's peekRecord method`, Ember.isPresent(modelName) && Ember.isPresent(id)));
      (true && !(typeof modelName === 'string') && Ember.assert(`Passing classes to store methods has been removed. Please pass a dasherized string instead of ${modelName}`, typeof modelName === 'string'));
      var normalizedModelName = normalizeModelName(modelName);

      if (this.hasRecordForId(normalizedModelName, id)) {
        return this._internalModelForId(normalizedModelName, id).getRecord();
      } else {
        return null;
      }
    },

    /**
      This method is called by the record's `reload` method.
       This method calls the adapter's `find` method, which returns a promise. When
      **that** promise resolves, `_reloadRecord` will resolve the promise returned
      by the record's `reload`.
       @method _reloadRecord
      @private
      @param {DS.Model} internalModel
      @param options optional to include adapterOptions
      @return {Promise} promise
    */
    _reloadRecord(internalModel, options) {
      var {
        id,
        modelName
      } = internalModel;
      var adapter = this.adapterFor(modelName);
      (true && !(id) && Ember.assert(`You cannot reload a record without an ID`, id));
      (true && !(adapter) && Ember.assert(`You tried to reload a record but you have no adapter (for ${modelName})`, adapter));
      (true && !(typeof adapter.findRecord === 'function' || typeof adapter.find === 'function') && Ember.assert(`You tried to reload a record but your adapter does not implement 'findRecord'`, typeof adapter.findRecord === 'function' || typeof adapter.find === 'function'));
      return this._scheduleFetch(internalModel, options);
    },

    /**
     This method returns true if a record for a given modelName and id is already
     loaded in the store. Use this function to know beforehand if a findRecord()
     will result in a request or that it will be a cache hit.
      Example
      ```javascript
     store.hasRecordForId('post', 1); // false
     store.findRecord('post', 1).then(function() {
       store.hasRecordForId('post', 1); // true
     });
     ```
       @method hasRecordForId
      @param {String} modelName
      @param {(String|Integer)} id
      @return {Boolean}
    */
    hasRecordForId(modelName, id) {
      {
        assertDestroyingStore(this, 'hasRecordForId');
      }

      (true && !(Ember.isPresent(modelName)) && Ember.assert(`You need to pass a model name to the store's hasRecordForId method`, Ember.isPresent(modelName)));
      (true && !(typeof modelName === 'string') && Ember.assert(`Passing classes to store methods has been removed. Please pass a dasherized string instead of ${modelName}`, typeof modelName === 'string'));
      var normalizedModelName = normalizeModelName(modelName);
      var trueId = coerceId(id);

      var internalModel = this._internalModelsFor(normalizedModelName).get(trueId);

      return !!internalModel && internalModel.isLoaded();
    },

    /**
      Returns id record for a given type and ID. If one isn't already loaded,
      it builds a new record and leaves it in the `empty` state.
       @method recordForId
      @private
      @param {String} modelName
      @param {(String|Integer)} id
      @return {DS.Model} record
    */
    recordForId(modelName, id) {
      {
        assertDestroyingStore(this, 'recordForId');
      }

      (true && !(Ember.isPresent(modelName)) && Ember.assert(`You need to pass a model name to the store's recordForId method`, Ember.isPresent(modelName)));
      (true && !(typeof modelName === 'string') && Ember.assert(`Passing classes to store methods has been removed. Please pass a dasherized string instead of ${modelName}`, typeof modelName === 'string'));
      return this._internalModelForId(modelName, id).getRecord();
    },

    // directly get an internal model from ID map if it is there, without doing any
    // processing
    _getInternalModelForId(modelName, id, clientId) {
      var internalModel;

      if (clientId) {
        internalModel = this._newlyCreatedModelsFor(modelName).get(clientId);
      }

      if (!internalModel) {
        internalModel = this._internalModelsFor(modelName).get(id);
      }

      return internalModel;
    },

    _internalModelForId(modelName, id, clientId) {
      var trueId = coerceId(id);

      var internalModel = this._getInternalModelForId(modelName, trueId, clientId);

      if (internalModel) {
        // unloadRecord is async, if one attempts to unload + then sync push,
        //   we must ensure the unload is canceled before continuing
        //   The createRecord path will take _existingInternalModelForId()
        //   which will call `destroySync` instead for this unload + then
        //   sync createRecord scenario. Once we have true client-side
        //   delete signaling, we should never call destroySync
        if (internalModel.hasScheduledDestroy()) {
          internalModel.cancelDestroy();
        }

        return internalModel;
      }

      return this._buildInternalModel(modelName, trueId, null, clientId);
    },

    /**
      @method findMany
      @private
      @param {Array} internalModels
      @return {Promise} promise
    */
    findMany(internalModels, options) {
      {
        assertDestroyingStore(this, 'findMany');
      }

      var finds = new Array(internalModels.length);

      for (var i = 0; i < internalModels.length; i++) {
        finds[i] = this._findEmptyInternalModel(internalModels[i], options);
      }

      return Ember.RSVP.Promise.all(finds);
    },

    /**
      If a relationship was originally populated by the adapter as a link
      (as opposed to a list of IDs), this method is called when the
      relationship is fetched.
       The link (which is usually a URL) is passed through unchanged, so the
      adapter can make whatever request it wants.
       The usual use-case is for the server to register a URL as a link, and
      then use that URL in the future to make a request for the relationship.
       @method findHasMany
      @private
      @param {InternalModel} internalModel
      @param {any} link
      @param {(Relationship)} relationship
      @return {Promise} promise
    */
    findHasMany(internalModel, link, relationship, options) {
      {
        assertDestroyingStore(this, 'findHasMany');
      }

      var adapter = this.adapterFor(internalModel.modelName);
      (true && !(adapter) && Ember.assert(`You tried to load a hasMany relationship but you have no adapter (for ${internalModel.modelName})`, adapter));
      (true && !(typeof adapter.findHasMany === 'function') && Ember.assert(`You tried to load a hasMany relationship from a specified 'link' in the original payload but your adapter does not implement 'findHasMany'`, typeof adapter.findHasMany === 'function'));
      return _findHasMany(adapter, this, internalModel, link, relationship, options);
    },

    _findHasManyByJsonApiResource(resource, parentInternalModel, relationshipMeta, options) {
      if (!resource) {
        return Ember.RSVP.resolve([]);
      }

      var {
        relationshipIsStale,
        allInverseRecordsAreLoaded,
        hasDematerializedInverse,
        hasAnyRelationshipData,
        relationshipIsEmpty
      } = resource._relationship;
      var shouldFindViaLink = resource.links && resource.links.related && (hasDematerializedInverse || relationshipIsStale || !allInverseRecordsAreLoaded && !relationshipIsEmpty); // fetch via link

      if (shouldFindViaLink) {
        return this.findHasMany(parentInternalModel, resource.links.related, relationshipMeta, options).then(internalModels => {
          var payload = {
            data: internalModels.map(im => im._recordData.getResourceIdentifier())
          };

          if (internalModels.meta !== undefined) {
            payload.meta = internalModels.meta;
          }

          parentInternalModel.linkWasLoadedForRelationship(relationshipMeta.key, payload);
          return internalModels;
        });
      }

      var preferLocalCache = hasAnyRelationshipData && !relationshipIsEmpty;
      var hasLocalPartialData = hasDematerializedInverse || relationshipIsEmpty && Array.isArray(resource.data) && resource.data.length > 0; // fetch using data, pulling from local cache if possible

      if (!relationshipIsStale && (preferLocalCache || hasLocalPartialData)) {
        var internalModels = resource.data.map(json => this._internalModelForResource(json));
        return this.findMany(internalModels, options);
      }

      var hasData = hasAnyRelationshipData && !relationshipIsEmpty; // fetch by data

      if (hasData || hasLocalPartialData) {
        var _internalModels2 = resource.data.map(json => this._internalModelForResource(json));

        return this._scheduleFetchMany(_internalModels2, options);
      } // we were explicitly told we have no data and no links.
      //   TODO if the relationshipIsStale, should we hit the adapter anyway?


      return Ember.RSVP.resolve([]);
    },

    _getHasManyByJsonApiResource(resource) {
      var internalModels = [];

      if (resource && resource.data) {
        internalModels = resource.data.map(reference => this._internalModelForResource(reference));
      }

      return internalModels;
    },

    /**
      @method findBelongsTo
      @private
      @param {InternalModel} internalModel
      @param {any} link
      @param {Relationship} relationship
      @return {Promise} promise
    */
    findBelongsTo(internalModel, link, relationship, options) {
      {
        assertDestroyingStore(this, 'findBelongsTo');
      }

      var adapter = this.adapterFor(internalModel.modelName);
      (true && !(adapter) && Ember.assert(`You tried to load a belongsTo relationship but you have no adapter (for ${internalModel.modelName})`, adapter));
      (true && !(typeof adapter.findBelongsTo === 'function') && Ember.assert(`You tried to load a belongsTo relationship from a specified 'link' in the original payload but your adapter does not implement 'findBelongsTo'`, typeof adapter.findBelongsTo === 'function'));
      return _findBelongsTo(adapter, this, internalModel, link, relationship, options);
    },

    _fetchBelongsToLinkFromResource(resource, parentInternalModel, relationshipMeta, options) {
      if (!resource || !resource.links || !resource.links.related) {
        // should we warn here, not sure cause its an internal method
        return Ember.RSVP.resolve(null);
      }

      return this.findBelongsTo(parentInternalModel, resource.links.related, relationshipMeta, options).then(internalModel => {
        var response = internalModel && internalModel._recordData.getResourceIdentifier();

        parentInternalModel.linkWasLoadedForRelationship(relationshipMeta.key, {
          data: response
        });

        if (internalModel === null) {
          return null;
        } // TODO Igor this doesn't seem like the right boundary, probably the caller method should extract the record out


        return internalModel.getRecord();
      });
    },

    _findBelongsToByJsonApiResource(resource, parentInternalModel, relationshipMeta, options) {
      if (!resource) {
        return Ember.RSVP.resolve(null);
      }

      var internalModel = resource.data ? this._internalModelForResource(resource.data) : null;
      var {
        relationshipIsStale,
        allInverseRecordsAreLoaded,
        hasDematerializedInverse,
        hasAnyRelationshipData,
        relationshipIsEmpty
      } = resource._relationship;
      var shouldFindViaLink = resource.links && resource.links.related && (hasDematerializedInverse || relationshipIsStale || !allInverseRecordsAreLoaded && !relationshipIsEmpty); // short circuit if we are already loading

      if (internalModel && internalModel.isLoading()) {
        return internalModel._promiseProxy.then(() => {
          return internalModel.getRecord();
        });
      } // fetch via link


      if (shouldFindViaLink) {
        return this._fetchBelongsToLinkFromResource(resource, parentInternalModel, relationshipMeta, options);
      }

      var preferLocalCache = hasAnyRelationshipData && allInverseRecordsAreLoaded && !relationshipIsEmpty;
      var hasLocalPartialData = hasDematerializedInverse || relationshipIsEmpty && resource.data; // null is explicit empty, undefined is "we don't know anything"

      var localDataIsEmpty = resource.data === undefined || resource.data === null; // fetch using data, pulling from local cache if possible

      if (!relationshipIsStale && (preferLocalCache || hasLocalPartialData)) {
        /*
          We have canonical data, but our local state is empty
         */
        if (localDataIsEmpty) {
          return Ember.RSVP.resolve(null);
        }

        return this._findByInternalModel(internalModel, options);
      }

      var resourceIsLocal = !localDataIsEmpty && resource.data.id === null;

      if (resourceIsLocal) {
        return Ember.RSVP.resolve(internalModel.getRecord());
      } // fetch by data


      if (!localDataIsEmpty) {
        return this._scheduleFetch(internalModel, options).then(() => {
          return internalModel.getRecord();
        });
      } // we were explicitly told we have no data and no links.
      //   TODO if the relationshipIsStale, should we hit the adapter anyway?


      return Ember.RSVP.resolve(null);
    },

    /**
      This method delegates a query to the adapter. This is the one place where
      adapter-level semantics are exposed to the application.
       Each time this method is called a new request is made through the adapter.
       Exposing queries this way seems preferable to creating an abstract query
      language for all server-side queries, and then require all adapters to
      implement them.
       ---
       If you do something like this:
       ```javascript
      store.query('person', { page: 1 });
      ```
       The call made to the server, using a Rails backend, will look something like this:
       ```
      Started GET "/api/v1/person?page=1"
      Processing by Api::V1::PersonsController#index as HTML
      Parameters: { "page"=>"1" }
      ```
       ---
       If you do something like this:
       ```javascript
      store.query('person', { ids: [1, 2, 3] });
      ```
       The call to the server, using a Rails backend, will look something like this:
       ```
      Started GET "/api/v1/person?ids%5B%5D=1&ids%5B%5D=2&ids%5B%5D=3"
      Processing by Api::V1::PersonsController#index as HTML
      Parameters: { "ids" => ["1", "2", "3"] }
      ```
       This method returns a promise, which is resolved with an
      [`AdapterPopulatedRecordArray`](https://emberjs.com/api/data/classes/DS.AdapterPopulatedRecordArray.html)
      once the server returns.
       @since 1.13.0
      @method query
      @param {String} modelName
      @param {any} query an opaque query to be used by the adapter
      @param {Object} options optional, may include `adapterOptions` hash which will be passed to adapter.query
      @return {Promise} promise
    */
    query(modelName, query, options) {
      {
        assertDestroyingStore(this, 'query');
      }

      (true && !(Ember.isPresent(modelName)) && Ember.assert(`You need to pass a model name to the store's query method`, Ember.isPresent(modelName)));
      (true && !(query) && Ember.assert(`You need to pass a query hash to the store's query method`, query));
      (true && !(typeof modelName === 'string') && Ember.assert(`Passing classes to store methods has been removed. Please pass a dasherized string instead of ${modelName}`, typeof modelName === 'string'));
      var adapterOptionsWrapper = {};

      if (options && options.adapterOptions) {
        adapterOptionsWrapper.adapterOptions = options.adapterOptions;
      }

      var normalizedModelName = normalizeModelName(modelName);
      return this._query(normalizedModelName, query, null, adapterOptionsWrapper);
    },

    _query(modelName, query, array, options) {
      (true && !(Ember.isPresent(modelName)) && Ember.assert(`You need to pass a model name to the store's query method`, Ember.isPresent(modelName)));
      (true && !(query) && Ember.assert(`You need to pass a query hash to the store's query method`, query));
      (true && !(typeof modelName === 'string') && Ember.assert(`Passing classes to store methods has been removed. Please pass a dasherized string instead of ${modelName}`, typeof modelName === 'string'));
      var adapter = this.adapterFor(modelName);
      (true && !(adapter) && Ember.assert(`You tried to load a query but you have no adapter (for ${modelName})`, adapter));
      (true && !(typeof adapter.query === 'function') && Ember.assert(`You tried to load a query but your adapter does not implement 'query'`, typeof adapter.query === 'function'));
      var pA = promiseArray(_query(adapter, this, modelName, query, array, options));
      return pA;
    },

    /**
      This method makes a request for one record, where the `id` is not known
      beforehand (if the `id` is known, use [`findRecord`](#method_findRecord)
      instead).
       This method can be used when it is certain that the server will return a
      single object for the primary data.
       Each time this method is called a new request is made through the adapter.
       Let's assume our API provides an endpoint for the currently logged in user
      via:
       ```
      // GET /api/current_user
      {
        user: {
          id: 1234,
          username: 'admin'
        }
      }
      ```
       Since the specific `id` of the `user` is not known beforehand, we can use
      `queryRecord` to get the user:
       ```javascript
      store.queryRecord('user', {}).then(function(user) {
        let username = user.get('username');
        console.log(`Currently logged in as ${username}`);
      });
      ```
       The request is made through the adapters' `queryRecord`:
       ```app/adapters/user.js
      import $ from 'jquery';
      import DS from 'ember-data';
       export default DS.Adapter.extend({
        queryRecord(modelName, query) {
          return $.getJSON('/api/current_user');
        }
      });
      ```
       Note: the primary use case for `store.queryRecord` is when a single record
      is queried and the `id` is not known beforehand. In all other cases
      `store.query` and using the first item of the array is likely the preferred
      way:
       ```
      // GET /users?username=unique
      {
        data: [{
          id: 1234,
          type: 'user',
          attributes: {
            username: "unique"
          }
        }]
      }
      ```
       ```javascript
      store.query('user', { username: 'unique' }).then(function(users) {
        return users.get('firstObject');
      }).then(function(user) {
        let id = user.get('id');
      });
      ```
       This method returns a promise, which resolves with the found record.
       If the adapter returns no data for the primary data of the payload, then
      `queryRecord` resolves with `null`:
       ```
      // GET /users?username=unique
      {
        data: null
      }
      ```
       ```javascript
      store.queryRecord('user', { username: 'unique' }).then(function(user) {
        console.log(user); // null
      });
      ```
       @since 1.13.0
      @method queryRecord
      @param {String} modelName
      @param {any} query an opaque query to be used by the adapter
      @param {Object} options optional, may include `adapterOptions` hash which will be passed to adapter.queryRecord
      @return {Promise} promise which resolves with the found record or `null`
    */
    queryRecord(modelName, query, options) {
      {
        assertDestroyingStore(this, 'queryRecord');
      }

      (true && !(Ember.isPresent(modelName)) && Ember.assert(`You need to pass a model name to the store's queryRecord method`, Ember.isPresent(modelName)));
      (true && !(query) && Ember.assert(`You need to pass a query hash to the store's queryRecord method`, query));
      (true && !(typeof modelName === 'string') && Ember.assert(`Passing classes to store methods has been removed. Please pass a dasherized string instead of ${modelName}`, typeof modelName === 'string'));
      var normalizedModelName = normalizeModelName(modelName);
      var adapter = this.adapterFor(normalizedModelName);
      var adapterOptionsWrapper = {};

      if (options && options.adapterOptions) {
        adapterOptionsWrapper.adapterOptions = options.adapterOptions;
      }

      (true && !(adapter) && Ember.assert(`You tried to make a query but you have no adapter (for ${normalizedModelName})`, adapter));
      (true && !(typeof adapter.queryRecord === 'function') && Ember.assert(`You tried to make a query but your adapter does not implement 'queryRecord'`, typeof adapter.queryRecord === 'function'));
      return promiseObject(_queryRecord(adapter, this, normalizedModelName, query, adapterOptionsWrapper).then(internalModel => {
        // the promise returned by store.queryRecord is expected to resolve with
        // an instance of DS.Model
        if (internalModel) {
          return internalModel.getRecord();
        }

        return null;
      }));
    },

    /**
      `findAll` asks the adapter's `findAll` method to find the records for the
      given type, and returns a promise which will resolve with all records of
      this type present in the store, even if the adapter only returns a subset
      of them.
       ```app/routes/authors.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        model(params) {
          return this.store.findAll('author');
        }
      });
      ```
       _When_ the returned promise resolves depends on the reload behavior,
      configured via the passed `options` hash and the result of the adapter's
      `shouldReloadAll` method.
       ### Reloading
       If `{ reload: true }` is passed or `adapter.shouldReloadAll` evaluates to
      `true`, then the returned promise resolves once the adapter returns data,
      regardless if there are already records in the store:
       ```js
      store.push({
        data: {
          id: 'first',
          type: 'author'
        }
      });
       // adapter#findAll resolves with
      // [
      //   {
      //     id: 'second',
      //     type: 'author'
      //   }
      // ]
      store.findAll('author', { reload: true }).then(function(authors) {
        authors.getEach('id'); // ['first', 'second']
      });
      ```
       If no reload is indicated via the abovementioned ways, then the promise
      immediately resolves with all the records currently loaded in the store.
       ### Background Reloading
       Optionally, if `adapter.shouldBackgroundReloadAll` evaluates to `true`,
      then a background reload is started. Once this resolves, the array with
      which the promise resolves, is updated automatically so it contains all the
      records in the store:
       ```app/adapters/application.js
      import DS from 'ember-data';
      export default DS.Adapter.extend({
        shouldReloadAll(store, snapshotsArray) {
          return false;
        },
         shouldBackgroundReloadAll(store, snapshotsArray) {
          return true;
        }
      });
       // ...
       store.push({
        data: {
          id: 'first',
          type: 'author'
        }
      });
       let allAuthors;
      store.findAll('author').then(function(authors) {
        authors.getEach('id'); // ['first']
         allAuthors = authors;
      });
       // later, once adapter#findAll resolved with
      // [
      //   {
      //     id: 'second',
      //     type: 'author'
      //   }
      // ]
       allAuthors.getEach('id'); // ['first', 'second']
      ```
       If you would like to force or prevent background reloading, you can set a
      boolean value for `backgroundReload` in the options object for
      `findAll`.
       ```app/routes/post/edit.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        model() {
          return this.store.findAll('post', { backgroundReload: false });
        }
      });
      ```
       If you pass an object on the `adapterOptions` property of the options
      argument it will be passed to you adapter via the `snapshotRecordArray`
       ```app/routes/posts.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        model(params) {
          return this.store.findAll('post', {
            adapterOptions: { subscribe: false }
          });
        }
      });
      ```
       ```app/adapters/post.js
      import MyCustomAdapter from './custom-adapter';
       export default MyCustomAdapter.extend({
        findAll(store, type, sinceToken, snapshotRecordArray) {
          if (snapshotRecordArray.adapterOptions.subscribe) {
            // ...
          }
          // ...
        }
      });
      ```
       See [peekAll](#method_peekAll) to get an array of current records in the
      store, without waiting until a reload is finished.
       ### Retrieving Related Model Records
       If you use an adapter such as Ember's default
      [`JSONAPIAdapter`](https://emberjs.com/api/data/classes/DS.JSONAPIAdapter.html)
      that supports the [JSON API specification](http://jsonapi.org/) and if your server
      endpoint supports the use of an
      ['include' query parameter](http://jsonapi.org/format/#fetching-includes),
      you can use `findAll()` to automatically retrieve additional records related to
      those requested by supplying an `include` parameter in the `options` object.
       For example, given a `post` model that has a `hasMany` relationship with a `comment`
      model, when we retrieve all of the post records we can have the server also return
      all of the posts' comments in the same request:
       ```app/routes/posts.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        model() {
          return this.store.findAll('post', { include: 'comments' });
        }
      });
       ```
      Multiple relationships can be requested using an `include` parameter consisting of a
      comma-separated list (without white-space) while nested relationships can be specified
      using a dot-separated sequence of relationship names. So to request both the posts'
      comments and the authors of those comments the request would look like this:
       ```app/routes/posts.js
      import Route from '@ember/routing/route';
       export default Route.extend({
        model() {
          return this.store.findAll('post', { include: 'comments,comments.author' });
        }
      });
       ```
       See [query](#method_query) to only get a subset of records from the server.
       @since 1.13.0
      @method findAll
      @param {String} modelName
      @param {Object} options
      @return {Promise} promise
    */
    findAll(modelName, options) {
      {
        assertDestroyingStore(this, 'findAll');
      }

      (true && !(Ember.isPresent(modelName)) && Ember.assert(`You need to pass a model name to the store's findAll method`, Ember.isPresent(modelName)));
      (true && !(typeof modelName === 'string') && Ember.assert(`Passing classes to store methods has been removed. Please pass a dasherized string instead of ${modelName}`, typeof modelName === 'string'));
      var normalizedModelName = normalizeModelName(modelName);

      var fetch = this._fetchAll(normalizedModelName, this.peekAll(normalizedModelName), options);

      return fetch;
    },

    /**
      @method _fetchAll
      @private
      @param {DS.Model} modelName
      @param {DS.RecordArray} array
      @return {Promise} promise
    */
    _fetchAll(modelName, array, options = {}) {
      var adapter = this.adapterFor(modelName);

      var sinceToken = this._internalModelsFor(modelName).metadata.since;

      (true && !(adapter) && Ember.assert(`You tried to load all records but you have no adapter (for ${modelName})`, adapter));
      (true && !(typeof adapter.findAll === 'function') && Ember.assert(`You tried to load all records but your adapter does not implement 'findAll'`, typeof adapter.findAll === 'function'));

      if (options.reload) {
        Ember.set(array, 'isUpdating', true);
        return promiseArray(_findAll(adapter, this, modelName, sinceToken, options));
      }

      var snapshotArray = array._createSnapshot(options);

      if (adapter.shouldReloadAll(this, snapshotArray)) {
        Ember.set(array, 'isUpdating', true);
        return promiseArray(_findAll(adapter, this, modelName, sinceToken, options));
      }

      if (options.backgroundReload === false) {
        return promiseArray(Ember.RSVP.Promise.resolve(array));
      }

      if (options.backgroundReload || adapter.shouldBackgroundReloadAll(this, snapshotArray)) {
        Ember.set(array, 'isUpdating', true);

        _findAll(adapter, this, modelName, sinceToken, options);
      }

      return promiseArray(Ember.RSVP.Promise.resolve(array));
    },

    /**
      @method _didUpdateAll
      @param {String} modelName
      @private
    */
    _didUpdateAll(modelName) {
      this.recordArrayManager._didUpdateAll(modelName);
    },

    /**
      This method returns a filtered array that contains all of the
      known records for a given type in the store.
       Note that because it's just a filter, the result will contain any
      locally created records of the type, however, it will not make a
      request to the backend to retrieve additional records. If you
      would like to request all the records from the backend please use
      [store.findAll](#method_findAll).
       Also note that multiple calls to `peekAll` for a given type will always
      return the same `RecordArray`.
       Example
       ```javascript
      let localPosts = store.peekAll('post');
      ```
       @since 1.13.0
      @method peekAll
      @param {String} modelName
      @return {DS.RecordArray}
    */
    peekAll(modelName) {
      {
        assertDestroyingStore(this, 'peekAll');
      }

      (true && !(Ember.isPresent(modelName)) && Ember.assert(`You need to pass a model name to the store's peekAll method`, Ember.isPresent(modelName)));
      (true && !(typeof modelName === 'string') && Ember.assert(`Passing classes to store methods has been removed. Please pass a dasherized string instead of ${modelName}`, typeof modelName === 'string'));
      var normalizedModelName = normalizeModelName(modelName);
      return this.recordArrayManager.liveRecordArrayFor(normalizedModelName);
    },

    /**
      This method unloads all records in the store.
      It schedules unloading to happen during the next run loop.
       Optionally you can pass a type which unload all records for a given type.
       ```javascript
      store.unloadAll();
      store.unloadAll('post');
      ```
       @method unloadAll
      @param {String} modelName
    */
    unloadAll(modelName) {
      {
        assertDestroyedStoreOnly(this, 'unloadAll');
      }

      (true && !(!modelName || typeof modelName === 'string') && Ember.assert(`Passing classes to store methods has been removed. Please pass a dasherized string instead of ${modelName}`, !modelName || typeof modelName === 'string'));

      if (arguments.length === 0) {
        this._identityMap.clear();
      } else {
        var normalizedModelName = normalizeModelName(modelName);

        this._internalModelsFor(normalizedModelName).clear();
      }
    },

    filter() {
      (true && !(false) && Ember.assert('The filter API has been moved to a plugin. To enable store.filter using an environment flag, or to use an alternative, you can visit the ember-data-filter addon page. https://github.com/ember-data/ember-data-filter', false));
    },

    // ..............
    // . PERSISTING .
    // ..............

    /**
      This method is called by `record.save`, and gets passed a
      resolver for the promise that `record.save` returns.
       It schedules saving to happen at the end of the run loop.
       @method scheduleSave
      @private
      @param {InternalModel} internalModel
      @param {Resolver} resolver
      @param {Object} options
    */
    scheduleSave(internalModel, resolver, options) {
      var snapshot = internalModel.createSnapshot(options);
      internalModel.adapterWillCommit();

      this._pendingSave.push({
        snapshot: snapshot,
        resolver: resolver
      });

      emberRun$1.scheduleOnce('actions', this, this.flushPendingSave);
    },

    /**
      This method is called at the end of the run loop, and
      flushes any records passed into `scheduleSave`
       @method flushPendingSave
      @private
    */
    flushPendingSave() {
      var pending = this._pendingSave.slice();

      this._pendingSave = [];

      for (var i = 0, j = pending.length; i < j; i++) {
        var pendingItem = pending[i];
        var snapshot = pendingItem.snapshot;
        var resolver = pendingItem.resolver;
        var internalModel = snapshot._internalModel;
        var adapter = this.adapterFor(internalModel.modelName);
        var operation = void 0;

        if (internalModel.currentState.stateName === 'root.deleted.saved') {
          resolver.resolve();
          continue;
        } else if (internalModel.isNew()) {
          operation = 'createRecord';
        } else if (internalModel.isDeleted()) {
          operation = 'deleteRecord';
        } else {
          operation = 'updateRecord';
        }

        resolver.resolve(_commit(adapter, this, operation, snapshot));
      }
    },

    /**
      This method is called once the promise returned by an
      adapter's `createRecord`, `updateRecord` or `deleteRecord`
      is resolved.
       If the data provides a server-generated ID, it will
      update the record and the store's indexes.
       @method didSaveRecord
      @private
      @param {InternalModel} internalModel the in-flight internal model
      @param {Object} data optional data (see above)
    */
    didSaveRecord(internalModel, dataArg) {
      {
        assertDestroyingStore(this, 'didSaveRecord');
      }

      var data;

      if (dataArg) {
        data = dataArg.data;
      }

      if (!data) {
        (true && !(internalModel.id) && Ember.assert(`Your ${internalModel.modelName} record was saved to the server, but the response does not have an id and no id has been set client side. Records must have ids. Please update the server response to provide an id in the response or generate the id on the client side either before saving the record or while normalizing the response.`, internalModel.id));
      } //We first make sure the primary data has been updated
      //TODO try to move notification to the user to the end of the runloop


      internalModel.adapterDidCommit(data);
    },

    /**
      This method is called once the promise returned by an
      adapter's `createRecord`, `updateRecord` or `deleteRecord`
      is rejected with a `DS.InvalidError`.
       @method recordWasInvalid
      @private
      @param {InternalModel} internalModel
      @param {Object} errors
    */
    recordWasInvalid(internalModel, errors) {
      {
        assertDestroyingStore(this, 'recordWasInvalid');
      }

      internalModel.adapterDidInvalidate(errors);
    },

    /**
      This method is called once the promise returned by an
      adapter's `createRecord`, `updateRecord` or `deleteRecord`
      is rejected (with anything other than a `DS.InvalidError`).
       @method recordWasError
      @private
      @param {InternalModel} internalModel
      @param {Error} error
    */
    recordWasError(internalModel, error) {
      {
        assertDestroyingStore(this, 'recordWasError');
      }

      internalModel.adapterDidError(error);
    },

    /**
      Sets newly received ID from the adapter's `createRecord`, `updateRecord`
      or `deleteRecord`.
       @method setRecordId
      @private
      @param {String} modelName
      @param {string} newId
      @param {number} clientId
     */
    setRecordId(modelName, newId, clientId) {
      var trueId = coerceId(newId);

      var internalModel = this._getInternalModelForId(modelName, trueId, clientId);

      this._setRecordId(internalModel, newId, clientId);
    },

    _setRecordId(internalModel, id, clientId) {
      {
        assertDestroyingStore(this, 'setRecordId');
      }

      var oldId = internalModel.id;
      var modelName = internalModel.modelName; // ID absolutely can't be missing if the oldID is empty (missing Id in response for a new record)

      (true && !(!(id === null && oldId === null)) && Ember.assert(`'${modelName}' was saved to the server, but the response does not have an id and your record does not either.`, !(id === null && oldId === null))); // ID absolutely can't be different than oldID if oldID is not null

      (true && !(!(oldId !== null && id !== oldId)) && Ember.assert(`'${modelName}:${oldId}' was saved to the server, but the response returned the new id '${id}'. The store cannot assign a new id to a record that already has an id.`, !(oldId !== null && id !== oldId))); // ID can be null if oldID is not null (altered ID in response for a record)
      // however, this is more than likely a developer error.

      if (oldId !== null && id === null) {
        (true && Ember.warn(`Your ${modelName} record was saved to the server, but the response does not have an id.`, !(oldId !== null && id === null)));
        return;
      }

      var existingInternalModel = this._existingInternalModelForId(modelName, id);

      (true && !(Ember.isNone(existingInternalModel) || existingInternalModel === internalModel) && Ember.assert(`'${modelName}' was saved to the server, but the response returned the new id '${id}', which has already been used with another record.'`, Ember.isNone(existingInternalModel) || existingInternalModel === internalModel));

      this._internalModelsFor(internalModel.modelName).set(id, internalModel);

      this._newlyCreatedModelsFor(internalModel.modelName).remove(internalModel, clientId);

      internalModel.setId(id);
    },

    /**
      Returns a map of IDs to client IDs for a given modelName.
       @method _internalModelsFor
      @private
      @param {String} modelName
      @return {Object} recordMap
    */
    _internalModelsFor(modelName) {
      return this._identityMap.retrieve(modelName);
    },

    _newlyCreatedModelsFor(modelName) {
      return this._newlyCreated.retrieve(modelName);
    },

    // ................
    // . LOADING DATA .
    // ................

    /**
      This internal method is used by `push`.
       @method _load
      @private
      @param {Object} data
    */
    _load(data) {
      var modelName = normalizeModelName(data.type);

      var internalModel = this._internalModelForId(modelName, data.id);

      var isUpdate = internalModel.currentState.isEmpty === false;
      internalModel.setupData(data);

      if (isUpdate) {
        this.recordArrayManager.recordDidChange(internalModel);
      } else {
        this.recordArrayManager.recordWasLoaded(internalModel);
      }

      return internalModel;
    },

    /**
      Returns the model class for the particular `modelName`.
       The class of a model might be useful if you want to get a list of all the
      relationship names of the model, see
      [`relationshipNames`](https://emberjs.com/api/data/classes/DS.Model.html#property_relationshipNames)
      for example.
       @method modelFor
      @param {String} modelName
      @return {DS.Model}
    */
    modelFor(modelName) {
      {
        assertDestroyedStoreOnly(this, 'modelFor');
      }

      (true && !(Ember.isPresent(modelName)) && Ember.assert(`You need to pass a model name to the store's modelFor method`, Ember.isPresent(modelName)));
      (true && !(typeof modelName === 'string') && Ember.assert(`Passing classes to store methods has been removed. Please pass a dasherized string instead of ${modelName}`, typeof modelName === 'string'));

      var maybeFactory = this._modelFactoryFor(modelName); // for factorFor factory/class split


      return maybeFactory.class ? maybeFactory.class : maybeFactory;
    },

    _modelFactoryFor(modelName) {
      {
        assertDestroyedStoreOnly(this, '_modelFactoryFor');
      }

      (true && !(Ember.isPresent(modelName)) && Ember.assert(`You need to pass a model name to the store's _modelFactoryFor method`, Ember.isPresent(modelName)));
      (true && !(typeof modelName === 'string') && Ember.assert(`Passing classes to store methods has been removed. Please pass a dasherized string instead of ${modelName}`, typeof modelName === 'string'));
      var normalizedModelName = normalizeModelName(modelName);
      var factory = getModelFactory(this, this._modelFactoryCache, normalizedModelName);

      if (factory === null) {
        throw new Ember.Error(`No model was found for '${normalizedModelName}'`);
      }

      return factory;
    },

    /*
    Returns whether a ModelClass exists for a given modelName
    This exists for legacy support for the RESTSerializer,
    which due to how it must guess whether a key is a model
    must query for whether a match exists.
     We should investigate an RFC to make this public or removing
    this requirement.
     @private
    */
    _hasModelFor(modelName) {
      {
        assertDestroyingStore(this, '_hasModelFor');
      }

      (true && !(Ember.isPresent(modelName)) && Ember.assert(`You need to pass a model name to the store's hasModelFor method`, Ember.isPresent(modelName)));
      (true && !(typeof modelName === 'string') && Ember.assert(`Passing classes to store methods has been removed. Please pass a dasherized string instead of ${modelName}`, typeof modelName === 'string'));
      var normalizedModelName = normalizeModelName(modelName);
      var factory = getModelFactory(this, this._modelFactoryCache, normalizedModelName);
      return factory !== null;
    },

    /**
      Push some data for a given type into the store.
       This method expects normalized [JSON API](http://jsonapi.org/) document. This means you have to follow [JSON API specification](http://jsonapi.org/format/) with few minor adjustments:
      - record's `type` should always be in singular, dasherized form
      - members (properties) should be camelCased
       [Your primary data should be wrapped inside `data` property](http://jsonapi.org/format/#document-top-level):
       ```js
      store.push({
        data: {
          // primary data for single record of type `Person`
          id: '1',
          type: 'person',
          attributes: {
            firstName: 'Daniel',
            lastName: 'Kmak'
          }
        }
      });
      ```
       [Demo.](http://ember-twiddle.com/fb99f18cd3b4d3e2a4c7)
       `data` property can also hold an array (of records):
       ```js
      store.push({
        data: [
          // an array of records
          {
            id: '1',
            type: 'person',
            attributes: {
              firstName: 'Daniel',
              lastName: 'Kmak'
            }
          },
          {
            id: '2',
            type: 'person',
            attributes: {
              firstName: 'Tom',
              lastName: 'Dale'
            }
          }
        ]
      });
      ```
       [Demo.](http://ember-twiddle.com/69cdbeaa3702159dc355)
       There are some typical properties for `JSONAPI` payload:
      * `id` - mandatory, unique record's key
      * `type` - mandatory string which matches `model`'s dasherized name in singular form
      * `attributes` - object which holds data for record attributes - `DS.attr`'s declared in model
      * `relationships` - object which must contain any of the following properties under each relationships' respective key (example path is `relationships.achievements.data`):
        - [`links`](http://jsonapi.org/format/#document-links)
        - [`data`](http://jsonapi.org/format/#document-resource-object-linkage) - place for primary data
        - [`meta`](http://jsonapi.org/format/#document-meta) - object which contains meta-information about relationship
       For this model:
       ```app/models/person.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        firstName: DS.attr('string'),
        lastName: DS.attr('string'),
         children: DS.hasMany('person')
      });
      ```
       To represent the children as IDs:
       ```js
      {
        data: {
          id: '1',
          type: 'person',
          attributes: {
            firstName: 'Tom',
            lastName: 'Dale'
          },
          relationships: {
            children: {
              data: [
                {
                  id: '2',
                  type: 'person'
                },
                {
                  id: '3',
                  type: 'person'
                },
                {
                  id: '4',
                  type: 'person'
                }
              ]
            }
          }
        }
      }
      ```
       [Demo.](http://ember-twiddle.com/343e1735e034091f5bde)
       To represent the children relationship as a URL:
       ```js
      {
        data: {
          id: '1',
          type: 'person',
          attributes: {
            firstName: 'Tom',
            lastName: 'Dale'
          },
          relationships: {
            children: {
              links: {
                related: '/people/1/children'
              }
            }
          }
        }
      }
      ```
       If you're streaming data or implementing an adapter, make sure
      that you have converted the incoming data into this form. The
      store's [normalize](#method_normalize) method is a convenience
      helper for converting a json payload into the form Ember Data
      expects.
       ```js
      store.push(store.normalize('person', data));
      ```
       This method can be used both to push in brand new
      records, as well as to update existing records.
       @method push
      @param {Object} data
      @return {DS.Model|Array} the record(s) that was created or
        updated.
    */
    push(data) {
      {
        assertDestroyingStore(this, 'push');
      }

      var pushed = this._push(data);

      if (Array.isArray(pushed)) {
        var records = pushed.map(internalModel => internalModel.getRecord());
        return records;
      }

      if (pushed === null) {
        return null;
      }

      var record = pushed.getRecord();
      return record;
    },

    /*
      Push some data in the form of a json-api document into the store,
      without creating materialized records.
       @method _push
      @private
      @param {Object} jsonApiDoc
      @return {DS.InternalModel|Array<DS.InternalModel>} pushed InternalModel(s)
    */
    _push(jsonApiDoc) {
      {
        assertDestroyingStore(this, '_push');
      }

      var internalModelOrModels = this._backburner.join(() => {
        var included = jsonApiDoc.included;
        var i, length;

        if (included) {
          for (i = 0, length = included.length; i < length; i++) {
            this._pushInternalModel(included[i]);
          }
        }

        if (Array.isArray(jsonApiDoc.data)) {
          length = jsonApiDoc.data.length;
          var internalModels = new Array(length);

          for (i = 0; i < length; i++) {
            internalModels[i] = this._pushInternalModel(jsonApiDoc.data[i]);
          }

          return internalModels;
        }

        if (jsonApiDoc.data === null) {
          return null;
        }

        (true && !(Ember.typeOf(jsonApiDoc.data) === 'object') && Ember.assert(`Expected an object in the 'data' property in a call to 'push' for ${jsonApiDoc.type}, but was ${Ember.typeOf(jsonApiDoc.data)}`, Ember.typeOf(jsonApiDoc.data) === 'object'));
        return this._pushInternalModel(jsonApiDoc.data);
      });

      return internalModelOrModels;
    },

    _pushInternalModel(data) {
      var modelName = data.type;
      (true && !(data.id !== null && data.id !== undefined && data.id !== '') && Ember.assert(`You must include an 'id' for ${modelName} in an object passed to 'push'`, data.id !== null && data.id !== undefined && data.id !== ''));
      (true && !(this._hasModelFor(modelName)) && Ember.assert(`You tried to push data with a type '${modelName}' but no model could be found with that name.`, this._hasModelFor(modelName)));

      {
        // If ENV.DS_WARN_ON_UNKNOWN_KEYS is set to true and the payload
        // contains unknown attributes or relationships, log a warning.
        if (ENV.DS_WARN_ON_UNKNOWN_KEYS) {
          var modelClass = this.modelFor(modelName); // Check unknown attributes

          var unknownAttributes = Object.keys(data.attributes || {}).filter(key => {
            return !Ember.get(modelClass, 'fields').has(key);
          });
          var unknownAttributesMessage = `The payload for '${modelName}' contains these unknown attributes: ${unknownAttributes}. Make sure they've been defined in your model.`;
          (true && Ember.warn(unknownAttributesMessage, unknownAttributes.length === 0, {
            id: 'ds.store.unknown-keys-in-payload'
          })); // Check unknown relationships

          var unknownRelationships = Object.keys(data.relationships || {}).filter(key => {
            return !Ember.get(modelClass, 'fields').has(key);
          });
          var unknownRelationshipsMessage = `The payload for '${modelName}' contains these unknown relationships: ${unknownRelationships}. Make sure they've been defined in your model.`;
          (true && Ember.warn(unknownRelationshipsMessage, unknownRelationships.length === 0, {
            id: 'ds.store.unknown-keys-in-payload'
          }));
        }
      } // Actually load the record into the store.


      var internalModel = this._load(data); //    this._setupRelationshipsForModel(internalModel, data);


      return internalModel;
    },

    /**
      Push some raw data into the store.
       This method can be used both to push in brand new
      records, as well as to update existing records. You
      can push in more than one type of object at once.
      All objects should be in the format expected by the
      serializer.
       ```app/serializers/application.js
      import DS from 'ember-data';
       export default DS.ActiveModelSerializer;
      ```
       ```js
      let pushData = {
        posts: [
          { id: 1, post_title: "Great post", comment_ids: [2] }
        ],
        comments: [
          { id: 2, comment_body: "Insightful comment" }
        ]
      }
       store.pushPayload(pushData);
      ```
       By default, the data will be deserialized using a default
      serializer (the application serializer if it exists).
       Alternatively, `pushPayload` will accept a model type which
      will determine which serializer will process the payload.
       ```app/serializers/application.js
      import DS from 'ember-data';
       export default DS.ActiveModelSerializer;
      ```
       ```app/serializers/post.js
      import DS from 'ember-data';
       export default DS.JSONSerializer;
      ```
       ```js
      store.pushPayload(pushData); // Will use the application serializer
      store.pushPayload('post', pushData); // Will use the post serializer
      ```
       @method pushPayload
      @param {String} modelName Optionally, a model type used to determine which serializer will be used
      @param {Object} inputPayload
    */
    pushPayload(modelName, inputPayload) {
      {
        assertDestroyingStore(this, 'pushPayload');
      }

      var serializer;
      var payload;

      if (!inputPayload) {
        payload = modelName;
        serializer = this.serializerFor('application');
        (true && !(typeof serializer.pushPayload === 'function') && Ember.assert(`You cannot use 'store#pushPayload' without a modelName unless your default serializer defines 'pushPayload'`, typeof serializer.pushPayload === 'function'));
      } else {
        payload = inputPayload;
        (true && !(typeof modelName === 'string') && Ember.assert(`Passing classes to store methods has been removed. Please pass a dasherized string instead of ${modelName}`, typeof modelName === 'string'));
        var normalizedModelName = normalizeModelName(modelName);
        serializer = this.serializerFor(normalizedModelName);
      }

      serializer.pushPayload(this, payload);
    },

    reloadManyArray(manyArray, internalModel, key, options) {
      return internalModel.reloadHasMany(key, options);
    },

    reloadBelongsTo(belongsToProxy, internalModel, key, options) {
      return internalModel.reloadBelongsTo(key, options);
    },

    _relationshipMetaFor(modelName, id, key) {
      var modelClass = this.modelFor(modelName);
      var relationshipsByName = Ember.get(modelClass, 'relationshipsByName');
      return relationshipsByName.get(key);
    },

    _attributesDefinitionFor(modelName) {
      var attributes = this._attributesDefCache[modelName];

      if (attributes === undefined) {
        var modelClass = this.modelFor(modelName);
        var attributeMap = Ember.get(modelClass, 'attributes');
        attributes = Object.create(null);
        attributeMap.forEach((meta, name) => attributes[name] = meta);
        this._attributesDefCache[modelName] = attributes;
      }

      return attributes;
    },

    _relationshipsDefinitionFor(modelName) {
      var relationships = this._relationshipsDefCache[modelName];

      if (relationships === undefined) {
        var modelClass = this.modelFor(modelName);
        relationships = Ember.get(modelClass, 'relationshipsObject') || null;
        this._relationshipsDefCache[modelName] = relationships;
      }

      return relationships;
    },

    _internalModelForResource(resource) {
      var internalModel;

      if (resource.clientId) {
        internalModel = this._newlyCreatedModelsFor(resource.type).get(resource.clientId);
      }

      if (!internalModel) {
        internalModel = this._internalModelForId(resource.type, resource.id);
      }

      return internalModel;
    },

    _createRecordData(modelName, id, clientId, internalModel) {
      return this.createRecordDataFor(modelName, id, clientId, this.recordDataWrapper);
    },

    createRecordDataFor(modelName, id, clientId, storeWrapper) {
      return new RecordData(modelName, id, clientId, storeWrapper, this);
    },

    recordDataFor(modelName, id, clientId) {
      var internalModel = this._internalModelForId(modelName, id, clientId);

      return internalModel._recordData;
    },

    _internalModelForRecordData(recordData) {
      var resource = recordData.getResourceIdentifier();
      return this._internalModelForId(resource.type, resource.id, resource.clientId);
    },

    /**
      `normalize` converts a json payload into the normalized form that
      [push](#method_push) expects.
       Example
       ```js
      socket.on('message', function(message) {
        let modelName = message.model;
        let data = message.data;
        store.push(store.normalize(modelName, data));
      });
      ```
       @method normalize
      @param {String} modelName The name of the model type for this payload
      @param {Object} payload
      @return {Object} The normalized payload
    */
    normalize(modelName, payload) {
      {
        assertDestroyingStore(this, 'normalize');
      }

      (true && !(Ember.isPresent(modelName)) && Ember.assert(`You need to pass a model name to the store's normalize method`, Ember.isPresent(modelName)));
      (true && !(typeof modelName === 'string') && Ember.assert(`Passing classes to store methods has been removed. Please pass a dasherized string instead of ${Ember.inspect(modelName)}`, typeof modelName === 'string'));
      var normalizedModelName = normalizeModelName(modelName);
      var serializer = this.serializerFor(normalizedModelName);
      var model = this.modelFor(normalizedModelName);
      return serializer.normalize(model, payload);
    },

    newClientId() {
      return globalClientIdCounter++;
    },

    /**
      Build a brand new record for a given type, ID, and
      initial data.
       @method _buildInternalModel
      @private
      @param {String} modelName
      @param {String} id
      @param {Object} data
      @return {InternalModel} internal model
    */
    _buildInternalModel(modelName, id, data, clientId) {
      (true && !(typeof modelName === 'string') && Ember.assert(`You can no longer pass a modelClass as the first argument to store._buildInternalModel. Pass modelName instead.`, typeof modelName === 'string'));

      var existingInternalModel = this._existingInternalModelForId(modelName, id);

      (true && !(!existingInternalModel) && Ember.assert(`The id ${id} has already been used with another record for modelClass '${modelName}'.`, !existingInternalModel));

      if (id === null && !clientId) {
        clientId = this.newClientId();
      } // lookupFactory should really return an object that creates
      // instances with the injections applied


      var internalModel = new InternalModel(modelName, id, this, data, clientId);

      if (clientId) {
        this._newlyCreatedModelsFor(modelName).add(internalModel, clientId);
      }

      this._internalModelsFor(modelName).add(internalModel, id);

      return internalModel;
    },

    _existingInternalModelForId(modelName, id) {
      var internalModel = this._internalModelsFor(modelName).get(id);

      if (internalModel && internalModel.hasScheduledDestroy()) {
        // unloadRecord is async, if one attempts to unload + then sync create,
        //   we must ensure the unload is complete before starting the create
        //   The push path will take _internalModelForId()
        //   which will call `cancelDestroy` instead for this unload + then
        //   sync push scenario. Once we have true client-side
        //   delete signaling, we should never call destroySync
        internalModel.destroySync();
        internalModel = null;
      }

      return internalModel;
    },

    //Called by the state machine to notify the store that the record is ready to be interacted with
    recordWasLoaded(record) {
      {
        assertDestroyingStore(this, 'recordWasLoaded');
      }

      this.recordArrayManager.recordWasLoaded(record);
    },

    // ...............
    // . DESTRUCTION .
    // ...............

    /**
      When a record is destroyed, this un-indexes it and
      removes it from any record arrays so it can be GCed.
       @method _removeFromIdMap
      @private
      @param {InternalModel} internalModel
    */
    _removeFromIdMap(internalModel) {
      var recordMap = this._internalModelsFor(internalModel.modelName);

      var id = internalModel.id;
      recordMap.remove(internalModel, id); //TODO IGOR DAVID remove from client id map
    },

    // ......................
    // . PER-TYPE ADAPTERS
    // ......................

    /**
      Returns an instance of the adapter for a given type. For
      example, `adapterFor('person')` will return an instance of
      `App.PersonAdapter`.
       If no `App.PersonAdapter` is found, this method will look
      for an `App.ApplicationAdapter` (the default adapter for
      your entire application).
       If no `App.ApplicationAdapter` is found, it will return
      the value of the `defaultAdapter`.
       @method adapterFor
      @public
      @param {String} modelName
      @return DS.Adapter
    */
    adapterFor(modelName) {
      {
        assertDestroyingStore(this, 'adapterFor');
      }

      (true && !(Ember.isPresent(modelName)) && Ember.assert(`You need to pass a model name to the store's adapterFor method`, Ember.isPresent(modelName)));
      (true && !(typeof modelName === 'string') && Ember.assert(`Passing classes to store.adapterFor has been removed. Please pass a dasherized string instead of ${modelName}`, typeof modelName === 'string'));
      var normalizedModelName = normalizeModelName(modelName);
      var {
        _adapterCache
      } = this;
      var adapter = _adapterCache[normalizedModelName];

      if (adapter) {
        return adapter;
      }

      var owner = getOwner(this);
      adapter = owner.lookup(`adapter:${normalizedModelName}`);

      if (adapter !== undefined) {
        Ember.set(adapter, 'store', this);
        _adapterCache[normalizedModelName] = adapter;
        return adapter;
      } // no adapter found for the specific model, fallback and check for application adapter


      adapter = _adapterCache.application || owner.lookup('adapter:application');

      if (adapter !== undefined) {
        Ember.set(adapter, 'store', this);
        _adapterCache[normalizedModelName] = adapter;
        _adapterCache.application = adapter;
        return adapter;
      } // no model specific adapter or application adapter, check for an `adapter`
      // property defined on the store


      var adapterName = this.get('adapter');
      adapter = adapterName ? _adapterCache[adapterName] || owner.lookup(`adapter:${adapterName}`) : undefined;

      if (adapter !== undefined) {
        Ember.set(adapter, 'store', this);
        _adapterCache[normalizedModelName] = adapter;
        _adapterCache[adapterName] = adapter;
        return adapter;
      } // final fallback, no model specific adapter, no application adapter, no
      // `adapter` property on store: use json-api adapter


      adapter = _adapterCache['-json-api'] || owner.lookup('adapter:-json-api');
      (true && !(adapter !== undefined) && Ember.assert(`No adapter was found for '${modelName}' and no 'application', store.adapter = 'adapter-fallback-name', or '-json-api' adapter were found as fallbacks.`, adapter !== undefined));
      Ember.set(adapter, 'store', this);
      _adapterCache[normalizedModelName] = adapter;
      _adapterCache['-json-api'] = adapter;
      return adapter;
    },

    // ..............................
    // . RECORD CHANGE NOTIFICATION .
    // ..............................

    /**
      Returns an instance of the serializer for a given type. For
      example, `serializerFor('person')` will return an instance of
      `App.PersonSerializer`.
       If no `App.PersonSerializer` is found, this method will look
      for an `App.ApplicationSerializer` (the default serializer for
      your entire application).
       if no `App.ApplicationSerializer` is found, it will attempt
      to get the `defaultSerializer` from the `PersonAdapter`
      (`adapterFor('person')`).
       If a serializer cannot be found on the adapter, it will fall back
      to an instance of `DS.JSONSerializer`.
       @method serializerFor
      @public
      @param {String} modelName the record to serialize
      @return {DS.Serializer}
    */
    serializerFor(modelName) {
      {
        assertDestroyingStore(this, 'serializerFor');
      }

      (true && !(Ember.isPresent(modelName)) && Ember.assert(`You need to pass a model name to the store's serializerFor method`, Ember.isPresent(modelName)));
      (true && !(typeof modelName === 'string') && Ember.assert(`Passing classes to store.serializerFor has been removed. Please pass a dasherized string instead of ${modelName}`, typeof modelName === 'string'));
      var normalizedModelName = normalizeModelName(modelName);
      var {
        _serializerCache
      } = this;
      var serializer = _serializerCache[normalizedModelName];

      if (serializer) {
        return serializer;
      }

      var owner = getOwner(this);
      serializer = owner.lookup(`serializer:${normalizedModelName}`);

      if (serializer !== undefined) {
        Ember.set(serializer, 'store', this);
        _serializerCache[normalizedModelName] = serializer;
        return serializer;
      } // no serializer found for the specific model, fallback and check for application serializer


      serializer = _serializerCache.application || owner.lookup('serializer:application');

      if (serializer !== undefined) {
        Ember.set(serializer, 'store', this);
        _serializerCache[normalizedModelName] = serializer;
        _serializerCache.application = serializer;
        return serializer;
      } // no model specific serializer or application serializer, check for the `defaultSerializer`
      // property defined on the adapter


      var adapter = this.adapterFor(modelName);
      var serializerName = Ember.get(adapter, 'defaultSerializer');
      serializer = _serializerCache[serializerName] || owner.lookup(`serializer:${serializerName}`);

      if (serializer !== undefined) {
        Ember.set(serializer, 'store', this);
        _serializerCache[normalizedModelName] = serializer;
        _serializerCache[serializerName] = serializer;
        return serializer;
      } // final fallback, no model specific serializer, no application serializer, no
      // `serializer` property on store: use json-api serializer


      serializer = _serializerCache['-default'] || owner.lookup('serializer:-default');
      Ember.set(serializer, 'store', this);
      _serializerCache[normalizedModelName] = serializer;
      _serializerCache['-default'] = serializer;
      return serializer;
    },

    willDestroy() {
      this._super(...arguments);

      this._pushedInternalModels = null;
      this.recordArrayManager.destroy();
      this._adapterCache = null;
      this._serializerCache = null;
      this.unloadAll();

      {
        Ember.Test.unregisterWaiter(this.__asyncWaiter);
        var shouldTrack = this.shouldTrackAsyncRequests;
        var tracked = this._trackedAsyncRequests;
        var isSettled = tracked.length === 0;

        if (!isSettled) {
          if (shouldTrack) {
            throw new Error('Async Request leaks detected. Add a breakpoint here and set `store.generateStackTracesForTrackedRequests = true;`to inspect traces for leak origins:\n\t - ' + tracked.map(o => o.label).join('\n\t - '));
          } else {
            (true && Ember.warn('Async Request leaks detected. Add a breakpoint here and set `store.generateStackTracesForTrackedRequests = true;`to inspect traces for leak origins:\n\t - ' + tracked.map(o => o.label).join('\n\t - '), false, {
              id: 'ds.async.leak.detected'
            }));
          }
        }
      }
    },

    _updateRelationshipState(relationship) {
      if (this._updatedRelationships.push(relationship) !== 1) {
        return;
      }

      this._backburner.join(() => {
        this._backburner.schedule('syncRelationships', this, this._flushUpdatedRelationships);
      });
    },

    _flushUpdatedRelationships() {
      var updated = this._updatedRelationships;

      for (var i = 0, l = updated.length; i < l; i++) {
        updated[i].flushCanonical();
      }

      updated.length = 0;
    },

    _updateInternalModel(internalModel) {
      if (this._updatedInternalModels.push(internalModel) !== 1) {
        return;
      }

      emberRun$1.schedule('actions', this, this._flushUpdatedInternalModels);
    },

    _flushUpdatedInternalModels() {
      var updated = this._updatedInternalModels;

      for (var i = 0, l = updated.length; i < l; i++) {
        updated[i]._triggerDeferredTriggers();
      }

      updated.length = 0;
    },

    _pushResourceIdentifier(relationship, resourceIdentifier) {
      if (Ember.isNone(resourceIdentifier)) {
        return;
      }

      (true && !(!Array.isArray(resourceIdentifier)) && Ember.assert(`A ${relationship.internalModel.modelName} record was pushed into the store with the value of ${relationship.key} being ${Ember.inspect(resourceIdentifier)}, but ${relationship.key} is a belongsTo relationship so the value must not be an array. You should probably check your data payload or serializer.`, !Array.isArray(resourceIdentifier))); //TODO:Better asserts

      return this._internalModelForId(resourceIdentifier.type, resourceIdentifier.id);
    },

    _pushResourceIdentifiers(relationship, resourceIdentifiers) {
      if (Ember.isNone(resourceIdentifiers)) {
        return;
      }

      (true && !(Array.isArray(resourceIdentifiers)) && Ember.assert(`A ${relationship.internalModel.modelName} record was pushed into the store with the value of ${relationship.key} being '${Ember.inspect(resourceIdentifiers)}', but ${relationship.key} is a hasMany relationship so the value must be an array. You should probably check your data payload or serializer.`, Array.isArray(resourceIdentifiers)));

      var _internalModels = new Array(resourceIdentifiers.length);

      for (var i = 0; i < resourceIdentifiers.length; i++) {
        _internalModels[i] = this._pushResourceIdentifier(relationship, resourceIdentifiers[i]);
      }

      return _internalModels;
    }

  });

  function _commit(adapter, store, operation, snapshot) {
    var internalModel = snapshot._internalModel;
    var modelName = snapshot.modelName;
    var modelClass = store.modelFor(modelName);
    (true && !(adapter) && Ember.assert(`You tried to update a record but you have no adapter (for ${modelName})`, adapter));
    (true && !(typeof adapter[operation] === 'function') && Ember.assert(`You tried to update a record but your adapter (for ${modelName}) does not implement '${operation}'`, typeof adapter[operation] === 'function'));
    var promise = Ember.RSVP.Promise.resolve().then(() => adapter[operation](store, modelClass, snapshot));
    var serializer = serializerForAdapter(store, adapter, modelName);
    var label = `DS: Extract and notify about ${operation} completion of ${internalModel}`;
    (true && !(promise !== undefined) && Ember.assert(`Your adapter's '${operation}' method must return a value, but it returned 'undefined'`, promise !== undefined));
    promise = guardDestroyedStore(promise, store, label);
    promise = _guard(promise, _bind(_objectIsAlive, internalModel));
    return promise.then(adapterPayload => {
      /*
      Note to future spelunkers hoping to optimize.
      We rely on this `run` to create a run loop if needed
      that `store._push` and `store.didSaveRecord` will both share.
       We use `join` because it is often the case that we
      have an outer run loop available still from the first
      call to `store._push`;
      */
      store._backburner.join(() => {
        var payload, data, sideloaded;

        if (adapterPayload) {
          payload = normalizeResponseHelper(serializer, store, modelClass, adapterPayload, snapshot.id, operation);

          if (payload.included) {
            sideloaded = payload.included;
          }

          data = payload.data;
        }

        store.didSaveRecord(internalModel, {
          data
        }); // seems risky, but if the tests pass might be fine?

        if (sideloaded) {
          store._push({
            data: null,
            included: sideloaded
          });
        }
      });

      return internalModel;
    }, function (error) {
      if (error instanceof InvalidError) {
        var errors = serializer.extractErrors(store, modelClass, error, snapshot.id);
        store.recordWasInvalid(internalModel, errors);
      } else {
        store.recordWasError(internalModel, error);
      }

      throw error;
    }, label);
  }
  /**
   *
   * @param store
   * @param cache modelFactoryCache
   * @param normalizedModelName already normalized modelName
   * @return {*}
   */


  function getModelFactory(store, cache, normalizedModelName) {
    var factory = cache[normalizedModelName];

    if (!factory) {
      factory = _lookupModelFactory(store, normalizedModelName);

      if (!factory) {
        //Support looking up mixins as base types for polymorphic relationships
        factory = _modelForMixin(store, normalizedModelName);
      }

      if (!factory) {
        // we don't cache misses in case someone wants to register a missing model
        return null;
      } // interopt with the future


      var klass = getOwner(store).factoryFor ? factory.class : factory;
      (true && !(klass.isModel) && Ember.assert(`'${Ember.inspect(klass)}' does not appear to be an ember-data model`, klass.isModel)); // TODO: deprecate this

      var hasOwnModelNameSet = klass.modelName && klass.hasOwnProperty('modelName');

      if (!hasOwnModelNameSet) {
        klass.modelName = normalizedModelName;
      }

      cache[normalizedModelName] = factory;
    }

    return factory;
  }

  function _lookupModelFactory(store, normalizedModelName) {
    var owner = getOwner(store);

    if (owner.factoryFor) {
      return owner.factoryFor(`model:${normalizedModelName}`);
    } else {
      return owner._lookupFactory(`model:${normalizedModelName}`);
    }
  }
  /*
    In case someone defined a relationship to a mixin, for example:
    ```
      let Comment = DS.Model.extend({
        owner: belongsTo('commentable'. { polymorphic: true })
      });
      let Commentable = Ember.Mixin.create({
        comments: hasMany('comment')
      });
    ```
    we want to look up a Commentable class which has all the necessary
    relationship metadata. Thus, we look up the mixin and create a mock
    DS.Model, so we can access the relationship CPs of the mixin (`comments`)
    in this case
  */


  function _modelForMixin(store, normalizedModelName) {
    // container.registry = 2.1
    // container._registry = 1.11 - 2.0
    // container = < 1.11
    var owner = getOwner(store);
    var mixin;

    if (owner.factoryFor) {
      var MaybeMixin = owner.factoryFor(`mixin:${normalizedModelName}`);
      mixin = MaybeMixin && MaybeMixin.class;
    } else {
      mixin = owner._lookupFactory(`mixin:${normalizedModelName}`);
    }

    if (mixin) {
      var ModelForMixin = Model.extend(mixin);
      ModelForMixin.reopenClass({
        __isMixin: true,
        __mixin: mixin
      }); //Cache the class as a model

      owner.register('model:' + normalizedModelName, ModelForMixin);
    }

    return _lookupModelFactory(store, normalizedModelName);
  }

  var assertDestroyingStore;
  var assertDestroyedStoreOnly;

  {
    assertDestroyingStore = function assertDestroyedStore(store, method) {
      if (!store.shouldAssertMethodCallsOnDestroyedStore) {
        (true && !(!(store.isDestroying || store.isDestroyed)) && Ember.deprecate(`Attempted to call store.${method}(), but the store instance has already been destroyed.`, !(store.isDestroying || store.isDestroyed), {
          id: 'ember-data:method-calls-on-destroyed-store',
          until: '3.8'
        }));
      } else {
        (true && !(!(store.isDestroying || store.isDestroyed)) && Ember.assert(`Attempted to call store.${method}(), but the store instance has already been destroyed.`, !(store.isDestroying || store.isDestroyed)));
      }
    };

    assertDestroyedStoreOnly = function assertDestroyedStoreOnly(store, method) {
      if (!store.shouldAssertMethodCallsOnDestroyedStore) {
        (true && !(!store.isDestroyed) && Ember.deprecate(`Attempted to call store.${method}(), but the store instance has already been destroyed.`, !store.isDestroyed, {
          id: 'ember-data:method-calls-on-destroyed-store',
          until: '3.8'
        }));
      } else {
        (true && !(!store.isDestroyed) && Ember.assert(`Attempted to call store.${method}(), but the store instance has already been destroyed.`, !store.isDestroyed));
      }
    };
  }

  var Store$1 = Store;

  /**
    @module ember-data
  */

  /**
    All Ember Data classes, methods and functions are defined inside of this namespace.

    @class DS
    @static
  */

  /**
    @property VERSION
    @type String
    @static
  */

  var DS = Ember.Namespace.create({
    VERSION: VERSION,
    name: 'DS'
  });

  if (Ember.libraries) {
    Ember.libraries.registerCoreLibrary('Ember Data', DS.VERSION);
  }

  /**
    `DS.belongsTo` is used to define One-To-One and One-To-Many
    relationships on a [DS.Model](/api/data/classes/DS.Model.html).


    `DS.belongsTo` takes an optional hash as a second parameter, currently
    supported options are:

    - `async`: A boolean value used to explicitly declare this to be an async relationship.
    - `inverse`: A string used to identify the inverse property on a
      related model in a One-To-Many relationship. See [Explicit Inverses](#toc_explicit-inverses)

    #### One-To-One
    To declare a one-to-one relationship between two models, use
    `DS.belongsTo`:

    ```app/models/user.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      profile: DS.belongsTo('profile')
    });
    ```

    ```app/models/profile.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      user: DS.belongsTo('user')
    });
    ```

    #### One-To-Many
    To declare a one-to-many relationship between two models, use
    `DS.belongsTo` in combination with `DS.hasMany`, like this:

    ```app/models/post.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      comments: DS.hasMany('comment')
    });
    ```

    ```app/models/comment.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      post: DS.belongsTo('post')
    });
    ```

    You can avoid passing a string as the first parameter. In that case Ember Data
    will infer the type from the key name.

    ```app/models/comment.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      post: DS.belongsTo()
    });
    ```

    will lookup for a Post type.

    @namespace
    @method belongsTo
    @for DS
    @param {String} modelName (optional) type of the relationship
    @param {Object} options (optional) a hash of options
    @return {Ember.computed} relationship
  */
  function belongsTo(modelName, options) {
    var opts, userEnteredModelName;

    if (typeof modelName === 'object') {
      opts = modelName;
      userEnteredModelName = undefined;
    } else {
      opts = options;
      userEnteredModelName = modelName;
    }

    if (typeof userEnteredModelName === 'string') {
      userEnteredModelName = normalizeModelName(userEnteredModelName);
    }

    (true && !(typeof userEnteredModelName === 'string' || typeof userEnteredModelName === 'undefined') && Ember.assert('The first argument to DS.belongsTo must be a string representing a model type key, not an instance of ' + Ember.inspect(userEnteredModelName) + ". E.g., to define a relation to the Person model, use DS.belongsTo('person')", typeof userEnteredModelName === 'string' || typeof userEnteredModelName === 'undefined'));
    opts = opts || {};
    var meta = {
      type: userEnteredModelName,
      isRelationship: true,
      options: opts,
      kind: 'belongsTo',
      name: 'Belongs To',
      key: null
    };
    return Ember.computed({
      get(key) {
        {
          if (['_internalModel', 'recordData', 'currentState'].indexOf(key) !== -1) {
            throw new Error(`'${key}' is a reserved property name on instances of classes extending Model. Please choose a different property name for your belongsTo on ${this.constructor.toString()}`);
          }

          if (opts.hasOwnProperty('serialize')) {
            (true && Ember.warn(`You provided a serialize option on the "${key}" property in the "${this._internalModel.modelName}" class, this belongs in the serializer. See DS.Serializer and it's implementations https://emberjs.com/api/data/classes/DS.Serializer.html`, false, {
              id: 'ds.model.serialize-option-in-belongs-to'
            }));
          }

          if (opts.hasOwnProperty('embedded')) {
            (true && Ember.warn(`You provided an embedded option on the "${key}" property in the "${this._internalModel.modelName}" class, this belongs in the serializer. See DS.EmbeddedRecordsMixin https://emberjs.com/api/data/classes/DS.EmbeddedRecordsMixin.html`, false, {
              id: 'ds.model.embedded-option-in-belongs-to'
            }));
          }
        }

        return this._internalModel.getBelongsTo(key);
      },

      set(key, value) {
        {
          if (['_internalModel', 'recordData', 'currentState'].indexOf(key) !== -1) {
            throw new Error(`'${key}' is a reserved property name on instances of classes extending Model. Please choose a different property name for your belongsTo on ${this.constructor.toString()}`);
          }
        }

        this._internalModel.setDirtyBelongsTo(key, value);

        return this._internalModel.getBelongsTo(key);
      }

    }).meta(meta);
  }

  /**
    @module ember-data
  */

  /**
    `DS.hasMany` is used to define One-To-Many and Many-To-Many
    relationships on a [DS.Model](/api/data/classes/DS.Model.html).

    `DS.hasMany` takes an optional hash as a second parameter, currently
    supported options are:

    - `async`: A boolean value used to explicitly declare this to be an async relationship.
    - `inverse`: A string used to identify the inverse property on a related model.

    #### One-To-Many
    To declare a one-to-many relationship between two models, use
    `DS.belongsTo` in combination with `DS.hasMany`, like this:

    ```app/models/post.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      comments: DS.hasMany('comment')
    });
    ```

    ```app/models/comment.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      post: DS.belongsTo('post')
    });
    ```

    #### Many-To-Many
    To declare a many-to-many relationship between two models, use
    `DS.hasMany`:

    ```app/models/post.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      tags: DS.hasMany('tag')
    });
    ```

    ```app/models/tag.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      posts: DS.hasMany('post')
    });
    ```

    You can avoid passing a string as the first parameter. In that case Ember Data
    will infer the type from the singularized key name.

    ```app/models/post.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      tags: DS.hasMany()
    });
    ```

    will lookup for a Tag type.

    #### Explicit Inverses

    Ember Data will do its best to discover which relationships map to
    one another. In the one-to-many code above, for example, Ember Data
    can figure out that changing the `comments` relationship should update
    the `post` relationship on the inverse because post is the only
    relationship to that model.

    However, sometimes you may have multiple `belongsTo`/`hasMany` for the
    same type. You can specify which property on the related model is
    the inverse using `DS.hasMany`'s `inverse` option:

    ```app/models/comment.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      onePost: DS.belongsTo('post'),
      twoPost: DS.belongsTo('post'),
      redPost: DS.belongsTo('post'),
      bluePost: DS.belongsTo('post')
    });
    ```

    ```app/models/post.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      comments: DS.hasMany('comment', {
        inverse: 'redPost'
      })
    });
    ```

    You can also specify an inverse on a `belongsTo`, which works how
    you'd expect.

    @namespace
    @method hasMany
    @for DS
    @param {String} type (optional) type of the relationship
    @param {Object} options (optional) a hash of options
    @return {Ember.computed} relationship
  */
  function hasMany(type, options) {
    if (typeof type === 'object') {
      options = type;
      type = undefined;
    }

    (true && !(typeof type === 'string' || typeof type === 'undefined') && Ember.assert(`The first argument to DS.hasMany must be a string representing a model type key, not an instance of ${Ember.inspect(type)}. E.g., to define a relation to the Comment model, use DS.hasMany('comment')`, typeof type === 'string' || typeof type === 'undefined'));
    options = options || {};

    if (typeof type === 'string') {
      type = normalizeModelName(type);
    } // Metadata about relationships is stored on the meta of
    // the relationship. This is used for introspection and
    // serialization. Note that `key` is populated lazily
    // the first time the CP is called.


    var meta = {
      type,
      options,
      isRelationship: true,
      kind: 'hasMany',
      name: 'Has Many',
      key: null
    };
    return Ember.computed({
      get(key) {
        {
          if (['_internalModel', 'recordData', 'currentState'].indexOf(key) !== -1) {
            throw new Error(`'${key}' is a reserved property name on instances of classes extending Model. Please choose a different property name for your hasMany on ${this.constructor.toString()}`);
          }
        }

        return this._internalModel.getHasMany(key);
      },

      set(key, records) {
        {
          if (['_internalModel', 'recordData', 'currentState'].indexOf(key) !== -1) {
            throw new Error(`'${key}' is a reserved property name on instances of classes extending Model. Please choose a different property name for your hasMany on ${this.constructor.toString()}`);
          }
        }

        var internalModel = this._internalModel;
        internalModel.setDirtyHasMany(key, records);
        return internalModel.getHasMany(key);
      }

    }).meta(meta);
  }

  /**

    WARNING: This interface is likely to change in order to accommodate [RFC: Ember Data url templates](https://github.com/emberjs/rfcs/pull/4)

    ## Using BuildURLMixin

    To use URL building, include the mixin when extending an adapter, and call `buildURL` where needed.
    The default behaviour is designed for RESTAdapter.

    ### Example

    ```javascript
    export default DS.Adapter.extend(BuildURLMixin, {
      findRecord: function(store, type, id, snapshot) {
        var url = this.buildURL(type.modelName, id, snapshot, 'findRecord');
        return this.ajax(url, 'GET');
      }
    });
    ```

    ### Attributes

    The `host` and `namespace` attributes will be used if defined, and are optional.

    @class BuildURLMixin
    @namespace DS
  */

  var buildUrlMixin = Ember.Mixin.create({
    /**
      Builds a URL for a given type and optional ID.
       By default, it pluralizes the type's name (for example, 'post'
      becomes 'posts' and 'person' becomes 'people'). To override the
      pluralization see [pathForType](#method_pathForType).
       If an ID is specified, it adds the ID to the path generated
      for the type, separated by a `/`.
       When called by `RESTAdapter.findMany()` the `id` and `snapshot` parameters
      will be arrays of ids and snapshots.
       @method buildURL
      @param {String} modelName
      @param {(String|Array|Object)} id single id or array of ids or query
      @param {(DS.Snapshot|Array)} snapshot single snapshot or array of snapshots
      @param {String} requestType
      @param {Object} query object of query parameters to send for query requests.
      @return {String} url
    */
    buildURL(modelName, id, snapshot, requestType, query) {
      switch (requestType) {
        case 'findRecord':
          return this.urlForFindRecord(id, modelName, snapshot);

        case 'findAll':
          return this.urlForFindAll(modelName, snapshot);

        case 'query':
          return this.urlForQuery(query, modelName);

        case 'queryRecord':
          return this.urlForQueryRecord(query, modelName);

        case 'findMany':
          return this.urlForFindMany(id, modelName, snapshot);

        case 'findHasMany':
          return this.urlForFindHasMany(id, modelName, snapshot);

        case 'findBelongsTo':
          return this.urlForFindBelongsTo(id, modelName, snapshot);

        case 'createRecord':
          return this.urlForCreateRecord(modelName, snapshot);

        case 'updateRecord':
          return this.urlForUpdateRecord(id, modelName, snapshot);

        case 'deleteRecord':
          return this.urlForDeleteRecord(id, modelName, snapshot);

        default:
          return this._buildURL(modelName, id);
      }
    },

    /**
      @method _buildURL
      @private
      @param {String} modelName
      @param {String} id
      @return {String} url
    */
    _buildURL(modelName, id) {
      var path;
      var url = [];
      var host = Ember.get(this, 'host');
      var prefix = this.urlPrefix();

      if (modelName) {
        path = this.pathForType(modelName);

        if (path) {
          url.push(path);
        }
      }

      if (id) {
        url.push(encodeURIComponent(id));
      }

      if (prefix) {
        url.unshift(prefix);
      }

      url = url.join('/');

      if (!host && url && url.charAt(0) !== '/') {
        url = '/' + url;
      }

      return url;
    },

    /**
     Builds a URL for a `store.findRecord(type, id)` call.
      Example:
      ```app/adapters/user.js
     import DS from 'ember-data';
      export default DS.JSONAPIAdapter.extend({
       urlForFindRecord(id, modelName, snapshot) {
         let baseUrl = this.buildURL(modelName, id, snapshot);
         return `${baseUrl}/users/${snapshot.adapterOptions.user_id}/playlists/${id}`;
       }
     });
     ```
      @method urlForFindRecord
     @param {String} id
     @param {String} modelName
     @param {DS.Snapshot} snapshot
     @return {String} url
      */
    urlForFindRecord(id, modelName, snapshot) {
      return this._buildURL(modelName, id);
    },

    /**
     Builds a URL for a `store.findAll(type)` call.
      Example:
      ```app/adapters/comment.js
     import DS from 'ember-data';
      export default DS.JSONAPIAdapter.extend({
       urlForFindAll(modelName, snapshot) {
         return 'data/comments.json';
       }
     });
     ```
      @method urlForFindAll
     @param {String} modelName
     @param {DS.SnapshotRecordArray} snapshot
     @return {String} url
     */
    urlForFindAll(modelName, snapshot) {
      return this._buildURL(modelName);
    },

    /**
     Builds a URL for a `store.query(type, query)` call.
      Example:
      ```app/adapters/application.js
     import DS from 'ember-data';
      export default DS.RESTAdapter.extend({
       host: 'https://api.github.com',
       urlForQuery (query, modelName) {
         switch(modelName) {
           case 'repo':
             return `https://api.github.com/orgs/${query.orgId}/repos`;
           default:
             return this._super(...arguments);
         }
       }
     });
     ```
      @method urlForQuery
     @param {Object} query
     @param {String} modelName
     @return {String} url
     */
    urlForQuery(query, modelName) {
      return this._buildURL(modelName);
    },

    /**
     Builds a URL for a `store.queryRecord(type, query)` call.
      Example:
      ```app/adapters/application.js
     import DS from 'ember-data';
      export default DS.RESTAdapter.extend({
       urlForQueryRecord({ slug }, modelName) {
         let baseUrl = this.buildURL();
         return `${baseUrl}/${encodeURIComponent(slug)}`;
       }
     });
     ```
      @method urlForQueryRecord
     @param {Object} query
     @param {String} modelName
     @return {String} url
     */
    urlForQueryRecord(query, modelName) {
      return this._buildURL(modelName);
    },

    /**
     Builds a URL for coalescing multiple `store.findRecord(type, id)`
     records into 1 request when the adapter's `coalesceFindRequests`
     property is `true`.
      Example:
      ```app/adapters/application.js
     import DS from 'ember-data';
      export default DS.RESTAdapter.extend({
       urlForFindMany(ids, modelName) {
         let baseUrl = this.buildURL();
         return `${baseUrl}/coalesce`;
       }
     });
     ```
      @method urlForFindMany
     @param {Array} ids
     @param {String} modelName
     @param {Array} snapshots
     @return {String} url
     */
    urlForFindMany(ids, modelName, snapshots) {
      return this._buildURL(modelName);
    },

    /**
     Builds a URL for fetching an async `hasMany` relationship when a URL
     is not provided by the server.
      Example:
      ```app/adapters/application.js
     import DS from 'ember-data';
      export default DS.JSONAPIAdapter.extend({
       urlForFindHasMany(id, modelName, snapshot) {
         let baseUrl = this.buildURL(modelName, id);
         return `${baseUrl}/relationships`;
       }
     });
     ```
      @method urlForFindHasMany
     @param {String} id
     @param {String} modelName
     @param {DS.Snapshot} snapshot
     @return {String} url
     */
    urlForFindHasMany(id, modelName, snapshot) {
      return this._buildURL(modelName, id);
    },

    /**
     Builds a URL for fetching an async `belongsTo` relationship when a url
     is not provided by the server.
      Example:
      ```app/adapters/application.js
     import DS from 'ember-data';
      export default DS.JSONAPIAdapter.extend({
       urlForFindBelongsTo(id, modelName, snapshot) {
         let baseUrl = this.buildURL(modelName, id);
         return `${baseUrl}/relationships`;
       }
     });
     ```
      @method urlForFindBelongsTo
     @param {String} id
     @param {String} modelName
     @param {DS.Snapshot} snapshot
     @return {String} url
     */
    urlForFindBelongsTo(id, modelName, snapshot) {
      return this._buildURL(modelName, id);
    },

    /**
     Builds a URL for a `record.save()` call when the record was created
     locally using `store.createRecord()`.
      Example:
      ```app/adapters/application.js
     import DS from 'ember-data';
      export default DS.RESTAdapter.extend({
       urlForCreateRecord(modelName, snapshot) {
         return this._super(...arguments) + '/new';
       }
     });
     ```
      @method urlForCreateRecord
     @param {String} modelName
     @param {DS.Snapshot} snapshot
     @return {String} url
     */
    urlForCreateRecord(modelName, snapshot) {
      return this._buildURL(modelName);
    },

    /**
     Builds a URL for a `record.save()` call when the record has been updated locally.
      Example:
      ```app/adapters/application.js
     import DS from 'ember-data';
      export default DS.RESTAdapter.extend({
       urlForUpdateRecord(id, modelName, snapshot) {
         return `/${id}/feed?access_token=${snapshot.adapterOptions.token}`;
       }
     });
     ```
      @method urlForUpdateRecord
     @param {String} id
     @param {String} modelName
     @param {DS.Snapshot} snapshot
     @return {String} url
     */
    urlForUpdateRecord(id, modelName, snapshot) {
      return this._buildURL(modelName, id);
    },

    /**
     Builds a URL for a `record.save()` call when the record has been deleted locally.
      Example:
      ```app/adapters/application.js
     import DS from 'ember-data';
      export default DS.RESTAdapter.extend({
       urlForDeleteRecord(id, modelName, snapshot) {
         return this._super(...arguments) + '/destroy';
       }
     });
     ```
      @method urlForDeleteRecord
     @param {String} id
     @param {String} modelName
     @param {DS.Snapshot} snapshot
     @return {String} url
     */
    urlForDeleteRecord(id, modelName, snapshot) {
      return this._buildURL(modelName, id);
    },

    /**
      @method urlPrefix
      @private
      @param {String} path
      @param {String} parentURL
      @return {String} urlPrefix
    */
    urlPrefix(path, parentURL) {
      var host = Ember.get(this, 'host');
      var namespace = Ember.get(this, 'namespace');

      if (!host || host === '/') {
        host = '';
      }

      if (path) {
        // Protocol relative url
        if (/^\/\//.test(path) || /http(s)?:\/\//.test(path)) {
          // Do nothing, the full host is already included.
          return path; // Absolute path
        } else if (path.charAt(0) === '/') {
          return `${host}${path}`; // Relative path
        } else {
          return `${parentURL}/${path}`;
        }
      } // No path provided


      var url = [];

      if (host) {
        url.push(host);
      }

      if (namespace) {
        url.push(namespace);
      }

      return url.join('/');
    },

    /**
      Determines the pathname for a given type.
       By default, it pluralizes the type's name (for example,
      'post' becomes 'posts' and 'person' becomes 'people').
       ### Pathname customization
       For example, if you have an object `LineItem` with an
      endpoint of `/line_items/`.
       ```app/adapters/application.js
      import DS from 'ember-data';
      import { decamelize } from '@ember/string';
      import { pluralize } from 'ember-inflector';
       export default DS.RESTAdapter.extend({
        pathForType: function(modelName) {
          var decamelized = decamelize(modelName);
          return pluralize(decamelized);
        }
      });
      ```
       @method pathForType
      @param {String} modelName
      @return {String} path
    **/
    pathForType(modelName) {
      var camelized = Ember.String.camelize(modelName);
      return emberInflector.pluralize(camelized);
    }

  });

  /**
    @module ember-data
  */
  function getDefaultValue(record, options, key) {
    if (typeof options.defaultValue === 'function') {
      return options.defaultValue.apply(null, arguments);
    } else {
      var defaultValue = options.defaultValue;
      (true && !(typeof defaultValue !== 'object' || defaultValue === null) && Ember.assert(`Non primitive defaultValues are not supported because they are shared between all instances. If you would like to use a complex object as a default value please provide a function that returns the complex object.`, typeof defaultValue !== 'object' || defaultValue === null));
      return defaultValue;
    }
  }

  function hasValue(internalModel, key) {
    return internalModel._recordData.hasAttr(key);
  }
  /**
    `DS.attr` defines an attribute on a [DS.Model](/api/data/classes/DS.Model.html).
    By default, attributes are passed through as-is, however you can specify an
    optional type to have the value automatically transformed.
    Ember Data ships with four basic transform types: `string`, `number`,
    `boolean` and `date`. You can define your own transforms by subclassing
    [DS.Transform](/api/data/classes/DS.Transform.html).

    Note that you cannot use `attr` to define an attribute of `id`.

    `DS.attr` takes an optional hash as a second parameter, currently
    supported options are:

    - `defaultValue`: Pass a string or a function to be called to set the attribute
    to a default value if none is supplied.

    Example

    ```app/models/user.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      username: DS.attr('string'),
      email: DS.attr('string'),
      verified: DS.attr('boolean', { defaultValue: false })
    });
    ```

    Default value can also be a function. This is useful it you want to return
    a new object for each attribute.

    ```app/models/user.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      username: DS.attr('string'),
      email: DS.attr('string'),
      settings: DS.attr({
        defaultValue() {
          return {};
        }
      })
    });
    ```

    The `options` hash is passed as second argument to a transforms'
    `serialize` and `deserialize` method. This allows to configure a
    transformation and adapt the corresponding value, based on the config:

    ```app/models/post.js
    import DS from 'ember-data';

    export default DS.Model.extend({
      text: DS.attr('text', {
        uppercase: true
      })
    });
    ```

    ```app/transforms/text.js
    import DS from 'ember-data';

    export default DS.Transform.extend({
      serialize(value, options) {
        if (options.uppercase) {
          return value.toUpperCase();
        }

        return value;
      },

      deserialize(value) {
        return value;
      }
    })
    ```

    @namespace
    @method attr
    @for DS
    @param {String|Object} type the attribute type
    @param {Object} options a hash of options
    @return {Attribute}
  */


  function attr(type, options) {
    if (typeof type === 'object') {
      options = type;
      type = undefined;
    } else {
      options = options || {};
    }

    var meta = {
      type: type,
      isAttribute: true,
      kind: 'attribute',
      options: options
    };
    return Ember.computed({
      get(key) {
        {
          if (['_internalModel', 'recordData', 'currentState'].indexOf(key) !== -1) {
            throw new Error(`'${key}' is a reserved property name on instances of classes extending Model. Please choose a different property name for your attr on ${this.constructor.toString()}`);
          }
        }

        var internalModel = this._internalModel;

        if (hasValue(internalModel, key)) {
          return internalModel.getAttributeValue(key);
        } else {
          return getDefaultValue(this, options, key);
        }
      },

      set(key, value) {
        {
          if (['_internalModel', 'recordData', 'currentState'].indexOf(key) !== -1) {
            throw new Error(`'${key}' is a reserved property name on instances of classes extending Model. Please choose a different property name for your attr on ${this.constructor.toString()}`);
          }
        }

        return this._internalModel.setDirtyAttribute(key, value);
      }

    }).meta(meta);
  }

  var newline = /\r?\n/;
  function parseResponseHeaders(headersString) {
    var headers = Object.create(null);

    if (!headersString) {
      return headers;
    }

    var headerPairs = headersString.split(newline);

    for (var i = 0; i < headerPairs.length; i++) {
      var header = headerPairs[i];
      var j = 0;
      var foundSep = false;

      for (; j < header.length; j++) {
        if (header.charCodeAt(j) === 58
        /* ':' */
        ) {
            foundSep = true;
            break;
          }
      }

      if (foundSep === false) {
        continue;
      }

      var field = header.substring(0, j).trim();
      var value = header.substring(j + 1, header.length).trim();

      if (value) {
        var lowerCasedField = field.toLowerCase();
        headers[lowerCasedField] = value;
        headers[field] = value;
      }
    }

    return headers;
  }

  /**
    @module ember-data
  */
  /*
    Extend `Ember.DataAdapter` with ED specific code.

    @class DebugAdapter
    @namespace DS
    @extends Ember.DataAdapter
    @private
  */

  var debugAdapter = Ember.DataAdapter.extend({
    getFilters() {
      return [{
        name: 'isNew',
        desc: 'New'
      }, {
        name: 'isModified',
        desc: 'Modified'
      }, {
        name: 'isClean',
        desc: 'Clean'
      }];
    },

    detect(typeClass) {
      return typeClass !== Model && Model.detect(typeClass);
    },

    columnNameToDesc(name) {
      return Ember.String.capitalize(Ember.String.underscore(name).replace(/_/g, ' ').trim());
    },

    columnsForType(typeClass) {
      var columns = [{
        name: 'id',
        desc: 'Id'
      }];
      var count = 0;
      var self = this;
      Ember.get(typeClass, 'attributes').forEach((meta, name) => {
        if (count++ > self.attributeLimit) {
          return false;
        }

        var desc = this.columnNameToDesc(name);
        columns.push({
          name: name,
          desc: desc
        });
      });
      return columns;
    },

    getRecords(modelClass, modelName) {
      if (arguments.length < 2) {
        // Legacy Ember.js < 1.13 support
        var containerKey = modelClass._debugContainerKey;

        if (containerKey) {
          var match = containerKey.match(/model:(.*)/);

          if (match !== null) {
            modelName = match[1];
          }
        }
      }

      (true && !(!!modelName) && Ember.assert('Cannot find model name. Please upgrade to Ember.js >= 1.13 for Ember Inspector support', !!modelName));
      return this.get('store').peekAll(modelName);
    },

    getRecordColumnValues(record) {
      var count = 0;
      var columnValues = {
        id: Ember.get(record, 'id')
      };
      record.eachAttribute(key => {
        if (count++ > this.attributeLimit) {
          return false;
        }

        columnValues[key] = Ember.get(record, key);
      });
      return columnValues;
    },

    getRecordKeywords(record) {
      var keywords = [];
      var keys = Ember.A(['id']);
      record.eachAttribute(key => keys.push(key));
      keys.forEach(key => keywords.push(Ember.get(record, key)));
      return keywords;
    },

    getRecordFilterValues(record) {
      return {
        isNew: record.get('isNew'),
        isModified: record.get('hasDirtyAttributes') && !record.get('isNew'),
        isClean: !record.get('hasDirtyAttributes')
      };
    },

    getRecordColor(record) {
      var color = 'black';

      if (record.get('isNew')) {
        color = 'green';
      } else if (record.get('hasDirtyAttributes')) {
        color = 'blue';
      }

      return color;
    },

    observeRecord(record, recordUpdated) {
      var releaseMethods = Ember.A();
      var keysToObserve = Ember.A(['id', 'isNew', 'hasDirtyAttributes']);
      record.eachAttribute(key => keysToObserve.push(key));
      var adapter = this;
      keysToObserve.forEach(function (key) {
        var handler = function () {
          recordUpdated(adapter.wrapRecord(record));
        };

        Ember.addObserver(record, key, handler);
        releaseMethods.push(function () {
          Ember.removeObserver(record, key, handler);
        });
      });

      var release = function () {
        releaseMethods.forEach(fn => fn());
      };

      return release;
    }

  });

  // public

  exports.Model = Model;
  exports.Errors = Errors;
  exports.Store = Store$1;
  exports.DS = DS;
  exports.belongsTo = belongsTo;
  exports.hasMany = hasMany;
  exports.BuildURLMixin = buildUrlMixin;
  exports.Snapshot = Snapshot;
  exports.attr = attr;
  exports.AdapterError = AdapterError;
  exports.InvalidError = InvalidError;
  exports.UnauthorizedError = UnauthorizedError;
  exports.ForbiddenError = ForbiddenError;
  exports.NotFoundError = NotFoundError;
  exports.ConflictError = ConflictError;
  exports.ServerError = ServerError;
  exports.TimeoutError = TimeoutError;
  exports.AbortError = AbortError;
  exports.errorsHashToArray = errorsHashToArray;
  exports.errorsArrayToHash = errorsArrayToHash;
  exports.normalizeModelName = normalizeModelName;
  exports.getOwner = getOwner;
  exports.modelHasAttributeOrRelationshipNamedType = modelHasAttributeOrRelationshipNamedType;
  exports.coerceId = coerceId;
  exports.parseResponseHeaders = parseResponseHeaders;
  exports.isEnabled = featureIsEnabled;
  exports.RootState = RootState$1;
  exports.InternalModel = InternalModel;
  exports.RecordData = RecordData;
  exports.PromiseArray = PromiseArray;
  exports.PromiseObject = PromiseObject;
  exports.PromiseManyArray = PromiseManyArray;
  exports.RecordArray = RecordArray;
  exports.AdapterPopulatedRecordArray = AdapterPopulatedRecordArray;
  exports.ManyArray = ManyArray;
  exports.RecordArrayManager = RecordArrayManager;
  exports.Relationship = Relationship;
  exports.DebugAdapter = debugAdapter;
  exports.diffArray = diffArray;
  exports.SnapshotRecordArray = SnapshotRecordArray;

  Object.defineProperty(exports, '__esModule', { value: true });

});
