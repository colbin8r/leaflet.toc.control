// import * as NestedLayerTreeHelper from './Leaflet.TOC.NestedLayerTreeHelper';

export default class MapEventManager {

  constructor() {
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

  bindLayerToMapChanges(map, layer, callback) {
    console.log('MapEventManager binding layer', layer._leaflet_id, 'to map', map._leaflet_id);
    this._addCallback(map, layer, callback);
  }

  // expects to be bound with .bind(this, map)
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
  _zoomendHandler(map, e) {
    // a zoom change needs to call all the callbacks
    // because only the model can compute whether or not it is visible

    console.log('MapEventManager detected zoom level changed to', e.target.getZoom());
    let id;
    let callbacks;
    let callbackList = this._findMap(map).callbacks
    for (id in callbackList) {
      callbacks = callbackList[id];
      if (callbacks) {
        console.log('MapEventManager zoom found callbacks', callbacks);
        callbacks.forEach((callback) => {
          callback(e)
        })
      }
    }
  }

  // expects to be bound with .bind(...)
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
  _layeraddHandler(map, e) {
    // a layer add/remove change needs only to call one handler:
    // the handler corresponding to the layer that was added/removed

    console.log('MapEventManager detected layer added/removed', e);
    let callbacks = this._findCallbacks(map, e.layer)
    if (callbacks) {
      console.log('MapEventManager calling add/remove callbacks', callbacks);
      callbacks.forEach((callback) => {
        callback(e)
      })
    }
  }

  // expects to be bound with .bind(...)
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
  _layerremoveHandler(map, e) {
    this._layeraddHandler(map, e);
  }

  // adds a new map if the specified one does not exist
  _findMap(map) {
    let entry = this.maps[map._leaflet_id];
    if (!entry) {
      entry = this._addNewMap(map);
    }
    return entry;
  }

  _addNewMap(map) {
    let entry = this.maps[map._leaflet_id] = {
      map,
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

  _findCallbacks(map, layer) {
    let mapEntry = this._findMap(map);
    if (!mapEntry.callbacks[layer._leaflet_id]) {
      mapEntry.callbacks[layer._leaflet_id] = [];
    }
    console.log('MapEventManager found callbacks for', layer._leaflet_id, mapEntry.callbacks[layer._leaflet_id]);
    return mapEntry.callbacks[layer._leaflet_id];
  }

  _addCallback(map, layer, callback) {
    let callbacks = this._findCallbacks(map, layer);
    callbacks.push(callback);
    console.log('MapEventManager adding callback to layer (+ result)', layer._leaflet_id, callbacks);
  }

  _addMapHandlers(map) {
    console.log('MapEventManager adding handlers to map');
    // http://leafletjs.com/reference-1.2.0.html#evented-on
    map.on(this._findMap(map).handlers);
  }

  _removeMapHandlers(map) {
    console.log('MapEventManager removing handlers from map');
    // http://leafletjs.com/reference-1.2.0.html#evented-off
    map.off(this._findMap(map).handlers);
  }

}
