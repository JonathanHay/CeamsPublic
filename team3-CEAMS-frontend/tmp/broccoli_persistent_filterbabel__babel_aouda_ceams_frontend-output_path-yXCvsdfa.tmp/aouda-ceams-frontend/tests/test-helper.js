define("aouda-ceams-frontend/tests/test-helper", ["aouda-ceams-frontend/app", "aouda-ceams-frontend/config/environment", "@ember/test-helpers", "ember-qunit"], function (_app, _environment, _testHelpers, _emberQunit) {
  "use strict";

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));
  (0, _emberQunit.start)();
});