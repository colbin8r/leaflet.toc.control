/*global describe, expect, it, beforeEach*/
import NestedLayer from './../src/Leaflet.NestedLayer';
import LayerHierarchy from './../src/Leaflet.LayerHierarchy';

import L from 'leaflet-headless';
import sinon from 'sinon';

describe( 'NestedLayer', () => {

  function stubLayer(id, options) {
    if (typeof options === 'undefined') {
      options = {};
    }
    return {
      id,
      addTo: function() {},
      removeFrom: function() {},
      remove: function() {},
      on: function() {},
      minZoom: options.minZoom,
      maxZoom: options.maxZoom
    }
  }

  // layer1 and layer2 are both children of layer0
  // l is for testing other non-nested layer features
  let l, l0, l1, l2, layer0, layer1, layer2,
      layerAddSpy, layerRemoveSpy;

  beforeEach(() => {
    l = new NestedLayer({
      id: 999,
      name: 'Layer 999',
      layer: stubLayer(999),
      map: {},
      enabled: true,
      selected: false
    });

    l1 = {
      id: 1,
      name: 'Layer 1',
      layer: stubLayer(1),
      map: {},
      children: []
    };
    l2 = {
      id: 2,
      name: 'Layer 2',
      layer: stubLayer(2),
      map: {},
      children: []
    }
    layer1 = new NestedLayer(l1);
    layer2 = new NestedLayer(l2);

    l0 = {
      id: 0,
      name: 'Layer 0',
      layer: stubLayer(0),
      map: {},
      children: [layer1, layer2]
    }
    layer0 = new NestedLayer(l0);

    layerAddSpy = sinon.spy(l.layer, 'addTo');
    layerRemoveSpy = sinon.spy(l.layer, 'removeFrom');
  });

  afterEach(() => {
    l._attach.restore;
    l._detach.restore;
  });

  it('should accept props on construction', () => {
    expect(layer1._props).to.have.property('id');
    expect(layer1._props).to.have.property('name');
    expect(layer1._props).to.have.property('layer');
    expect(layer1._props).to.have.property('children');
  });

  it('should have defaults for optional arguments in the constructor', () => {


    // children
    expect(l._props).to.have.property('children');
    expect(l.children).to.be.empty;

    // swatch
    expect(l._props).to.have.property('swatch');
    expect(l.swatch).to.equal('');

    // enabled + selected
    expect(l.enabled).to.be.true;
    expect(l.selected).to.be.false;
  });

  it('should throw errors when missing required arguments on construction', () => {
    expect(function() {
      new NestedLayer({
        name: 'Layer 999',
        layer: {id: 999},
        map: {}
      });
    }).to.throw('ID');

    expect(function() {
      new NestedLayer({
        id: 999,
        layer: {id: 999},
        map: {}
      });
    }).to.throw('name');

    expect(function() {
      new NestedLayer({
        id: 999,
        name: 'Layer 999',
        map: {}
      });
    }).to.throw('layer object');
    expect(function() {
      new NestedLayer({
        id: 999,
        name: 'Layer 999',
        layer: {id:999},
      });
    }).to.throw('map object');
  });

  it('should have a name', () => {
    expect(l.name).to.equal('Layer 999');
  })

  it('should be selectable', () => {
    l.select();
    expect(l.selected).to.be.true;
    expect(l.deselected).to.be.false;

    l.selected = true;
    expect(l.selected).to.be.true;
    expect(l.deselected).to.be.false;
  });

  it('should be deselectable', () => {
    l.deselect();
    expect(l.selected).to.be.false;
    expect(l.deselected).to.be.true;

    l.selected = false;
    expect(l.selected).to.be.false;
    expect(l.deselected).to.be.true;
  })

  it('should permit toggling the selected state', () => {
    l.selected = false;
    l.toggleSelected();
    expect(l.selected).to.be.true;
    expect(l.deselected).to.be.false;
  })

  it('should be enableable', () => {
    l.enable();
    expect(l.enabled).to.be.true;
    expect(l.disabled).to.be.false;

    l.enabled = true;
    expect(l.enabled).to.be.true;
    expect(l.disabled).to.be.false;
  });

  it('should be disableable', () => {
    l.disable();
    expect(l.enabled).to.be.false;
    expect(l.disabled).to.be.true;

    l.enabled = false;
    expect(l.enabled).to.be.false;
    expect(l.disabled).to.be.true;
  })

  it('should permit toggling the enabled state', () => {
    l.enabled = false;
    l.toggleEnabled();
    expect(l.enabled).to.be.true;
    expect(l.disabled).to.be.false;
  })

  it('should always be deselected if disabled', () => {
    l.disable();
    expect(l.selected).to.be.false;
    expect(l.deselected).to.be.true;

    l.select();
    expect(l.selected).to.be.false;
    expect(l.deselected).to.be.true;
  });

  it('should retain selected state if disabled then re-enabled', () => {
    l.select();
    l.disable();
    expect(l.selected).to.be.false;

    l.enable();
    expect(l.selected).to.be.true;

    l.deselect();
    l.disable();
    expect(l.selected).to.be.false;

    l.enable();
    expect(l.selected).to.be.false;
  });

  it('should know who its owner is', () => {
    expect(l.owner).to.be.undefined;

    const owner = new LayerHierarchy();
    l.owner = owner;
    expect(l.owner).to.equal(owner);
    expect(l.isOwnedBy(owner)).to.be.true;

    const nonOwner = {};
    expect(l.owner).to.not.equal(nonOwner);
    expect(l.isOwnedBy(nonOwner)).to.be.false;
  })

  it('should have access to its owner\'s configuration properties when owned', () => {
    // trying to fetch the options of an unowned layer should give null (no options)
    expect(layer0.options).to.be.null;

    const owner = new LayerHierarchy({ layers: [layer0] });
    expect(layer0.options).to.have.all.keys([
      'followAncestorVisibility',
      'followAncestorMutability',
      'propogateDeselectToChildren'
    ]);
  })

  it('should be able to add valid child layers', () => {
    expect(layer0.children).to.not.contain(l);

    layer0.addChild(l)
    expect(layer0.children).to.contain(l);

    // try adding an invalid child layer
    let notALayer = 42;
    expect(() => {
      layer0.addChild(notALayer);
    }).to.throw(TypeError);
  });

  it('should know if it has children', () => {
    expect(layer0.hasChildren).to.be.true;
    expect(layer1.hasChildren).to.be.false;
  })

  it('should be able to enable its children', () => {
    layer2.addChild(l);

    layer1.disable();
    layer2.disable();
    l.disable();

    layer0.enableChildren();

    expect(layer1.enabled).to.be.true;
    expect(layer2.enabled).to.be.true;

    layer1.enable();
    layer2.enable();

    expect(() => {
      layer0.enableChildren()
    }).to.not.throw();
  })

  it('should be able to disable its children', () => {
    layer2.addChild(l);

    layer1.enable();
    layer2.enable();
    l.enable();

    layer0.disableChildren();

    expect(layer1.disabled).to.be.true;
    expect(layer2.disabled).to.be.true;

    layer1.disable();
    layer2.disable();

    expect(() => {
      layer0.disableChildren()
    }).to.not.throw();
  })

  it('should be able to take ownership of all its children', () => {
    const owner = {};
    expect(layer0.owner).to.be.undefined;
    expect(layer1.owner).to.be.undefined;
    expect(layer2.owner).to.be.undefined;

    layer0.owner = owner;
    expect(layer0.isOwnedBy(owner)).to.be.true;
    // child layers are not owned until ownChildren() is called
    expect(layer1.owner).to.be.undefined;
    expect(layer2.owner).to.be.undefined;

    layer0.ownChildren();
    expect(layer0.isOwnedBy(owner)).to.be.true;
    expect(layer1.isOwnedBy(owner)).to.be.true;
    expect(layer2.isOwnedBy(owner)).to.be.true;
  })

  it('should attach to the map when selected', () => {
    l.select();
    expect(layerAddSpy.called).to.be.true;
  });

  it('should not attach to the map if it is already attached', () => {
    l.select();
    l.select();
    expect(layerAddSpy.calledOnce).to.be.true;
    expect(layerRemoveSpy.called).to.be.false;
  });

  it('should detach from the map when deselected', () => {
    // start by attaching it through selection
    l.select();
    l.deselect();
    expect(layerRemoveSpy.called).to.be.true;
  });

  it('should detach from the map when disabled', () => {
    l.select();
    l.disable();
    expect(layerRemoveSpy.called).to.be.true;
  })

  it('should re-attach to the map after being re-enabled (if selected)', () => {
    l.select(); // mark layer as "selected"
    l.disable(); // layer should persist selected state even when disabled
    l.enable(); // layer should remember that it was selected before it was disabled
    expect(layerAddSpy.callCount).to.equal(2); // layer should re-attach to the map
  })

  it('should not detach from the map if it is already detached', () => {
    l.select();
    l.deselect();
    l.deselect();
    expect(layerRemoveSpy.calledOnce).to.be.true;
  });

  it('should disable itself if the map is zoomed beyond its zoom boundaries', () => {
    const minZoom = 5, maxZoom = 15;
    const map = L.map(document.createElement('div')).setView([52, 4], 10);
    const layer = new NestedLayer({
      id: 888,
      name: 'Layer 888',
      layer: stubLayer(888, {minZoom, maxZoom}),
      map,
      enabled: true,
      selected: true
    });
    expect(layer.minZoom).to.equal(minZoom);
    expect(layer.maxZoom).to.equal(maxZoom);

    const removeSpy = sinon.spy(layer.layer, 'removeFrom');
    map.setZoom(4);
    expect(removeSpy.callCount).to.equal(1);

    map.setZoom(10); // this ensures the layer is reattached to the map
    map.setZoom(16);
    expect(removeSpy.callCount).to.equal(2);
  })

} );
