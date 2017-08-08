'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Symbology = function () {
  function Symbology(props) {
    _classCallCheck(this, Symbology);

    // merge props with defaults
    this._props = {};
    // https://lodash.com/docs/4.17.4#defaultsDeep
    (0, _lodash.defaultsDeep)(this._props, props, this.defaults);
  }

  _createClass(Symbology, [{
    key: 'label',
    get: function get() {
      return this._props.label;
    },
    set: function set(val) {
      this._props.label = val;
    }
  }, {
    key: 'defaults',
    get: function get() {
      // uses reflection to return the static _defaults property on the class
      return this.constructor._defaults;
    }
  }]);

  return Symbology;
}();

Symbology._defaults = {};
exports.default = Symbology;
//# sourceMappingURL=Leaflet.TOC.Symbology.js.map
