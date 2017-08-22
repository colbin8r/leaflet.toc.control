'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import * as NestedLayerTreeHelper from './Leaflet.TOC.NestedLayerTreeHelper';

var MapEventManager = function () {
  function MapEventManager() {
    _classCallCheck(this, MapEventManager);

    this.maps = {};
    // this.maps = {
    //   '[map1._leaflet_id]': {
    //     map: 'MapObject',
    //     handlers: {
    //       'zoomend': function() {},
    //       'layeradd': function() {},
    //       'layerremove': function() {}
    //     },
    //     callbacks: {
    //       '[LeafletLayer1._leaflet_id]': ['callback1'],
    //       '[LeafletLayer2._leaflet_id]': ['callback2', 'callback2', ... ]
    //     }
    //   }
    // };
  }

  _createClass(MapEventManager, [{
    key: 'bindLayerToMapChanges',
    value: function bindLayerToMapChanges(map, layer, callback) {
      console.log('MapEventManager binding layer', layer._leaflet_id, 'to map', map._leaflet_id);
      this._addCallback(map, layer, callback);
    }

    // expects to be bound with .bind(this, map)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind

  }, {
    key: '_zoomendHandler',
    value: function _zoomendHandler(map, e) {
      // a zoom change needs to call all the callbacks
      // because only the model can compute whether or not it is visible

      console.log('MapEventManager detected zoom level changed to', e.target.getZoom());
      var id = void 0;
      var callbacks = void 0;
      var callbackList = this._findMap(map).callbacks;
      for (id in callbackList) {
        callbacks = callbackList[id];
        if (callbacks) {
          console.log('MapEventManager zoom found callbacks', callbacks);
          callbacks.forEach(function (callback) {
            callback(e);
          });
        }
      }
    }

    // expects to be bound with .bind(...)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind

  }, {
    key: '_layeraddHandler',
    value: function _layeraddHandler(map, e) {
      // a layer add/remove change needs only to call one handler:
      // the handler corresponding to the layer that was added/removed

      console.log('MapEventManager detected layer added/removed', e);
      var callbacks = this._findCallbacks(map, e.layer);
      if (callbacks) {
        console.log('MapEventManager calling add/remove callbacks', callbacks);
        callbacks.forEach(function (callback) {
          callback(e);
        });
      }
    }

    // expects to be bound with .bind(...)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind

  }, {
    key: '_layerremoveHandler',
    value: function _layerremoveHandler(map, e) {
      this._layeraddHandler(map, e);
    }

    // adds a new map if the specified one does not exist

  }, {
    key: '_findMap',
    value: function _findMap(map) {
      var entry = this.maps[map._leaflet_id];
      if (!entry) {
        entry = this._addNewMap(map);
      }
      return entry;
    }
  }, {
    key: '_addNewMap',
    value: function _addNewMap(map) {
      var entry = this.maps[map._leaflet_id] = {
        map: map,
        handlers: {
          'zoomend': this._zoomendHandler.bind(this, map),
          'layeradd': this._layeraddHandler.bind(this, map),
          'layerremove': this._layerremoveHandler.bind(this, map)
        },
        callbacks: {}
      };
      this._addMapHandlers(map);
      return entry;
    }
  }, {
    key: '_findCallbacks',
    value: function _findCallbacks(map, layer) {
      var mapEntry = this._findMap(map);
      if (!mapEntry.callbacks[layer._leaflet_id]) {
        mapEntry.callbacks[layer._leaflet_id] = [];
      }
      console.log('MapEventManager found callbacks for', layer._leaflet_id, mapEntry.callbacks[layer._leaflet_id]);
      return mapEntry.callbacks[layer._leaflet_id];
    }
  }, {
    key: '_addCallback',
    value: function _addCallback(map, layer, callback) {
      var callbacks = this._findCallbacks(map, layer);
      callbacks.push(callback);
      console.log('MapEventManager adding callback to layer (+ result)', layer._leaflet_id, callbacks);
    }
  }, {
    key: '_addMapHandlers',
    value: function _addMapHandlers(map) {
      console.log('MapEventManager adding handlers to map');
      // http://leafletjs.com/reference-1.2.0.html#evented-on
      map.on(this._findMap(map).handlers);
    }
  }, {
    key: '_removeMapHandlers',
    value: function _removeMapHandlers(map) {
      console.log('MapEventManager removing handlers from map');
      // http://leafletjs.com/reference-1.2.0.html#evented-off
      map.off(this._findMap(map).handlers);
    }
  }]);

  return MapEventManager;
}();

exports.default = MapEventManager;
//# sourceMappingURL=Leaflet.TOC.MapEventManager.js.map
