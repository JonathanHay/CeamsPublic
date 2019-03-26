define('ember-truth-helpers/utils/truth-convert', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = truthConvert;
  function truthConvert(result) {
    const truthy = result && Ember.get(result, 'isTruthy');
    if (typeof truthy === 'boolean') {
      return truthy;
    }

    if (Ember.isArray(result)) {
      return Ember.get(result, 'length') !== 0;
    } else {
      return !!result;
    }
  }
});