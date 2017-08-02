/*global describe, expect, it, beforeEach*/
import React from 'react';
import { mount, render, shallow } from 'enzyme';

import tree, * as fixtures from '../fixtures/smalltree';
import LeafletTOC from '../../src/components/LeafletTOC';
import NestedLayer from '../../src/components/NestedLayer';

describe('<LeafletTOC />', () => {

  let wrapper;
  const title = 'Example Table of Contents Control';

  before(() => {
    wrapper = shallow(<LeafletTOC layers={tree} title={title} />);
  })

  it('should display a title', () => {
    expect(wrapper).to.have.exactly(1).descendants('h2');
    expect(wrapper.find('h2')).to.contain.text(title);
  })

  it('should have a branch with class .branch', () => {
    expect(wrapper.find('ul')).to.have.className('branch');
  })

  it('should have a NestedLayer component for each root-level layer', () => {
    expect(wrapper).to.have.exactly(tree.length).descendants(NestedLayer);
  })

})
