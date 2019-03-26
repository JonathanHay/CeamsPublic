define("aouda-ceams-frontend/tests/unit/routes/datatable-example-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Route | datatable-example', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:datatable-example');
      assert.ok(route);
    });
  });
});