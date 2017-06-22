/*global describe, expect, it, beforeEach*/
import NestedLayer from './../../src/Leaflet.NestedLayer';
import LayerHierarchy from './../../src/Leaflet.LayerHierarchy';

describe( 'LayerHierarchy', () => {

  let h, layers, l,
      l0,     l1,     l2,     l3,     l4,
      layer0, layer1, layer2, layer3, layer4;
  beforeEach( () => {
    l = new NestedLayer({
      id: 999,
      name: 'Layer 999',
      layer: {id: 999},
      map: {}
    });

    l2 = {
      id: 2,
      name: 'Layer 2',
      layer: {id: 2},
      map: {},
      children: []
    };
    l3 = {
      id: 3,
      name: 'Layer 3',
      layer: {id: 3},
      map: {},
      children: []
    }
    layer2 = new NestedLayer(l2);
    layer3 = new NestedLayer(l3);
    l1 = {
      id: 1,
      name: 'Layer 1',
      layer: {id: 1},
      map: {},
      children: [layer2, layer3]
    }
    layer1 = new NestedLayer(l1);
    l0 = {
      id: 0,
      name: 'Layer 0',
      layer: {id: 0},
      map: {},
      children: [layer1]
    }
    layer0 = new NestedLayer(l0);
    l4 = {
      id: 4,
      name: 'Layer 4',
      layer: {id: 4},
      map: {},
      children: []
    }
    layer4 = new NestedLayer(l4);

    layers = [layer0, layer4];

    h = new LayerHierarchy({layers});
  } );

  it('should be able to get layers by id', () => {
    expect(h.getLayerByID(0), 'hierarchy getLayerByID').to.equal(layer0);
    expect(h.getLayerByID(1), 'hierarchy getLayerByID').to.equal(layer1);
    expect(h.getLayerByID(2), 'hierarchy getLayerByID').to.equal(layer2);
    expect(h.getLayerByID(3), 'hierarchy getLayerByID').to.equal(layer3);
    expect(h.getLayerByID(4), 'hierarchy getLayerByID').to.equal(layer4);
  });

  it('should be able to add layers at the root level', () => {
    expect(() => {
      h.addLayer(l);
    }).to.not.throw();

    expect(h.getLayerByID(l.id)).to.equal(l);
    expect(h._layers).to.include(l);
  });

  it('should be able to add layers below the root level to other layers', () => {
    expect(() => {
      h.addLayer(l, layer0.id)
    }).to.not.throw();

    expect(h.getLayerByID(l.id)).to.equal(l);
    expect(layer0.children).to.include(l);
  });

} );
