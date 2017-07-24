'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Leaflet = require('./Leaflet.NestedLayer');

var _Leaflet2 = _interopRequireDefault(_Leaflet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Represents a non-rooted tree structure of NestedLayer objects
 * @param {object} options Configuration options that dictate how the tree
 * should behave
 */
var LayerHierarchy = function () {

  /**
   * @param {object} options Configuration options
   * @param {NestedLayer[]} [options.layers=[]] Layers to include at the root
   * level
   * @param {boolean} [options.followAncestorVisibility=true] {@link
   * #NestedLayers#constructor See the plugin constructor.}
   * @param {boolean} [options.propogateDeselectToChildren=false] {@link
   * #NestedLayers#constructor See the plugin constructor.}
   * @param {boolean} [options.followAncestorMutability=true] {@link
   * #NestedLayers#constructor See the plugin constructor.}
   */
  function LayerHierarchy(options) {
    _classCallCheck(this, LayerHierarchy);

    // for the layers parameter, ensure that we are at least passed an array
    // otherwise, default to empty array

    // default options
    this._options = {
      // 'layers' will be deleted by the end of the constructor
      layers: [],
      followAncestorVisibility: true,
      propogateDeselectToChildren: false,
      followAncestorMutability: true
    };

    // overwrite defaults with passed options
    Object.assign(this._options, options);

    // extract the 'layers' property from 'options' into its own property
    this._layers = this.options.layers;
    delete this._options.layers;

    this.validateEnabledStates();

    this.ownAllLayers(this.layers);
  }

  /**
   * Configuration options
   * @type {object}
   */


  _createClass(LayerHierarchy, [{
    key: 'addLayer',


    /**
     * Adds a new layer into the tree. Defaults to insertion at the root of the
     * tree, but passing a the ID of another layer will insert the layer as a
     * child of that parent.
     * @param {NestedLayer} layer    The layer to insert
     * @param {?number} [parentID=null] The ID of a parent to insert underneath
     */
    value: function addLayer(layer, parentID) {
      // id, name, layer, defaultVisibility, minScale, maxScale, children
      // layer should be a NestedLayer

      if (!(layer instanceof _Leaflet2.default)) {
        throw new TypeError('layer is not a NestedLayer');
      }

      // take ownership of the layer
      this.ownLayer(layer);

      if (typeof parentID != 'undefined') {
        // add as child
        this.getLayerByID(parentID).addChild(layer);
      } else {
        // no parent, add at root level
        this._layers.push(layer);
      }
    }

    /**
     * Finds a layer in the tree by ID. Traverses the tree recurisvely until it
     * is found. Don't pass children unless you want to search a specific
     * subtree.
     * @param  {number}          id       The layer ID to search for
     * @param  {NestedLayer[]}   [children=this.layers] A subtree to search
     * @return {?NestedLayer}     The layer if found, or null otherwise.
     */

  }, {
    key: 'getLayerByID',
    value: function getLayerByID(id, children) {

      // if the function was not called recursively
      if (!children) {
        children = this._layers;
      }

      for (var i = 0; i < children.length; i++) {

        // if the child matches
        if (children[i].id == id) {
          // return the child
          return children[i];
        } else {

          // if the child has its own children
          if (children[i].children && children[i].children.length > 0) {

            // reucrisvely check them
            var recursiveResult = this.getLayerByID(id, children[i].children);
            if (recursiveResult !== null) {
              return recursiveResult;
            }
          }
        }
      }

      // if execution reaches here, no layers in this tree or subtree have the requested id
      return null;
    }

    /**
     * Root-level NestedLayer layers
     * @type {NestedLayer[]}
     */

  }, {
    key: 'validateEnabledStates',


    // check all the children to ensure that they are all enabled/disabled as appropriate
    // the highest layer takes precedence over lower layers
    // i.e. if a root-level layer is disabled, then all its children will be disabled as well
    // parameters should be undefined when called the first time; the function is recursive
    value: function validateEnabledStates(layers, newEnabledValue) {
      // first call? then layers = the whole true
      if (typeof layers === 'undefined') {
        // console.log('validateEnabledStates: first call');
        layers = this.rootLayers;
      }

      for (var i = 0; i < layers.length; i++) {
        // console.log('validateEnabledStates: checking', layers[i].name);

        // if we have a specific enabled value, set the children to that
        if (typeof newEnabledValue !== 'undefined') {
          // console.log('validateEnabledStates: setting', layers[i].name, 'to', newEnabledValue);
          layers[i].enabled = newEnabledValue;
        }

        // if the layer has children, repeat this process on them
        // console.log('validateEnabledStates: does', layers[i].name, 'have children?', (layers[i].hasChildren ? 'yes' : 'no'));
        if (layers[i].hasChildren) {
          // console.log('validateEnabledStates: setting children of', layers[i].name, 'to', layers[i].enabled);
          this.validateEnabledStates(layers[i].children, layers[i].enabled);
        }
      }
    }

    /**
     * Checks if this LayerHierarchy owns the provided layer
     * @param  {NestedLayer} layer The layer to check
     * @return {boolean}       True if the layer is owned by this hierarchy; false otherwise
     */

  }, {
    key: 'ownsLayer',
    value: function ownsLayer(layer) {
      return layer.owner === this;
    }

    /**
     * Factory method for making a new NestedLayer that is owned by this hierarchy
     * @param  {object} layerData The same object you would provide to the {@link #NestedLayer#constructor constructor of NestedLayer}
     * @return {NestedLayer}           A NestedLayer owned by this hierarchy
     */

  }, {
    key: 'makeLayer',
    value: function makeLayer(layerData) {
      var l = new _Leaflet2.default(layerData);
      l.owner = this;
      return l;
    }

    /**
     * Take ownership of a layer
     * @param  {NestedLayer} layer The layer to become the owner of
     */

  }, {
    key: 'ownLayer',
    value: function ownLayer(layer) {
      layer.owner = this;
    }

    /**
     * Take ownership of a layer subtree AND those layers' children
     * @param  {NestedLayer[]} layers The layers to become the owner of
     */

  }, {
    key: 'ownAllLayers',
    value: function ownAllLayers(layers) {
      for (var i = 0; i < layers.length; i++) {
        this.ownLayer(layers[i]);
        layers[i].ownChildren();
      }
    }
  }, {
    key: 'options',
    get: function get() {
      return this._options;
    }
  }, {
    key: 'layers',
    get: function get() {
      return this._layers;
    }
    /**
     * {@link #LayerHierarchy#layers Root-level NestedLayer layers}
     * @type {NestedLayer[]}
     */

  }, {
    key: 'rootLayers',
    get: function get() {
      return this.layers;
    }
  }]);

  return LayerHierarchy;
}();

exports.default = LayerHierarchy;
//# sourceMappingURL=Leaflet.LayerHierarchy.js.map
