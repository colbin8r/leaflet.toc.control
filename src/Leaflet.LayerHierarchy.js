import NestedLayer from './Leaflet.NestedLayer';

export default class LayerHierarchy {
  constructor(options) {
    // for the layers parameter, ensure that we are at least passed an array
    // otherwise, default to empty array

    // default options
    this._options = {
      // 'layers' will be deleted by the end of the constructor
      layers: [],
      followAncestorVisibility: true,
      propogateDeselectToChildren: false,
      followAncestorMutability: true
    };

    // overwrite defaults with passed options
    Object.assign(this._options, options);

    // extract the 'layers' property from 'options' into its own property
    this._layers = this.options.layers;
    delete this._options.layers;

    this.validateEnabledStates();

    this.ownAllLayers(this.layers);
  }

  get options() {
    return this._options;
  }

  // adds a new NestedLayer object into the tree
  // defaults to insertion at the root of the tree, but with a parentID
  // you may insert underneath any other NestedLayer in the tree
  addLayer(layer, parentID) {
    // id, name, layer, defaultVisibility, minScale, maxScale, children
    // layer should be a NestedLayer

    if (!(layer instanceof NestedLayer)) {
      throw new TypeError('layer is not a NestedLayer');
    }

    // take ownership of the layer
    layer.owner = this;

    if (typeof parentID != 'undefined') {
      // add as child
      this.getLayerByID(parentID).addChild(layer);
    } else {
      // no parent, add at root level
      this._layers.push(layer);
    }
  }

  // looks up NestedLayer object by traversing the tree
  // when calling, do not pass a 'children' parameter
  getLayerByID(id, children) {

    // if the function was not called recursively
    if (!children) {
      children = this._layers;
    }

    for (let i = 0; i < children.length; i++) {

      // if the child matches
      if (children[i].id == id) {
        // return the child
        return children[i];

      } else {

        // if the child has its own children
        if (children[i].children && children[i].children.length > 0) {

          // reucrisvely check them
          let recursiveResult = this.getLayerByID(id, children[i].children);
          if (recursiveResult !== null) {
            return recursiveResult;
          }

        }
      }

    }

    // if execution reaches here, no layers in this tree or subtree have the requested id
    return null;
  }

  // getRootLayers() {
  //   return this._layers;
  // }

  get layers() {
    return this._layers;
  }
  get rootLayers() {
    return this.layers;
  }

  // check all the children to ensure that they are all enabled/disabled as appropriate
  // the highest layer takes precedence over lower layers
  // i.e. if a root-level layer is disabled, then all its children will be disabled as well
  // parameters should be undefined when called the first time; the function is recursive
  validateEnabledStates(layers, newEnabledValue) {
    // first call? then layers = the whole true
    if (typeof layers === 'undefined') {
      // console.log('validateEnabledStates: first call');
      layers = this.rootLayers;
    }

    for (let i = 0; i < layers.length; i++) {
      // console.log('validateEnabledStates: checking', layers[i].name);

      // if we have a specific enabled value, set the children to that
      if (typeof newEnabledValue !== 'undefined') {
        // console.log('validateEnabledStates: setting', layers[i].name, 'to', newEnabledValue);
        layers[i].enabled = newEnabledValue;
      }

      // if the layer has children, repeat this process on them
      // console.log('validateEnabledStates: does', layers[i].name, 'have children?', (layers[i].hasChildren ? 'yes' : 'no'));
      if (layers[i].hasChildren) {
        // console.log('validateEnabledStates: setting children of', layers[i].name, 'to', layers[i].enabled);
        this.validateEnabledStates(layers[i].children, layers[i].enabled)
      }

    }

  }

  ownsLayer(layer) {
    return layer.owner === this;
  }

  makeLayer(layerData) {
    const l = new NestedLayer(layerData);
    l.owner = this;
    return l;
  }

  ownLayer(layer) {
    layer.owner = this;
  }

  ownAllLayers(layers) {
    for (let i = 0; i < layers.length; i++) {
      this.ownLayer(layers[i]);
      layers[i].ownChildren();
    }
  }

}
