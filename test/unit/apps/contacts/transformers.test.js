const {
  transformContactToListItem,
} = require('~/src/apps/contacts/transformers')

describe('Contact transformers', function () {
  describe('#transformContactToListItem', () => {
    const simpleContact = require('~/test/unit/data/simple-contact')

    it('should return undefined for unqualified result', () => {
      expect(transformContactToListItem()).to.be.undefined
      expect(transformContactToListItem({ a: 'b' })).to.be.undefined
      expect(transformContactToListItem({ id: 'abcd' })).to.be.undefined
      expect(transformContactToListItem({ first_name: 'Peter', last_name: 'Great' })).to.be.undefined
    })

    it('should return an object with data for active contact list item', () => {
      const actual = transformContactToListItem(simpleContact)

      expect(actual).to.have.property('id').a('string')
      expect(actual).to.have.property('type').a('string')
      expect(actual).to.have.property('name').a('string')
      expect(actual).to.have.property('isArchived').a('boolean').to.be.false
      expect(actual).to.have.property('meta').an('array').to.deep.equal([
        { label: 'Company', value: 'Fred ltd' },
        { label: 'Updated', type: 'datetime', value: '2017-02-14T14:49:17' },
        { label: 'Sector', value: 'Aerospace' },
        { label: 'Contact type', type: 'badge', value: 'Primary', badgeModifier: 'secondary' },
        { label: 'Country', type: 'badge', value: 'United Kingdom' },
      ])
    })

    it('should return an object with data for archived contact list item', () => {
      const archivedContact = Object.assign({}, simpleContact, {
        archived: true,
        archived_on: '2017-03-14T14:49:17',
        archived_by: 'Sam Smith',
        archived_reason: 'Left job',
      })
      const actual = transformContactToListItem(archivedContact)

      expect(actual).to.have.property('id').a('string')
      expect(actual).to.have.property('type').a('string')
      expect(actual).to.have.property('name').a('string')
      expect(actual).to.have.property('isArchived').a('boolean').to.be.true
      expect(actual).to.have.property('meta').an('array').to.deep.equal([
        { label: 'Company', value: 'Fred ltd' },
        { label: 'Archived', type: 'datetime', value: '2017-03-14T14:49:17' },
        { label: 'Sector', value: 'Aerospace' },
        { label: 'Contact type', type: 'badge', value: 'Primary', badgeModifier: 'secondary' },
        { label: 'Country', type: 'badge', value: 'United Kingdom' },
        { label: 'Reason to archive', value: 'Left job' },
        { label: 'Archived by', value: 'Sam Smith' },
      ])
    })
  })
})
