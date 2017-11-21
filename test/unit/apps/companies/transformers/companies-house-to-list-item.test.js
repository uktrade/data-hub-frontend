const companiesHouseSearchResults = require('~/test/unit/data/companies/companies-house-search.json')
const transformCompaniesHouseToListItem = require('~/src/apps/companies/transformers/companies-house-to-list-item')

describe('transformCompaniesHouseToListItem', () => {
  beforeEach(() => {
    this.transformed = transformCompaniesHouseToListItem(companiesHouseSearchResults.results[0])
  })

  it('should include the company number as an id', () => {
    expect(this.transformed.id).to.equal('01234567896')
  })

  it('should format the company name', () => {
    expect(this.transformed.name).to.equal('Fred consultants limited')
  })

  it('should include the company status as a badge', () => {
    expect(this.transformed.meta[0]).to.deep.equal({
      label: 'Status',
      value: 'Active',
      type: 'badge',
    })
  })

  it('should include the company number as meta data', () => {
    expect(this.transformed.meta[1]).to.deep.equal({
      label: 'Company number',
      value: '01234567896',
    })
  })

  it('should include the type of company as meta data', () => {
    expect(this.transformed.meta[2]).to.deep.equal({
      label: 'Type',
      value: 'Private Limited Company',
    })
  })

  it('should join sic codes and return as meta data', () => {
    expect(this.transformed.meta[3]).to.deep.equal({
      label: 'Nature of business (SIC)',
      value: '62020 - Information technology consultancy activities, 9999 - Animal trainer',
    })
  })

  it('should include the incorporation date', () => {
    expect(this.transformed.meta[4]).to.deep.equal({
      label: 'Incorporated on',
      type: 'date',
      value: '2002-01-07',
    })
  })

  it('should format the address and return as meta data', () => {
    expect(this.transformed.meta[5]).to.deep.equal({
      label: 'Address',
      value: 'Fred Cottage Smith Lane, Winkfield, Windsor, Berkshire, SL9 9RE, United Kingdom',
    })
  })
})
