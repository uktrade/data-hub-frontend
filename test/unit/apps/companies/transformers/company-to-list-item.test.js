const { assign, find } = require('lodash')

const companyData = require('~/test/unit/data/company')
const transformCompanyToListItem = require('~/src/apps/companies/transformers/company-to-list-item')

describe('transformCompanyToListItem', () => {
  context('when there is no companies house data or datahub data', () => {
    beforeEach(() => {
      this.listItem = transformCompanyToListItem()
    })

    it('should return undefined', () => {
      expect(this.listItem).to.be.undefined
    })
  })

  context('when the object passed to the transformer is not a company', () => {
    beforeEach(() => {
      this.listItem = transformCompanyToListItem({ a: 'b' })
    })

    it('should return undefined', () => {
      expect(this.listItem).to.be.undefined
    })
  })

  context('when passed a company with no ID', () => {
    beforeEach(() => {
      this.listItem = transformCompanyToListItem({ a: 'b' })
    })

    it('should return undefined', () => {
      expect(this.listItem).to.be.undefined
    })
  })

  context('when called with a fully populated company', () => {
    beforeEach(() => {
      this.listItem = transformCompanyToListItem(companyData)
    })

    it('should return the id of the company', () => {
      expect(this.listItem).to.have.property('id', 'dcdabbc9-1781-e411-8955-e4115bead28a')
    })

    it('should return a type of company', () => {
      expect(this.listItem).to.have.property('type', 'company')
    })

    it('should return the company name', () => {
      expect(this.listItem).to.have.property('name', 'Wonka Industries')
    })

    it('should return a url to view the company', () => {
      expect(this.listItem).to.have.property('url', '/companies/dcdabbc9-1781-e411-8955-e4115bead28a')
    })

    it('should return a modifed on property', () => {
      expect(this.listItem).to.have.deep.property('subTitle', {
        value: '2017-05-13T15:58:46.421721',
        type: 'datetime',
        label: 'Updated on',
      })
    })
  })

  context('when the company is based in the uk', () => {
    beforeEach(() => {
      this.listItem = transformCompanyToListItem(companyData)
    })

    it('should return the business sector for the company', () => {
      expect(this.listItem.meta).to.containSubset([{
        label: 'Sector',
        value: 'ICT',
      }])
    })

    it('should return the country', () => {
      expect(this.listItem.meta).to.containSubset([{
        label: 'Country',
        type: 'badge',
        value: 'United Kingdom',
      }])
    })

    it('should return the UK region', () => {
      expect(this.listItem.meta).to.containSubset([{
        label: 'UK region',
        type: 'badge',
        value: 'Yorkshire and The Humber',
      }])
    })
  })

  context('when called with a non-UK company', () => {
    beforeEach(() => {
      this.listItem = transformCompanyToListItem(assign({}, companyData, {
        uk_based: false,
      }))
    })

    it('should return the business sector for the company', () => {
      expect(this.listItem.meta).to.containSubset([{
        label: 'Sector',
        value: 'ICT',
      }])
    })

    it('should return the country', () => {
      expect(this.listItem.meta).to.containSubset([{
        label: 'Country',
        type: 'badge',
        value: 'United Kingdom',
      }])
    })

    it('should not return the region', () => {
      expect(this.listItem.meta).to.not.containSubset([{
        label: 'UK region',
        type: 'badge',
        value: 'Yorkshire and The Humber',
      }])
    })
  })

  context('when the company has an address', () => {
    beforeEach(() => {
      this.listItem = transformCompanyToListItem(assign({}, companyData, {
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
      }))
    })

    it('should include the address in the result', () => {
      expect(this.listItem.meta).to.containSubset([{
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
      }])
    })
  })

  context('headquarter information', () => {
    context('contains the headquarter information', () => {
      beforeEach(() => {
        this.listItem = transformCompanyToListItem(companyData)
      })

      it('should not include the headquarter info in the result', () => {
        expect(this.listItem.meta).to.containSubset([{
          label: 'Headquarter type',
          type: 'badge',
          value: 'European HQ',
        }])
      })
    })

    context('should not contain the headquarter information', () => {
      beforeEach(() => {
        this.listItem = transformCompanyToListItem({
          ...companyData,
          headquarter_type: null,
        })
      })

      it('should not include the headquarter info in the result', () => {
        expect(this.listItem.meta).to.not.containSubset([{
          label: 'Headquarter type',
          type: 'badge',
          value: 'European HQ',
        }])
      })
    })
  })

  context('global headquarters information', () => {
    context('contains the global headquarters information', () => {
      context('and its global headquarters is not archived', () => {
        beforeEach(() => {
          this.listItem = transformCompanyToListItem(companyData)
        })

        it('should include the headquarter info in the result', () => {
          expect(this.listItem.meta).to.containSubset([{
            label: 'Global HQ',
            value: 'Mars Exports Ltd',
            url: '/companies/b2c34b41-1d5a-4b4b-9249-7c53ff2868dd',
          }])
        })

        it('should include the "Remove subsidiary" link in the result', () => {
          expect(this.listItem.meta).to.containSubset([{
            label: '',
            value: 'Remove subsidiary',
            url: '/companies/dcdabbc9-1781-e411-8955-e4115bead28a/hierarchies/ghq/remove',
          }])
        })
      })

      context('and its global headquarters is archived', () => {
        beforeEach(() => {
          this.listItem = transformCompanyToListItem({
            ...companyData,
            global_headquarters_archived: true,
          })
        })

        it('should include the headquarter info in the result', () => {
          expect(this.listItem.meta).to.containSubset([{
            label: 'Global HQ',
            value: 'Mars Exports Ltd',
            url: '/companies/b2c34b41-1d5a-4b4b-9249-7c53ff2868dd',
          }])
        })

        it('should not include the "Remove subsidiary" link in the result', () => {
          expect(this.listItem.meta).to.not.containSubset([{
            label: '',
            value: 'Remove subsidiary',
            url: '/companies/b2c34b41-1d5a-4b4b-9249-7c53ff2868dd/hierarchies/ghq/remove',
          }])
        })
      })
    })

    context('does not contain the headquarter information', () => {
      beforeEach(() => {
        this.listItem = transformCompanyToListItem({
          ...companyData,
          global_headquarters: null,
        })
      })

      it('should not include the headquarter info in the result', () => {
        expect(this.listItem.meta).to.not.containSubset([{
          label: 'Global HQ',
          value: 'Mars Exports Ltd',
          url: '/companies/b2c34b41-1d5a-4b4b-9249-7c53ff2868dd',
        }])
      })
    })
  })

  context('when the company does not have trading names', () => {
    beforeEach(() => {
      this.listItem = transformCompanyToListItem(companyData)
    })

    it('should not set a trading name meta item', () => {
      const tradingNameMetaItem = find(this.listItem.meta, ({ label }) => label === 'Trading names')
      expect(tradingNameMetaItem).to.not.exist
    })
  })

  context('when the company does have trading names', () => {
    beforeEach(() => {
      this.listItem = transformCompanyToListItem({
        ...companyData,
        trading_names: [ 'trading name' ],
      })
    })

    it('should not set a trading name meta item', () => {
      const tradingNameMetaItem = find(this.listItem.meta, ({ label }) => label === 'Trading names')
      expect(tradingNameMetaItem).to.exist
    })
  })
})
