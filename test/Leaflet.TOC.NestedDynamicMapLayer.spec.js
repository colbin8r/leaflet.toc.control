/*global describe, expect, it, beforeEach*/
import NestedDynamicMapLayer from './../src/Leaflet.TOC.NestedDynamicMapLayer';
import fixtureGen from './fixtures/smalltree-custom';

import L from 'leaflet-headless';
import esri from 'esri-leaflet';
import sinon from 'sinon';

describe('NestedDynamicMapLayer', () => {
  let fixtures, layerStub, fixture;

  before(() => {
    layerStub = sinon.createStubInstance(esri.DynamicMapLayer);
    console.log(esri.DynamicMapLayer);
    fixtures = fixtureGen({}, NestedDynamicMapLayer);
    fixture = fixtures.parent;
  })

  it('should be a NestedDynamicMapLayer', () => {
    expect(fixtures.parent).to.be.an.instanceof(NestedDynamicMapLayer);
  })

  it('should try to call .setLayers on the Leaflet layer when attaching', () => {
    fixture._attach();
    expect(layerStub.setLayers).to.have.been.called;
  })
})
