import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | manage-upi', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:manage-upi');
    assert.ok(route);
  });
});
