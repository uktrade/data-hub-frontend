const transformOneListCoreTeamToCollection = require('../one-list-core-team-to-collection')

const coreTeamMock = require('../../../../../test/sandbox/fixtures/v4/company/one-list-group-core-team.json')

describe('#transformOneListCoreTeamToCollection', () => {
  context(
    'when the core team member is a Global Account Manager and from a UK region',
    () => {
      beforeEach(() => {
        this.collection = transformOneListCoreTeamToCollection(coreTeamMock)
      })

      it('should set the account manager', () => {
        expect(this.collection.accountManagers).to.deep.equal([
          {
            name: 'Travis Greene',
            team: 'IST - Sector Advisory Services',
            location: 'London',
          },
        ])
      })

      it('should set the team members', () => {
        expect(this.collection.teamMembers).to.deep.equal([
          {
            name: 'Holly Collins',
            team: 'Heart of the South West LEP',
            location: 'United Kingdom',
          },
          {
            name: 'Jenny Carey',
            team: 'IG - Specialists - Knowledge Intensive Industry',
            location: 'London',
          },
        ])
      })
    }
  )
})
