'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global L, window */
// import { Example } from './model/Example';

var NestedLayers = exports.NestedLayers = function NestedLayers(options) {
  _classCallCheck(this, NestedLayers);

  Object.assign(options, this);
  this.props = {};
  // let person = new Person( 'Stefan', 'Walther' );
  // this.props.person = person;
  // this.props.fullName = person.fullName;
}

// get person() {
//   return this.props.person;
// }
;

if (typeof window != 'undefined') {
  L.control.nestedLayers = function nestedLayers(options) {
    return new NestedLayers(options);
  };
}
//# sourceMappingURL=Leaflet.Control.NestedLayers.js.map
