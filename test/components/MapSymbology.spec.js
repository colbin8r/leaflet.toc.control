/*global describe, expect, it, beforeEach*/
import React from 'react';
import sinon from 'sinon';
import { mount, render, shallow } from 'enzyme';

import fixture, * as fixtures from '../fixtures/symbology';
import MapSymbology from '../../src/components/MapSymbology';
import MapSymbol from '../../src/components/MapSymbol';

describe('<MapSymbology />', () => {
  let wrapper;

  before(() => {
    wrapper = shallow(<MapSymbology symbology={fixture} />);
  })

  it('should have a .symbology class', () => {
    expect(wrapper).to.have.className('symbology');
  })

  it('should have a MapSymbol for each symbol', () => {
    const length = fixture.symbols.length;
    expect(wrapper).to.have.exactly(length).descendants(MapSymbol);
  })

})
