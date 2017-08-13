/*eslint no-undef: "off"*/
'use strict';

const Yelp = require('../../../../api/yelp/yelp');
const chaiAsPromised = require('chai-as-promised');
const chai = require('chai');

chai.use(chaiAsPromised);

let expect = chai.expect;

describe('Testing Yelp api', () => {
    const TEST_BUSINESS_PARAMS = {
        term: 'shop',
        latitude: 37.773972,
        longitude: -122.431297
    };

    beforeEach(done => {
        Yelp.init();

        setTimeout(() => {
            done();
        }, 1000);
    });

    it('Yelp init method returns a promise', () => {
        return expect(Yelp.init()).to.be.a('promise');
    });

    it('Yelp searchBusiness method exists', () => {
        return expect(Yelp.searchBusiness).to.be.a('function');
    });

    it('Yelp searchBusiness returns a promise resolves with an object with list of businesses', () => {
        const myKeys = ['region', 'total', 'businesses'];
        const propertyName = 'businesses';

        return expect(Yelp.searchBusiness(TEST_BUSINESS_PARAMS)).to.be
            .a('promise')
            .that.eventually.has.keys(myKeys)
            .and.has.property(propertyName)
            .that.is.an('array').that.is.not.empty;
    });

    it('Yelp searchRartings method exists', () => {
        return expect(Yelp.searchRatings).to.be.a('function');
    });

    it('Yelp searchRartings returns a promise with an object with list of reviewes with length equal to 3', () => {
        const businessID = 'life-san-francisco';

        expect(Yelp.searchRatings(businessID)).to.eventually.have
            .property('reviews')
            .that.is.an('array')
            .to.have.lengthOf(3);
    });
});
