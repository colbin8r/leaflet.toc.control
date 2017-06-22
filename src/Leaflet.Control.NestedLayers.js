import L from 'leaflet-headless';

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import LayerHierarchy from './Leaflet.LayerHierarchy';
import NestedLayer from './Leaflet.NestedLayer';

export class NestedLayersComponent extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {date: new Date()};
  }

  render() {
    return (
      <div>

      </div>
    );
  }
}

export class NestedLayerComponent extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {date: new Date()};
  }

  render() {
    return (
      <li className="leaf" onClick={this.props.l.toggleSelected}>
        <input type="checkbox" />
        {this.props.l.swatch.length > 0 &&
          <img src="data:{this.props.l.swatch}" className="swatch" />
        }
        <span className="layer-name">{this.props.l.name}</span>
      </li>
    );
  }
}

NestedLayerComponent.propTypes = {
  l: PropTypes.instanceOf(NestedLayer).isRequired
};

export default class NestedLayers {

  /*
   * NestedLayers plugin
   *
   * Required Arguments
   * hierarchy: LayerHierarchy object to represent; create this with L.layerHierarchy
   * element: DOM element to attach to and render in
   *
   * Options
   * n/a
   */
  constructor(hierarchy, element, options) {
    if (typeof hierarchy == 'undefined') {
      throw new Error('Missing hierarchy when creating NestedLayers control');
    }
    this.hierarchy = hierarchy;
    if (typeof element == 'undefined') {
      throw new Error('Missing element when creating NestedLayers control');
    }
    this.element = element;

    // save the options
    this._options = {};
    Object.assign(this._options, options);

    this._component = <NestedLayersComponent hierarchy={this.hierarchy} />

    this._isAttached = false;

    // bind to the DOM
    this.attach();
  }

  get hierarchy() {
    return this._hierarchy;
  }
  // shorthand convenience accessor
  get h() {
    return this.hierarchy;
  }
  set hierarchy(val) {
    this._hierarchy = val;
  }

  get element() {
    return this._element;
  }
  // shorthand convenience accessor
  get el() {
    return this.element;
  }
  set element(val) {
    this._element = val;
  }

  get component() {
    return this._component;
  }
  // short convenience accessor
  get c() {
    return this.component;
  }
  // no direct setting of 'component' from outside the class

  get isAttached() {
    return this._isAttached;
  }
  // no direct setting of 'isAttached' from outside the class
  // the attach() and detach() methods handle this state

  // bind to DOM
  attach() {
    if (!this.isAttachedz) {
      ReactDOM.render(
        this.component,
        this.element
      );
    }
    this._isAttached = true;
  }

  // unbind from DOM
  detach() {
    if (this.isAttached) {
      ReactDOM.unmountComponentAtNode(this.element);
    }
    this._isAttached = true;
  }

}


