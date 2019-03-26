define("aouda-ceams-frontend/tests/helpers/ember-cli-file-picker", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.uploadFileHelper = _exports.uploadFile = void 0;

  /* global Blob, jQuery */
  function createFile(content = ['test'], options = {}) {
    const {
      name,
      type,
      lastModifiedDate
    } = options;
    const file = new Blob(content, {
      type: type ? type : 'text/plain'
    });
    file.name = name ? name : 'test.txt';
    return file;
  }

  const uploadFileHelper = function (content, options) {
    const file = createFile(content, options);
    const event = jQuery.Event('change');
    event.target = {
      files: [file]
    };
    jQuery('.file-picker__input').trigger(event);
  };

  _exports.uploadFileHelper = uploadFileHelper;
  const uploadFile = Ember.Test.registerAsyncHelper('uploadFile', function (app, content, options) {
    uploadFileHelper(content, options);
    return wait();
  });
  _exports.uploadFile = uploadFile;
});