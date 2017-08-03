import NestedLayer from '../../src/Leaflet.TOC.NestedLayer';

import L from 'leaflet-headless';
import sinon from 'sinon';

const layerStub = sinon.createStubInstance(L.Layer);
const mapStub = sinon.createStubInstance(L.Map);

export default function makeCustomSmallTreeFixture(options = {}, LayerClass = NestedLayer, layer = layerStub, map = mapStub) {
  const root1 =   new LayerClass(111, 'Layer 111', layerStub, mapStub, options);
  const root2 =   new LayerClass(222, 'Layer 222', layerStub, mapStub, options);
  const root3 =   new LayerClass(333, 'Layer 333', layerStub, mapStub, options);
  const child1 =  new LayerClass(444, 'Layer 444', layerStub, mapStub, options);
  const child2 =  new LayerClass(555, 'Layer 555', layerStub, mapStub, options);
  root3.addChild(child1);
  root3.addChild(child2);
  const tree = [ root1, root2, root3 ];
  return {
    tree,
    root1,
    root2,
    root3,
    child1,
    child2,
    parent: root3,
    children: [ child1, child2 ]
  }
}