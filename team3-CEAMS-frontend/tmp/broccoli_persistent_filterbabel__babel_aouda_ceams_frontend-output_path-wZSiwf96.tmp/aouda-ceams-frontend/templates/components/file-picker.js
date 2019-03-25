define("aouda-ceams-frontend/templates/components/file-picker", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "ewMcR84W",
    "block": "{\"symbols\":[\"&default\"],\"statements\":[[4,\"if\",[[23,[\"dropzone\"]]],null,{\"statements\":[[0,\"  \"],[7,\"div\"],[11,\"class\",\"file-picker__dropzone\"],[9],[0,\"\\n    \"],[14,1],[0,\"\\n  \"],[10],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"  \"],[14,1],[0,\"\\n\"]],\"parameters\":[]}],[0,\"\\n\"],[4,\"if\",[[23,[\"preview\"]]],null,{\"statements\":[[0,\"  \"],[7,\"div\"],[11,\"class\",\"file-picker__preview\"],[9],[10],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[23,[\"progress\"]]],null,{\"statements\":[[4,\"if\",[[23,[\"showProgress\"]]],null,{\"statements\":[[4,\"if\",[[23,[\"isProgressSupported\"]]],null,{\"statements\":[[0,\"      \"],[7,\"progress\"],[12,\"value\",[21,\"progressValue\"]],[11,\"max\",\"100\"],[11,\"class\",\"file-picker__progress\"],[9],[1,[21,\"progress\"],false],[0,\" %\"],[10],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"      \"],[7,\"div\"],[11,\"class\",\"file-picker__progress\"],[9],[0,\"\\n        \"],[7,\"span\"],[11,\"class\",\"file-picker__progress__value\"],[12,\"style\",[21,\"progressStyle\"]],[9],[10],[0,\"\\n      \"],[10],[0,\"\\n\"]],\"parameters\":[]}]],\"parameters\":[]},null]],\"parameters\":[]},null],[0,\"\\n\"],[1,[27,\"input\",null,[[\"type\",\"value\",\"accept\",\"multiple\",\"class\"],[\"file\",[23,[\"file\"]],[23,[\"accept\"]],[23,[\"multiple\"]],\"file-picker__input\"]]],false],[0,\"\\n\"]],\"hasEval\":false}",
    "meta": {
      "moduleName": "aouda-ceams-frontend/templates/components/file-picker.hbs"
    }
  });

  _exports.default = _default;
});