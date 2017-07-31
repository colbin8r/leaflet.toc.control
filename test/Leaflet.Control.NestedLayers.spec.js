/*global describe, expect, it, beforeEach*/
import NestedLayers from './../src/Leaflet.Control.NestedLayers';
import LayerHierarchy from './../src/Leaflet.LayerHierarchy';

import jsdom from 'jsdom';

// describe('TOCComponent', () => {

// })

// describe('NestedLayerComponent', () => {

// })

// describe('NestedLayers Plugin', () => {

// })

describe( 'NestedLayers', () => {

  let control, h, el;
  const { JSDOM } = jsdom;

  beforeEach(() => {
    h = new LayerHierarchy();
    el = JSDOM.fragment('<div id="test-element"></div>');
    control = new NestedLayers(h, el);
  });

  afterEach(() => {
    control.detach();
  });

  it('should have required arguments on construction', () => {
    expect(() => {
      let invalidControl = new NestedLayers(undefined, undefined);
    }).to.throw();
    expect(() => {
      let invalidControl = new NestedLayers(undefined, el);
    }).to.throw('hierarchy');
    expect(() => {
      let invalidControl = new NestedLayers(h, undefined);
    }).to.throw('element');
  });

  it('should have default (configuration) options', () => {
    // expect(control.options).to.be.an('object').that.is.not.empty;
    expect(control.options).to.have.all.keys([
      'followAncestorVisibility',
      'followAncestorMutability',
      'propogateDeselectToChildren'
    ]);
  });



  // it('should have better tests written', () => {
  //   let betterTestsWritten = false;
  //   expect(betterTestsWritten).to.be.true;
  // });

} );
