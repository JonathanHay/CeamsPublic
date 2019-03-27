define("ember-data/adapters/errors", ["exports", "ember-data/-private"], function (_exports, _private) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "AdapterError", {
    enumerable: true,
    get: function () {
      return _private.AdapterError;
    }
  });
  Object.defineProperty(_exports, "InvalidError", {
    enumerable: true,
    get: function () {
      return _private.InvalidError;
    }
  });
  Object.defineProperty(_exports, "UnauthorizedError", {
    enumerable: true,
    get: function () {
      return _private.UnauthorizedError;
    }
  });
  Object.defineProperty(_exports, "ForbiddenError", {
    enumerable: true,
    get: function () {
      return _private.ForbiddenError;
    }
  });
  Object.defineProperty(_exports, "NotFoundError", {
    enumerable: true,
    get: function () {
      return _private.NotFoundError;
    }
  });
  Object.defineProperty(_exports, "ConflictError", {
    enumerable: true,
    get: function () {
      return _private.ConflictError;
    }
  });
  Object.defineProperty(_exports, "ServerError", {
    enumerable: true,
    get: function () {
      return _private.ServerError;
    }
  });
  Object.defineProperty(_exports, "TimeoutError", {
    enumerable: true,
    get: function () {
      return _private.TimeoutError;
    }
  });
  Object.defineProperty(_exports, "AbortError", {
    enumerable: true,
    get: function () {
      return _private.AbortError;
    }
  });
  Object.defineProperty(_exports, "errorsHashToArray", {
    enumerable: true,
    get: function () {
      return _private.errorsHashToArray;
    }
  });
  Object.defineProperty(_exports, "errorsArrayToHash", {
    enumerable: true,
    get: function () {
      return _private.errorsArrayToHash;
    }
  });
});