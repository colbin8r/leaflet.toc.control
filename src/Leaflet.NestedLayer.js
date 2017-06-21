/* global L, window */
export class NestedLayer {

  // options include:
  // 'id' number (req'd), 'name' string (req'd), 'layer' object (req'd), 'map' object (req'd)
  // 'enabled' boolean (optional), 'selected' boolean (optional),
  // 'children' array (optional)
  constructor(options) {
    // set default props for optional options
    this._props = { children: [], enabled: true, selected: false }
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

  get id() {
    return this._props.id;
  }

  get name() {
    return this._props.name;
  }

  get layer() {
    return this._props.layer;
  }

  get map() {
    return this._props.map;
  }

  get children() {
    return this._props.children;
  }

  // enabled = user may freely toggle this layer on and off
  // disabled = user may not toggle the layer
  // disabling always deselects the layer, but the selected state is persisted, so that if
  // the layer is re-enabled, the selected state is what it was prior to disabling
  // i.e. if disabled, always deselected
  // this logic is handled in the .selected getter
  get enabled() {
    return this._props.enabled;
  }
  set enabled(val) {
    this._props.enabled = val;
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
    if (this.selected) {
      this._attach();
    } else {
      this._detach();
    }
  }

  // convenience methods to change state
  enable() {
    this.enabled = true;
  }
  disable() {
    this.enabled = false;
  }
  toggleEnabled() {
    this.enabled = !this.enabled;
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

  // convenience properties that reflect state
  get disabled() {
    return !this.enabled;
  }
  get deselected() {
    return !this.selected;
  }

  // add a child NestedLayer object
  addChild(child) {
    if (!(child instanceof NestedLayer)) {
      throw new TypeError('child is not a NestedLayer');
    }
    this._props.children.push(child);
  }

  // display on map
  _attach() {
    if (!this._isAttached) {
      this.layer.addTo(this.map);
      this._isAttached = true;
    }
  }

  // remove from map
  _detach() {
    if (this._isAttached) {
      this.layer.removeFrom(this.map);
      this._isAttached = false;
    }
  }
}

if (typeof window != 'undefined') {
  L.nestedLayer = function nestedLayer(options) {
    return new NestedLayer(options);
  };
}
