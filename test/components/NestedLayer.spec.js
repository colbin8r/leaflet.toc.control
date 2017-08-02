/*global describe, expect, it, beforeEach*/
import React from 'react';
import sinon from 'sinon';
import { mount, render, shallow } from 'enzyme';

import {root3 as layer} from '../fixtures/smalltree';
import NestedLayer from '../../src/components/NestedLayer';

describe('<NestedLayer />', () => {
  let wrapper;
  let toggleSelectedSpy;

  before(() => {
    toggleSelectedSpy = sinon.spy((layer) => {
      // BAD PRACTICE because it does not use setState
      layer.toggleSelected();
    });
    wrapper = shallow(<NestedLayer layer={layer} toggleSelected={toggleSelectedSpy} />);
  })

  it('should display the layer name', () => {
    expect(wrapper.find('.layer-name')).to.contain.text(layer.name);
  })

  it('should have a .leaf class', () => {
    expect(wrapper).to.have.className('leaf');
  })

  it('should have a .enabled class if it is enabled', () => {
    layer.enable();
    let w = shallow(<NestedLayer layer={layer} />);

    expect(w).to.have.className('enabled');
  })

  it('should have a .disabled class if it is disabled', () => {
    layer.disable();
    let w = shallow(<NestedLayer layer={layer} />);

    expect(w).to.have.className('disabled');
  })

  it('should have a .selected class if it is selected', () => {
    layer.select();
    let w = shallow(<NestedLayer layer={layer} />);

    expect(w).to.have.className('selected');
  })

  it('should have a .deselected class if it is deselected', () => {
    layer.deselect();
    let w = shallow(<NestedLayer layer={layer} />);

    expect(w).to.have.className('deselected');
  })

  it('should have a checked checkbox if it is selected', () => {
    layer.select();
    let w = shallow(<NestedLayer layer={layer} />);

    expect(w.find('input[type="checkbox"]')).to.be.checked();
  })

  it('should have an unchecked checkbox if it is deselected', () => {
    layer.deselect();
    let w = shallow(<NestedLayer layer={layer} />);

    expect(w.find('input[type="checkbox"]')).to.not.be.checked();
  })

  it('should toggle its selected state when the checkbox is clicked', () => {
    const initiallySelected = layer.selected;
    wrapper.find('input[type="checkbox"]').simulate('change');
    expect(toggleSelectedSpy).to.have.been.calledOnce;
    expect(layer.selected).to.equal(!initiallySelected);
  })

  it('should render a NestedLayer for each child', () => {
    expect(wrapper).to.have.exactly(layer.children.length).descendants(NestedLayer);
  })
})
