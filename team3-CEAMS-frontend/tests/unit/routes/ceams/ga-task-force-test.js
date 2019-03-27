import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | ceams/ga-task-force', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:ceams/ga-task-force');
    assert.ok(route);
  });
});
