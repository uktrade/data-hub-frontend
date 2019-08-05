const {
  transformLocation,
} = require('~/src/apps/companies/apps/investments/large-capital-profile/transformers')

describe('Large capital profile, location form to API', () => {
  context('when translating location', () => {
    beforeEach(() => {
      this.transformed = transformLocation({
        notes_on_locations: 'They love Birmingham',
      })
    })

    it('should transform the POST', () => {
      expect(this.transformed).to.deep.equal({
        notes_on_locations: 'They love Birmingham',
      })
    })
  })
})
