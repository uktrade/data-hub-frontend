const { transformCompanyToSubsidiariesList } = require('../transformers')
const urls = require('../../../../../lib/urls')

const companyMock = require('../../../../../../test/unit/data/companies/company-v4')

describe('Edit company form transformers', () => {
  describe('#transformCompanyToSubsidiariesList', () => {
    context('when called with a fully populated company', () => {
      const actual = transformCompanyToSubsidiariesList(companyMock)

      it('should return transformed values', () => {
        const expected = {
          'badges': [
            'United Kingdom',
            'North West',
          ],
          'headingText': 'Mercury Ltd',
          'headingUrl': urls.companies.detail('a73efeba-8499-11e6-ae22-56b6b6499611'),
          'metadata': [
            {
              'label': 'Sector',
              'value': 'Retail',
            },
            {
              'label': 'Address',
              'value': '82 Ramsgate Rd, Willington, NE28 5JB, United Kingdom',
            },
          ],
          'subheading': 'Updated on 5 Jul 2016, 1:00pm',
        }

        expect(actual).to.deep.equal(expected)
      })
    })

    context('when called without ID', () => {
      const actual = transformCompanyToSubsidiariesList({})

      it('should return undefined', () => {
        expect(actual).to.be.undefined
      })
    })

    context('when called only with ID', () => {
      const actual = transformCompanyToSubsidiariesList({
        id: '123',
      })

      it('should return minimal object', () => {
        expect(actual).to.deep.equal({
          headingText: undefined,
          headingUrl: urls.companies.detail('123'),
          subheading: 'Updated on undefined',
          metadata: [],
          badges: [],
        })
      })
    })
  })
})
