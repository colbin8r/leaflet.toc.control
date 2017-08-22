'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _MapSymbol = require('./MapSymbol');

var _MapSymbol2 = _interopRequireDefault(_MapSymbol);

var _LeafletTOC = require('../Leaflet.TOC.MapSymbology');

var _LeafletTOC2 = _interopRequireDefault(_LeafletTOC);

var _LeafletTOC3 = require('../Leaflet.TOC.NestedLayer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MapSymbology = function (_React$Component) {
  _inherits(MapSymbology, _React$Component);

  function MapSymbology() {
    _classCallCheck(this, MapSymbology);

    return _possibleConstructorReturn(this, (MapSymbology.__proto__ || Object.getPrototypeOf(MapSymbology)).apply(this, arguments));
  }

  _createClass(MapSymbology, [{
    key: 'render',
    value: function render() {
      var symbols = this.props.symbology.symbols.map(function (symbol) {
        return _react2.default.createElement(_MapSymbol2.default, { symbol: symbol, key: (0, _LeafletTOC3.generateID)() });
      });

      return _react2.default.createElement(
        'ul',
        { className: 'symbology' },
        symbols
      );
    }
  }]);

  return MapSymbology;
}(_react2.default.Component);

MapSymbology.propTypes = {
  symbology: _propTypes2.default.instanceOf(_LeafletTOC2.default).isRequired
};
exports.default = MapSymbology;
//# sourceMappingURL=MapSymbology.js.map
