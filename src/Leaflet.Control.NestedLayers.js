/* global L, window */
// import { Example } from './model/Example';

export class NestedLayers {
  constructor(options) {
    Object.assign(options, this)
    this.props = {};
    // let person = new Person( 'Stefan', 'Walther' );
    // this.props.person = person;
    // this.props.fullName = person.fullName;
  }

  // get person() {
  //   return this.props.person;
  // }
}

if (typeof window != 'undefined') {
  L.control.nestedLayers = function nestedLayers(options) {
    return new NestedLayers(options);
  };
}
