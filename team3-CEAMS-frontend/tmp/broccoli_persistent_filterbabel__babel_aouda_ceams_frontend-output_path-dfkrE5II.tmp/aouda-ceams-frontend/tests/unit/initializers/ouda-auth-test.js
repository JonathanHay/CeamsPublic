define("aouda-ceams-frontend/tests/unit/initializers/ouda-auth-test", ["aouda-ceams-frontend/initializers/ouda-auth", "qunit", "ember-qunit"], function (_oudaAuth, _qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Initializer | ouda-auth', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    hooks.beforeEach(function () {
      this.TestApplication = Ember.Application.extend();
      this.TestApplication.initializer({
        name: 'initializer under test',
        initialize: _oudaAuth.initialize
      });
      this.application = this.TestApplication.create({
        autoboot: false
      });
    });
    hooks.afterEach(function () {
      Ember.run(this.application, 'destroy');
    }); // Replace this with your real tests.

    (0, _qunit.test)('it works', async function (assert) {
      await this.application.boot();
      assert.ok(true);
    });
  });
});