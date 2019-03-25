define("aouda-ceams-frontend/tests/unit/services/ouda-auth-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Service | ouda-auth', function (hooks) {
    (0, _emberQunit.setupTest)(hooks); // Replace this with your real tests.

    (0, _qunit.test)('it exists', function (assert) {
      let service = this.owner.lookup('service:ouda-auth');
      assert.ok(service);
    });
  });
});