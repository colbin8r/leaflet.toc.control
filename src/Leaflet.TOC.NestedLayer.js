import { defaultsDeep as defaults } from 'lodash';

import * as NestedLayerTreeHelper from './Leaflet.TOC.NestedLayerTreeHelper';
import MapSymbology from './Leaflet.TOC.MapSymbology';

let lastID = 0;

/**
 * Generate a ID number guaranteed to be unique.
 * IDs are composed of a pseudorandom 4-digit number suffixed by an incrementing counter.
 * @return {Number} Unique ID number
 */
export function generateID() {
  // generates a 4 digit random number
  // lastID is appended to the end of the number
  // lastID is incremented each
  return Number.parseInt(Math.floor(1000 + Math.random() * 9000).toString()
                         + (lastID++).toString());
}

/**
 * Wraps a Leaflet Layer to allow that layer to be the "parent" of other layers by having
 * "child" layers
 * @see http://leafletjs.com/reference-1.1.0.html#layer
 */
export default class NestedLayer {

  static _defaults = {
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
  }

  get defaults() {
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
  constructor(layerID, name, layer, map, props) {

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
      layerID,
      name,
      layer,
      map
    };

    // this prop isn't set on defaults
    // if it is, then all instances that use the default will share the same instance
    // (NOT what you want)
    this._props.symbology = new MapSymbology()

    // merge optional props with defaults
    // the "defaults" also contains the initial state
    defaults(this._props, props, this.defaults);
    this._props.id = generateID();
    this._isAttached = false;

    // if this layer is starting off selected, attach to the map
    // calling this.select() ensures that we follow any other attachment rules
    // built into the 'selected' setter
    if (this.selected) {
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
  get layerID() {
    return this._props.layerID;
  }

  /**
   * Layer name
   * @type {string}
   */
  get name() {
    return this._props.name;
  }

  /**
   * Underlying Leaflet layer
   * @type {L.Layer}
   */
  get layer() {
    return this._props.layer;
  }

  /**
   * Leaflet Map to attach to
   * @type {L.Map}
   */
  get map() {
    return this._props.map;
  }

  /**
   * Child layers
   * @type {NestedLayer[]}
   */
  get children() {
    return this._props.children;
  }

  /**
   * Parent layer
   * @type {NestedLayer}
   */
  get parent() {
    return this._props.parent;
  }

  /**
   * Map symbology
   * @type {MapSymbology}
   */
  get symbology() {
    return this._props.symbology;
  }

  /**
   * Minimum zoom level for this layer to be visible
   * @type {number}
   */
  get minZoom() {
    return this._props.minZoom;
  }

  /**
   * Maximum zoom level for this layer to be visible
   * @type {number}
   */
  get maxZoom() {
    return this._props.maxZoom;
  }

  get rules() {
    return this._props.rules;
  }

  /**
   * Unique ID generated for each NestedLayer
   * @type {number}
   */
  get id() {
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
  get enabled() {
    return this._props.enabled;
  }
  set enabled(val) {
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
  get disabled() {
    return !this.enabled;
  }

  /** Enable the layer */
  enable() {
    this.enabled = true;
  }
  /** Disable the layer */
  disable() {
    this.enabled = false;
  }
  /** Toggle the layer's enabled state */
  toggleEnabled() {
    this.enabled = !this.enabled;
  }

  // selected = layer present on the map
  // deselected = layer not present on the map
  get selected() {
    if (this.rules.alwaysDeselectedWhenDisabled && this.disabled) {
      return false;
    } else {
      return this._props.selected;
    }
  }
  set selected(val) {
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
  get deselected() {
    return !this.selected;
  }
  select() {
    this.selected = true;
  }
  deselect() {
    this.selected = false;
  }
  toggleSelected() {
    this.selected = !this.selected;
  }

  // true if the layer has children
  get hasChildren() {
    return this.children.length > 0;
  }

  // add a child NestedLayer object
  addChild(child) {
    if (!(child instanceof NestedLayer)) {
      throw new TypeError('child is not a NestedLayer');
    }
    this._props.children.push(child);
  }

  // _handleMapZoom = () => {
  //   const zoom = this.map.getZoom();

  //   if (zoom < this.minZoom || zoom > this.maxZoom) {
  //     this._detach();
  //   } else {
  //     this._attach()
  //   }
  // }

  // display on map
  _attach() {
    if (!this._isAttached && !this.map.hasLayer(this.layer)) {
      this.map.addLayer(this.layer);
      // this.layer.addTo(this.map);
    }
    this._isAttached = true;
  }

  // remove from map
  _detach() {
    if (this._isAttached && this.map.hasLayer(this.layer)) {
      this.map.removeLayer(this.layer);
      // this.layer.removeFrom(this.map);
    }
    this._isAttached = false;
  }
}


