define("aouda-ceams-frontend/components/datatable-example", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    didRender() {
      this._super(...arguments);

      Ember.$('#example').DataTable();
    }

  });

  _exports.default = _default;
});