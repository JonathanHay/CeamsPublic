import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | ga-task-force/manage-users', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:ga-task-force/manage-users');
    assert.ok(controller);
  });
});
