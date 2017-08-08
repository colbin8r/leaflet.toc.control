import NestedLayer from './Leaflet.TOC.NestedLayer';

export default class NestedDynamicMapLayer extends NestedLayer {
  _attach() {
    // console.log(this.layer.getLayers);
    if (!this._isAttached) {
      // push the layerID into the list of layers to render
      // http://esri.github.io/esri-leaflet/api-reference/layers/dynamic-map-layer.html#methods

      let layers = this.layer.getLayers();
      // if the DynamicMapLayer was instantiated without providing a list of layer IDs as an option,
      // then .getLayers will return 'false' (as of esri-leaflet@2.0.8)
      // in JavaScript, 'typeof []'' will return 'object', so use Array.isArray to verify that .getLayers
      // returned an actual array
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
      if (!Array.isArray(layers)) {
        // .getLayers returned false (see above), so set the empty array ourselves
        layers = [];
      }
      // setLayers allows you to introduce duplicate IDs
      // this check prevents that from happening
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
      if (!layers.includes(this.layerID)) {
        // Array.push returns the new length of the array, not the array itself
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
        layers.push(this.layerID);
        this.layer.setLayers(layers);
      }


      // ensure the Leaflet layer is actually on the map object
      if (!this.map.hasLayer(this.layer)) {
        this.map.addLayer(this.layer);
      }
    }

    this._isAttached = true;
  }

  _detach() {
    if (this._isAttached) {
      // remove the layerID from the list of layers to render
      // http://esri.github.io/esri-leaflet/api-reference/layers/dynamic-map-layer.html#methods
      let layers = this.layer.getLayers().filter((id) => {
        return id !== this.layerID;
      });
      this.layer.setLayers(layers);

      // if there are no more layers left, remove the layer from the map object
      if (layers.length === 0 && this.map.hasLayer(this.layer)) {
        this.map.removeLayer(this.layer);
      }
    }

    this._isAttached = false;
  }
}
