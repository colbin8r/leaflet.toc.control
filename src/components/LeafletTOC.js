import NestedLayer from './NestedLayer';
import { NestedLayer as NL } from '../Leaflet.TOC.NestedLayer';

import React from 'react';
import PropTypes from 'prop-types';

export default class LeafletTOC extends React.Component {

  static propTypes = {
    layers: PropTypes.arrayOf(PropTypes.instanceOf(NL)).isRequired,
    title: PropTypes.string.isRequired
  };

  render() {
    let layers = this.props.layers.map((layer) => <NestedLayer layer={layer} key={layer.id} />);

    return (
      <div className="leaflet-toc-container">
        <h2>{this.props.title}</h2>
        <ul className="branch">
          {layers}
        </ul>
      </div>
    );
  }

}
