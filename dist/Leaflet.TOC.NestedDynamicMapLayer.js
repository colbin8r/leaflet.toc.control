'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _LeafletTOC = require('./Leaflet.TOC.NestedLayer');

var _LeafletTOC2 = _interopRequireDefault(_LeafletTOC);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NestedDynamicMapLayer = function (_NestedLayer) {
  _inherits(NestedDynamicMapLayer, _NestedLayer);

  function NestedDynamicMapLayer() {
    _classCallCheck(this, NestedDynamicMapLayer);

    return _possibleConstructorReturn(this, (NestedDynamicMapLayer.__proto__ || Object.getPrototypeOf(NestedDynamicMapLayer)).apply(this, arguments));
  }

  _createClass(NestedDynamicMapLayer, [{
    key: '_attach',
    value: function _attach() {
      if (!this.isAttached) {
        // push the layerID into the list of layers to render
        // http://esri.github.io/esri-leaflet/api-reference/layers/dynamic-map-layer.html#methods

        var layers = this.layer.getLayers();
        // if the DynamicMapLayer was instantiated without providing a list of layer IDs as an option,
        // then .getLayers will return 'false' (as of esri-leaflet@2.0.8)
        // in JavaScript, 'typeof []'' will return 'object', so use Array.isArray to verify that .getLayers
        // returned an actual array
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
        if (!Array.isArray(layers)) {
          // .getLayers returned false (see above), so set the empty array ourselves
          layers = [];
        }
        // setLayers allows you to introduce duplicate IDs
        // this check prevents that from happening
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
        if (!layers.includes(this.layerID)) {
          // Array.push returns the new length of the array, not the array itself
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
          layers.push(this.layerID);
          this.layer.setLayers(layers);
        }

        // ensure the Leaflet layer is actually on the map object
        if (!this.map.hasLayer(this.layer)) {
          this.map.addLayer(this.layer);
        }
      }
    }
  }, {
    key: '_detach',
    value: function _detach() {
      var _this2 = this;

      if (this.isAttached) {
        // remove the layerID from the list of layers to render
        // http://esri.github.io/esri-leaflet/api-reference/layers/dynamic-map-layer.html#methods
        var layers = this.layer.getLayers().filter(function (id) {
          return id !== _this2.layerID;
        });
        this.layer.setLayers(layers);

        // if there are no more layers left, remove the layer from the map object
        if (layers.length === 0 && this.map.hasLayer(this.layer)) {
          this.map.removeLayer(this.layer);
        }
      }
    }
  }, {
    key: 'isAttached',
    get: function get() {
      var layers = this.layer.getLayers() || [];
      return this.map.hasLayer(this.layer) && layers.includes(this.layerID);
    }
  }]);

  return NestedDynamicMapLayer;
}(_LeafletTOC2.default);

exports.default = NestedDynamicMapLayer;
//# sourceMappingURL=Leaflet.TOC.NestedDynamicMapLayer.js.map
