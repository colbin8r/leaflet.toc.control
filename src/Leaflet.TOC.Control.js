import { defaults } from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';

import LeafletTOC from './components/LeafletTOC';

export default class Control {

  static _defaults = {
    title: 'Layers'
  }

  get defaults() {
    // uses reflection to return the static _defaults property on the class
    return this.constructor._defaults;
  }

  constructor(layers, element, options) {
    // save arguments
    this._layers = layers;
    this._element = element;

    // set initial state
    this._options = {};
    defaults(this._options, options, this.defaults);
    this._component = <LeafletTOC layers={this.layers} title={this.options.title} />

    this.attach();
  }

  // all properties are get-only from the outside
  get layers() {
    return this._layers;
  }
  get element() {
    return this._element;
  }
  get options() {
    return this._options;
  }
  get component() {
    return this._component;
  }
  get isAttached() {
    return this._isAttached;
  }

  // bind to the DOM
  attach() {
    if (!this.isAttached) {
      ReactDOM.render(
        this.component,
        this.element
      );
    }
    this._isAttached = true;
  }

  detach() {
    if (this.isAttached) {
      ReactDOM.unmountComponentAtNode(this.element);
    }
    this._isAttached = false;
  }

}
