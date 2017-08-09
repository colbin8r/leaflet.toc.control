/*global describe, expect, it, beforeEach*/
import React from 'react';
import sinon from 'sinon';
import { mount, render, shallow } from 'enzyme';

import symbology, * as fixtures from '../fixtures/symbology';
import MapSymbol from '../../src/components/MapSymbol';

describe('<MapSymbol />', () => {
  let wrapper, fixture;

  before(() => {
    fixture = fixtures.symbol0;
    wrapper = shallow(<MapSymbol symbol={fixture} />);
  })

  it('should have a .symbol class', () => {
    expect(wrapper).to.have.className('symbol');
  })

  describe('swatch', () => {
    let img;

    before(() => {
      img = wrapper.find('img');
    })

    it('should have the proper width and height', () => {
      const unit = 'px';
      const width = fixture.width+unit;
      const height = fixture.height+unit;
      expect(img).to.have.style('width', width);
      expect(img).to.have.style('height', height);
    })

    it('should have the correct base64 URI as the src', () => {
      expect(img).to.have.attr('src', fixture.base64URI);
    })

    it('should have the .swatch class', () => {
      expect(img).to.have.className('swatch');
    })
  })

  describe('label', () => {
    let span;

    before(() => {
      span = wrapper.find('span');
    })

    it('should have the .label class', () => {
      expect(span).to.have.className('label');
    })

    it('should have the label text', () => {
      expect(span).to.have.text(fixture.label);
    })
  })

})
