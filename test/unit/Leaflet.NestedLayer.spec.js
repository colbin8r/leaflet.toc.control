/*global describe, expect, it, beforeEach*/
import NestedLayer from './../../src/Leaflet.NestedLayer';

import sinon from 'sinon';

describe( 'NestedLayer', () => {

  function stubLayer(id) {
    return {
      id,
      addTo: function() {},
      removeFrom: function() {},
      remove: function() {}
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

  it('should not detach from the map if it is already detached', () => {
    l.select();
    l.deselect();
    l.deselect();
    expect(layerRemoveSpy.calledOnce).to.be.true;
  });

} );
