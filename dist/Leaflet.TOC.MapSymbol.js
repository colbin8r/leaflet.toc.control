'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapSymbol = function () {
  function MapSymbol(props) {
    _classCallCheck(this, MapSymbol);

    // merge props with defaults
    this._props = {};
    // https://lodash.com/docs/4.17.4#defaultsDeep
    (0, _lodash.defaultsDeep)(this._props, props, this.defaults);
  }

  _createClass(MapSymbol, [{
    key: 'label',
    get: function get() {
      return this._props.label;
    }
  }, {
    key: 'height',
    get: function get() {
      return this._props.height;
    }
  }, {
    key: 'width',
    get: function get() {
      return this._props.width;
    }
  }, {
    key: 'contentType',
    get: function get() {
      return this._props.contentType;
    }
  }, {
    key: 'imageData',
    get: function get() {
      return this._props.imageData;
    }
  }, {
    key: 'relativeURL',
    get: function get() {
      return this._props.relativeURL;
    }
  }, {
    key: 'base64URI',
    get: function get() {
      return 'data:' + this.contentType + ';base64,' + this.imageData;
    }
  }, {
    key: 'defaults',
    get: function get() {
      // uses reflection to return the static _defaults property on the class
      return this.constructor._defaults;
    }
  }]);

  return MapSymbol;
}();

MapSymbol._defaults = {
  label: '',
  height: 20,
  width: 20,
  contentType: 'image/png',
  imageData: '',
  relativeURL: ''
};
exports.default = MapSymbol;
//# sourceMappingURL=Leaflet.TOC.MapSymbol.js.map
