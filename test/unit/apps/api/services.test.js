const API_KEY = 'postcode_key'
const services = proxyquire('~/src/apps/api/services.js', {
  '../../../config': {
    postcodeLookup: {
      baseUrl: 'https://addresses.com/{postcode}?api-key={api-key}',
      apiKey: API_KEY,
    },
  },
})

describe('API services', () => {
  describe('#lookupAddress', () => {
    context('Address variation 1', () => {
      let actual

      beforeEach(async () => {
        nock('https://addresses.com')
          .get(`/postcode?api-key=${API_KEY}`)
          .reply(200, {
            Addresses: [
              'zero, one, two, , , five, six',
            ],
          })

        actual = await services.lookupAddress('postcode')
      })

      it('should return addresses', () => {
        expect(actual).to.deep.equal([
          {
            postcode: 'POSTCODE',
            county: 'six',
            city: 'five',
            address1: 'zero - one',
            address2: 'two',
          },
        ])
      })
    })

    context('Address variation 2', () => {
      let actual

      beforeEach(async () => {
        nock('https://addresses.com')
          .get(`/postcode?api-key=${API_KEY}`)
          .reply(200, {
            Addresses: [
              'zero, one, two, , , , ',
            ],
          })

        actual = await services.lookupAddress('postcode')
      })

      it('should return addresses', () => {
        expect(actual).to.deep.equal([
          {
            postcode: 'POSTCODE',
            address1: 'zero - one',
            address2: 'two',
            city: '',
          },
        ])
      })
    })

    context('Address variation 3', () => {
      let actual

      beforeEach(async () => {
        nock('https://addresses.com')
          .get(`/postcode?api-key=${API_KEY}`)
          .reply(200, {
            Addresses: [
              'zero, one, , , , five, ',
            ],
          })

        actual = await services.lookupAddress('postcode')
      })

      it('should return addresses', () => {
        expect(actual).to.deep.equal([
          {
            postcode: 'POSTCODE',
            city: 'five',
            address1: 'zero',
            address2: 'one',
            county: '',
          },
        ])
      })
    })
  })
})
