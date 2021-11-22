const { transformFormToDnbChangeRequest } = require('../transformers')

describe('#transformFormToDnbChangeRequest', () => {
  context('when all fields are populated', () => {
    let actual = transformFormToDnbChangeRequest('company123', {
      address1: 'line 1',
      address2: 'line 2',
      city: 'town',
      county: 'county',
      postcode: 'postcode',
      area: 'area',
    })

    it('should transform the request body', () => {
      expect(actual).to.deep.equal({
        address: {
          line_1: 'line 1',
          line_2: 'line 2',
          town: 'town',
          county: 'county',
          postcode: 'postcode',
          area: {
            id: 'area',
          },
        },
      })
    })
  })
})
