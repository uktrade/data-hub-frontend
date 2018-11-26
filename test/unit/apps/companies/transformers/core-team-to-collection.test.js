const transformOneListCoreTeamToCollection = require('~/src/apps/companies/transformers/one-list-core-team-to-collection')

describe('#transformOneListCoreTeamToCollection', () => {
  beforeEach(() => {
    this.coreTeamMock = require('~/test/unit/data/companies/core-team.json')
  })

  context('when the core team member is a Global Account Manager and from a UK region', () => {
    beforeEach(() => {
      this.collection = transformOneListCoreTeamToCollection(this.coreTeamMock)
    })

    it('should have 1 item in the collection', () => {
      expect(this.collection.accountManagers.length).to.equal(1)
    })

    it('should set the name', () => {
      expect(this.collection.accountManagers[0].name).to.equal('Travis Greene')
    })

    it('should have an accountManager property', () => {
      expect(typeof this.collection.accountManagers).to.equal('object')
    })
  })

  context('when the core team member is not a Global Account Manager and not from a UK region', () => {
    beforeEach(() => {
      this.collection = transformOneListCoreTeamToCollection(this.coreTeamMock)
    })

    it('should have 1 item in the collection', () => {
      expect(this.collection.teamMembers.length).to.equal(1)
    })

    it('should set the name', () => {
      expect(this.collection.teamMembers[0].name).to.equal('Resivda Greene')
    })

    it('should have a teamMember property', () => {
      expect(typeof this.collection.teamMembers).to.equal('object')
    })
  })
})
