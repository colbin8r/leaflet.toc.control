import NestedLayer from './Leaflet.TOC.NestedLayer';

export default class NestedDynamicMapLayer extends NestedLayer {
  _attach() {
    if (!this._isAttached) {
      // push the layerID into the list of layers to render
      // http://esri.github.io/esri-leaflet/api-reference/layers/dynamic-map-layer.html#methods
      this.layer.setLayers(this.layer.getLayers().push(this.layerID));

      this._isAttached = true;
    }
  }

  _detach() {
    if (this._isAttached) {
      // remove the layerID from the list of layers to render
      // http://esri.github.io/esri-leaflet/api-reference/layers/dynamic-map-layer.html#methods
      let layers = this.layer.getLayers().filter((id) => {
        return id !== this.layerID;
      });
      this.layer.setLayers(layers);

      this._isAttached = false;
    }
  }
}
