const { transformCompanyToDnbHierarchyList } = require('../transformers')
const urls = require('../../../../../lib/urls')

describe('Edit company form transformers', () => {
  describe('#transformCompanyToDnbHierarchyList', () => {
    context('when called with a fully populated company', () => {
      const actual = transformCompanyToDnbHierarchyList({
        id: '123',
        name: 'Test company',
        sector: {
          name: 'Test sector',
        },
        uk_based: true,
        uk_region: {
          name: 'Test UK region',
        },
        trading_names: ['Test trading name'],
        address: {
          country: {
            name: 'Test country',
          },
        },
        modified_on: '2016-07-05T12:00:00Z',
        headquarter_type: {
          name: 'ghq',
        },
        is_global_ultimate: true,
      })

      it('should return transformed values', () => {
        const expected = {
          badges: [
            { text: 'Test country' },
            { text: 'Test UK region' },
            { text: 'Ultimate HQ' },
            { text: 'Global HQ' },
          ],
          headingText: 'Test company',
          headingUrl: '/companies/123',
          metadata: [
            {
              label: 'Trading names',
              value: ['Test trading name'],
            },
            {
              label: 'Sector',
              value: 'Test sector',
            },
            {
              label: 'Address',
              value: 'Test country',
            },
          ],
          subheading: 'Updated on 5 Jul 2016, 1:00pm',
        }

        expect(actual).to.deep.equal(expected)
      })
    })

    context('when called without ID', () => {
      const actual = transformCompanyToDnbHierarchyList({})

      it('should return undefined', () => {
        expect(actual).to.be.undefined
      })
    })

    context('when called only with ID', () => {
      const actual = transformCompanyToDnbHierarchyList({
        id: '123',
      })

      it('should return minimal object', () => {
        expect(actual).to.deep.equal({
          headingText: undefined,
          headingUrl: urls.companies.detail('123'),
          subheading: undefined,
          metadata: [],
          badges: [],
        })
      })
    })
  })
})
