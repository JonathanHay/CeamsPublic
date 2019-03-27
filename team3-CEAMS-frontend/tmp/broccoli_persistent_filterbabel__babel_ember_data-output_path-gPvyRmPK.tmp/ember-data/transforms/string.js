define("ember-data/transforms/string", ["exports", "ember-data/transforms/transform"], function (_exports, _transform) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /**
    The `DS.StringTransform` class is used to serialize and deserialize
    string attributes on Ember Data record objects. This transform is
    used when `string` is passed as the type parameter to the
    [DS.attr](../../data#method_attr) function.
  
    Usage
  
    ```app/models/user.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      isAdmin: DS.attr('boolean'),
      name: DS.attr('string'),
      email: DS.attr('string')
    });
    ```
  
    @class StringTransform
    @extends DS.Transform
    @namespace DS
   */
  var _default = _transform.default.extend({
    deserialize(serialized) {
      return Ember.isNone(serialized) ? null : String(serialized);
    },

    serialize(deserialized) {
      return Ember.isNone(deserialized) ? null : String(deserialized);
    }

  });

  _exports.default = _default;
});