'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _LeafletTOC = require('./components/LeafletTOC');

var _LeafletTOC2 = _interopRequireDefault(_LeafletTOC);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Control = function () {
  _createClass(Control, [{
    key: 'defaults',
    get: function get() {
      // uses reflection to return the static _defaults property on the class
      return this.constructor._defaults;
    }
  }]);

  function Control(layers, element, options) {
    _classCallCheck(this, Control);

    // save arguments
    this._layers = layers;
    this._element = element;

    // set initial state
    this._options = {};
    (0, _lodash.defaults)(this._options, options, this.defaults);
    this._component = _react2.default.createElement(_LeafletTOC2.default, { layers: this.layers, title: this.options.title });

    this.attach();
  }

  // all properties are get-only from the outside


  _createClass(Control, [{
    key: 'attach',


    // bind to the DOM
    value: function attach() {
      if (!this.isAttached) {
        _reactDom2.default.render(this.component, this.element);
      }
      this._isAttached = true;
    }
  }, {
    key: 'detach',
    value: function detach() {
      if (this.isAttached) {
        _reactDom2.default.unmountComponentAtNode(this.element);
      }
      this._isAttached = false;
    }
  }, {
    key: 'layers',
    get: function get() {
      return this._layers;
    }
  }, {
    key: 'element',
    get: function get() {
      return this._element;
    }
  }, {
    key: 'options',
    get: function get() {
      return this._options;
    }
  }, {
    key: 'component',
    get: function get() {
      return this._component;
    }
  }, {
    key: 'isAttached',
    get: function get() {
      return this._isAttached;
    }
  }]);

  return Control;
}();

Control._defaults = {
  title: 'Layers'
};
exports.default = Control;
//# sourceMappingURL=Leaflet.TOC.Control.js.map
