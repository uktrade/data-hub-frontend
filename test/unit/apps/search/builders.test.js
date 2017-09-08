const builders = require('~/src/apps/search/builders')

describe('Search builders', () => {
  describe('#buildSearchAggregation', () => {
    it('should undefined if entity aggregations argument is not an array', () => {
      const actual = builders.buildSearchAggregation()

      expect(actual).to.be.undefined
    })

    it('should return an object with expanded aggregations for provided API response aggregations', () => {
      const actual = builders.buildSearchAggregation([
        { count: 20, entity: 'contact' },
        { count: 11, entity: 'investment_project' },
        { count: 3, entity: 'company' },
        { count: 5, entity: 'order' },
      ])

      const expected = [
        {
          entity: 'company',
          path: 'companies',
          text: 'Companies',
          noun: 'company',
          count: 3,
        },
        {
          entity: 'contact',
          path: 'contacts',
          text: 'Contacts',
          noun: 'contact',
          count: 20,
        },
        {
          entity: 'interaction',
          path: 'interactions',
          text: 'Interactions',
          noun: 'interaction',
          count: 0,
        },
        {
          entity: 'investment_project',
          path: 'investment-projects',
          text: 'Investment projects',
          noun: 'investment project',
          count: 11,
        },
        {
          entity: 'order',
          path: 'omis',
          text: 'Orders',
          noun: 'order',
          count: 5,
        },
      ]

      expect(actual).to.deep.equal(expected)
    })
  })
})
