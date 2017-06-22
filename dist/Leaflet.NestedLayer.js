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
  // 'children' array (optional)
  function NestedLayer(options) {
    _classCallCheck(this, NestedLayer);

    // set default props for optional options
    this._props = { children: [], enabled: true, selected: false, swatch: '' };
    this._isAttached = false;

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
      debugger;
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

    // display on map

  }, {
    key: '_attach',
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
      if (this.selected) {
        this._attach();
      } else {
        this._detach();
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
  }]);

  return NestedLayer;
}();

exports.default = NestedLayer;
//# sourceMappingURL=Leaflet.NestedLayer.js.map
