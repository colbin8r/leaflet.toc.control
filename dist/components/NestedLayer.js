import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import NL from '../Leaflet.TOC.NestedLayer';
import MapSymbology from './MapSymbology';

export default class NestedLayer extends React.Component {

  static propTypes = {
    layer: PropTypes.instanceOf(NL).isRequired,
    toggleSelected: PropTypes.func.isRequired,
    visibilityChange: PropTypes.func.isRequired
  };

  constructor() {
    super();

    this.state = {
      _mapEventListeners: {
        'zoomend': this._handleMapZoomChange,
        'layeradd': this._handleMapLayerChange,
        'layerremove': this._handleMapLayerChange
      }
    };
  }

  // add event listener(s) to map
  bindToMapEvents() {
    console.log('binding to map events');
    // http://leafletjs.com/reference-1.2.0.html#evented-on
    this.props.layer.map.on(this.state._mapEventListeners);
    // visibilityChange
  }

  // remove event listener(s) from map
  unbindFromMapEvents() {
    console.log('unbinding from map events');
    // http://leafletjs.com/reference-1.2.0.html#evented-off
    this.props.layer.map.off(this.state._mapEventListeners);
  }

  // listens to zoomend and moveend
  // http://leafletjs.com/reference-1.2.0.html#map-zoomend
  // http://leafletjs.com/reference-1.2.0.html#map-moveend
  _handleMapZoomChange = (e) => {
    console.log('_handleMapZoomChange', e, this);
  }

  // listens to layeradd and layerremove
  // http://leafletjs.com/reference-1.2.0.html#map-layeradd
  // http://leafletjs.com/reference-1.2.0.html#map-layeradd
  _handleMapLayerChange = (e) => {
    console.log('_handleMapLayerChange', e, this);
    if (!this.props.layer.isAttached) {
      this.props.visibilityChange();
    }
  }

  componentDidMount() {
    this.bindToMapEvents();
  }

  componentWillUnmount() {
    this.unbindFromMapEvents();
  }

  toggleSelected = () => {
    this.props.toggleSelected(this.props.layer);
  }

  visibilityChange = () => {
    this.props.visibilityChange();
  }

  friendlyLayerType = () => {
    return this.props.layer.constructor.name.replace('Nested', '');
  }

  render() {
    const disabled = (this.props.layer.disabled ? 'disabled' : '');
    console.log('disabled:' disabled);
    const classes = classnames({
      leaf: true,
      enabled: this.props.layer.enabled,
      disabled: this.props.layer.disabled,
      selected: this.props.layer.selected,
      deselected: this.props.layer.deselected,
      visible: this.props.layer.visible,
      invisible: !this.props.layer.visible
    });

    let children;

    if (this.props.layer.hasChildren) {
      // each child layer turns into a NestedLayer
      children = this.props.layer.children.map((layer) => <NestedLayer layer={layer}
                                                                       toggleSelected={this.props.toggleSelected}
                                                                       visibilityChange={this.props.visibilityChange}
                                                                       key={layer.id} />);
      // wrap the children with a <ul>
      children = (
        <ul className="branch">
          {children}
        </ul>
      )
    }

    return (
      <li className={classes} >
        <span>{disabled}</span>
        <input type="checkbox" checked={this.props.layer.selected} disabled={disabled} onChange={this.toggleSelected} />
        <span className="layer-name">{this.props.layer.name}</span>
        <span className="layer-type">{this.friendlyLayerType()}</span>
        <MapSymbology symbology={this.props.layer.symbology} />

        {children}

      </li>
    );
  }

}
