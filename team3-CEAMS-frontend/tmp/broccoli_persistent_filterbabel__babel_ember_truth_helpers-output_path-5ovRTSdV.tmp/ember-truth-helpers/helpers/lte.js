define('ember-truth-helpers/helpers/lte', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.lte = lte;
  function lte([left, right], hash) {
    if (hash.forceNumber) {
      if (typeof left !== 'number') {
        left = Number(left);
      }
      if (typeof right !== 'number') {
        right = Number(right);
      }
    }
    return left <= right;
  }

  exports.default = Ember.Helper.helper(lte);
});