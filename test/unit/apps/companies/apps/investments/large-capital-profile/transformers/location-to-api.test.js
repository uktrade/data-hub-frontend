const {
  transformLocation,
} = require('~/src/apps/companies/apps/investments/large-capital-profile/transformers')

describe('Large capital profile, location form to API', () => {
  context('when translating location', () => {
    beforeEach(() => {
      this.transformed = transformLocation({
        notes_on_locations: 'They love Birmingham',
        uk_region_locations: [
          {
            'name': 'East of England',
            'id': '864cd12a-6095-e211-a939-e4115bead28a',
          },
          {
            'name': 'London',
            'id': '874cd12a-6095-e211-a939-e4115bead28a',
          },
        ],
      })
    })

    it('should transform the POST', () => {
      expect(this.transformed).to.deep.equal({
        notes_on_locations: 'They love Birmingham',
        uk_region_locations: [
          {
            'name': 'East of England',
            'id': '864cd12a-6095-e211-a939-e4115bead28a',
          },
          {
            'name': 'London',
            'id': '874cd12a-6095-e211-a939-e4115bead28a',
          },
        ],
      })
    })
  })
})
