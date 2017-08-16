import NestedLayer from './NestedLayer';
import NL from '../Leaflet.TOC.NestedLayer';
// import NestedLayerTreeHelper from '../Leaflet.TOC.NestedLayerTreeHelper';

import MapEventManager from '../Leaflet.TOC.MapEventManager';
import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

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

    this.eventManager = new MapEventManager();
    window.em = this.eventManager; // FOR DEBUGGING
    console.log('LeafletTOC created event manager', this.eventManager);
  }

  toggleSelected = (layer) => {
    // let layers = this.state.layers;
    layer.toggleSelected();
    this.setState({ layers: this.state.layers });
  }

  visibilityChange = debounce(() => {
    console.log('visibilityChange (debounced)');
    this.setState({ layers: this.state.layers });
  })

  // toggleEnabled = (layer) => {
  //   console.log('toggling enabled state of', layer);
  //   layer.toggleEnabled();
  //   this.setState({ layers: this.state.layers });
  // }
  //

  componentWillUpdate() {
    console.log('LeafletTOC componentWillUpdate (state change)');
  }

  render() {
    console.log('LeafletTOC rendering with event manager', this.eventManager);

    let layers = this.state.layers.map((layer) => <NestedLayer layer={layer}
                                                               toggleSelected={this.toggleSelected}
                                                               visibilityChange={this.visibilityChange}
                                                               eventManager={this.eventManager}
                                                               key={layer.id} />);

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
