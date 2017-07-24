require( 'babel-core/register' );

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');

// https://github.com/domenic/sinon-chai
// example assertion:
// expect(mySpy.calledWith("foo")).to.be.ok;
chai.use(sinonChai);

// https://github.com/domenic/chai-as-promised
// remember that when using a chai-as-promised assertion
// you must 'return the assertion':
// return expect(Promise.resolve({ foo: "bar" })).to.eventually.have.property("foo");
chai.use(chaiAsPromised);

global.expect = chai.expect;
