/*global describe, expect, it, beforeEach*/
// this package must be imported before MapServerParser for testing purposes
// MapServerParser imports esri-leaflet, which imports Leaflet, which throws errors when
// run in a headless environment
import 'leaflet-headless';

import MapServerParser from './../src/Leaflet.LayerHierarchy.MapServerParser';
import LayerHierarchy from './../src/Leaflet.LayerHierarchy';

import Promise from 'bluebird';
import { Map } from 'leaflet-headless';

// import chalk from 'chalk';
import sinon from 'sinon';

describe.skip( 'MapServerParser', () => {

  let url, map, options, parser;
  before( () => {
    // setup fixture data
    url = 'https://gis.worldviewsolutions.com/arcgis/rest/services/accomack/public/MapServer';
    // stubbing Leaflet's Map prevents us from actually calling the Map constructor, which would require
    // a HTMLElement to use; getting JSDOM to work with Map is more trouble that it's worth
    // however, checks like `map instanceof Map` still pass with the stub
    map = sinon.createStubInstance(Map);
    options = {
      data: {
        scale: false,
        defaultVisibility: false,
        swatch: true
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

    it.skip('should resolve the promise with a LayerHierarchy', () => {
      return expect(promise).to.eventually.be.an.instanceof(LayerHierarchy);
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
    });

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
    });
  })

  describe('#_convertLayerNodeToNestedLayer)', () => {
      // fixture node data
    let node = {"currentVersion":10.31,"id":26,"name":"County Resources","type":"Group Layer","description":"","geometryType":null,"copyrightText":"","parentLayer":null,"subLayers":[{"id":27,"name":"Fire and Rescue Stations"},{"id":28,"name":"Fire Response"},{"id":29,"name":"Rescue Response"},{"id":30,"name":"Fire Districts"},{"id":31,"name":"Rescue Districts"},{"id":32,"name":"County Administration Building"},{"id":33,"name":"Airports"},{"id":34,"name":"Schools"},{"id":35,"name":"Solid Waste Disposal Facilities"},{"id":36,"name":"Boating Public Access Sites"},{"id":37,"name":"Polling Places"}],"minScale":0,"maxScale":0,"defaultVisibility":true,"extent":{"xmin":-8465355.1356,"ymin":4501816.1559,"xmax":-8375617.3878,"ymax":4583811.349899999,"spatialReference":{"wkid":102100,"latestWkid":3857}},"hasAttachments":false,"htmlPopupType":"esriServerHTMLPopupTypeNone","displayField":"","typeIdField":null,"fields":null,"relationships":[],"canModifyLayer":false,"canScaleSymbols":false,"hasLabels":false,"capabilities":"Map,Query","supportsStatistics":false,"supportsAdvancedQueries":false,"supportedQueryFormats":"JSON, AMF","ownershipBasedAccessControlForFeatures":{"allowOthersToQuery":true},"useStandardizedQueries":true,"advancedQueryCapabilities":{"useStandardizedQueries":true,"supportsStatistics":false,"supportsOrderBy":false,"supportsDistinct":false,"supportsPagination":false,"supportsTrueCurve":true,"supportsReturningQueryExtent":true,"supportsQueryWithDistance":true}};
    const fakeLegend = [];

    it('should trim whitespace around a layer name', () => {
      node.name = '  TEST  \t\n';
      let l = parser._convertLayerNodeToNestedLayer(node, fakeLegend);
      expect(l.name).to.equal('TEST');
    });
  })

} );
