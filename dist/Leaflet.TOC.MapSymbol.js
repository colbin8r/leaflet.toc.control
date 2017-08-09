import { defaultsDeep as defaults } from 'lodash';

export default class MapSymbol {

  static _defaults = {
    label: '',
    height: 20,
    width: 20,
    contentType: 'image/png',
    imageData: '',
    relativeURL: ''
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

  get height() {
    return this._props.height;
  }

  get width() {
    return this._props.width;
  }

  get contentType() {
    return this._props.contentType;
  }

  get imageData() {
    return this._props.imageData;
  }

  get relativeURL() {
    return this._props.relativeURL;
  }

  get base64URI() {
    return 'data:' + this.contentType + ';base64,' + this.imageData;
  }

  get defaults() {
    // uses reflection to return the static _defaults property on the class
    return this.constructor._defaults;
  }
}
