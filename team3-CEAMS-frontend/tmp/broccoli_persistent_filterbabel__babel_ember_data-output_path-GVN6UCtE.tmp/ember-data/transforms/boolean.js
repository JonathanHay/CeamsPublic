define("ember-data/transforms/boolean", ["exports", "ember-data/transforms/transform"], function (_exports, _transform) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /**
    The `DS.BooleanTransform` class is used to serialize and deserialize
    boolean attributes on Ember Data record objects. This transform is
    used when `boolean` is passed as the type parameter to the
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
  
    By default, the boolean transform only allows for values of `true` or
    `false`. You can opt into allowing `null` values for
    boolean attributes via `DS.attr('boolean', { allowNull: true })`
  
    ```app/models/user.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      email: DS.attr('string'),
      username: DS.attr('string'),
      wantsWeeklyEmail: DS.attr('boolean', { allowNull: true })
    });
    ```
  
    @class BooleanTransform
    @extends DS.Transform
    @namespace DS
   */
  var _default = _transform.default.extend({
    deserialize(serialized, options) {
      if (Ember.isNone(serialized) && options.allowNull === true) {
        return null;
      }

      var type = typeof serialized;

      if (type === 'boolean') {
        return serialized;
      } else if (type === 'string') {
        return /^(true|t|1)$/i.test(serialized);
      } else if (type === 'number') {
        return serialized === 1;
      } else {
        return false;
      }
    },

    serialize(deserialized, options) {
      if (Ember.isNone(deserialized) && options.allowNull === true) {
        return null;
      }

      return Boolean(deserialized);
    }

  });

  _exports.default = _default;
});