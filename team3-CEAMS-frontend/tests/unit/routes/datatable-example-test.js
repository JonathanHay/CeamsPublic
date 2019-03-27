import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | datatable-example', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:datatable-example');
    assert.ok(route);
  });
});
