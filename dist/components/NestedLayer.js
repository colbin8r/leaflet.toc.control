'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _LeafletTOC = require('../Leaflet.TOC.MapEventManager');

var _LeafletTOC2 = _interopRequireDefault(_LeafletTOC);

var _LeafletTOC3 = require('../Leaflet.TOC.NestedLayer');

var _LeafletTOC4 = _interopRequireDefault(_LeafletTOC3);

var _MapSymbology = require('./MapSymbology');

var _MapSymbology2 = _interopRequireDefault(_MapSymbology);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NestedLayer = function (_React$Component) {
  _inherits(NestedLayer, _React$Component);

  function NestedLayer(props) {
    _classCallCheck(this, NestedLayer);

    var _this = _possibleConstructorReturn(this, (NestedLayer.__proto__ || Object.getPrototypeOf(NestedLayer)).call(this, props));

    _this._mapEventHandler = function (e) {
      console.log('<NestedLayer /> map event handler', e);
      _this.props.visibilityChange();
    };

    _this.toggleSelected = function () {
      _this.props.toggleSelected(_this.props.layer);
    };

    _this.visibilityChange = function () {
      _this.props.visibilityChange();
    };

    _this.toggleCollapsed = function () {
      _this.setState({
        collapsed: !_this.state.collapsed
      });
      console.log('<NestedLayer /> toggle collapse:', _this.state);
    };

    _this.friendlyLayerType = function () {
      return _this.props.layer.constructor.name.replace('Nested', '');
    };

    _this.eventManager = _this.props.eventManager;
    console.log('NestedLayer received event manager', _this.eventManager);
    var map = _this.props.layer.map;
    var layer = _this.props.layer.layer;
    console.log('NestedLayer asking event manager to bind layer', layer);
    _this.eventManager.bindLayerToMapChanges(map, layer, _this._mapEventHandler);

    _this.state = {
      collapsed: true

      // this.state = {
      //   _mapEventListeners: {
      //     'zoomend': this._handleMapZoomChange,
      //     'layeradd': this._handleMapLayerChange,
      //     'layerremove': this._handleMapLayerChange
      //   }
      // };
    };return _this;
  }

  // // add event listener(s) to map
  // bindToMapEvents() {
  //   console.log('binding to map events');

  //   this.props.layer.map.on(this.state._mapEventListeners);
  // }

  // // remove event listener(s) from map
  // unbindFromMapEvents() {
  //   console.log('unbinding from map events');
  //   this.props.layer.map.off(this.state._mapEventListeners);
  // }

  // // listens to zoomend
  // // http://leafletjs.com/reference-1.2.0.html#map-zoomend
  // _handleMapZoomChange = (e) => {
  //   console.log('zoom level changed to', e.target.getZoom());
  //   this.props.visibilityChange();
  // }

  // // listens to layeradd and layerremove
  // // http://leafletjs.com/reference-1.2.0.html#map-layeradd
  // // http://leafletjs.com/reference-1.2.0.html#map-layeradd
  // _handleMapLayerChange = (e) => {
  //   console.log('_handleMapLayerChange handles this layer?', e.layer._leaflet_id == this.props.layer.layer._leaflet_id);
  //   // if the change was to this layer (i.e. they share IDs)
  //   // this check helps throttle down React render() calls
  //   if (e.layer._leaflet_id == this.props.layer.layer._leaflet_id) {
  //     console.log('_handleMapLayerChange MATCH', e.layer, this.props.layer.layer);
  //     this.props.visibilityChange();
  //   }
  // }

  // componentDidMount() {
  //   this.bindToMapEvents();
  // }

  // componentWillUnmount() {
  //   this.unbindFromMapEvents();
  // }

  _createClass(NestedLayer, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var disabled = this.props.layer.disabled ? 'disabled' : '';
      var classes = (0, _classnames2.default)({
        leaf: true,
        enabled: this.props.layer.enabled,
        disabled: this.props.layer.disabled,
        selected: this.props.layer.selected,
        deselected: this.props.layer.deselected,
        visible: this.props.layer.visible,
        invisible: !this.props.layer.visible,
        collapsed: this.state.collapsed,
        expanded: !this.state.collapsed,
        'has-children': this.props.layer.hasChildren,
        'has-no-children': !this.props.layer.hasChildren
      });

      var children = void 0;

      if (this.props.layer.hasChildren) {
        // each child layer turns into a NestedLayer
        children = this.props.layer.children.map(function (layer) {
          return _react2.default.createElement(NestedLayer, { layer: layer,
            toggleSelected: _this2.props.toggleSelected,
            visibilityChange: _this2.props.visibilityChange,
            eventManager: _this2.eventManager,
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
        _react2.default.createElement(
          'div',
          { className: 'layer-collapse-toggle', onClick: this.toggleCollapsed },
          _react2.default.createElement(
            'i',
            { className: 'layer-collapse-icon-collapse' },
            '\u2192'
          ),
          _react2.default.createElement(
            'i',
            { className: 'layer-collapse-icon-expand' },
            '\u2193'
          )
        ),
        _react2.default.createElement('input', { type: 'checkbox', checked: this.props.layer.selected, disabled: disabled, onChange: this.toggleSelected }),
        _react2.default.createElement(
          'span',
          { className: 'layer-name' },
          this.props.layer.name
        ),
        _react2.default.createElement(
          'span',
          { className: 'layer-type' },
          this.friendlyLayerType()
        ),
        _react2.default.createElement(_MapSymbology2.default, { symbology: this.props.layer.symbology }),
        _react2.default.createElement(
          'span',
          { className: 'layer-collapse-content' },
          children
        )
      );
    }
  }]);

  return NestedLayer;
}(_react2.default.Component);

NestedLayer.propTypes = {
  layer: _propTypes2.default.instanceOf(_LeafletTOC4.default).isRequired,
  toggleSelected: _propTypes2.default.func.isRequired,
  visibilityChange: _propTypes2.default.func.isRequired,
  eventManager: _propTypes2.default.instanceOf(_LeafletTOC2.default).isRequired
};
exports.default = NestedLayer;
//# sourceMappingURL=NestedLayer.js.map
