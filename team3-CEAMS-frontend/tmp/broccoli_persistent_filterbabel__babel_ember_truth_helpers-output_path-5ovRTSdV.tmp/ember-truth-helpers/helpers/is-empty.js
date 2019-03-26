define('ember-truth-helpers/helpers/is-empty', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Helper.helper(function ([obj]) {
    return Ember.isEmpty(obj);
  });
});