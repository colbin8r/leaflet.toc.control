'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.generateID = generateID;

var _lodash = require('lodash');

var _LeafletTOC = require('./Leaflet.TOC.NestedLayerTreeHelper');

var NestedLayerTreeHelper = _interopRequireWildcard(_LeafletTOC);

var _LeafletTOC2 = require('./Leaflet.TOC.MapSymbology');

var _LeafletTOC3 = _interopRequireDefault(_LeafletTOC2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var lastID = 0;

/**
 * Generate a ID number guaranteed to be unique.
 * IDs are composed of a pseudorandom 4-digit number suffixed by an incrementing counter.
 * @return {Number} Unique ID number
 */
function generateID() {
  // generates a 4 digit random number
  // lastID is appended to the end of the number
  // lastID is incremented each
  return Number.parseInt(Math.floor(1000 + Math.random() * 9000).toString() + (lastID++).toString());
}

/**
 * Wraps a Leaflet Layer to allow that layer to be the "parent" of other layers by having
 * "child" layers
 * @see http://leafletjs.com/reference-1.1.0.html#layer
 */

var NestedLayer = function () {
  _createClass(NestedLayer, [{
    key: 'defaults',
    get: function get() {
      // uses reflection to return the static _defaults property on the class
      return this.constructor._defaults;
    }

    /**
     *
     * @param {object} props The layer data
     * @param {number} props.id The layer's unique ID number
     * @param {string} props.name The layer's unique name
     * @param {L.Layer} props.layer A {@link
     * http://leafletjs.com/reference-1.1.0.html#layer Leaflet layer}
     * @param {L.Map} props.map {@link
     * http://leafletjs.com/reference-1.1.0.html#map Leaflet map} to attach to
     * @param {boolean} [props.enabled=true] Initial enabled state of the layer
     * @param {boolean} [props.selected=false] Initial selected state of the layer
     * @param {string} [props.swatch=''] Base64 encoded swatch PNG
     * @param {NestedLayer[]} [props.children=[]] Child layers
     * @param {number} [props.minZoom] Minimum zoom level that the layer should be visible
     * @param {number} [props.maxZoom] Maximum zoom level that the layer should be visible
     */

    /**
     * Creates a new NestedLayer.
     * @param  {number} layerID ID of the layer on the origin.
     * @param  {string} name    Name of the layer on the origin; display-friendly
     * @param  {L.Layer} layer   Leaflet layer
     * @param  {L.Map} map     Leaflet map
     * @param  {object} props   Optional properties
     */

  }]);

  function NestedLayer(layerID, name, layer, map, props) {
    _classCallCheck(this, NestedLayer);

    // ensure all required props are present
    if (typeof layerID == 'undefined') {
      throw new Error('Missing layer ID when creating NestedLayer');
    }
    if (typeof name == 'undefined') {
      throw new Error('Missing name when creating NestedLayer');
    }
    if (typeof layer == 'undefined') {
      throw new Error('Missing layer object when creating NestedLayer');
    }
    if (typeof map == 'undefined') {
      throw new Error('Missing map object when creating NestedLayer');
    }

    // set the required props
    this._props = {
      layerID: layerID,
      name: name,
      layer: layer,
      map: map
    };

    // this prop isn't set on defaults
    // if it is, then all instances that use the default will share the same instance
    // (NOT what you want)
    this._props.symbology = new _LeafletTOC3.default();

    // merge optional props with defaults
    // the "defaults" also contains the initial state
    (0, _lodash.defaultsDeep)(this._props, props, this.defaults);
    this._props.id = generateID();

    // if this layer is starting off selected, attach to the map
    // calling this.select() ensures that we follow any other attachment rules
    // built into the 'selected' setter
    if (this._props.selected) {
      this.select();
    }

    // if the zoom properties are on the leaflet layer object, copy them up to the
    // NestedLayer object
    // if (this.layer.minZoom !== undefined && this.layer.maxZoom !== undefined) {
    //   this._props.minZoom = this.layer.minZoom;
    //   this._props.maxZoom = this.layer.maxZoom;
    // }

    // if this layer has zoom data, we need to handle the case where the user zooms to a level where
    // our layer should be disabled according to the minZoom/maxZoom contained in the layer object
    // if (this.minZoom !== undefined && this.maxZoom !== undefined) {
    //   this.map.on('zoomend', this._handleMapZoom);
    // }
  }

  /**
   * Layer ID as specified by the server
   * @type {number}
   */


  _createClass(NestedLayer, [{
    key: 'enable',


    /** Enable the layer */
    value: function enable() {
      this.enabled = true;
    }
    /** Disable the layer */

  }, {
    key: 'disable',
    value: function disable() {
      this.enabled = false;
    }
    /** Toggle the layer's enabled state */

  }, {
    key: 'toggleEnabled',
    value: function toggleEnabled() {
      this.enabled = !this.enabled;
    }

    // selected = layer present on the map
    // deselected = layer not present on the map

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

    /**
     * Checks if the layer could be visible on the map
     * @type {boolean}
     */

  }, {
    key: 'addChild',


    // add a child NestedLayer object
    value: function addChild(child) {
      if (!(child instanceof NestedLayer)) {
        throw new TypeError('child is not a NestedLayer');
      }
      child.parent = this;
      this._props.children.push(child);
    }

    // returns true if the layer could be visible at the current zoom level at the map

  }, {
    key: '_withinZoomRange',
    value: function _withinZoomRange() {
      // if no range specifies, assume that it is always valid
      if (!this.minZoom || !this.maxZoom) {
        return true;
      }
      // check if the layer is visible at the current zoom level
      var currentZoomLevel = map.getZoom();
      var aboveMinZoom = currentZoomLevel >= this.minZoom;
      var belowMaxZoom = currentZoomLevel <= this.maxZoom;
      var withinZoomRange = aboveMinZoom && belowMaxZoom;
      // console.log('within zoom range?', withinZoomRange,
      // 'min:', this.minZoom, '<=', currentZoomLevel, aboveMinZoom,
      // 'max:', this.maxZoom, '>=', currentZoomLevel, belowMaxZoom);
      return currentZoomLevel >= this.minZoom && currentZoomLevel <= this.maxZoom;
    }

    // display on map

  }, {
    key: '_attach',
    value: function _attach() {
      if (!this.isAttached && !this.map.hasLayer(this.layer)) {
        this.map.addLayer(this.layer);
        // this.layer.addTo(this.map);
      }
    }

    // remove from map

  }, {
    key: '_detach',
    value: function _detach() {
      if (this.isAttached && this.map.hasLayer(this.layer)) {
        this.map.removeLayer(this.layer);
        // this.layer.removeFrom(this.map);
      }
    }
  }, {
    key: 'layerID',
    get: function get() {
      return this._props.layerID;
    }

    /**
     * Layer name
     * @type {string}
     */

  }, {
    key: 'name',
    get: function get() {
      return this._props.name;
    }

    /**
     * Underlying Leaflet layer
     * @type {L.Layer}
     */

  }, {
    key: 'layer',
    get: function get() {
      return this._props.layer;
    }

    /**
     * Leaflet Map to attach to
     * @type {L.Map}
     */

  }, {
    key: 'map',
    get: function get() {
      return this._props.map;
    }

    /**
     * Child layers
     * @type {NestedLayer[]}
     */

  }, {
    key: 'children',
    get: function get() {
      return this._props.children;
    }

    /**
     * Parent layer
     * @type {NestedLayer}
     */

  }, {
    key: 'parent',
    get: function get() {
      return this._props.parent;
    },
    set: function set(val) {
      this._props.parent = val;
    }

    /**
     * Map symbology
     * @type {MapSymbology}
     */

  }, {
    key: 'symbology',
    get: function get() {
      return this._props.symbology;
    }

    /**
     * Minimum zoom level for this layer to be visible
     * @type {number}
     */

  }, {
    key: 'minZoom',
    get: function get() {
      return this._props.minZoom;
    },
    set: function set(val) {
      this._props.minZoom = val;
    }

    /**
     * Maximum zoom level for this layer to be visible
     * @type {number}
     */

  }, {
    key: 'maxZoom',
    get: function get() {
      return this._props.maxZoom;
    },
    set: function set(val) {
      this._props.maxZoom = val;
    }
  }, {
    key: 'rules',
    get: function get() {
      return this._props.rules;
    }

    /**
     * Unique ID generated for each NestedLayer
     * @type {number}
     */

  }, {
    key: 'id',
    get: function get() {
      return this._props.id;
    }

    // enabled = user may freely toggle this layer on and off
    // disabled = user may not toggle the layer
    // disabling always deselects the layer, but the selected state is persisted, so that if
    // the layer is re-enabled, the selected state is what it was prior to disabling
    // i.e. if disabled, always deselected
    // this logic is handled in the .selected getter

    /**
     * Whether the user may freely toggle this layer on and off
     * @type {boolean}
     */

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
      } else if (this.rules.enableTriggersAttach && this._props.selected) {
        this._attach();
      }
    }
    /**
     * The inverse of #enabled
     * @type {boolean}
     */

  }, {
    key: 'disabled',
    get: function get() {
      return !this.enabled;
    }
  }, {
    key: 'selected',
    get: function get() {
      if (this.rules.alwaysDeselectedWhenDisabled && this.disabled) {
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
        // this.enableChildren();
      } else {
        this._detach();
        // this.disableChildren();
      }

      // if configured to, disable all descendents if deselected
      if (this.rules.disableDescendentsWhenDeselected) {
        NestedLayerTreeHelper.applyStateChangeToTree(this.children, { enabled: this.selected });
      }
    }
  }, {
    key: 'deselected',
    get: function get() {
      return !this.selected;
    }
  }, {
    key: 'visible',
    get: function get() {
      return this.selected && this._withinZoomRange();
    }

    /**
     * Checks if is bound to the Leaflet map
     * @type {boolean}
     */

  }, {
    key: 'isAttached',
    get: function get() {
      return this.map.hasLayer(this.layer);
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

NestedLayer._defaults = {
  parent: null,
  children: [],
  enabled: true,
  selected: false,
  minZoom: Number.NEGATIVE_INFINITY,
  maxZoom: Number.POSITIVE_INFINITY,
  rules: {
    enableTriggersAttach: true,
    alwaysDeselectedWhenDisabled: true,
    disableDescendentsWhenDeselected: true
  }
};
exports.default = NestedLayer;
//# sourceMappingURL=Leaflet.TOC.NestedLayer.js.map
