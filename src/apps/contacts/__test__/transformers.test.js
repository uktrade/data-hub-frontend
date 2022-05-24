const contactSearchResult = require('../../../../test/unit/data/contacts/contact-search-result.json')

const { transformContactToListItem } = require('../transformers')

describe('Contact transformers', () => {
  describe('#transformContactToListItem', () => {
    context('when no object is provided as a parameter', () => {
      beforeEach(() => {
        this.transformedContact = transformContactToListItem()
      })

      it('should return undefined', () => {
        expect(this.transformedContact).to.be.undefined
      })
    })

    context('when a none contact object is provided as a parameter', () => {
      beforeEach(() => {
        this.transformedContact = transformContactToListItem({ a: 'b' })
      })

      it('should return undefined', () => {
        expect(this.transformedContact).to.be.undefined
      })
    })

    context('when the contact object parameter does not contain an ID', () => {
      beforeEach(() => {
        this.transformedContact = transformContactToListItem({
          first_name: 'Fred',
          last_name: 'Smith',
        })
      })

      it('should return undefined', () => {
        expect(this.transformedContact).to.be.undefined
      })
    })

    context('when the contact object parameter does not contain a name', () => {
      beforeEach(() => {
        this.transformedContact = transformContactToListItem({ id: '1234' })
      })

      it('should return undefined', () => {
        expect(this.transformedContact).to.be.undefined
      })
    })

    context(
      'when the contact object parameter contains only a partial name',
      () => {
        beforeEach(() => {
          this.transformedContact = transformContactToListItem({
            id: '1234',
            first_name: 'Fred',
            last_name: 'Smith',
          })
        })

        it('should return undefined', () => {
          expect(this.transformedContact).to.be.ok
        })
      }
    )

    context(
      'when the contact object parameter contains a valid contact',
      () => {
        beforeEach(() => {
          this.transformedContact =
            transformContactToListItem(contactSearchResult)
        })

        it('should return a transformed contact list item', () => {
          expect(this.transformedContact).to.deep.equal({
            id: '12651151-2149-465e-871b-ac45bc568a62',
            type: 'contact',
            name: 'Fred Smith',
            subTitle: {
              label: 'Updated on',
              type: 'datetime',
              value: '2017-02-14T14:49:17',
            },
            isArchived: false,
            meta: [
              { label: 'Company', value: 'Fred ltd' },
              { label: 'Job title', value: 'Director' },
              { label: 'Sector', value: 'Aerospace' },
              { label: 'Country', value: 'United Kingdom' },
              { label: 'Phone number', value: '+44 07814 333 777' },
              { label: 'Email', value: 'fred@test.com' },
              {
                label: 'Contact type',
                type: 'badge',
                value: 'Primary',
                badgeModifier: 'secondary',
              },
            ],
          })
        })
      }
    )

    context(
      'when the contact object parameter contains an archived contact',
      () => {
        beforeEach(() => {
          const archivedContact = Object.assign({}, contactSearchResult, {
            archived: true,
            archived_on: '2017-03-14T14:49:17',
            archived_by: 'Sam Smith',
            archived_reason: 'Left job',
          })

          this.transformedContact = transformContactToListItem(archivedContact)
        })

        it('should return a transformed contact list item', () => {
          expect(this.transformedContact).to.deep.equal({
            id: '12651151-2149-465e-871b-ac45bc568a62',
            type: 'contact',
            name: 'Fred Smith',
            subTitle: {
              label: 'Updated on',
              type: 'datetime',
              value: '2017-02-14T14:49:17',
            },
            isArchived: true,
            meta: [
              { label: 'Company', value: 'Fred ltd' },
              { label: 'Job title', value: 'Director' },
              { label: 'Sector', value: 'Aerospace' },
              { label: 'Country', value: 'United Kingdom' },
              { label: 'Phone number', value: '+44 07814 333 777' },
              { label: 'Email', value: 'fred@test.com' },
              {
                label: 'Contact type',
                type: 'badge',
                value: 'Primary',
                badgeModifier: 'secondary',
              },
              { label: 'Status', type: 'badge', value: 'Archived' },
            ],
          })
        })
      }
    )
  })
})
