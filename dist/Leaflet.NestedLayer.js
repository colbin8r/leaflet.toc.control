'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NestedLayer = function () {

  // props include:
  // 'id' number (req'd), 'name' string (req'd), 'layer' object (req'd), 'map' object (req'd)
  // 'enabled' boolean (optional), 'selected' boolean (optional), 'swatch' base64 string (optional)
  // 'children' array (optional), 'minZoom' zoom level (optional), 'maxZoom' zoom level (optional)
  function NestedLayer(props) {
    var _this = this;

    _classCallCheck(this, NestedLayer);

    this._handleMapZoom = function () {
      var zoom = _this.map.getZoom();

      if (zoom < _this.minZoom || zoom > _this.maxZoom) {
        _this._detach();
      } else {
        _this._attach();
      }
    };

    // set default props for optional props
    this._props = { children: [], enabled: true, selected: false, swatch: '' };
    this._isAttached = false;

    // verify that all required arguments are present
    if (typeof props.id == 'undefined') {
      throw new Error('Missing ID when creating NestedLayer');
    }
    if (typeof props.name == 'undefined') {
      throw new Error('Missing name when creating NestedLayer');
    }
    if (typeof props.layer == 'undefined') {
      throw new Error('Missing layer object when creating NestedLayer');
    }
    if (typeof props.map == 'undefined') {
      throw new Error('Missing map object when creating NestedLayer');
    }

    Object.assign(this._props, props);

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

  _createClass(NestedLayer, [{
    key: 'enable',
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

    // this is used to track what programmatic object owns this NestedLayer

  }, {
    key: 'isOwnedBy',

    // checks ownership
    value: function isOwnedBy(owner) {
      return this.owner === owner;
    }

    // options come from the layers owner
    // will return null if there is no owner

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
      this._applyStateChangeToAllChildren('enabled', true, this.children);
    }
  }, {
    key: 'disableChildren',
    value: function disableChildren() {
      this._applyStateChangeToAllChildren('enabled', false, this.children);
    }
  }, {
    key: 'ownChildren',
    value: function ownChildren() {
      this._applyStateChangeToAllChildren('owner', this.owner, this.children);
    }
  }, {
    key: '_applyStateChangeToAllChildren',
    value: function _applyStateChangeToAllChildren(prop, val, children) {
      // utility to recursively loop through children (and their children, etc.)
      // to change their state
      // IDEA: convert to a "deep map" function
      for (var i = 0; i < children.length; i++) {
        // make the state change
        children[i][prop] = val;

        // loop through children/subtrees when necessary
        if (children[i].hasChildren) {
          this._applyStateChangeToAllChildren(prop, val, children[i].children);
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
  }, {
    key: 'disabled',
    get: function get() {
      return !this.enabled;
    }
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
    key: 'deselected',
    get: function get() {
      return !this.selected;
    }
  }, {
    key: 'owner',
    get: function get() {
      return this._owner;
    },
    set: function set(val) {
      this._owner = val;
    }
  }, {
    key: 'options',
    get: function get() {
      if (typeof this.owner === 'undefined') {
        return null;
      } else {
        return this.owner.options;
      }
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
