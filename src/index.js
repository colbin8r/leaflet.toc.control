/* global window */
import NestedLayer from './Leaflet.TOC.NestedLayer';
import NestedDynamicMapLayer from './Leaflet.TOC.NestedDynamicMapLayer';
import * as NestedLayerTreeHelper from './Leaflet.TOC.NestedLayerTreeHelper';
import MapServerParser from './Leaflet.TOC.MapServerParser';
import MapSymbology from './Leaflet.TOC.MapSymbology';
import MapSymbol from './Leaflet.TOC.MapSymbol';
import Control from './Leaflet.TOC.Control';
// import LayerHierarchy from './Leaflet.LayerHierarchy';
// import MapServerParser from './Leaflet.LayerHierarchy.MapServerParser';
// import NestedLayers from './Leaflet.Control.NestedLayers';

let exports = {
  NestedLayer,
  NestedDynamicMapLayer,
  NestedLayerTreeHelper,
  MapServerParser,
  MapSymbology,
  MapSymbol,
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
namespace.nestedDynamicMapLayer = function nestedDynamicMapLayer(...args) {
  return new exports.NestedDynamicMapLayer(...args);
}
// no factory for NestedLayerTreeHelper
namespace.mapServerParser = function mapServerParser(...args) {
  return new exports.MapServerParser(...args);
}
namespace.mapSymbology = function mapSymbology(...args) {
  return new exports.MapSymbology(...args);
}
namespace.mapSymbol = function mapSymbol(...args) {
  return new exports.MapSymbol(...args);
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
