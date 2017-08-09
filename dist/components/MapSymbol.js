import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import MS from '../Leaflet.TOC.MapSymbol';

export default class MapSymbol extends React.Component {

  static propTypes = {
    symbol: PropTypes.instanceOf(MS).isRequired
  };

  render() {
    return (
      <li className="symbol">
        <img src={this.props.symbol.base64URI}
             height={this.props.symbol.height}
             width={this.props.symbol.width}
             alt=""
             className="swatch" />
        <span className="label">{this.props.symbol.height.label}</span>
      </li>
  }

}
