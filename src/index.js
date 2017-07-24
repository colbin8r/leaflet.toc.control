import L from 'leaflet-headless';
import NestedLayer from './Leaflet.NestedLayer';
import LayerHierarchy from './Leaflet.LayerHierarchy';
import MapServerParser from './Leaflet.LayerHierarchy.MapServerParser';
import NestedLayers from './Leaflet.Control.NestedLayers';

let exports = {
  NestedLayer,
  LayerHierarchy,
  MapServerParser,
  NestedLayers
}

if (typeof window !== 'undefined' && typeof L !== 'undefined') {
  L.NestedLayer = exports.NestedLayer;
  L.LayerHierarchy = exports.LayerHierarchy;
  L.MapServerParser = exports.MapServerParser;
  L.Control.NestedLayers = exports.NestedLayers;

  L.nestedLayer = function nestedLayer(options) {
    return new exports.NestedLayer(options);
  };
  L.layerHierarchy = function layerHierarchy(options) {
    return new exports.LayerHierarchy(options);
  };
  L.mapServerParser = function mapServerParser(url, map, options) {
    return new exports.MapServerParser(url, map, options);
  };
  L.control.nestedLayers = function nestedLayers(hierarchy, element, options) {
    return new exports.NestedLayers(hierarchy, element, options);
  };
}

module.exports = exports;
