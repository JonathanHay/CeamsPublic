define('ember-truth-helpers/helpers/is-array', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.isArray = isArray;
  function isArray(params) {
    for (let i = 0, len = params.length; i < len; i++) {
      if (Ember.isArray(params[i]) === false) {
        return false;
      }
    }
    return true;
  }

  exports.default = Ember.Helper.helper(isArray);
});