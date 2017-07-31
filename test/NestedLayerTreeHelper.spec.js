/*global describe, expect, it, beforeEach*/
import * as NestedLayerTreeHelper from './../src/Leaflet.NestedLayerTreeHelper';
import NestedLayer from './../src/Leaflet.NestedLayer';

import L from 'leaflet-headless';
import sinon from 'sinon';

describe('NestedLayerTreeHelper', () => {
  let layer;
  let root1, root2, root3;
  let child1, child2; // children of root 2
  let tree;
  let layerStub = sinon.createStubInstance(L.Layer);
  let mapStub = sinon.createStubInstance(L.Map);
  const options = { rules: { alwaysDeselectedWhenDisabled: false } };

  beforeEach('create tree fixture', () => {
    // layer is an alias for root1
    layer = root1;
    root1 =   new NestedLayer(111, 'Layer 111', layerStub, mapStub, options);
    root2 =   new NestedLayer(222, 'Layer 222', layerStub, mapStub, options);
    root3 =   new NestedLayer(333, 'Layer 333', layerStub, mapStub, options);
    child1 =  new NestedLayer(444, 'Layer 444', layerStub, mapStub, options);
    child2 =  new NestedLayer(555, 'Layer 555', layerStub, mapStub, options);
    root3.addChild(child1);
    root3.addChild(child2);
    tree = [root1, root2, root3];
  })

  describe('#getLayerByID', () => {
    it('should find layers by ID', () => {
      const target = child2;
      const id = target.id;

      expect(NestedLayerTreeHelper.getLayerByID(tree, id)).to.equal(target);
    })

    it('should return null if the layer is not found', () => {
      const id = 12345;

      expect(NestedLayerTreeHelper.getLayerByID(tree, id)).to.be.null;
    })
  })

  describe('#getLayerByLayerID', () => {
    it('should find layers by server ID', () => {
      const target = child2;
      const id = target.layerID;

      expect(NestedLayerTreeHelper.getLayerByLayerID(tree, id)).to.equal(target);
    })

    it('should return null if the layer is not found', () => {
      const id = 12345;

      expect(NestedLayerTreeHelper.getLayerByLayerID(tree, id)).to.be.null;
    })
  })

  describe('#applyStateChangeToLayer', () => {
    it('should apply valid state changes', () => {
      const change = {
        selected: !layer.defaults.selected,
        enabled: !layer.defaults.enabled
      };
      NestedLayerTreeHelper.applyStateChangeToLayer(layer, change);

      expect(layer.selected).to.equal(change.selected);
      expect(layer.enabled).to.equal(change.enabled);
    })
  })

  describe('#applyStateChangeToTree', () => {
    it('should apply valid state changes', () => {
      const change = {
        selected: !layer.defaults.selected,
        enabled: !layer.defaults.enabled
      };
      NestedLayerTreeHelper.applyStateChangeToTree(tree, change);

      expect(root1.selected).to.equal(change.selected);
      expect(root2.selected).to.equal(change.selected);
      expect(root3.selected).to.equal(change.selected);
      expect(child1.selected).to.equal(change.selected);
      expect(child2.selected).to.equal(change.selected);
      expect(root1.enabled).to.equal(change.enabled);
      expect(root2.enabled).to.equal(change.enabled);
      expect(root3.enabled).to.equal(change.enabled);
      expect(child1.enabled).to.equal(change.enabled);
      expect(child2.enabled).to.equal(change.enabled);
    })
  })
})
