import MapSymbol from './../src/Leaflet.TOC.MapSymbol';

describe('MapSymbol', () => {

  const data = {
    label: 'Example Symbol',
    height: 20,
    width: 20,
    contentType: 'image/png',
    imageData: 'iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAOlJREFUOI3t0L0rxAEYB/DP6dwtokjeBnWOARkuUpKsBibj/QfKYjfL/2DGLONRKItB8ktdsQhHksXgJWeU+N397sXEMz4938/z9MTVueL/4K+BnRGyd3iPBLYmXWenvYRJuROJ4EY3CpHA8bTiSlby/Ns46S6W1xWD7Z+Xhf7w4YnNAyYGP3t7pyzOhiXKgDDaz+sbFwUGesikSmNlQchfsTDDWo6OljqAmT429hnp5faxRnA3YCxFopHLew7zTA5VCbY3szT3tTc1TFtTFeBOoGF+NTx0dCZWEfhMbOu49CUVgbXUHwQ/AJz+MYUp0l0SAAAAAElFTkSuQmCC',
    relativeURL: '4aca38282739050a6567dfb7ae26e9c7'
  };
  const base64URI = 'data:'+data.contentType+';base64,'+data.imageData;
  let symbol;

  before(() => {
    symbol = new MapSymbol(data);
  })

  describe('#label', () => {
    it('should be able to get the label', () => {
      expect(symbol.label).to.be.a('string').and.to.equal(data.label);
    });
  })

  describe('#height', () => {
    it('should be able to get the height', () => {
      expect(symbol.height).to.be.a('number').and.to.equal(data.height);
    });
  })

  describe('#width', () => {
    it('should be able to get the width', () => {
      expect(symbol.width).to.be.a('number').and.to.equal(data.width);
    });
  })

  describe('#contentType', () => {
    it('should be able to get the contentType', () => {
      expect(symbol.contentType).to.be.a('string').and.to.equal(data.contentType);
    });
  })

  describe('#iamgeData', () => {
    it('should be able to get the imageData', () => {
      expect(symbol.imageData).to.be.a('string').and.to.equal(data.imageData);
    });
  })

  describe('#relativeURL', () => {
    it('should be able to get the relativeURL', () => {
      expect(symbol.relativeURL).to.be.a('string').and.to.equal(data.relativeURL);
    });
  })

  describe('#base64URI', () => {
    it('should be able to a string suitable for embedding the symbology in an image tag\'s src attribute', () => {
      expect(symbol.base64URI).to.be.a('string').and.to.equal(base64URI);
    });
  })


})

