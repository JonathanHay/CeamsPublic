define('ember-promise-utils/utils/get-promise-content', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = getPromiseContent;


  /**
   * It's assumed if you call this method, it was previously checked that it was a promise
   * and is fullfilled
   *
   * @param promise
   * @returns {Object} contents of the promise
   */
  function getPromiseContent(promise) {
    if (Ember.PromiseProxyMixin.detect(promise)) {
      return promise.get('content');
    }

    if (promise instanceof Ember.RSVP.Promise) {
      return promise._result;
    }

    // Only can get the content for one of the two above
    return null;
  }
});