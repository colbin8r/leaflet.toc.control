'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NestedLayerComponent = exports.NestedLayersComponent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // import colors from 'colors';

var NestedLayersComponent = exports.NestedLayersComponent = function (_React$Component) {
  _inherits(NestedLayersComponent, _React$Component);

  function NestedLayersComponent(props) {
    _classCallCheck(this, NestedLayersComponent);

    var _this = _possibleConstructorReturn(this, (NestedLayersComponent.__proto__ || Object.getPrototypeOf(NestedLayersComponent)).call(this, props));

    _this.handleToggleSelected = function (layer) {
      var id = layer.id;
      var newHierarchy = _this.state.hierarchy;
      newHierarchy.getLayerByID(id).toggleSelected();
      _this.setState({
        hierarchy: newHierarchy
      });
    };

    _this.makeComponentFromLayer = function (layer) {
      // recursive function
      // 'leaf' is the base case
      // property initializer syntax + arrow function keeps the scope of 'this' through recursive calls
      var componentChildren = void 0;

      // branch: this layer has children
      if (layer.children.length > 0) {
        // leaves = layer.children.map(this.makeComponentFromLayer)
        componentChildren = _react2.default.createElement(
          'ul',
          { className: 'branch' },
          layer.children.map(_this.makeComponentFromLayer)
        );
      }

      return _react2.default.createElement(
        NestedLayerComponent,
        { layer: layer, onToggleSelected: _this.handleToggleSelected, key: _this.makeLayerKey(layer) },
        componentChildren
      );

      // // branch: this layer has children
      // if (layer.children.length > 0) {
      //   // recursively calls this function on each child (leaf)
      //   // 'leaves' will be an array of JSX components (NestedLayerComponent) for each child (leaf)
      //   const leaves = layer.children.map(this.makeComponentFromLayer);

      //   return (
      //     <NestedLayerComponent layer={layer} onToggleSelected={this.handleToggleSelected} key={this.makeLayerKey(layer)}>
      //       <ul className="branch">
      //         {leaves}
      //       </ul>
      //     </NestedLayerComponent>
      //   );
      // } else {
      // // leaf: this layer is just a leaf

      //   return (
      //     <NestedLayerComponent layer={layer} onToggleSelected={this.handleToggleSelected} key={this.makeLayerKey(layer)} />
      //   )
      // }
    };

    _this.state = {
      hierarchy: _this.props.hierarchy
    };
    return _this;
  }

  _createClass(NestedLayersComponent, [{
    key: 'makeLayerKey',
    value: function makeLayerKey(layer) {
      return layer.id.toString + layer.name;
    }
  }, {
    key: 'render',
    value: function render() {
      var roots = this.state.hierarchy.rootLayers;
      var components = [];

      for (var i = 0; i < roots.length; i++) {
        components.push(this.makeComponentFromLayer(roots[i]));
      }

      return _react2.default.createElement(
        'div',
        { className: 'nested-layer-control-container' },
        _react2.default.createElement(
          'h2',
          null,
          'TOC CONTROL'
        ),
        _react2.default.createElement(
          'ul',
          { className: 'branch nested-layer-control' },
          components
        )
      );
    }
  }]);

  return NestedLayersComponent;
}(_react2.default.Component);

NestedLayersComponent.propTypes = {
  hierarchy: _propTypes2.default.instanceOf(_Leaflet2.default).isRequired
};

var NestedLayerComponent = exports.NestedLayerComponent = function (_React$Component2) {
  _inherits(NestedLayerComponent, _React$Component2);

  function NestedLayerComponent(props) {
    _classCallCheck(this, NestedLayerComponent);

    var _this2 = _possibleConstructorReturn(this, (NestedLayerComponent.__proto__ || Object.getPrototypeOf(NestedLayerComponent)).call(this, props));

    _this2.toggleSelected = function () {
      // updates both the component state and the LayerHierarchy structure
      _this2.props.onToggleSelected(_this2.props.layer);
    };

    _this2.getSwatch = function () {
      return 'data:image/png;base64,' + _this2.props.layer.swatch;
    };

    _this2.state = {};
    return _this2;
  }

  _createClass(NestedLayerComponent, [{
    key: 'render',
    value: function render() {
      var itemClassNames = (0, _classnames2.default)({
        leaf: true,
        enabled: this.props.layer.enabled,
        disabled: this.props.layer.disabled
      });
      return _react2.default.createElement(
        'li',
        { className: itemClassNames },
        _react2.default.createElement('input', { type: 'checkbox', checked: this.props.layer.selected }),
        this.props.layer.swatch.length > 0 && _react2.default.createElement('img', { src: this.getSwatch(), className: 'swatch' }),
        _react2.default.createElement(
          'span',
          { className: 'layer-name', onClick: this.toggleSelected },
          this.props.layer.name
        ),
        this.props.children
      );
    }
  }]);

  return NestedLayerComponent;
}(_react2.default.Component);

NestedLayerComponent.propTypes = {
  layer: _propTypes2.default.instanceOf(_Leaflet4.default).isRequired,
  onToggleSelected: _propTypes2.default.func.isRequired,
  children: _propTypes2.default.any
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
      throw new Error('Missing DOM element when creating NestedLayers control');
    }
    this.element = element;

    // default options
    this._options = {
      // deselecting any ancestor makes its children invisible (without changing their selected state)
      followAncestorVisibility: true,

      // deselecting a parent also deselects children (by changing their state)
      propogateDeselectToChildren: false,

      // deselecting any ancestor disables its children (cannot change children's selected state)
      followAncestorMutability: true
    };

    // overwrite defaults with passed options
    Object.assign(this._options, options);

    this._component = _react2.default.createElement(NestedLayersComponent, { hierarchy: this.hierarchy });

    this._isAttached = false;

    // bind to the DOM
    this.attach();
  }

  _createClass(NestedLayers, [{
    key: 'attach',


    // bind to DOM
    value: function attach() {
      if (!this.isAttached) {
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
  }, {
    key: 'isAttached',
    get: function get() {
      return this._isAttached;
    }
    // no direct setting of 'isAttached' from outside the class
    // the attach() and detach() methods handle this state

  }, {
    key: 'options',
    get: function get() {
      return this._options;
    }
  }]);

  return NestedLayers;
}();

exports.default = NestedLayers;
//# sourceMappingURL=Leaflet.Control.NestedLayers.js.map
