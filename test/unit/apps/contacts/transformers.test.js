const {
  transformContactToListItem,
} = require('~/src/apps/contacts/transformers')

const contactsData = require('~/test/unit/data/contacts/collection')

describe('Investment project data transformers', () => {
  describe('#transformContactToListItem', () => {
    it('should transform investment project items into investment project entity list items', () => {
      const actual = contactsData.results.map(transformContactToListItem)
      const firstItem = actual[0]

      expect(actual).to.have.length(10)
      expect(firstItem.id).to.be.a('string')
      expect(firstItem.name).to.be.a('string').and.equal(`${contactsData.results[0].first_name} ${contactsData.results[0].last_name}`)
      expect(firstItem.type).to.be.a('string').and.equal('contact')
      expect(firstItem.meta).to.be.an('array').that.have.length(5)

      expect(firstItem.meta[0].label).to.equal('Contact type')
      expect(firstItem.meta[0].value).to.equal('Primary')
      expect(firstItem.meta[0].type).to.equal('badge')
      expect(firstItem.meta[1].label).to.equal('Company')
      expect(firstItem.meta[1].value).to.equal('4F  (OTCF S.A.)')
      expect(firstItem.meta[2].label).to.equal('Country')
      expect(firstItem.meta[2].value).to.equal('Poland')
      expect(firstItem.meta[3].label).to.equal('Created')
      expect(firstItem.meta[3].value).to.equal('2016-02-25T09:07:38')
      expect(firstItem.meta[4].label).to.equal('Modified')
      expect(firstItem.meta[4].value).to.equal('2016-04-24T19:08:59')
    })
  })
})
