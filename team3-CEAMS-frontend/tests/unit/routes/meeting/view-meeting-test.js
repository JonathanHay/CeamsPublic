import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | meeting/view-meeting', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:meeting/view-meeting');
    assert.ok(route);
  });
});
