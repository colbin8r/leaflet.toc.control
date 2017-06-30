export default class NestedLayer {

  // options include:
  // 'id' number (req'd), 'name' string (req'd), 'layer' object (req'd), 'map' object (req'd)
  // 'enabled' boolean (optional), 'selected' boolean (optional), 'swatch' base64 string (optional)
  // 'children' array (optional), 'minZoom' zoom level (optional), 'maxZoom' zoom level (optional)
  constructor(options) {
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
      this.map.on('zoomend', this._handleMapZoom);
    }
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

  get swatch() {
    return this._props.swatch;
  }

  get children() {
    return this._props.children;
  }

  get minZoom() {
    return this._props.minZoom;
  }

  get maxZoom() {
    return this._props.maxZoom;
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

    // if disabling, detach from map
    if (!val) {
      this._detach();

    // if enabling, and marked selected (i.e. "re-enabling"), attach to map
    } else if (this._props.selected) {
      this._attach();
    }
  }
  get disabled() {
    return !this.enabled;
  }
  enable() {
    this.enabled = true;
  }
  disable() {
    this.enabled = false;
  }
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


