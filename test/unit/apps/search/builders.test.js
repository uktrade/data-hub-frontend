const builders = require('~/src/apps/search/builders')

describe('Search builders', () => {
  describe('#buildSearchAggregation', () => {
    beforeEach(() => {
      this.builders = builders
      this.apiResponseEntities = [
        { count: 3, entity: 'company' },
        { count: 20, entity: 'contact' },
        { count: 31, entity: 'event' },
        { count: 11, entity: 'investment_project' },
        { count: 5, entity: 'order' },
      ]
      this.entities = [
        {
          entity: 'company',
          path: 'companies',
          text: 'Companies',
          noun: 'company',
          count: 0,
          permissions: ['permission1'],
        },
        {
          entity: 'contact',
          path: 'contacts',
          text: 'Contacts',
          noun: 'contact',
          count: 0,
          permissions: ['permission2'],
        },
        {
          entity: 'event',
          path: 'events',
          text: 'Events',
          noun: 'event',
          count: 0,
          permissions: ['permission3'],
        },
        {
          entity: 'interaction',
          path: 'interactions',
          text: 'Interactions',
          noun: 'interaction',
          count: 0,
          permissions: ['permission4'],
        },
        {
          entity: 'investment_project',
          path: 'investment-projects',
          text: 'Investment projects',
          noun: 'investment project',
          count: 0,
          permissions: ['permission5'],
        },
        {
          entity: 'order',
          path: 'omis',
          text: 'Orders',
          noun: 'order',
          count: 0,
          permissions: ['permission6'],
        },
      ]
    })

    it('should undefined if entity aggregations argument is not an array', () => {
      const userEntities = this.builders.buildSearchAggregation({})

      expect(userEntities).to.be.undefined
    })

    it('should return an object with expanded aggregations for provided API response aggregations', () => {
      this.userPermissions = [
        'permission',
        'permission1',
        'permission2',
        'permission3',
        'permission4',
      ]

      const userEntities = this.builders.buildSearchAggregation({
        aggregations: this.apiResponseEntities,
        userPermissions: this.userPermissions,
        entityDetails: this.entities,
      })

      const expected = [
        {
          entity: 'company',
          path: 'companies',
          text: 'Companies',
          noun: 'company',
          count: 3,
          permissions: ['permission1'],
        },
        {
          entity: 'contact',
          path: 'contacts',
          text: 'Contacts',
          noun: 'contact',
          count: 20,
          permissions: ['permission2'],
        },
        {
          entity: 'event',
          path: 'events',
          text: 'Events',
          noun: 'event',
          count: 31,
          permissions: ['permission3'],
        },
        {
          entity: 'interaction',
          path: 'interactions',
          text: 'Interactions',
          noun: 'interaction',
          count: 0,
          permissions: ['permission4'],
        },
      ]

      expect(userEntities).to.deep.equal(expected)
    })
  })
})
