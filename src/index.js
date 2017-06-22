import L from 'leaflet-headless';
import NestedLayer from './Leaflet.NestedLayer';
import LayerHierarchy from './Leaflet.LayerHierarchy';
import NestedLayers from './Leaflet.Control.NestedLayers';

let exports = {
  NestedLayer,
  LayerHierarchy,
  NestedLayers
}

if (typeof window != 'undefined') {
  L.NestedLayer = exports.NestedLayer;
  L.LayerHierarchy = exports.LayerHierarchy;
  L.Control.NestedLayers = exports.NestedLayers;

  L.nestedLayer = function nestedLayer(options) {
    return new exports.NestedLayer(options);
  };
  L.layerHierarchy = function layerHierarchy(options) {
    return new exports.LayerHierarchy(options);
  };
  L.control.nestedLayers = function nestedLayers(hierarchy, element, options) {
    return new exports.NestedLayers(hierarchy, element, options);
  };
}

module.exports = exports;
