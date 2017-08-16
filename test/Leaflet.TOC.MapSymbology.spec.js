import MapSymbol from './../src/Leaflet.TOC.MapSymbol';
import MapSymbology from './../src/Leaflet.TOC.MapSymbology';
import fixture, * as fixtures from './fixtures/symbology';

describe('MapSymbology', () => {

  describe('#symbols', () => {
    let symbols;

    before(() => {
      symbols = fixture.symbols;
    })

    it('should be able to get the symbols', () => {
      expect(symbols).to.be.an('array');
    });

    it('should contain only MapSymbols', () => {
      symbols.forEach((symbol) => {
        expect(symbol).to.be.an.instanceof(MapSymbol);
      })
    })

    it('should know if it only has one symbol', () => {
      expect(fixture.isSingle).to.be.false;
    })
  })

})

