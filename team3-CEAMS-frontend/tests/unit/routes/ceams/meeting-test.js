import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | ceams/meeting', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:ceams/meeting');
    assert.ok(route);
  });
});
