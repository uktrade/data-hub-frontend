const { find } = require('lodash')

const companyData = require('../../../../../test/unit/data/company')
const urls = require('../../../../lib/urls')
const transformCompanyToListItem = require('../company-to-list-item')

describe('transformCompanyToListItem', () => {
  let listItem
  context('when there is no companies house data or datahub data', () => {
    before(() => {
      listItem = transformCompanyToListItem()
    })

    it('should return undefined', () => {
      expect(listItem).to.be.undefined
    })
  })

  context('when the object passed to the transformer is not a company', () => {
    before(() => {
      listItem = transformCompanyToListItem({ a: 'b' })
    })

    it('should return undefined', () => {
      expect(listItem).to.be.undefined
    })
  })

  context('when passed a company with no ID', () => {
    before(() => {
      listItem = transformCompanyToListItem({ a: 'b' })
    })

    it('should return undefined', () => {
      expect(listItem).to.be.undefined
    })
  })

  context('when called with a fully populated company', () => {
    before(() => {
      listItem = transformCompanyToListItem(companyData)
    })

    it('should return the id of the company', () => {
      expect(listItem).to.have.property('id', companyData.id)
    })

    it('should return a type of company', () => {
      expect(listItem).to.have.property('type', 'company')
    })

    it('should return the company name', () => {
      expect(listItem).to.have.property('name', 'Wonka Industries')
    })

    it('should return a url to view the company', () => {
      expect(listItem).to.have.property(
        'url',
        urls.companies.detail(companyData.id)
      )
    })

    it('should return a modifed on property', () => {
      expect(listItem).to.have.deep.property('subTitle', {
        value: '2017-05-13T15:58:46.421721',
        type: 'datetime',
        label: 'Updated on',
      })
    })
  })

  context('when the company is based in the uk', () => {
    before(() => {
      listItem = transformCompanyToListItem(companyData)
    })

    it('should return the business sector for the company', () => {
      expect(listItem.meta).to.containSubset([
        {
          label: 'Sector',
          value: 'ICT',
        },
      ])
    })

    it('should return the country', () => {
      expect(listItem.meta).to.containSubset([
        {
          label: 'Country',
          type: 'badge',
          value: 'United Kingdom',
        },
      ])
    })

    it('should return the UK region', () => {
      expect(listItem.meta).to.containSubset([
        {
          label: 'UK region',
          type: 'badge',
          value: 'Yorkshire and The Humber',
        },
      ])
    })
  })

  context('when called with a non-UK company', () => {
    before(() => {
      listItem = transformCompanyToListItem({
        ...companyData,
        uk_based: false,
      })
    })

    it('should return the business sector for the company', () => {
      expect(listItem.meta).to.containSubset([
        {
          label: 'Sector',
          value: 'ICT',
        },
      ])
    })

    it('should return the country', () => {
      expect(listItem.meta).to.containSubset([
        {
          label: 'Country',
          type: 'badge',
          value: 'United Kingdom',
        },
      ])
    })

    it('should not return the region', () => {
      expect(listItem.meta).to.not.containSubset([
        {
          label: 'UK region',
          type: 'badge',
          value: 'Yorkshire and The Humber',
        },
      ])
    })
  })

  context('when the company has an address', () => {
    before(() => {
      listItem = transformCompanyToListItem({
        ...companyData,
        address: {
          line_1: 'line 1',
          line_2: null,
          town: 'town',
          county: null,
          postcode: 'postcode',
          country: {
            id: '80756b9a-5d95-e211-a939-e4115bead28a',
            name: 'United Kingdom',
          },
        },
      })
    })

    it('should include the address in the result', () => {
      expect(listItem.meta).to.containSubset([
        {
          label: 'Address',
          type: 'address',
          value: {
            line_1: 'line 1',
            line_2: null,
            town: 'town',
            county: null,
            postcode: 'postcode',
            country: {
              id: '80756b9a-5d95-e211-a939-e4115bead28a',
              name: 'United Kingdom',
            },
          },
        },
      ])
    })
  })

  context('when the company has a different registered address', () => {
    before(() => {
      listItem = transformCompanyToListItem({
        ...companyData,
        registered_address: {
          line_1: 'registered address',
          line_2: null,
          town: 'town',
          county: null,
          postcode: 'postcode',
          country: {
            id: '80756b9a-5d95-e211-a939-e4115bead28a',
            name: 'United Kingdom',
          },
        },
      })
    })

    it('should include the registered address in the result', () => {
      expect(listItem.meta).to.containSubset([
        {
          label: 'Registered address',
          type: 'address',
          value: {
            line_1: 'registered address',
            line_2: null,
            town: 'town',
            county: null,
            postcode: 'postcode',
            country: {
              id: '80756b9a-5d95-e211-a939-e4115bead28a',
              name: 'United Kingdom',
            },
          },
        },
      ])
    })
  })

  context('when the registered address is the same as the address', () => {
    before(() => {
      listItem = transformCompanyToListItem({
        ...companyData,
        registered_address: companyData.address,
      })
    })

    it('should not include the registered address in the result', () => {
      expect(listItem.meta).to.not.containSubset([
        {
          label: 'Registered address',
          type: 'address',
          value: companyData.address,
        },
      ])
    })
  })

  context('headquarter information', () => {
    context('contains the headquarter information', () => {
      before(() => {
        listItem = transformCompanyToListItem(companyData)
      })

      it('should not include the headquarter info in the result', () => {
        expect(listItem.meta).to.containSubset([
          {
            label: 'Headquarter type',
            type: 'badge',
            value: 'European HQ',
          },
        ])
      })
    })

    context('should not contain the headquarter information', () => {
      before(() => {
        listItem = transformCompanyToListItem({
          ...companyData,
          headquarter_type: null,
        })
      })

      it('should not include the headquarter info in the result', () => {
        expect(listItem.meta).to.not.containSubset([
          {
            label: 'Headquarter type',
            type: 'badge',
            value: 'European HQ',
          },
        ])
      })
    })
  })

  context('global headquarters information', () => {
    context('contains the global headquarters information', () => {
      before(() => {
        listItem = transformCompanyToListItem(companyData)
      })

      it('should include the headquarter info in the result', () => {
        expect(listItem.meta).to.containSubset([
          {
            label: 'Global HQ',
            value: 'Mars Exports Ltd',
          },
        ])
      })
    })

    context('does not contain the headquarter information', () => {
      before(() => {
        listItem = transformCompanyToListItem({
          ...companyData,
          global_headquarters: null,
        })
      })

      it('should not include the headquarter info in the result', () => {
        expect(listItem.meta).to.not.containSubset([
          {
            label: 'Global HQ',
            value: 'Mars Exports Ltd',
            url: '/companies/b2c34b41-1d5a-4b4b-9249-7c53ff2868dd',
          },
        ])
      })
    })
  })

  context('when the company does not have trading names', () => {
    before(() => {
      listItem = transformCompanyToListItem(companyData)
    })

    it('should not set a trading name meta item', () => {
      const tradingNameMetaItem = find(
        listItem.meta,
        ({ label }) => label === 'Trading names'
      )
      expect(tradingNameMetaItem).to.not.exist
    })
  })

  context('when the company does have trading names', () => {
    before(() => {
      listItem = transformCompanyToListItem({
        ...companyData,
        trading_names: ['trading name'],
      })
    })

    it('should not set a trading name meta item', () => {
      const tradingNameMetaItem = find(
        listItem.meta,
        ({ label }) => label === 'Trading names'
      )
      expect(tradingNameMetaItem).to.exist
    })
  })

  context('when the company address is null', () => {
    before(() => {
      listItem = transformCompanyToListItem({
        ...companyData,
        address: null,
      })
    })

    it('should still transform the company and not return country', () => {
      const country = find(listItem.meta, ({ label }) => label === 'Country')
      expect(country).to.not.exist
    })
  })

  describe('Latest interaction date', () => {
    context('when the company has a last interaction date', () => {
      it('should include the last interaction date in the result', () => {
        const date = '2019-11-01'
        const listItem = transformCompanyToListItem({
          ...companyData,
          latest_interaction_date: date,
        })
        expect(listItem.meta).to.containSubset([
          {
            label: 'Last interaction date',
            type: 'date',
            value: date,
          },
        ])
      })
    })

    context('when the company does not have a last interaction date', () => {
      it('should not include the last interaction date in the result', () => {
        const listItem = transformCompanyToListItem({
          ...companyData,
          latest_interaction_date: null,
        })
        expect(listItem.meta).to.not.containSubset([
          {
            label: 'Last interaction date',
            type: 'date',
          },
        ])
      })
    })
  })
})
