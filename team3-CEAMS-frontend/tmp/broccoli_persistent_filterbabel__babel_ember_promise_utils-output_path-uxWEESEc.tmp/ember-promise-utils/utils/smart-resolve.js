define('ember-promise-utils/utils/smart-resolve', ['exports', 'ember-promise-utils/utils/is-promise', 'ember-promise-utils/utils/is-fulfilled', 'ember-promise-utils/utils/get-promise-content'], function (exports, _isPromise, _isFulfilled, _getPromiseContent) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = smartResolve;

    /**
     * Returns the resolved data from a promise, if it has been resolved,
     * or it returns the promise itself
     *
     * @param maybePromise
     * @returns {Promise | Object} the promise itself, or it's data, if fulfilled
     */
    function smartResolve(maybePromise) {
        if (!(0, _isPromise.default)(maybePromise)) {
            // Not a promise, return value
            return maybePromise;
        }
        if (!(0, _isFulfilled.default)(maybePromise)) {
            // Promise is still pending, return promise
            return maybePromise;
        }
        // Try to unwrap promise and get content;
        return (0, _getPromiseContent.default)(maybePromise);
    }
});