/*global describe, expect, it, beforeEach*/
import NestedDynamicMapLayer from './../src/Leaflet.TOC.NestedDynamicMapLayer';
import fixtureGen from './fixtures/smalltree-custom';

// the leaflet-headless import prevents the esri import from throwing errors about missing
// window object, etc
// https://github.com/Esri/esri-leaflet/issues/969
import L from 'leaflet-headless';
import esri from 'esri-leaflet';
import sinon from 'sinon';

describe('NestedDynamicMapLayer', () => {
  const layerStubOptions = {
    url: 'https://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_Population_Density/MapServer',
    layers: [1, 2, 3, 4]
  }
  let fixtures, layer, fixture, setLayersSpy;

  before(() => {
    // layerStub = sinon.createStubInstance(esri.DynamicMapLayer);
    layer  = new esri.DynamicMapLayer(layerStubOptions);
    fixtures = fixtureGen({}, NestedDynamicMapLayer, layer);
    fixture = fixtures.parent;
  })

  beforeEach(() => {
    setLayersSpy = sinon.spy(layer, 'setLayers');
  })

  afterEach(() => {
    setLayersSpy.restore();
  })

  it('should be a NestedDynamicMapLayer', () => {
    expect(fixtures.parent).to.be.an.instanceof(NestedDynamicMapLayer);
  })

  describe('#_attach', () => {
    it('should try to call .setLayers on the Leaflet layer', () => {
      fixture._attach();
      expect(setLayersSpy).to.have.been.called;
    })

    it('should have the new ID in the list', () => {
      const id = fixture.layerID;
      fixture._attach();
      expect(layer.getLayers()).to.include(id);
    })

    it('should keep existing IDs in the list', () => {
      const existingIDs = layer.getLayers();
      fixture._attach();
      expect(layer.getLayers()).to.include.members(existingIDs);
    })

    it('should add the new ID even if there are no existing layers', () => {
      const emptyLayer = new esri.DynamicMapLayer({ url: layerStubOptions.url });
      let emptyLayerFixtures = fixtureGen({}, NestedDynamicMapLayer, emptyLayer);
      let emptyFixture = emptyLayerFixtures.parent;
      const id = emptyFixture.layerID;
      emptyFixture._attach();
      expect(emptyFixture.layer.getLayers()).to.include(id);
    })
  })

  describe('#_detach', () => {
    it('should try to call .setLayers on the Leaflet layer', () => {
      fixture._detach();
      expect(setLayersSpy).to.have.been.called;
    })

    it('should have removed the ID from the list', () => {
      const id = fixture.layerID;
      fixture._detach();
      expect(layer.getLayers()).to.not.include(id);
    })

    it('should keep existing IDs in the list', () => {
      const existingIDs = layer.getLayers();
      fixture._detach();
      expect(layer.getLayers()).to.include.members(existingIDs);
    })
  })

})
