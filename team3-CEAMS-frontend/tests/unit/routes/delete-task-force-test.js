import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | delete-task-force', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:delete-task-force');
    assert.ok(route);
  });
});