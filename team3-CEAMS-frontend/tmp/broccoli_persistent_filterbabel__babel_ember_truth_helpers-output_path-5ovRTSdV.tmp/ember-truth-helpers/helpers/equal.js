define('ember-truth-helpers/helpers/equal', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.equal = equal;
  function equal(params) {
    return params[0] === params[1];
  }

  exports.default = Ember.Helper.helper(equal);
});