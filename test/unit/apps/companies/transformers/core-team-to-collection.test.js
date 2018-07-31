const transformCoreTeamToCollection = require('~/src/apps/companies/transformers/core-team-to-collection')

describe('#transformCoreTeamToCollection', () => {
  beforeEach(() => {
    this.coreTeamMock = require('~/test/unit/data/companies/core-team.json')
  })

  context('when the core team member is a global account manager and from a UK region', () => {
    beforeEach(() => {
      this.collection = transformCoreTeamToCollection(this.coreTeamMock)
    })

    it('should have 1 item in the collection', () => {
      expect(this.collection.length).to.equal(1)
    })

    it('should set the name', () => {
      expect(this.collection[0].name).to.equal('Travis Greene')
    })

    it('should set the type', () => {
      expect(this.collection[0].type).to.equal('adviser')
    })

    it('should set the subtitle', () => {
      expect(this.collection[0].subTitle.value).to.equal('Global Account Manager')
    })

    it('should set the meta with region', () => {
      expect(this.collection[0].meta).to.deep.equal([
        {
          'label': 'Region',
          'value': 'London',
        },
        {
          'label': 'Country',
          'value': 'United Kingdom',
        },
        {
          'label': 'Team',
          'value': 'IST - Sector Advisory Services',
        },
      ])
    })
  })

  context('when the core team member is not a global account manager and not from a UK region', () => {
    beforeEach(() => {
      this.coreTeamMock[0].is_global_account_manager = false
      delete this.coreTeamMock[0].adviser.dit_team.uk_region

      this.collection = transformCoreTeamToCollection(this.coreTeamMock)
    })

    it('should have 1 item in the collection', () => {
      expect(this.collection.length).to.equal(1)
    })

    it('should set the name', () => {
      expect(this.collection[0].name).to.equal('Travis Greene')
    })

    it('should set the type', () => {
      expect(this.collection[0].type).to.equal('adviser')
    })

    it('should not set the subtitle', () => {
      expect(this.collection[0].subTitle).to.be.undefined
    })

    it('should set the meta without region', () => {
      expect(this.collection[0].meta).to.deep.equal([
        {
          'label': 'Country',
          'value': 'United Kingdom',
        },
        {
          'label': 'Team',
          'value': 'IST - Sector Advisory Services',
        },
      ])
    })
  })
})
