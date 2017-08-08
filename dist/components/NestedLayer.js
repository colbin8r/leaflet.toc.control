'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _LeafletTOC = require('../Leaflet.TOC.NestedLayer');

var _LeafletTOC2 = _interopRequireDefault(_LeafletTOC);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NestedLayer = function (_React$Component) {
  _inherits(NestedLayer, _React$Component);

  function NestedLayer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, NestedLayer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = NestedLayer.__proto__ || Object.getPrototypeOf(NestedLayer)).call.apply(_ref, [this].concat(args))), _this), _this.toggleSelected = function () {
      _this.props.toggleSelected(_this.props.layer);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(NestedLayer, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var classes = (0, _classnames2.default)({
        leaf: true,
        enabled: this.props.layer.enabled,
        disabled: this.props.layer.disabled,
        selected: this.props.layer.selected,
        deselected: this.props.layer.deselected
      });

      var children = void 0;

      if (this.props.layer.hasChildren) {
        // each child layer turns into a NestedLayer
        children = this.props.layer.children.map(function (layer) {
          return _react2.default.createElement(NestedLayer, { layer: layer,
            toggleSelected: _this2.props.toggleSelected,
            key: layer.id });
        });
        // wrap the children with a <ul>
        children = _react2.default.createElement(
          'ul',
          { className: 'branch' },
          children
        );
      }

      return _react2.default.createElement(
        'li',
        { className: classes },
        _react2.default.createElement('input', { type: 'checkbox', checked: this.props.layer.selected, onChange: this.toggleSelected }),
        _react2.default.createElement(
          'span',
          { className: 'layer-name' },
          this.props.layer.name
        ),
        children
      );
    }
  }]);

  return NestedLayer;
}(_react2.default.Component);

NestedLayer.propTypes = {
  layer: _propTypes2.default.instanceOf(_LeafletTOC2.default).isRequired,
  toggleSelected: _propTypes2.default.func.isRequired
  // toggleEnabled: PropTypes.func.isRequired
};
exports.default = NestedLayer;
//# sourceMappingURL=NestedLayer.js.map
