define("aouda-ceams-frontend/tests/integration/components/datatable-example-test", ["qunit", "ember-qunit", "@ember/test-helpers"], function (_qunit, _emberQunit, _testHelpers) {
  "use strict";

  (0, _qunit.module)('Integration | Component | datatable-example', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.set('myAction', function(val) { ... });
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "jmT3Kpuz",
        "block": "{\"symbols\":[],\"statements\":[[1,[21,\"datatable-example\"],false]],\"hasEval\":false}",
        "meta": {}
      }));
      assert.equal(this.element.textContent.trim(), ''); // Template block usage:

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "e3dlVtcC",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"datatable-example\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));
      assert.equal(this.element.textContent.trim(), 'template block text');
    });
  });
});