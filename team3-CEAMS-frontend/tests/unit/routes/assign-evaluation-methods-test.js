import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | assign-evaluation-methods', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:assign-evaluation-methods');
    assert.ok(route);
  });
});
