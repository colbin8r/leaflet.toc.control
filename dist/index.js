/* global window */
import NestedLayer from './Leaflet.TOC.NestedLayer';
import * as NestedLayerTreeHelper from './Leaflet.TOC.NestedLayerTreeHelper';
import Symbology from './Leaflet.TOC.Symbology';
// import LayerHierarchy from './Leaflet.LayerHierarchy';
// import MapServerParser from './Leaflet.LayerHierarchy.MapServerParser';
// import NestedLayers from './Leaflet.Control.NestedLayers';

let exports = {
  NestedLayer,
  NestedLayerTreeHelper
  Symbology
  // LayerHierarchy,
  // MapServerParser,
  // NestedLayers
}

// decide later whether to attach to the global L
let namespace = {};

namespace.NestedLayer = exports.NestedLayer;
namespace.NestedLayerTreeHelper = exports.NestedLayerTreeHelper;
namespace.Symbology = exports.Symbology;

namespace.nestedLayer = function nestedLayer(...args) {
  return new exports.NestedLayer(args);
};
// no factory for NestedLayerTreeHelper
namespace.symbology = function symbology(...args) {
  return new exports.Symbology(args);
}

if (typeof window !== 'undefined' && typeof window.L !== 'undefined') {
  // global L and window present
  window.L.TOC = namespace;
} else if (typeof window !== 'undefined') {
  // global L and window missing
  window.LeafletTOC = namespace;
} else {
  // if there is no global window, stay out of the global namespace
  exports.L = {
    TOC: namespace
  };
}

module.exports = exports;
