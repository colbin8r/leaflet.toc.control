/*global describe, expect, it, beforeEach*/
import Symbology from './../src/Leaflet.TOC.Symbology';

describe.skip('Symbology', () => {

  let sym;
  const fixture = {
    label: 'ADVERTISED',

  }

  beforeEach(() => {
    sym = new Symbology();
  })

  it('should pass', () => {
    expect(sym).to.be.null;
  })

  describe('getters and setters', () => {
    describe('label', () => {
      it('should be able to get a label')
    })
  })
})
