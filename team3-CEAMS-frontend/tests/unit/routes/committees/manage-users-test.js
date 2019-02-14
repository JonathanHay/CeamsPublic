import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | ga-task-force/manage-users', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:ga-task-force/manage-users');
    assert.ok(route);
  });
});
