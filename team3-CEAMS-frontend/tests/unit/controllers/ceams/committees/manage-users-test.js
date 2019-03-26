import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | ceams/committees/manage-users', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:ceams/committees/manage-users');
    assert.ok(controller);
  });
});
