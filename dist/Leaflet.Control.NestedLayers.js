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

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // import chalk from 'chalk';

/**
 * React component to represent a LayerHierarchy
 * @param {object} props The component's props.
 * @param {LayerHierarchy} props.hierarchy The LayerHierarchy the component displays.
 */
var NestedLayersComponent = exports.NestedLayersComponent = function (_React$Component) {
  _inherits(NestedLayersComponent, _React$Component);

  /**
   * @param {object} props The component's props.
   * @param {LayerHierarchy} props.hierarchy The LayerHierarchy the component displays.
   */
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
    };

    _this.state = {
      hierarchy: _this.props.hierarchy
    };
    return _this;
  }

  /**
   * Describes the React props object
   * @type {Object}
   */


  _createClass(NestedLayersComponent, [{
    key: 'makeLayerKey',


    /**
     * Generates a unique key for rendering a layer in JSX
     * @param  {NestedLayer} layer The layer to use data from
     * @return {string}       A string unique to this layer
     */
    value: function makeLayerKey(layer) {
      return layer.id.toString + layer.name;
    }

    /**
     * Event handler to toggle a layer's selected state
     * @param  {NestedLayer} layer The layer to toggle
     */


    /**
     * Recursively renders a NestedLayer using NestedLayerComponent. If the NestedLayer has
     * children, use this function as it not only renders a single NestedLayer, but also the subtree
     * of layers under the NestedLayer recursively.
     * @param  {NestedLayer} layer The layer to represent with a React component
     * @return {NestedLayerComponent}       A react component representing the given NestedLayer.
     */

  }, {
    key: 'render',


    /**
     * Renders the component
     * @return {Component} JSX
     */
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

/**
 * React Component to represent a single NestedLayer
 * @param {object} props Component properties
 * @param {NestedLayer} props.layer The layer to represent
 * @param {function} props.onToggleSelected The callback to change the layer's selected state
 */


NestedLayersComponent.propTypes = {
  hierarchy: _propTypes2.default.instanceOf(_Leaflet2.default).isRequired
};

var NestedLayerComponent = exports.NestedLayerComponent = function (_React$Component2) {
  _inherits(NestedLayerComponent, _React$Component2);

  /**
   * @param {object} props Component properties
   * @param {NestedLayer} props.layer The layer to represent
   * @param {function} props.onToggleSelected The callback to change the layer's selected state
   */
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

  /**
   * Describes the React props object
   * @type {Object}
   */


  /**
   * Calls the toggle selected state handler passed by the parent to change the selected state of
   * the layer
   */


  /**
   * Returns a data URL suitable for use in a the src of an <img /> that contains the base 64
   * encoded layer swatch
   * @return {string} data URL containing the swatch
   */


  _createClass(NestedLayerComponent, [{
    key: 'render',


    /**
     * Renders the component
     * @return {Component} JSX
     */
    value: function render() {
      var itemClassNames = (0, _classnames2.default)({
        leaf: true,
        enabled: this.props.layer.enabled,
        disabled: this.props.layer.disabled
      });
      return _react2.default.createElement(
        'li',
        { className: itemClassNames },
        _react2.default.createElement('input', { type: 'checkbox', checked: this.props.layer.selected, onChange: this.toggleSelected }),
        this.props.layer.swatch.length > 0 && _react2.default.createElement('img', { src: this.getSwatch(), className: 'swatch' }),
        _react2.default.createElement(
          'span',
          { className: 'layer-name' },
          this.props.layer.name
        ),
        this.props.children
      );
    }
  }]);

  return NestedLayerComponent;
}(_react2.default.Component);

/**
 * Leaflet plugin to display a hierarchial version of {@link http://leafletjs.com/reference-1.1.0.html#control-layers L.Control.Layers}. Uses React to wrap the
 * NestedLayersComponent.
 * @param  {LayerHierarchy} hierarchy The hierarchy to display in the control
 * @param  {Element} element   The DOM element to bind the control to
 * @param  {object} options   Configuration options that dictate how the control should behave
 */


NestedLayerComponent.propTypes = {
  layer: _propTypes2.default.instanceOf(_Leaflet4.default).isRequired,
  onToggleSelected: _propTypes2.default.func.isRequired,
  children: _propTypes2.default.any
};

var NestedLayers = function () {

  /**
   * Initialize the plugin and {@link #NestedLayers#attach attaches} to the DOM.
   * @param  {LayerHierarchy} hierarchy The hierarchy to display in the control
   * @param  {Element} element   The DOM element to bind the control to
   * @param  {object} options   Configuration options that dictate how the control should behave
   * @param  {boolean} [options.followAncestorVisibility=true] Deselecting any ancestor makes its
   * children invisible (without changing their selected state)
   * @param {boolean} [options.propogateDeselectToChildren=false] Deselecting a parent also deselects
   * children (by changing their state)
   * @param {boolean} [options.followAncestorMutability=true] Deselecting any ancestor disables its
   * children (cannot change children's selected state)
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
      followAncestorVisibility: true,
      propogateDeselectToChildren: false,
      followAncestorMutability: true
    };

    // overwrite defaults with passed options
    Object.assign(this._options, options);

    this._component = _react2.default.createElement(NestedLayersComponent, { hierarchy: this.hierarchy });

    this._isAttached = false;

    // bind to the DOM
    this.attach();
  }

  /**
   * The underlying hierarchy of layers the plugin visually represents
   * @type {LayerHierarchy}
   */


  _createClass(NestedLayers, [{
    key: 'attach',


    /**
     * Bind to the DOM. Internally, it checks to see if it has already been attached, and if not,
     * uses React to render the {@link #NestedLayers#component component} to the specified {@link
     * #NestedLayers#element element}.
     */
    value: function attach() {
      if (!this.isAttached) {
        _reactDom2.default.render(this.component, this.element);
      }
      this._isAttached = true;
    }

    /**
     * Unbind from the DOM. Releases the {@link #NestedLayers#element element} for reuse.
     */

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
    /**
     * Shorthand accessor for the {@link #NestedLayers#hierarchy hierarchy} property
     */
    ,
    set: function set(val) {
      this._hierarchy = val;
    }

    /**
     * The DOM element that the control attaches to
     * @type {Element}
     */

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
    /**
     * Shorthand accessor for the {@link #NestedLayers#element element} property
     */
    ,
    set: function set(val) {
      this._element = val;
    }

    /**
     * The React component under the hood
     * @type {NestedLayersComponent}
     */

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

    /**
     * True if the plugin has attached itself to the DOM element
     * @type {boolean}
     */

  }, {
    key: 'isAttached',
    get: function get() {
      return this._isAttached;
    }
    // no direct setting of 'isAttached' from outside the class
    // the attach() and detach() methods handle this state

    /**
     * Configuration options
     * @type {object}
     */

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
