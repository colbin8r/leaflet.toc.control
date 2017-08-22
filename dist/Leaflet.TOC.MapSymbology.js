"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapSymbology = function () {
  function MapSymbology() {
    var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _classCallCheck(this, MapSymbology);

    this._symbols = symbols;
  }

  _createClass(MapSymbology, [{
    key: "addSymbol",
    value: function addSymbol(symbol) {
      this._symbols.push(symbol);
    }
  }, {
    key: "symbols",
    get: function get() {
      return this._symbols;
    }
  }, {
    key: "isSingle",
    get: function get() {
      return this.symbols.length == 1;
    }
  }]);

  return MapSymbology;
}();

exports.default = MapSymbology;
//# sourceMappingURL=Leaflet.TOC.MapSymbology.js.map
