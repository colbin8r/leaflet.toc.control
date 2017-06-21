/* global L, window */
import { NestedLayer } from './Leaflet.NestedLayer';

export class LayerHierarchy {
  constructor(options) {
    // Object.assign(this, options);

    // for the layers parameter, ensure that we are at least passed an array
    // otherwise, default to empty array
    this._layers = (Array.isArray(options.layers) ? options.layers : []);
  }

  // adds a new NestedLayer object into the tree
  // defaults to insertion at the root of the tree, but with a parentID
  // you may insert underneath any other NestedLayer in the tree
  addLayer(layer, parentID) {
    // id, name, layer, defaultVisibility, minScale, maxScale, children
    // layer should be a NestedLayer

    if (!(layer instanceof NestedLayer)) {
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
  getLayerByID(id, children) {

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
          let recursiveResult = this.getLayerByID(id, children[i].children);
          if (recursiveResult !== null) {
            return recursiveResult;
          }

        }
      }

    }

    // if execution reaches here, no layers in this subtree have the requested id
    return null;
  }

  // addToMapOverlays(map) {

  // }

  // get person() {
  //   return this.props.person;
  // }
}

if (typeof window != 'undefined') {
  L.layerHierarchy = function layerHierarchy(options) {
    return new L.LayerHierarchy(options);
  };
}
