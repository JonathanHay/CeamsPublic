define('ember-truth-helpers/helpers/is-equal', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.isEqual = isEqual;
  function isEqual([a, b]) {
    return Ember.isEqual(a, b);
  }

  exports.default = Ember.Helper.helper(isEqual);
});