// import colors from 'colors';

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import LayerHierarchy from './Leaflet.LayerHierarchy';
import NestedLayer from './Leaflet.NestedLayer';
import classnames from 'classnames';

export class NestedLayersComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hierarchy: this.props.hierarchy
    }
  }

  static propTypes = {
    hierarchy: PropTypes.instanceOf(LayerHierarchy).isRequired
  }

  makeLayerKey(layer) {
    return (layer.id.toString + layer.name);
  }

  handleToggleSelected = (layer) => {
    const id = layer.id;
    const newHierarchy = this.state.hierarchy;
    newHierarchy.getLayerByID(id).toggleSelected();
    this.setState({
      hierarchy: newHierarchy
    });
  }

  makeComponentFromLayer = (layer) => {
    // recursive function
    // 'leaf' is the base case
    // property initializer syntax + arrow function keeps the scope of 'this' through recursive calls
    let componentChildren;

    // branch: this layer has children
    if (layer.children.length > 0) {
      // leaves = layer.children.map(this.makeComponentFromLayer)
      componentChildren = (
        <ul className="branch">
          {layer.children.map(this.makeComponentFromLayer)}
        </ul>
      );
    }

    return (
      <NestedLayerComponent layer={layer} onToggleSelected={this.handleToggleSelected} key={this.makeLayerKey(layer)}>
        {componentChildren}
      </NestedLayerComponent>
    );

    // // branch: this layer has children
    // if (layer.children.length > 0) {
    //   // recursively calls this function on each child (leaf)
    //   // 'leaves' will be an array of JSX components (NestedLayerComponent) for each child (leaf)
    //   const leaves = layer.children.map(this.makeComponentFromLayer);

    //   return (
    //     <NestedLayerComponent layer={layer} onToggleSelected={this.handleToggleSelected} key={this.makeLayerKey(layer)}>
    //       <ul className="branch">
    //         {leaves}
    //       </ul>
    //     </NestedLayerComponent>
    //   );
    // } else {
    // // leaf: this layer is just a leaf

    //   return (
    //     <NestedLayerComponent layer={layer} onToggleSelected={this.handleToggleSelected} key={this.makeLayerKey(layer)} />
    //   )
    // }
  }

  render() {
    const roots = this.state.hierarchy.rootLayers;
    let components = [];

    for (let i = 0; i < roots.length; i++) {
      components.push(this.makeComponentFromLayer(roots[i]));
    }

    return (
      <div className="nested-layer-control-container">
        <h2>TOC CONTROL</h2>
        <ul className="branch nested-layer-control">
          {components}
        </ul>
      </div>
    );
  }
}

export class NestedLayerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static propTypes = {
    layer: PropTypes.instanceOf(NestedLayer).isRequired,
    onToggleSelected: PropTypes.func.isRequired,
    children: PropTypes.any
  }

  toggleSelected = () => {
    // updates both the component state and the LayerHierarchy structure
    this.props.onToggleSelected(this.props.layer);
  }

  getSwatch = () => {
    return 'data:image/png;base64,' + this.props.layer.swatch;
  }

  render() {
    const itemClassNames = classnames({
      leaf: true,
      enabled: this.props.layer.enabled,
      disabled: this.props.layer.disabled
    });
    return (
      <li className={itemClassNames}>
        <input type="checkbox" checked={this.props.layer.selected} />
        {this.props.layer.swatch.length > 0 &&
          <img src={this.getSwatch()} className="swatch" />
        }
        <span className="layer-name" onClick={this.toggleSelected}>{this.props.layer.name}</span>

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
      throw new Error('Missing DOM element when creating NestedLayers control');
    }
    this.element = element;

    // default options
    this._options = {
      // deselecting any ancestor makes its children invisible (without changing their selected state)
      followAncestorVisibility: true,

      // deselecting a parent also deselects children (by changing their state)
      propogateDeselectToChildren: false,

      // deselecting any ancestor disables its children (cannot change children's selected state)
      followAncestorMutability: true
    };

    // overwrite defaults with passed options
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

  get isAttached() {
    return this._isAttached;
  }
  // no direct setting of 'isAttached' from outside the class
  // the attach() and detach() methods handle this state

  get options() {
    return this._options;
  }

  // bind to DOM
  attach() {
    if (!this.isAttached) {
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


