import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import MapSymbol from './MapSymbol';
import Symbology from '../Leaflet.TOC.MapSymbology';

export default class MapSymbology extends React.Component {

  static propTypes = {
    symbology: PropTypes.instanceOf(Symbology).isRequired
  };

  render() {
    let symbols = this.props.symbology.symbols.map((symbol) => {
      return <MapSymbol symbol={symbol} />
    });

    return (
      <ul className="symbology">
        <li>Symbology</li>
        {symbols}
      </ul>
    );
  }

}
