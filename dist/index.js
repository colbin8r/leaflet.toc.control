/* global window */
import NestedLayer from './Leaflet.TOC.NestedLayer';
import * as NestedLayerTreeHelper from './Leaflet.TOC.NestedLayerTreeHelper';
import Symbology from './Leaflet.TOC.Symbology';
import Control from './Leaflet.TOC.Control';
// import LayerHierarchy from './Leaflet.LayerHierarchy';
// import MapServerParser from './Leaflet.LayerHierarchy.MapServerParser';
// import NestedLayers from './Leaflet.Control.NestedLayers';

let exports = {
  NestedLayer,
  NestedLayerTreeHelper,
  Symbology,
  Control
  // LayerHierarchy,
  // MapServerParser,
  // NestedLayers
}

// decide later whether to attach to the global L by attaching everything we would attach
// to the global L to a separate 'namespace' object
let namespace = Object.assign({}, exports);

// create the standard factory methods that Leaflet plugins are supposed to expose
// using ES6 spread notation means always up-to-date constructor parameters
namespace.nestedLayer = function nestedLayer(...args) {
  return new exports.NestedLayer(...args);
};
// no factory for NestedLayerTreeHelper
namespace.symbology = function symbology(...args) {
  return new exports.Symbology(...args);
}
namespace.control = function control(...args) {
  return new exports.Control(...args);
}

if (typeof window !== 'undefined' && typeof window.L !== 'undefined') {
  // global L and window present
  window.L.TOC = namespace;
  // specially alias plugin (a Leaflet control) to the L.Control.TOC
  // to emulate other control plugins' best practice
  window.L.Control.TOC = namespace.Control;
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
