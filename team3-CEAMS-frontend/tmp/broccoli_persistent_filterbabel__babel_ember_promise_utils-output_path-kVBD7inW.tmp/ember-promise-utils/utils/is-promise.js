define('ember-promise-utils/utils/is-promise', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isPromise;
  /**
   * Check if given object is promise or not
   * @param maybePromise
   * @returns {boolean} whether it is a promise
   */
  function isPromise(maybePromise) {
    return maybePromise != null && typeof maybePromise.then === 'function';
  }
});