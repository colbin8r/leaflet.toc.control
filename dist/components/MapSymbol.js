'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _LeafletTOC = require('../Leaflet.TOC.MapSymbol');

var _LeafletTOC2 = _interopRequireDefault(_LeafletTOC);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MapSymbol = function (_React$Component) {
  _inherits(MapSymbol, _React$Component);

  function MapSymbol() {
    _classCallCheck(this, MapSymbol);

    return _possibleConstructorReturn(this, (MapSymbol.__proto__ || Object.getPrototypeOf(MapSymbol)).apply(this, arguments));
  }

  _createClass(MapSymbol, [{
    key: 'render',
    value: function render() {
      var imgStyle = {
        width: this.props.symbol.width,
        height: this.props.symbol.height
      };
      return _react2.default.createElement(
        'li',
        { className: 'symbol' },
        _react2.default.createElement('img', { src: this.props.symbol.base64URI,
          style: imgStyle,
          alt: '',
          className: 'swatch' }),
        _react2.default.createElement(
          'span',
          { className: 'label' },
          this.props.symbol.label
        )
      );
    }
  }]);

  return MapSymbol;
}(_react2.default.Component);

MapSymbol.propTypes = {
  symbol: _propTypes2.default.instanceOf(_LeafletTOC2.default).isRequired
};
exports.default = MapSymbol;
//# sourceMappingURL=MapSymbol.js.map
