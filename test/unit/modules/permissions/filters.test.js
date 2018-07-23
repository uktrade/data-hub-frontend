const { filterNonPermittedItem } = require('~/src/modules/permissions/filters')

describe('filters', () => {
  describe('#filterNonPermittedItem', () => {
    beforeEach(() => {
      this.filterNonPermittedItem = filterNonPermittedItem
      this.items = [
        {
          permissions: [
            'permission',
          ],
          name: 'Example',
        },
        {
          permissions: [
            'permission1',
          ],
          name: 'Example one',
        },
        {
          name: 'Item without permissions',
        },
        {
          permissions: [
            'permission2',
          ],
          name: 'Example two',
        },
        {
          name: 'Item with empty permissions array',
          permissions: [],
        },
        {
          permissions: [
            'permission3',
          ],
          name: 'Example three',
        },
        {
          permissions: [
            'permission5',
          ],
          name: 'Example five',
        },
        {
          permissions: [
            'permission4',
            'permission6',
            'permission7',
          ],
          name: 'Example four, six and seven',
        },
        {
          name: 'Another item without permissions',
        },
      ]
    })

    it('should return expected user permitted items', () => {
      this.userPermissions = [
        'permission1',
        'permission2',
        'permission5',
      ]
      const expectItems = [
        {
          permissions: [
            'permission1',
          ],
          name: 'Example one',
        },
        {
          name: 'Item without permissions',
        },
        {
          permissions: [
            'permission2',
          ],
          name: 'Example two',
        },
        {
          name: 'Item with empty permissions array',
          permissions: [],
        },
        {
          permissions: [
            'permission5',
          ],
          name: 'Example five',
        },
        {
          name: 'Another item without permissions',
        },
      ]
      const userPermissions = this.items.filter(this.filterNonPermittedItem(this.userPermissions))

      expect(userPermissions).to.deep.equal(expectItems)
    })

    it('should return expected user permitted items when multiple permissions are supplied', () => {
      this.userPermissions = [
        'permission7',
      ]
      const expectItems = [
        {
          name: 'Item without permissions',
        },
        {
          name: 'Item with empty permissions array',
          permissions: [],
        },
        {
          permissions: [
            'permission4',
            'permission6',
            'permission7',
          ],
          name: 'Example four, six and seven',
        },
        {
          name: 'Another item without permissions',
        },
      ]
      const userPermissions = this.items.filter(this.filterNonPermittedItem(this.userPermissions))

      expect(userPermissions).to.deep.equal(expectItems)
    })

    it('should return items without permissions', () => {
      this.userPermissions = []
      const expectItems = [
        {
          name: 'Item without permissions',
        },
        {
          name: 'Item with empty permissions array',
          permissions: [],
        },
        {
          name: 'Another item without permissions',
        },
      ]
      const userPermissions = this.items.filter(this.filterNonPermittedItem(this.userPermissions))

      expect(userPermissions).to.deep.equal(expectItems)
    })
  })
})
