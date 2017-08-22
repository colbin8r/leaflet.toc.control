'use strict';

var _LeafletTOC = require('./Leaflet.TOC.NestedLayer');

var _LeafletTOC2 = _interopRequireDefault(_LeafletTOC);

var _LeafletTOC3 = require('./Leaflet.TOC.NestedDynamicMapLayer');

var _LeafletTOC4 = _interopRequireDefault(_LeafletTOC3);

var _LeafletTOC5 = require('./Leaflet.TOC.NestedLayerTreeHelper');

var NestedLayerTreeHelper = _interopRequireWildcard(_LeafletTOC5);

var _LeafletTOC6 = require('./Leaflet.TOC.MapServerParser');

var _LeafletTOC7 = _interopRequireDefault(_LeafletTOC6);

var _LeafletTOC8 = require('./Leaflet.TOC.MapSymbology');

var _LeafletTOC9 = _interopRequireDefault(_LeafletTOC8);

var _LeafletTOC10 = require('./Leaflet.TOC.MapSymbol');

var _LeafletTOC11 = _interopRequireDefault(_LeafletTOC10);

var _LeafletTOC12 = require('./Leaflet.TOC.Control');

var _LeafletTOC13 = _interopRequireDefault(_LeafletTOC12);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import LayerHierarchy from './Leaflet.LayerHierarchy';
// import MapServerParser from './Leaflet.LayerHierarchy.MapServerParser';
// import NestedLayers from './Leaflet.Control.NestedLayers';

var _exports = {
  NestedLayer: _LeafletTOC2.default,
  NestedDynamicMapLayer: _LeafletTOC4.default,
  NestedLayerTreeHelper: NestedLayerTreeHelper,
  MapServerParser: _LeafletTOC7.default,
  MapSymbology: _LeafletTOC9.default,
  MapSymbol: _LeafletTOC11.default,
  Control: _LeafletTOC13.default
  // LayerHierarchy,
  // MapServerParser,
  // NestedLayers


  // decide later whether to attach to the global L by attaching everything we would attach
  // to the global L to a separate 'namespace' object
}; /* global window */
var namespace = Object.assign({}, _exports);

// create the standard factory methods that Leaflet plugins are supposed to expose
// using ES6 spread notation means always up-to-date constructor parameters
namespace.nestedLayer = function nestedLayer() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new (Function.prototype.bind.apply(_exports.NestedLayer, [null].concat(args)))();
};
namespace.nestedDynamicMapLayer = function nestedDynamicMapLayer() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return new (Function.prototype.bind.apply(_exports.NestedDynamicMapLayer, [null].concat(args)))();
};
// no factory for NestedLayerTreeHelper
namespace.mapServerParser = function mapServerParser() {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return new (Function.prototype.bind.apply(_exports.MapServerParser, [null].concat(args)))();
};
namespace.mapSymbology = function mapSymbology() {
  for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    args[_key4] = arguments[_key4];
  }

  return new (Function.prototype.bind.apply(_exports.MapSymbology, [null].concat(args)))();
};
namespace.mapSymbol = function mapSymbol() {
  for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    args[_key5] = arguments[_key5];
  }

  return new (Function.prototype.bind.apply(_exports.MapSymbol, [null].concat(args)))();
};
namespace.control = function control() {
  for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    args[_key6] = arguments[_key6];
  }

  return new (Function.prototype.bind.apply(_exports.Control, [null].concat(args)))();
};

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
  _exports.L = {
    TOC: namespace
  };
}

module.exports = _exports;
//# sourceMappingURL=index.js.map
