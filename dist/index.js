'use strict';

var _leafletHeadless = require('leaflet-headless');

var _leafletHeadless2 = _interopRequireDefault(_leafletHeadless);

var _Leaflet = require('./Leaflet.NestedLayer');

var _Leaflet2 = _interopRequireDefault(_Leaflet);

var _Leaflet3 = require('./Leaflet.LayerHierarchy');

var _Leaflet4 = _interopRequireDefault(_Leaflet3);

var _LeafletLayerHierarchy = require('./Leaflet.LayerHierarchy.MapServerParser');

var _LeafletLayerHierarchy2 = _interopRequireDefault(_LeafletLayerHierarchy);

var _LeafletControl = require('./Leaflet.Control.NestedLayers');

var _LeafletControl2 = _interopRequireDefault(_LeafletControl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _exports = {
  NestedLayer: _Leaflet2.default,
  LayerHierarchy: _Leaflet4.default,
  MapServerParser: _LeafletLayerHierarchy2.default,
  NestedLayers: _LeafletControl2.default
};

if (typeof window !== 'undefined' && typeof _leafletHeadless2.default !== 'undefined') {
  _leafletHeadless2.default.NestedLayer = _exports.NestedLayer;
  _leafletHeadless2.default.LayerHierarchy = _exports.LayerHierarchy;
  _leafletHeadless2.default.MapServerParser = _exports.MapServerParser;
  _leafletHeadless2.default.Control.NestedLayers = _exports.NestedLayers;

  _leafletHeadless2.default.nestedLayer = function nestedLayer(options) {
    return new _exports.NestedLayer(options);
  };
  _leafletHeadless2.default.layerHierarchy = function layerHierarchy(options) {
    return new _exports.LayerHierarchy(options);
  };
  _leafletHeadless2.default.mapServerParser = function mapServerParser(url, map, options) {
    return new _exports.MapServerParser(url, map, options);
  };
  _leafletHeadless2.default.control.nestedLayers = function nestedLayers(hierarchy, element, options) {
    return new _exports.NestedLayers(hierarchy, element, options);
  };
}

module.exports = _exports;
//# sourceMappingURL=index.js.map
