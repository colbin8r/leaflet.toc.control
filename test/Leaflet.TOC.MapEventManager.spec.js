import { generateID } from './../src/Leaflet.TOC.NestedLayer';
import sinon from 'sinon';

import MapEventManager from './../src/Leaflet.TOC.MapEventManager';

describe('MapEventManager', () => {

  function stubMap() {
    return {
      _leaflet_id: generateID(),
      _events: [],
      on: function(e, handler) {
        if (typeof e === 'string') {
          if (this._events[e]) {
            this._events[e] = [];
          }
          this._events[e].push(handler);
        } else {
          Object.keys(e).forEach((type) => {
            if (this._events[e]) {
              this._events[e] = [];
            }
            this._events[e].push(e[type]);
          })
        }
      },
      off: function(e, handler) {

      },
      fire: function(type, payload) {
        this._events[type].forEach((handler) => {
          handler(payload);
        })
      }
    }
  }

  const manager = new MapEventManager();
  const map1 = stubMap();
  // const map2 = sinon.createStubInstance(Map);

  it('should export MapEventManager class', () => {
    expect(manager).to.be.an.instanceof(MapEventManager);
  })

  it('should have IDs for the maps', () => {
    console.log(map1._leaflet_id);
  })

})
