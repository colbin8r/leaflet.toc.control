'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _leafletHeadless = require('leaflet-headless');

var _leafletHeadless2 = _interopRequireDefault(_leafletHeadless);

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

      // if execution reaches here, no layers in this subtree have the requested id
      return null;
    }
  }, {
    key: 'getRootLayers',
    value: function getRootLayers() {
      return this._layers;
    }
  }]);

  return LayerHierarchy;
}();

exports.default = LayerHierarchy;
//# sourceMappingURL=Leaflet.LayerHierarchy.js.map
