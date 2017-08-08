'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLayerByUniqueProp = getLayerByUniqueProp;
exports.getLayerByID = getLayerByID;
exports.getLayerByLayerID = getLayerByLayerID;
exports.applyStateChangeToLayer = applyStateChangeToLayer;
exports.applyStateChangeToTree = applyStateChangeToTree;
// import { assign } from 'lodash';

// recursively traverses down the tree looking for the first matching NestedLayer
// "tree" here is expected to be an array of NestedLayers
function getLayerByUniqueProp(tree, key, val) {
  for (var i = 0; i < tree.length; i++) {

    if (tree[i][key] === val) {
      // base case A: we found a matching element at the root of the tree
      return tree[i];
    } else if (tree[i].hasChildren) {

      // recursive step: search the element's tree
      var result = getLayerByUniqueProp(tree[i].children, key, val);
      if (result !== null) {
        // base case B: element found within a subtree
        return result;
      }
    }
  }

  // base case C: not found
  return null;
}

function getLayerByID(tree, id) {
  return getLayerByUniqueProp(tree, 'id', id);
}

function getLayerByLayerID(tree, id) {
  return getLayerByUniqueProp(tree, 'layerID', id);
}

function applyStateChangeToLayer(layer, change) {
  // copies each key/value in "change" onto "layer"
  // triggers the getters/setters in NestedLayer
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
  Object.assign(layer, change);
}

/**
 * Applies a state change (or changes) to a tree or substree
 * @param  {NestedLayer[]} tree   Tree or subtree of NestedLayers
 * @param  {Object} change A key/value pair of state changes to apply to each layer in the tree
 */
function applyStateChangeToTree(tree, change) {
  for (var i = 0; i < tree.length; i++) {
    applyStateChangeToLayer(tree[i], change);

    if (tree[i].hasChildren) {
      applyStateChangeToTree(tree[i].children, change);
    }
  }
}

/**
 * Modifies (if necessary) the enabled state of layers in the tree according to the following rules:
 * 1. All the descendents of an enabled layer are also enabled.
 * 2. All the descendents of a disabled layer are also disabled.
 * @param  {[type]} tree [description]
 * @return {[type]}      [description]
 */
// export function validateEnabledStates(tree) {

// }
//# sourceMappingURL=Leaflet.TOC.NestedLayerTreeHelper.js.map
