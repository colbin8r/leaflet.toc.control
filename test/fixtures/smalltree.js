import NestedLayer from '../../src/Leaflet.TOC.NestedLayer';

import L from 'leaflet-headless';
import sinon from 'sinon';

const layerStub = sinon.createStubInstance(L.Layer);
const mapStub = sinon.createStubInstance(L.Map);

const options = { rules: { alwaysDeselectedWhenDisabled: false } };

const root1 =   new NestedLayer(111, 'Layer 111', layerStub, mapStub, options);
const root2 =   new NestedLayer(222, 'Layer 222', layerStub, mapStub, options);
const root3 =   new NestedLayer(333, 'Layer 333', layerStub, mapStub, options);
const child1 =  new NestedLayer(444, 'Layer 444', layerStub, mapStub, options);
const child2 =  new NestedLayer(555, 'Layer 555', layerStub, mapStub, options);
root3.addChild(child1);
root3.addChild(child2);
const tree = [root1, root2, root3];

export default tree;
export const children = [child1, child2];
export { root1, root2, root3, child1, child2, layerStub, mapStub };