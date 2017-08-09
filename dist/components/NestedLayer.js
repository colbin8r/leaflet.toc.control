import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import NL from '../Leaflet.TOC.NestedLayer';
import MapSymbology from './MapSymbology';

export default class NestedLayer extends React.Component {

  static propTypes = {
    layer: PropTypes.instanceOf(NL).isRequired,
    toggleSelected: PropTypes.func.isRequired,
    // toggleEnabled: PropTypes.func.isRequired
  };

  toggleSelected = () => {
    this.props.toggleSelected(this.props.layer);
  }

  friendlyLayerType = () => {
    return this.props.layer.constructor.name.replace('Nested', '');
  }

  render() {
    const classes = classnames({
      leaf: true,
      enabled: this.props.layer.enabled,
      disabled: this.props.layer.disabled,
      selected: this.props.layer.selected,
      deselected: this.props.layer.deselected
    });

    let children;

    if (this.props.layer.hasChildren) {
      // each child layer turns into a NestedLayer
      children = this.props.layer.children.map((layer) => <NestedLayer layer={layer}
                                                                       toggleSelected={this.props.toggleSelected}
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
        <input type="checkbox" checked={this.props.layer.selected} onChange={this.toggleSelected} />
        <span className="layer-name">{this.props.layer.name}</span>
        <span className="layer-type">{this.friendlyLayerType()}</span>

        <MapSymbology symbology={this.props.layer.symbology} />

        {children}

      </li>
    );
  }

}
