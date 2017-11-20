const { some } = require('lodash')

const companyData = require('~/test/unit/data/company')
const transformCompanyResponseToListItem = require('~/src/apps/companies/transformers/company-response-to-list-item')

describe('transformCompanyResponseToListItem', () => {
  it('should return undefined if there is no companies house data or datahub data', () => {
    expect(transformCompanyResponseToListItem()).to.be.undefined
    expect(transformCompanyResponseToListItem({ a: 'b' })).to.be.undefined
    expect(transformCompanyResponseToListItem({ first_name: 'Peter', last_name: 'Great' })).to.be.undefined
  })

  it('should return undefined if companies house is incomplete', () => {
    expect(transformCompanyResponseToListItem({ companies_house_data: {} })).to.be.undefined
  })

  it('should return an object with data for company list item', () => {
    const actual = transformCompanyResponseToListItem(companyData)

    expect(actual).to.have.property('id').to.be.a('string')
    expect(actual).to.have.property('type').to.equal('company')
    expect(actual).to.have.property('name').to.be.a('string')
    expect(actual).to.have.property('url').to.be.equal(`/companies/${companyData.id}`)
  })

  it('should return have correct meta items for Uk company', () => {
    const actual = transformCompanyResponseToListItem(companyData)

    expect(actual).to.have.property('meta').an('array').to.have.length(4)
    expect(actual.meta[0]).to.have.property('label', 'Sector')
    expect(actual.meta[1]).to.have.property('label', 'Country')
    expect(actual.meta[2]).to.have.property('label', 'UK region')
    expect(actual.meta[3]).to.have.property('label', 'Registered address')
  })

  it('should return have correct meta items for non-UK company', () => {
    const actual = transformCompanyResponseToListItem(Object.assign({}, companyData, {
      uk_based: false,
    }))

    expect(actual).to.have.property('meta').an('array').to.have.length(3)
    expect(some(actual.meta, { label: 'UK region' })).to.be.false
  })

  it('should return have correct meta items for company with trading address', () => {
    const actual = transformCompanyResponseToListItem(Object.assign({}, companyData, {
      trading_address_postcode: 'W1C 2BA',
      trading_address_town: 'London',
      trading_address_1: '100 Bolton Road',
    }))

    expect(actual).to.have.property('meta').an('array').to.have.length(4)
    expect(some(actual.meta, { label: 'Registered address' })).to.be.false
    expect(some(actual.meta, { label: 'Trading address' })).to.be.true
  })

  it('should return correct URL for Companies House company', () => {
    const actual = transformCompanyResponseToListItem(Object.assign({}, companyData, {
      id: null,
      companies_house_data: {
        company_number: 10203040,
      },
    }))

    expect(actual).to.have.property('url', '/companies/view/ch/10203040')
  })

  it('should return correct URL for company with both datahub and companies house data', () => {
    const actual = transformCompanyResponseToListItem(Object.assign({}, companyData, {
      companies_house_data: {
        company_number: 10203040,
      },
    }))

    expect(actual).to.have.property('url').to.be.equal(`/companies/${companyData.id}`)
  })
})
