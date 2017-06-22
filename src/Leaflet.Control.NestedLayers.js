import L from 'leaflet-headless';

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import LayerHierarchy from './Leaflet.LayerHierarchy';
import NestedLayer from './Leaflet.NestedLayer';

export class NestedLayersComponent extends React.Component {
  constructor(props) {
    super(props);
    // primary prop is 'hierarchy', an instance of Leaflet.LayerHierarchy
  }

  makeComponentFromLayer(layer) {
    // recursive function
    // 'leaf' is the base case

    // branch: this layer has children
    if (layer.children.length < 0) {
      // recursively calls this function on each child (leaf)
      // 'leaves' will be an array of JSX components (NestedLayerComponent) for each child (leaf)
      const leaves = layer.children.map(this.makeComponentFromLayer);

      return (
        <NestedLayerComponent l={layer}>
          <ul className="branch">
            {leaves}
          </ul>
        </NestedLayerComponent>
      );
    } else {
    // leaf: this layer is just a leaf
      return (
        <NestedLayerComponent l={layer} key={layer.id} />
      )
    }
  }

  render() {
    let roots = this.props.hierarchy.getRootLayers();
    let components = [];

    for (let i = 0; i < roots.length; i++) {
      components.push(this.makeComponentFromLayer(roots[i]));
    }

    return (
      <div className="nested-layer-control-container">
        TOC CONTROL
        {components}
      </div>
    );
  }
}

export class NestedLayerComponent extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {date: new Date()};
  }

  static propTypes = {
    l: PropTypes.instanceOf(NestedLayer).isRequired
  }

  toggleSelected = () => {
    debugger;
    this.props.l.toggleSelected();
  }

  render() {
    return (
      <li className="leaf" onClick={this.toggleSelected}>
        <input type="checkbox" value={this.props.l.selected} />
        {this.props.l.swatch.length > 0 &&
          <img src="data:{this.props.l.swatch}" className="swatch" />
        }
        <span className="layer-name">{this.props.l.name}</span>

        {this.props.children}
      </li>
    );
  }
}

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


