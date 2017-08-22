'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _NestedLayer = require('./NestedLayer');

var _NestedLayer2 = _interopRequireDefault(_NestedLayer);

var _LeafletTOC = require('../Leaflet.TOC.NestedLayer');

var _LeafletTOC2 = _interopRequireDefault(_LeafletTOC);

var _LeafletTOC3 = require('../Leaflet.TOC.MapEventManager');

var _LeafletTOC4 = _interopRequireDefault(_LeafletTOC3);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import NestedLayerTreeHelper from '../Leaflet.TOC.NestedLayerTreeHelper';

var LeafletTOC = function (_React$Component) {
  _inherits(LeafletTOC, _React$Component);

  function LeafletTOC(props) {
    _classCallCheck(this, LeafletTOC);

    // the initial state is a reference to the layers prop
    var _this = _possibleConstructorReturn(this, (LeafletTOC.__proto__ || Object.getPrototypeOf(LeafletTOC)).call(this, props));

    _this.toggleSelected = function (layer) {
      // let layers = this.state.layers;
      layer.toggleSelected();
      _this.setState({ layers: _this.state.layers });
    };

    _this.visibilityChange = (0, _lodash.debounce)(function () {
      console.log('visibilityChange (debounced)');
      _this.setState({ layers: _this.state.layers });
    });
    _this.state = {
      layers: props.layers
    };

    _this.eventManager = new _LeafletTOC4.default();
    window.em = _this.eventManager; // FOR DEBUGGING
    console.log('LeafletTOC created event manager', _this.eventManager);
    return _this;
  }

  _createClass(LeafletTOC, [{
    key: 'componentWillUpdate',


    // toggleEnabled = (layer) => {
    //   console.log('toggling enabled state of', layer);
    //   layer.toggleEnabled();
    //   this.setState({ layers: this.state.layers });
    // }
    //

    value: function componentWillUpdate() {
      console.log('LeafletTOC componentWillUpdate (state change)');
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      console.log('LeafletTOC rendering with event manager', this.eventManager);

      var layers = this.state.layers.map(function (layer) {
        return _react2.default.createElement(_NestedLayer2.default, { layer: layer,
          toggleSelected: _this2.toggleSelected,
          visibilityChange: _this2.visibilityChange,
          eventManager: _this2.eventManager,
          key: layer.id });
      });

      return _react2.default.createElement(
        'div',
        { className: 'leaflet-toc-container' },
        _react2.default.createElement(
          'h2',
          null,
          this.props.title
        ),
        _react2.default.createElement(
          'ul',
          { className: 'branch' },
          layers
        )
      );
    }
  }]);

  return LeafletTOC;
}(_react2.default.Component);

LeafletTOC.propTypes = {
  layers: _propTypes2.default.arrayOf(_propTypes2.default.instanceOf(_LeafletTOC2.default)).isRequired,
  title: _propTypes2.default.string.isRequired
};
exports.default = LeafletTOC;
//# sourceMappingURL=LeafletTOC.js.map
