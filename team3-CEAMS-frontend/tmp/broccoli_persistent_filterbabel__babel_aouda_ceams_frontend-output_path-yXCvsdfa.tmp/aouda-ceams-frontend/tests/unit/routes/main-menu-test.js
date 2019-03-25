define("aouda-ceams-frontend/tests/unit/routes/main-menu-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Route | MainMenu', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:main-menu');
      assert.ok(route);
    });
  });
});