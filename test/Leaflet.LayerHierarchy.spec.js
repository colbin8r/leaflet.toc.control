/*global describe, expect, it, beforeEach*/
import NestedLayer from './../src/Leaflet.NestedLayer';
import LayerHierarchy from './../src/Leaflet.LayerHierarchy';

describe( 'LayerHierarchy', () => {

  function stubLayer(id) {
    return {
      id,
      addTo: function() {},
      removeFrom: function() {},
      remove: function() {},
      on: function() {}
    }
  }

  let h, layers, l, layerData, ownedLayer,
      l0,     l1,     l2,     l3,     l4,
      layer0, layer1, layer2, layer3, layer4;
  beforeEach( () => {
    layerData = {
      id: 999,
      name: 'Layer 999',
      layer: stubLayer(999),
      map: {}
    };
    l = new NestedLayer(layerData);

    l2 = {
      id: 2,
      name: 'Layer 2',
      layer: stubLayer(2),
      map: {},
      children: []
    };
    l3 = {
      id: 3,
      name: 'Layer 3',
      layer: stubLayer(3),
      map: {},
      children: []
    }
    layer2 = new NestedLayer(l2);
    layer3 = new NestedLayer(l3);

    l1 = {
      id: 1,
      name: 'Layer 1',
      layer: stubLayer(1),
      map: {},
      children: [layer2, layer3]
    }
    layer1 = new NestedLayer(l1);

    l0 = {
      id: 0,
      name: 'Layer 0',
      layer: stubLayer(0),
      map: {},
      children: [layer1]
    }
    layer0 = new NestedLayer(l0);

    l4 = {
      id: 4,
      name: 'Layer 4',
      layer: stubLayer(4),
      map: {},
      children: []
    }
    layer4 = new NestedLayer(l4);

    layers = [layer0, layer4];
    h = new LayerHierarchy({layers});

    ownedLayer = h.makeLayer(layerData);
  } );

  it('should have default (configuration) options', () => {
    // expect(control.options).to.be.an('object').that.is.not.empty;
    expect(h.options).to.have.all.keys([
      'followAncestorVisibility',
      'followAncestorMutability',
      'propogateDeselectToChildren'
    ]);
  });

  it('should be able to make layers with a factory method', () => {
    expect(ownedLayer).to.be.an.instanceOf(NestedLayer);
  });

  it('should be able to check if it owns a layer', () => {
    expect(ownedLayer.owner).to.equal(h);
    expect(ownedLayer.isOwnedBy(h)).to.be.true;

    const nonOwner = {};
    expect(ownedLayer.owner).to.not.equal(nonOwner);
    expect(ownedLayer.isOwnedBy(nonOwner)).to.be.false;
  });

  it('should be able to get layers by id', () => {
    expect(h.getLayerByID(0), 'hierarchy getLayerByID').to.equal(layer0);
    expect(h.getLayerByID(1), 'hierarchy getLayerByID').to.equal(layer1);
    expect(h.getLayerByID(2), 'hierarchy getLayerByID').to.equal(layer2);
    expect(h.getLayerByID(3), 'hierarchy getLayerByID').to.equal(layer3);
    expect(h.getLayerByID(4), 'hierarchy getLayerByID').to.equal(layer4);
  });

  it('should not be able to add non-NestedLayer layers', () => {
    const badLayer = {};
    expect(() => {
      h.addLayer(badLayer);
    }).to.throw(TypeError, 'NestedLayer');
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

  it('should ensure that layers it adds at the root level are owned by it', () => {
    h.addLayer(l);
    expect(l.isOwnedBy(h)).to.be.true;
  });

  it('should ensure that layers it adds below the root level are owned by it', () => {
    h.addLayer(l, layer0.id)
    expect(l.isOwnedBy(h)).to.be.true;
  });

  it('should own all layers it was created with', () => {
    expect(layer0.isOwnedBy(h)).to.be.true;
    // expect(layer1.isOwnedBy(h)).to.be.true;
    // expect(layer2.isOwnedBy(h)).to.be.true;
    // expect(layer3.isOwnedBy(h)).to.be.true;
    // expect(layer4.isOwnedBy(h)).to.be.true;
  })

  it('should have valid enabled states upon creation', () => {
    // use a customized subset of the fixtures for this test
    // layers 1 and 2 are enabled and children of layer 0, which is disabled
    // layer 3 is enabled and a child of layer 2
    // layer 4 is disabled and a child of layer 2
    // at the start of the test
    l3.enabled = true;
    layer3 = new NestedLayer(l3);
    l4.enabled = false;
    layer4 = new NestedLayer(l4);
    l1.children = [];
    l2.children = [layer3, layer4];
    l1.enabled = l2.enabled = true;
    layer1 = new NestedLayer(l1);
    layer2 = new NestedLayer(l2);
    l0.children = [layer1, layer2];
    l0.enabled = false;
    layer0 = new NestedLayer(l0);
    layers = [layer0];
    let hierarchy = new LayerHierarchy({layers});

    // the constructor should have validated the enabled state of all the layers
    // layers 1 and 2 shoud now be disabled

    expect(layer1.disabled).to.be.true;
    expect(layer2.disabled).to.be.true;
    expect(layer3.disabled).to.be.true;
    expect(layer4.disabled).to.be.true;
  });

} );
