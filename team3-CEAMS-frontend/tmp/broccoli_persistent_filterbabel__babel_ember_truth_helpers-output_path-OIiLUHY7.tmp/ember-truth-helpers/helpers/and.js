define('ember-truth-helpers/helpers/and', ['exports', 'ember-truth-helpers/utils/truth-convert'], function (exports, _truthConvert) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.and = and;
  function and(params) {
    for (let i = 0, len = params.length; i < len; i++) {
      if ((0, _truthConvert.default)(params[i]) === false) {
        return params[i];
      }
    }
    return params[params.length - 1];
  }

  exports.default = Ember.Helper.helper(and);
});