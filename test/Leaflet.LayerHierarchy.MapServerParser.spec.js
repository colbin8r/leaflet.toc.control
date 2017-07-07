/*global describe, expect, it, beforeEach*/
import MapServerParser from './../src/Leaflet.LayerHierarchy.MapServerParser';
import LayerHierarchy from './../src/Leaflet.LayerHierarchy';

import Promise from 'bluebird';
import { Map } from 'leaflet-headless';

// import chalk from 'chalk';
import sinon from 'sinon';

describe( 'MapServerParser', () => {

  let url, map, options, parser;
  beforeEach( () => {
    // setup fixture data
    url = 'https://gis.worldviewsolutions.com/arcgis/rest/services/accomack/public/MapServer';
    // stubbing Leaflet's Map prevents us from actually calling the Map constructor, which would require
    // a HTMLElement to use; getting JSDOM to work with Map is more trouble that it's worth
    // however, checks like `map instanceof Map` still pass with the stub
    map = sinon.createStubInstance(Map);
    options = {
      data: {
        scale: false,
        defaultVisibility: false
      },
      hierarchyOptions: {
        followAncestorVisibility: false,
        propogateDeselectToChildren: true,
        followAncestorMutability: false
      }
    };
    parser = new MapServerParser(url, map, options);
  } );

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
      const o = { data: { scale: false } };
      let p = new MapServerParser(url, map, o);
      expect(p.options).to.be.an('object').that.has.all.deep.keys(options);
      expect(p.options.data.scale).to.be.false;
      expect(p.options.data.defaultVisibility).to.exist.and.to.equal(p.defaults.data.defaultVisibility);
    });
  })

  describe('#parse', () => {
    it('should return a promise', () => {
      expect(parser.parse()).to.be.an.instanceof(Promise);
    })
  })

  describe('#_queryLayers', () => {
    it('should return a promise', () => {
      expect(parser._queryLayers()).to.be.an.instanceof(Promise);
    })
  })

  describe('._makeLayerURL', () => {
    it('should require valid parameters', () => {
      expect(function noParams() {
        MapServerParser._makeLayerURL()
      }).to.throw();
      expect(function missingURL() {
        MapServerParser._makeLayerURL(undefined, 0)
      }).to.throw('URL');
      expect(function invalidURLType() {
        MapServerParser._makeLayerURL({}, 0)
      }).to.throw('URL');
      expect(function missingID() {
        MapServerParser._makeLayerURL('foo', undefined);
      }).to.throw('ID');
      expect(function invalidIDType() {
        MapServerParser._makeLayerURL('foo', {});
      }).to.throw('ID');
    })

    it('should make valid URLs', () => {
      const fixture1 = {
        base: 'https://gis.worldviewsolutions.com/arcgis/rest/services/accomack/public/MapServer',
        id: 0,
        result: 'https://gis.worldviewsolutions.com/arcgis/rest/services/accomack/public/MapServer/0'
      };
      const fixture2 = {
        base: 'MapServer',
        id: 42,
        result: 'MapServer/42'
      }

      expect(MapServerParser._makeLayerURL(fixture1.base, fixture1.id)).to.equal(fixture1.result);
      expect(MapServerParser._makeLayerURL(fixture2.base, fixture2.id)).to.equal(fixture2.result);
    })
  })


} );
