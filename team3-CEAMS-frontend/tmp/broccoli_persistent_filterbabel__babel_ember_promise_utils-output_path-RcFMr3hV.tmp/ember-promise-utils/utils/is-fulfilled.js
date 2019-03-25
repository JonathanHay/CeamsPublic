define('ember-promise-utils/utils/is-fulfilled', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isFulfilled;


  /**
   * It's assumed if you call this method, it was previously checked that it is a promise
   * @param promise
   * @returns {boolean} whether promise has been fullfilled or not
   */
  function isFulfilled(promise) {
    if (Ember.PromiseProxyMixin.detect(promise)) {
      return !!promise.get('isFulfilled');
    }

    if (promise instanceof Ember.RSVP.Promise) {
      return promise._state === 1;
    }

    // Can't detect it if its not one of the two kinds above
    return false;
  }
});