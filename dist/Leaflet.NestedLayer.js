'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _leafletHeadless = require('leaflet-headless');

var _leafletHeadless2 = _interopRequireDefault(_leafletHeadless);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NestedLayer = function () {

  // options include:
  // 'id' number (req'd), 'name' string (req'd), 'layer' object (req'd), 'map' object (req'd)
  // 'enabled' boolean (optional), 'selected' boolean (optional), 'swatch' base64 string (optional)
  // 'children' array (optional), 'minZoom' zoom level (optional), 'maxZoom' zoom level (optional)
  function NestedLayer(options) {
    var _this = this;

    _classCallCheck(this, NestedLayer);

    this._handleMapZoom = function () {
      console.log('Zoom ended listener');
      var zoom = _this.map.getZoom();
      console.log(zoom);

      if (zoom < _this.minZoom || zoom > _this.maxZoom) {
        console.log('Outside zoom level, detaching...');
        _this._detach();
      } else {
        console.log('Within zoom level, attaching...');
        _this._attach();
      }
    };

    // set default props for optional options
    this._props = { children: [], enabled: true, selected: false, swatch: '' };
    this._isAttached = false;

    // verify that all required arguments are present
    if (typeof options.id == 'undefined') {
      throw new Error('Missing ID when creating NestedLayer');
    }
    if (typeof options.name == 'undefined') {
      throw new Error('Missing name when creating NestedLayer');
    }
    if (typeof options.layer == 'undefined') {
      throw new Error('Missing layer object when creating NestedLayer');
    }
    if (typeof options.map == 'undefined') {
      throw new Error('Missing map object when creating NestedLayer');
    }

    Object.assign(this._props, options);

    // if this layer is starting off selected, attach to the map
    // calling this.select() ensures that we follow any other attachment rules
    // built into the 'selected' setter
    if (this.selected) {
      this.select();
    }

    // if the zoom properties are on the leaflet layer object, copy them up to the
    // NestedLayer object
    if (this.layer.minZoom !== undefined && this.layer.maxZoom !== undefined) {
      this._props.minZoom = this.layer.minZoom;
      this._props.maxZoom = this.layer.maxZoom;
    }

    // if this layer has zoom data, we need to handle the case where the user zooms to a level where
    // our layer should be disabled according to the minZoom/maxZoom contained in the layer object
    if (this.minZoom !== undefined && this.maxZoom !== undefined) {
      console.info('zoom info detected, attaching listener...');
      this.map.on('zoomend', this._handleMapZoom);
    }
  }

  _createClass(NestedLayer, [{
    key: 'enable',


    // convenience methods to change state
    value: function enable() {
      this.enabled = true;
    }
  }, {
    key: 'disable',
    value: function disable() {
      this.enabled = false;
    }
  }, {
    key: 'toggleEnabled',
    value: function toggleEnabled() {
      this.enabled = !this.enabled;
    }
  }, {
    key: 'select',
    value: function select() {
      this.selected = true;
    }
  }, {
    key: 'deselect',
    value: function deselect() {
      this.selected = false;
    }
  }, {
    key: 'toggleSelected',
    value: function toggleSelected() {
      this.selected = !this.selected;
    }

    // convenience properties that reflect state

  }, {
    key: 'addChild',


    // add a child NestedLayer object
    value: function addChild(child) {
      if (!(child instanceof NestedLayer)) {
        throw new TypeError('child is not a NestedLayer');
      }
      this._props.children.push(child);
    }
  }, {
    key: 'enableChildren',
    value: function enableChildren() {
      this._setChildrenEnabledState(true, this.children);
    }
  }, {
    key: 'disableChildren',
    value: function disableChildren() {
      this._setChildrenEnabledState(false, this.children);
    }
  }, {
    key: '_setChildrenEnabledState',
    value: function _setChildrenEnabledState(state, children) {
      // recursively loops through children (and their children, etc.) to
      // either enable or disable
      for (var i = 0; i < children.length; i++) {
        children[i].enabled = state;
        if (children[i].hasChildren) {
          this._setChildrenEnabledState(state, children[i].children);
        }
      }
    }
  }, {
    key: '_attach',


    // display on map
    value: function _attach() {
      if (!this._isAttached) {
        this.layer.addTo(this.map);
        this._isAttached = true;
      }
    }

    // remove from map

  }, {
    key: '_detach',
    value: function _detach() {
      if (this._isAttached) {
        this.layer.removeFrom(this.map);
        this._isAttached = false;
      }
    }
  }, {
    key: 'id',
    get: function get() {
      return this._props.id;
    }
  }, {
    key: 'name',
    get: function get() {
      return this._props.name;
    }
  }, {
    key: 'layer',
    get: function get() {
      return this._props.layer;
    }
  }, {
    key: 'map',
    get: function get() {
      return this._props.map;
    }
  }, {
    key: 'swatch',
    get: function get() {
      return this._props.swatch;
    }
  }, {
    key: 'children',
    get: function get() {
      return this._props.children;
    }
  }, {
    key: 'minZoom',
    get: function get() {
      return this._props.minZoom;
    }
  }, {
    key: 'maxZoom',
    get: function get() {
      return this._props.maxZoom;
    }

    // enabled = user may freely toggle this layer on and off
    // disabled = user may not toggle the layer
    // disabling always deselects the layer, but the selected state is persisted, so that if
    // the layer is re-enabled, the selected state is what it was prior to disabling
    // i.e. if disabled, always deselected
    // this logic is handled in the .selected getter

  }, {
    key: 'enabled',
    get: function get() {
      return this._props.enabled;
    },
    set: function set(val) {
      this._props.enabled = val;

      // if disabling, detach from map
      if (!val) {
        this._detach();

        // if enabling, and marked selected (i.e. "re-enabling"), attach to map
      } else if (this._props.selected) {
        this._attach();
      }
    }

    // selected = layer present on the map
    // deselected = layer not present on the map

  }, {
    key: 'selected',
    get: function get() {
      if (this.disabled) {
        return false;
      } else {
        return this._props.selected;
      }
    },
    set: function set(val) {
      this._props.selected = val;

      // attach/detach from map when needed
      // disable children from selection when unselected
      if (this.selected) {
        this._attach();
        this.enableChildren();
      } else {
        this._detach();
        this.disableChildren();
      }
    }
  }, {
    key: 'disabled',
    get: function get() {
      return !this.enabled;
    }
  }, {
    key: 'deselected',
    get: function get() {
      return !this.selected;
    }

    // true if the layer has children

  }, {
    key: 'hasChildren',
    get: function get() {
      return this.children.length > 0;
    }
  }]);

  return NestedLayer;
}();

exports.default = NestedLayer;
//# sourceMappingURL=Leaflet.NestedLayer.js.map
