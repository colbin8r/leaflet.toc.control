import { defaultsDeep as defaults } from 'lodash';

/**
 * Wraps a Leaflet Layer to allow that layer to be the "parent" of other layers by having
 * "child" layers
 * @param {object} props The layer data
 * @see http://leafletjs.com/reference-1.1.0.html#layer
 */
export default class NestedLayer {

  static _defaults = {
    children: [],
    enabled: true,
    selected: false,
    zoom: {
      minZoom: Number.NEGATIVE_INFINITY,
      maxZoom: Number.POSITIVE_INFINITY
    }
    _isAttached: false
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
  constructor(id, name, layer, map, props) {

    // ensure all required props are present
    if (typeof id == 'undefined') {
      throw new Error('Missing ID when creating NestedLayer');
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
      id,
      name,
      layer,
      map
    };

    // merge optional props with defaults
    // the "defaults" also contains the initial state
    defaults(this._props, props, this.defaults);

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
      this.map.on('zoomend', this._handleMapZoom);
    }
  }

  /**
   * Layer ID
   * @type {number}
   */
  get id() {
    return this._props.id;
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
   * Base64 encoded swatch PNG
   * @type {string}
   */
  get swatch() {
    return this._props.swatch;
  }

  /**
   * Child layers
   * @type {NestedLayer[]}
   */
  get children() {
    return this._props.children;
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
    } else if (this._props.selected) {
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
    if (this.disabled) {
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
      this.enableChildren();
    } else {
      this._detach();
      this.disableChildren();
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

  // this is used to track what programmatic object owns this NestedLayer
  get owner() {
    return this._owner;
  }
  set owner(val) {
    this._owner = val;
  }
  // checks ownership
  isOwnedBy(owner) {
    return this.owner === owner;
  }

  // options come from the layers owner
  // will return null if there is no owner
  get options() {
    if (typeof this.owner === 'undefined') {
      return null;
    } else {
      return this.owner.options;
    }
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

  enableChildren() {
    this._applyStateChangeToAllChildren('enabled', true, this.children);
  }

  disableChildren() {
    this._applyStateChangeToAllChildren('enabled', false, this.children);
  }

  ownChildren() {
    this._applyStateChangeToAllChildren('owner', this.owner, this.children);
  }

  _applyStateChangeToAllChildren(prop, val, children) {
    // utility to recursively loop through children (and their children, etc.)
    // to change their state
    // IDEA: convert to a "deep map" function
    for (let i = 0; i < children.length; i++) {
      // make the state change
      children[i][prop] = val;

      // loop through children/subtrees when necessary
      if (children[i].hasChildren) {
        this._applyStateChangeToAllChildren(prop, val, children[i].children);
      }
    }
  }

  _handleMapZoom = () => {
    const zoom = this.map.getZoom();

    if (zoom < this.minZoom || zoom > this.maxZoom) {
      this._detach();
    } else {
      this._attach()
    }
  }

  // display on map
  _attach() {
    if (!this._isAttached) {
      this.map.addLayer(this.layer);
      // this.layer.addTo(this.map);
      this._isAttached = true;
    }
  }

  // remove from map
  _detach() {
    if (this._isAttached) {
      this.map.removeLayer(this.layer);
      // this.layer.removeFrom(this.map);
      this._isAttached = false;
    }
  }
}


