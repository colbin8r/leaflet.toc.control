import NestedLayer from './NestedLayer';
import NL from '../Leaflet.TOC.NestedLayer';
// import NestedLayerTreeHelper from '../Leaflet.TOC.NestedLayerTreeHelper';

import React from 'react';
import PropTypes from 'prop-types';

export default class LeafletTOC extends React.Component {

  static propTypes = {
    layers: PropTypes.arrayOf(PropTypes.instanceOf(NL)).isRequired,
    title: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    // the initial state is a reference to the layers prop
    this.state = {
      layers: props.layers
    };
  }

  toggleSelected = (layer) => {
    // let layers = this.state.layers;
    layer.toggleSelected();
    this.setState({ layers: this.state.layers });
  }

  // toggleEnabled = (layer) => {
  //   console.log('toggling enabled state of', layer);
  //   layer.toggleEnabled();
  //   this.setState({ layers: this.state.layers });
  // }

  render() {
    let layers = this.state.layers.map((layer) => <NestedLayer layer={layer} toggleSelected={this.toggleSelected} key={layer.id} />);

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
