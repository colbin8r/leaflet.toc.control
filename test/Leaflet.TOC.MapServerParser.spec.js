/*global describe, expect, it, beforeEach*/
// this package must be imported before MapServerParser for testing purposes
// MapServerParser imports (parts of) esri-leaflet, which imports Leaflet, which throws errors when
// run in a headless environment
import { Map } from 'leaflet-headless';
import { DynamicMapLayer } from 'esri-leaflet';
import Promise from 'bluebird';
import sinon from 'sinon';
// import chalk from 'chalk';

import MapServerParser from './../src/Leaflet.TOC.MapServerParser';

describe('MapServerParser', () => {

  const url = 'http://vm104.worldviewsolutions.net/arcgis/rest/services/NN/Stormwater_02272017/MapServer';
  const options = {
    parsingOptions: {
      scale: true,
      defaultVisibility: true,
      swatch: true
    },
    layerProps: {},
    dynamicMapLayerOptions: {}
  }
  let map, parser;

  before(() => {
    map = sinon.createStubInstance(Map);
    parser = new MapServerParser(url, map, options);
  })

  describe('#url', () => {
    it('should be able to get the MapServer url', () => {
      expect(parser.url).to.be.a('string').that.has.string(url);
    });
  })

  describe('#map', () => {
    it('should be able to get the Leaflet map object', () => {
      expect(parser.map).to.be.an.instanceof(Map).and.to.equal(map);
    });
  })

  describe('#options', () => {
    it('should be able to get configuration options', () => {
      expect(parser.options).to.be.an('object').that.has.all.deep.keys(options);
    })
  })

  describe('#defaults', () => {
    it('should have default configuration options accessible always', () => {
      expect(parser.defaults).to.be.an('object').that.has.all.deep.keys(options);
    })
  })

  describe('#layer', () => {
    it('should be able to get the Esri-Leaflet DynamicMapLayer', () => {
      expect(parser.layer).to.be.an.instanceof(DynamicMapLayer);
    })
  })

  describe('#constructor', () => {
    it('should throw errors if required arguments are missing', () => {
      expect(() => {
        let p = new MapServerParser();
      }).to.throw();
      expect(() => {
        let p = new MapServerParser(undefined, map, options);
      }).to.throw('URL');
      expect(() => {
        let p = new MapServerParser(url, undefined, options);
      }).to.throw('map');
    });

    it('should have default (configuration) options', () => {
      // create a new parser without any options passed
      // so we can assert that it uses default options of some sort
      let p = new MapServerParser(url, map);
      expect(p.options).to.be.an('object').that.has.all.deep.keys(options)
    });

    it('should merge options with defaults', () => {
      const o = { parsingOptions: { scale: false } };
      let p = new MapServerParser(url, map, o);
      expect(p.options).to.be.an('object').that.has.all.deep.keys(options);
      expect(p.options.parsingOptions.scale).to.be.false;
      expect(p.options.parsingOptions.defaultVisibility).to.exist.and.to.equal(p.defaults.parsingOptions.defaultVisibility);
    });
  })

  describe('#parse', () => {
    let promise;
    before(() => {
      promise = parser.parse();
    });

    it('should return a promise', () => {
      expect(promise).to.be.an.instanceof(Promise);
    });

    it('should resolve the promise', () => {
      return expect(promise).to.be.fulfilled;
    });

    it('should resolve the promise with an array', () => {
      return expect(promise).to.eventually.be.a('array');
    });
  })

  describe('#_queryLayers', () => {
    it('should return a promise', () => {
      expect(parser._queryLayers()).to.be.an.instanceof(Promise);
    });
  })

  describe('#_queryLegend', () => {
    it('should return a promise', () => {
      expect(parser._queryLayers()).to.be.an.instanceof(Promise);
    });
  })

})
