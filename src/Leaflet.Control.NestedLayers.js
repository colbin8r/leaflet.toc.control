// import chalk from 'chalk';

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import LayerHierarchy from './Leaflet.LayerHierarchy';
import NestedLayer from './Leaflet.NestedLayer';
import classnames from 'classnames';

/**
 * React component to represent a LayerHierarchy
 * @param {object} props The component's props.
 * @param {LayerHierarchy} props.hierarchy The LayerHierarchy the component displays.
 */
export class NestedLayersComponent extends React.Component {
  /**
   * @param {object} props The component's props.
   * @param {LayerHierarchy} props.hierarchy The LayerHierarchy the component displays.
   */
  constructor(props) {
    super(props);
    this.state = {
      hierarchy: this.props.hierarchy
    }
  }

  /**
   * Describes the React props object
   * @type {Object}
   */
  static propTypes = {
    hierarchy: PropTypes.instanceOf(LayerHierarchy).isRequired
  };

  /**
   * Generates a unique key for rendering a layer in JSX
   * @param  {NestedLayer} layer The layer to use data from
   * @return {string}       A string unique to this layer
   */
  makeLayerKey(layer) {
    return (layer.id.toString + layer.name);
  }

  /**
   * Event handler to toggle a layer's selected state
   * @param  {NestedLayer} layer The layer to toggle
   */
  handleToggleSelected = (layer) => {
    const id = layer.id;
    const newHierarchy = this.state.hierarchy;
    newHierarchy.getLayerByID(id).toggleSelected();
    this.setState({
      hierarchy: newHierarchy
    });
  }

  /**
   * Recursively renders a NestedLayer using NestedLayerComponent. If the NestedLayer has
   * children, use this function as it not only renders a single NestedLayer, but also the subtree
   * of layers under the NestedLayer recursively.
   * @param  {NestedLayer} layer The layer to represent with a React component
   * @return {NestedLayerComponent}       A react component representing the given NestedLayer.
   */
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

  }

  /**
   * Renders the component
   * @return {Component} JSX
   */
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

/**
 * React Component to represent a single NestedLayer
 * @param {object} props Component properties
 * @param {NestedLayer} props.layer The layer to represent
 * @param {function} props.onToggleSelected The callback to change the layer's selected state
 */
export class NestedLayerComponent extends React.Component {
  /**
   * @param {object} props Component properties
   * @param {NestedLayer} props.layer The layer to represent
   * @param {function} props.onToggleSelected The callback to change the layer's selected state
   */
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * Describes the React props object
   * @type {Object}
   */
  static propTypes = {
    layer: PropTypes.instanceOf(NestedLayer).isRequired,
    onToggleSelected: PropTypes.func.isRequired,
    children: PropTypes.any
  };

  /**
   * Calls the toggle selected state handler passed by the parent to change the selected state of
   * the layer
   */
  toggleSelected = () => {
    // updates both the component state and the LayerHierarchy structure
    this.props.onToggleSelected(this.props.layer);
  }

  /**
   * Returns a data URL suitable for use in a the src of an <img /> that contains the base 64
   * encoded layer swatch
   * @return {string} data URL containing the swatch
   */
  getSwatch = () => {
    return 'data:image/png;base64,' + this.props.layer.swatch;
  }

  /**
   * Renders the component
   * @return {Component} JSX
   */
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

/**
 * Leaflet plugin to display a hierarchial version of {@link http://leafletjs.com/reference-1.1.0.html#control-layers L.Control.Layers}. Uses React to wrap the
 * NestedLayersComponent.
 * @param  {LayerHierarchy} hierarchy The hierarchy to display in the control
 * @param  {Element} element   The DOM element to bind the control to
 * @param  {object} options   Configuration options that dictate how the control should behave
 */
export default class NestedLayers {

  /**
   * Initialize the plugin and {@link #NestedLayers#attach attaches} to the DOM.
   * @param  {LayerHierarchy} hierarchy The hierarchy to display in the control
   * @param  {Element} element   The DOM element to bind the control to
   * @param  {object} options   Configuration options that dictate how the control should behave
   * @param  {boolean} [options.followAncestorVisibility=true] Deselecting any ancestor makes its
   * children invisible (without changing their selected state)
   * @param {boolean} [options.propogateDeselectToChildren=false] Deselecting a parent also deselects
   * children (by changing their state)
   * @param {boolean} [options.followAncestorMutability=true] Deselecting any ancestor disables its
   * children (cannot change children's selected state)
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
      followAncestorVisibility: true,
      propogateDeselectToChildren: false,
      followAncestorMutability: true
    };

    // overwrite defaults with passed options
    Object.assign(this._options, options);

    this._component = <NestedLayersComponent hierarchy={this.hierarchy} />

    this._isAttached = false;

    // bind to the DOM
    this.attach();
  }

  /**
   * The underlying hierarchy of layers the plugin visually represents
   * @type {LayerHierarchy}
   */
  get hierarchy() {
    return this._hierarchy;
  }
  /**
   * Shorthand accessor for the {@link #NestedLayers#hierarchy hierarchy} property
   */
  get h() {
    return this.hierarchy;
  }
  set hierarchy(val) {
    this._hierarchy = val;
  }

  /**
   * The DOM element that the control attaches to
   * @type {Element}
   */
  get element() {
    return this._element;
  }
  /**
   * Shorthand accessor for the {@link #NestedLayers#element element} property
   */
  get el() {
    return this.element;
  }
  set element(val) {
    this._element = val;
  }

  /**
   * The React component under the hood
   * @type {NestedLayersComponent}
   */
  get component() {
    return this._component;
  }

  /**
   * True if the plugin has attached itself to the DOM element
   * @type {boolean}
   */
  get isAttached() {
    return this._isAttached;
  }
  // no direct setting of 'isAttached' from outside the class
  // the attach() and detach() methods handle this state

  /**
   * Configuration options
   * @type {object}
   */
  get options() {
    return this._options;
  }

  /**
   * Bind to the DOM. Internally, it checks to see if it has already been attached, and if not,
   * uses React to render the {@link #NestedLayers#component component} to the specified {@link
   * #NestedLayers#element element}.
   */
  attach() {
    if (!this.isAttached) {
      ReactDOM.render(
        this.component,
        this.element
      );
    }
    this._isAttached = true;
  }

  /**
   * Unbind from the DOM. Releases the {@link #NestedLayers#element element} for reuse.
   */
  detach() {
    if (this.isAttached) {
      ReactDOM.unmountComponentAtNode(this.element);
    }
    this._isAttached = true;
  }

}
