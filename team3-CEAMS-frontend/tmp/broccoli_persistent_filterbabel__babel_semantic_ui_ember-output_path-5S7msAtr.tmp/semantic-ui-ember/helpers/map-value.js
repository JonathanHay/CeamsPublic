define('semantic-ui-ember/helpers/map-value', ['exports', 'ember-promise-utils/mixins/promise-resolver'], function (exports, _promiseResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Helper.extend(_promiseResolver.default, {
    compute([action, maybePromise]) {
      return this.resolvePromise(maybePromise, function (value) {
        return action(value);
      }, function () {
        this.recompute();
        return null;
      });
    }
  });
});