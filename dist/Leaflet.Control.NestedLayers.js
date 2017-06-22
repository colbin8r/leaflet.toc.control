'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NestedLayerComponent = exports.NestedLayersComponent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _leafletHeadless = require('leaflet-headless');

var _leafletHeadless2 = _interopRequireDefault(_leafletHeadless);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Leaflet = require('./Leaflet.LayerHierarchy');

var _Leaflet2 = _interopRequireDefault(_Leaflet);

var _Leaflet3 = require('./Leaflet.NestedLayer');

var _Leaflet4 = _interopRequireDefault(_Leaflet3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NestedLayersComponent = exports.NestedLayersComponent = function (_React$Component) {
  _inherits(NestedLayersComponent, _React$Component);

  function NestedLayersComponent(props) {
    _classCallCheck(this, NestedLayersComponent);

    return _possibleConstructorReturn(this, (NestedLayersComponent.__proto__ || Object.getPrototypeOf(NestedLayersComponent)).call(this, props));
    // primary prop is 'hierarchy', an instance of Leaflet.LayerHierarchy
  }

  _createClass(NestedLayersComponent, [{
    key: 'makeComponentFromLayer',
    value: function makeComponentFromLayer(layer) {
      // recursive function
      // 'leaf' is the base case

      // branch: this layer has children
      if (layer.children.length < 0) {
        // recursively calls this function on each child (leaf)
        // 'leaves' will be an array of JSX components (NestedLayerComponent) for each child (leaf)
        var leaves = layer.children.map(this.makeComponentFromLayer);

        return _react2.default.createElement(
          NestedLayerComponent,
          { l: layer },
          _react2.default.createElement(
            'ul',
            { className: 'branch' },
            leaves
          )
        );
      } else {
        // leaf: this layer is just a leaf
        return _react2.default.createElement(NestedLayerComponent, { l: layer, key: layer.id });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var roots = this.props.hierarchy.getRootLayers();
      var components = [];

      for (var i = 0; i < roots.length; i++) {
        components.push(this.makeComponentFromLayer(roots[i]));
      }

      return _react2.default.createElement(
        'div',
        { className: 'nested-layer-control-container' },
        'TOC CONTROL',
        components
      );
    }
  }]);

  return NestedLayersComponent;
}(_react2.default.Component);

var NestedLayerComponent = exports.NestedLayerComponent = function (_React$Component2) {
  _inherits(NestedLayerComponent, _React$Component2);

  function NestedLayerComponent(props) {
    _classCallCheck(this, NestedLayerComponent);

    // this.state = {date: new Date()};
    var _this2 = _possibleConstructorReturn(this, (NestedLayerComponent.__proto__ || Object.getPrototypeOf(NestedLayerComponent)).call(this, props));

    _this2.toggleSelected = function () {
      debugger;
      _this2.props.l.toggleSelected();
    };

    return _this2;
  }

  _createClass(NestedLayerComponent, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'li',
        { className: 'leaf', onClick: this.toggleSelected },
        _react2.default.createElement('input', { type: 'checkbox', value: this.props.l.selected }),
        this.props.l.swatch.length > 0 && _react2.default.createElement('img', { src: 'data:{this.props.l.swatch}', className: 'swatch' }),
        _react2.default.createElement(
          'span',
          { className: 'layer-name' },
          this.props.l.name
        ),
        this.props.children
      );
    }
  }]);

  return NestedLayerComponent;
}(_react2.default.Component);

NestedLayerComponent.propTypes = {
  l: _propTypes2.default.instanceOf(_Leaflet4.default).isRequired
};

var NestedLayers = function () {

  /*
   * NestedLayers plugin
   *
   * Required Arguments
   * hierarchy: LayerHierarchy object to represent; create this with L.layerHierarchy
   * element: DOM element to attach to and render in
   *
   * Options
   * n/a
   */
  function NestedLayers(hierarchy, element, options) {
    _classCallCheck(this, NestedLayers);

    if (typeof hierarchy == 'undefined') {
      throw new Error('Missing hierarchy when creating NestedLayers control');
    }
    this.hierarchy = hierarchy;
    if (typeof element == 'undefined') {
      throw new Error('Missing element when creating NestedLayers control');
    }
    this.element = element;

    // save the options
    this._options = {};
    Object.assign(this._options, options);

    this._component = _react2.default.createElement(NestedLayersComponent, { hierarchy: this.hierarchy });

    this._isAttached = false;

    // bind to the DOM
    this.attach();
  }

  _createClass(NestedLayers, [{
    key: 'attach',

    // no direct setting of 'isAttached' from outside the class
    // the attach() and detach() methods handle this state

    // bind to DOM
    value: function attach() {
      if (!this.isAttachedz) {
        _reactDom2.default.render(this.component, this.element);
      }
      this._isAttached = true;
    }

    // unbind from DOM

  }, {
    key: 'detach',
    value: function detach() {
      if (this.isAttached) {
        _reactDom2.default.unmountComponentAtNode(this.element);
      }
      this._isAttached = true;
    }
  }, {
    key: 'hierarchy',
    get: function get() {
      return this._hierarchy;
    }
    // shorthand convenience accessor
    ,
    set: function set(val) {
      this._hierarchy = val;
    }
  }, {
    key: 'h',
    get: function get() {
      return this.hierarchy;
    }
  }, {
    key: 'element',
    get: function get() {
      return this._element;
    }
    // shorthand convenience accessor
    ,
    set: function set(val) {
      this._element = val;
    }
  }, {
    key: 'el',
    get: function get() {
      return this.element;
    }
  }, {
    key: 'component',
    get: function get() {
      return this._component;
    }
    // short convenience accessor

  }, {
    key: 'c',
    get: function get() {
      return this.component;
    }
    // no direct setting of 'component' from outside the class

  }, {
    key: 'isAttached',
    get: function get() {
      return this._isAttached;
    }
  }]);

  return NestedLayers;
}();

exports.default = NestedLayers;
//# sourceMappingURL=Leaflet.Control.NestedLayers.js.map
