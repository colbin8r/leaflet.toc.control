'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Leaflet = require('./Leaflet.NestedLayer');

var _Leaflet2 = _interopRequireDefault(_Leaflet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LayerHierarchy = function () {
  function LayerHierarchy(options) {
    _classCallCheck(this, LayerHierarchy);

    // for the layers parameter, ensure that we are at least passed an array
    // otherwise, default to empty array
    if (typeof options === 'undefined') {
      options = {};
    }
    this._layers = Array.isArray(options.layers) ? options.layers : [];

    this.validateEnabledStates();
  }

  // adds a new NestedLayer object into the tree
  // defaults to insertion at the root of the tree, but with a parentID
  // you may insert underneath any other NestedLayer in the tree


  _createClass(LayerHierarchy, [{
    key: 'addLayer',
    value: function addLayer(layer, parentID) {
      // id, name, layer, defaultVisibility, minScale, maxScale, children
      // layer should be a NestedLayer

      if (!(layer instanceof _Leaflet2.default)) {
        throw new TypeError('layer is not a NestedLayer');
      }

      if (typeof parentID != 'undefined') {
        // add as child
        this.getLayerByID(parentID).addChild(layer);
      } else {
        // no parent, add at root level
        this._layers.push(layer);
      }
    }

    // looks up NestedLayer object by traversing the tree
    // when calling, do not pass a 'children' parameter

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
  }, {
    key: 'getRootLayers',
    value: function getRootLayers() {
      return this._layers;
    }

    // check all the children to ensure that they are all enabled/disabled as appropriate
    // the highest layer takes precedence over lower layers
    // i.e. if a root-level layer is disabled, then all its children will be disabled as well
    // parameters should be undefined when called the first time; the function is recursive

  }, {
    key: 'validateEnabledStates',
    value: function validateEnabledStates(layers, newEnabledValue) {
      // first call? then layers = the whole true
      if (typeof layers === 'undefined') {
        // console.log('validateEnabledStates: first call');
        layers = this.getRootLayers();
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
  }]);

  return LayerHierarchy;
}();

exports.default = LayerHierarchy;
//# sourceMappingURL=Leaflet.LayerHierarchy.js.map
