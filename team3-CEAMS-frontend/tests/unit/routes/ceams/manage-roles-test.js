import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | ceams/manage-roles', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:ceams/manage-roles');
    assert.ok(route);
  });
});
