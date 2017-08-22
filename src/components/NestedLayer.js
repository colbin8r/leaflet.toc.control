import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import MapEventManager from '../Leaflet.TOC.MapEventManager';
import NL from '../Leaflet.TOC.NestedLayer';
import MapSymbology from './MapSymbology';

export default class NestedLayer extends React.Component {

  static propTypes = {
    layer: PropTypes.instanceOf(NL).isRequired,
    toggleSelected: PropTypes.func.isRequired,
    visibilityChange: PropTypes.func.isRequired,
    eventManager: PropTypes.instanceOf(MapEventManager).isRequired
  };

  constructor(props) {
    super(props);

    this.eventManager = this.props.eventManager;
    console.log('NestedLayer received event manager', this.eventManager);
    let map = this.props.layer.map;
    let layer = this.props.layer.layer;
    console.log('NestedLayer asking event manager to bind layer', layer);
    this.eventManager.bindLayerToMapChanges(map, layer, this._mapEventHandler);

    this.state = {
      collapsed: true
    }

    // this.state = {
    //   _mapEventListeners: {
    //     'zoomend': this._handleMapZoomChange,
    //     'layeradd': this._handleMapLayerChange,
    //     'layerremove': this._handleMapLayerChange
    //   }
    // };
  }

  _mapEventHandler = (e) => {
    console.log('<NestedLayer /> map event handler', e);
    this.props.visibilityChange();
  }

  // // add event listener(s) to map
  // bindToMapEvents() {
  //   console.log('binding to map events');

  //   this.props.layer.map.on(this.state._mapEventListeners);
  // }

  // // remove event listener(s) from map
  // unbindFromMapEvents() {
  //   console.log('unbinding from map events');
  //   this.props.layer.map.off(this.state._mapEventListeners);
  // }

  // // listens to zoomend
  // // http://leafletjs.com/reference-1.2.0.html#map-zoomend
  // _handleMapZoomChange = (e) => {
  //   console.log('zoom level changed to', e.target.getZoom());
  //   this.props.visibilityChange();
  // }

  // // listens to layeradd and layerremove
  // // http://leafletjs.com/reference-1.2.0.html#map-layeradd
  // // http://leafletjs.com/reference-1.2.0.html#map-layeradd
  // _handleMapLayerChange = (e) => {
  //   console.log('_handleMapLayerChange handles this layer?', e.layer._leaflet_id == this.props.layer.layer._leaflet_id);
  //   // if the change was to this layer (i.e. they share IDs)
  //   // this check helps throttle down React render() calls
  //   if (e.layer._leaflet_id == this.props.layer.layer._leaflet_id) {
  //     console.log('_handleMapLayerChange MATCH', e.layer, this.props.layer.layer);
  //     this.props.visibilityChange();
  //   }
  // }

  // componentDidMount() {
  //   this.bindToMapEvents();
  // }

  // componentWillUnmount() {
  //   this.unbindFromMapEvents();
  // }

  toggleSelected = () => {
    this.props.toggleSelected(this.props.layer);
  }

  visibilityChange = () => {
    this.props.visibilityChange();
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
    console.log('<NestedLayer /> toggle collapse:', this.state);
  }

  friendlyLayerType = () => {
    return this.props.layer.constructor.name.replace('Nested', '');
  }

  render() {
    const disabled = (this.props.layer.disabled ? 'disabled' : '');
    const classes = classnames({
      leaf: true,
      enabled: this.props.layer.enabled,
      disabled: this.props.layer.disabled,
      selected: this.props.layer.selected,
      deselected: this.props.layer.deselected,
      visible: this.props.layer.visible,
      invisible: !this.props.layer.visible,
      collapsed: this.state.collapsed,
      expanded: !this.state.collapsed,
      'has-children': this.props.layer.hasChildren,
      'has-no-children': !this.props.layer.hasChildren
    });

    let children;

    if (this.props.layer.hasChildren) {
      // each child layer turns into a NestedLayer
      children = this.props.layer.children.map((layer) => <NestedLayer layer={layer}
                                                                       toggleSelected={this.props.toggleSelected}
                                                                       visibilityChange={this.props.visibilityChange}
                                                                       eventManager={this.eventManager}
                                                                       key={layer.id} />);
      // wrap the children with a <ul>
      children = (
        <ul className="branch">
          {children}
        </ul>
      )
    }

    return (
      <li className={classes}>
        <div className="layer-collapse-toggle" onClick={this.toggleCollapsed}>
          <i className="layer-collapse-icon-collapse">→</i>
          <i className="layer-collapse-icon-expand">↓</i>
        </div>
        <input type="checkbox" checked={this.props.layer.selected} disabled={disabled} onChange={this.toggleSelected} />
        <span className="layer-name">{this.props.layer.name}</span>
        <span className="layer-type">{this.friendlyLayerType()}</span>
        <MapSymbology symbology={this.props.layer.symbology} />
        <span className="layer-collapse-content">
          {children}
        </span>
      </li>
    );
  }

}
