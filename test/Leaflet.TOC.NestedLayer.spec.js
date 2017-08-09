/*global describe, expect, it, beforeEach*/
import NestedLayer, { generateID } from './../src/Leaflet.TOC.NestedLayer';
import fixtureGen from './fixtures/smalltree-custom';

import L from 'leaflet-headless';
import sinon from 'sinon';

describe('#generateID', () => {
  it('should return numbers', () => {
    expect(generateID()).to.be.a('number');
  })

  it('shouldn\'t generate the same ID twice', () => {
    const a = generateID(), b = generateID();
    expect(a).to.not.equal(b);
  })
})

describe('NestedLayer', () => {
  let l;
  let layerStub = sinon.createStubInstance(L.Layer);
  let mapStub = sinon.createStubInstance(L.Map);

  beforeEach(() => {
    l = new NestedLayer(666, 'Layer 666', layerStub, mapStub);
  })

  it('should have accessible properties', () => {
    expect(l).to.have.property('layerID');
    expect(l).to.have.property('name');
    expect(l).to.have.property('enabled');
    expect(l).to.have.property('selected');
    expect(l).to.have.property('layer');
    expect(l).to.have.property('children');
    expect(l).to.have.property('parent');
    expect(l).to.have.property('symbology');
    expect(l).to.have.property('minZoom');
    expect(l).to.have.property('maxZoom');
    expect(l).to.have.property('rules');
    expect(l).to.have.property('id');
  })

  describe('#constructor', () => {
    it('should throw errors when missing required arguments', () => {
      const layerID = 999;
      const name = 'Layer 999';
      expect(function() {
        new NestedLayer(undefined, name, layerStub, mapStub);
      }).to.throw('layer ID');

      expect(function() {
        new NestedLayer(layerID, undefined, layerStub, mapStub);
      }).to.throw('name');

      expect(function() {
        new NestedLayer(layerID, name, undefined, mapStub);
      }).to.throw('layer object');

      expect(function() {
        new NestedLayer(layerID, name, layerStub, undefined);
      }).to.throw('map object');
    })

    it('should have defaults for optional arguments', () => {
      expect(l.parent).to.equal(l.defaults.parent);
      // .equal tests referential equality (===)
      // .eql tests deep equality
      // http://chaijs.com/api/bdd/#method_eql
      expect(l.children).to.eql(l.defaults.children);
      expect(l.symbology).to.eql(l.defaults.symbology);
      expect(l.enabled).to.equal(l.defaults.enabled);
      expect(l.selected).to.equal(l.defaults.selected);
      expect(l.zoom).to.equal(l.defaults.zoom);
    })
  })

  describe('#enabled', () => {
    before(() => {
      l = new NestedLayer(666, 'Layer 666', layerStub, mapStub, {
        rules: {
          enableTriggersAttach: true,
        }
      });
    })

    beforeEach(() => {
      sinon.spy(l, '_attach');
      sinon.spy(l, '_detach');
    })

    afterEach(() => {
      l._attach.restore();
      l._detach.restore();
    })

    it('should detach when disabled', () => {
      l.disable();
      expect(l.disabled).to.be.true;
      expect(l._detach).to.have.been.called;
    })

    it('should attach when enabled and selected and enableTriggersAttach is true', () => {
      l.select();
      l.enable();
      expect(l.enabled).to.be.true;
      expect(l.selected).to.be.true;
      expect(l.rules.enableTriggersAttach).to.be.true;
      expect(l._attach).to.have.been.called;
    })
  })

  describe('#selected', () => {
    it('should be deselected when selected but disabled and alwaysDeselectedWhenDisabled is true', () => {
      l = new NestedLayer(666, 'Layer 666', layerStub, mapStub, {
        rules: {
          alwaysDeselectedWhenDisabled: true
        }
      });

      l.select();
      l.disable();
      expect(l.disabled).to.be.true;
      expect(l.rules.alwaysDeselectedWhenDisabled).to.be.true;
      expect(l.deselected).to.be.true;
    })

    it('should always return the selected state when alwaysDeselectedWhenDisabled is false', () => {
      l = new NestedLayer(666, 'Layer 666', layerStub, mapStub, {
        rules: {
          alwaysDeselectedWhenDisabled: false
        }
      });

      l.select();
      l.disable();
      expect(l.selected).to.be.true;
      l.enable();
      expect(l.selected).to.be.true;

      l.deselect();
      l.disable();
      expect(l.deselected).to.be.true;
      l.enable();
      expect(l.deselected).to.be.true;
    })

    it('should disable children when deselected and disableDescendentsWhenDeselected is true', () => {
      const options = {
        rules: {
          disableDescendentsWhenDeselected: true
        }
      }

      let fixtures = fixtureGen(options);
      let fixture = fixtures.parent;
      fixture.deselect();

      expect(fixture.rules.disableDescendentsWhenDeselected).to.be.true;
      expect(fixture.deselected).to.be.true;
      fixture.children.forEach((child) => {
        expect(child.disabled).to.be.true;
      });

    })
  })

  describe('#children', () => {
    let child1, child2;

    before(() => {
      child1 = new NestedLayer(777, 'Layer 777', layerStub, mapStub);
      child2 = new NestedLayer(888, 'Layer 888', layerStub, mapStub);
    })

    it('should be able to add children', () => {
      l.addChild(child1);
      l.addChild(child2);
      expect(l.children).to.contain(child1);
      expect(l.children).to.contain(child2);
    })

    it('should only be able to add NestedLayers as children', () => {
      const badChild = {};
      expect(() => {
        l.addChild(badChild);
      }).to.throw('NestedLayer');
    })

    it('#hasChildren', () => {
      expect(l.hasChildren).to.be.false;

      l.addChild(child1);
      expect(l.hasChildren).to.be.true;
    })
  })

})
