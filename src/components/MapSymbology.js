import React from 'react';
import PropTypes from 'prop-types';

import MapSymbol from './MapSymbol';
import Symbology from '../Leaflet.TOC.MapSymbology';
import { generateID } from '../Leaflet.TOC.NestedLayer';

export default class MapSymbology extends React.Component {

  static propTypes = {
    symbology: PropTypes.instanceOf(Symbology).isRequired
  };

  render() {
    let symbols = this.props.symbology.symbols.map((symbol) => {
      return <MapSymbol symbol={symbol} key={generateID()} />
    });

    return (
      <ul className="symbology">
        {symbols}
      </ul>
    );
  }

}
