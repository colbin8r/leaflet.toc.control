import { defaultsDeep as defaults } from 'lodash';

export default class Symbology {

  static _defaults = {

  }

  constructor(props) {
    // merge props with defaults
    this._props = {};
    // https://lodash.com/docs/4.17.4#defaultsDeep
    defaults(this._props, props, this.defaults);
  }

  get label() {
    return this._props.label;
  }
  set label(val) {
    this._props.label = val;
  }

  get defaults() {
    // uses reflection to return the static _defaults property on the class
    return this.constructor._defaults;
  }
}
