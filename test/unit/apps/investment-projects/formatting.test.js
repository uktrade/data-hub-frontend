const investmentData = require('~/test/unit/data/investment/investment-data.json')
const formattingService = require('~/src/apps/investment-projects/services/formatting')

describe('Investment project formatting service', () => {
  describe('#transformProjectManagementForView', () => {
    it('should return null if there is no project manager or assurance adviser', () => {
      const data = Object.assign({}, investmentData)
      data.project_manager = null
      data.project_assurance_adviser = null

      const projectManagementData = formattingService.transformProjectManagementForView(data)
      expect(projectManagementData).to.deep.equal(null)
    })

    it('should return formatted data for the project manager and assurance adviser if there are both', () => {
      const data = Object.assign({}, investmentData)
      const expectedProjectManagementData = [{
        role: 'Project assurance adviser',
        adviser: 'John Brown',
        team: 'Team B',
      }, {
        role: 'Project manager',
        adviser: 'Fred Smith',
        team: 'Team A',
      }]

      const projectManagementData = formattingService.transformProjectManagementForView(data)
      expect(projectManagementData).to.deep.equal(expectedProjectManagementData)
    })

    it('should return formatted data for project manager, and todo for assurance officer if no assurance officer', () => {
      const data = Object.assign({}, investmentData)
      data.project_assurance_adviser = null
      data.project_assurance_team = null

      const expectedProjectManagementData = [{
        role: 'Project assurance adviser',
        adviser: 'To do',
        team: null,
      }, {
        role: 'Project manager',
        adviser: 'Fred Smith',
        team: 'Team A',
      }]

      const projectManagementData = formattingService.transformProjectManagementForView(data)
      expect(projectManagementData).to.deep.equal(expectedProjectManagementData)
    })

    it('should return formatted data for assurance adviser and todo for project manager is there is no project manager', () => {
      const data = Object.assign({}, investmentData)
      data.project_manager = null
      data.project_manager_team = null

      const expectedProjectManagementData = [{
        role: 'Project assurance adviser',
        adviser: 'John Brown',
        team: 'Team B',
      }, {
        role: 'Project manager',
        adviser: 'To do',
        team: null,
      }]

      const projectManagementData = formattingService.transformProjectManagementForView(data)
      expect(projectManagementData).to.deep.equal(expectedProjectManagementData)
    })
  })

  describe('#transformClientRelationshipManagementForView', () => {
    it('should return just the client relationship manager details if there is no account manager', () => {
      const data = {
        client_relationship_manager: {
          id: '123',
          first_name: 'Fred',
          last_name: 'Smith',
          dit_team: {
            id: '3321',
            name: 'Team Fred',
          },
        },
        investor_company: {
          account_manager: null,
        },
      }

      const expectedResult = [{
        adviser: 'Fred Smith',
        role: 'Client relationship manager',
        team: 'Team Fred',
      }]

      const actualResult = formattingService.transformClientRelationshipManagementForView(data)
      expect(actualResult).to.deep.equal(expectedResult)
    })

    it('should return account manager details if there is an account manager also', () => {
      const data = {
        client_relationship_manager: {
          id: '123',
          first_name: 'Fred',
          last_name: 'Smith',
          dit_team: {
            id: '3321',
            name: 'Team Fred',
          },
        },
        investor_company: {
          account_manager: {
            id: '321',
            name: 'John Brown',
            dit_team: {
              name: 'Johns Team',
            },
          },
        },
      }

      const expectedResult = [{
        adviser: 'Fred Smith',
        role: 'Client relationship manager',
        team: 'Team Fred',
      }, {
        adviser: 'John Brown',
        role: 'Account manager',
        team: 'Johns Team',
      }]

      const actualResult = formattingService.transformClientRelationshipManagementForView(data)
      expect(actualResult).to.deep.equal(expectedResult)
    })
  })

  describe('#transformTeamMembersForView', () => {
    it('should return a formatted version of team member data', () => {
      const teamMembers = [{
        adviser: {
          id: '1234',
          first_name: 'Fred',
          last_name: 'Smith',
          name: 'Fred Smith',
          dit_team: {
            id: '444',
            name: 'Freds Team',
          },
        },
        role: 'Director',
      }]

      const expected = [{
        adviser: 'Fred Smith',
        team: 'Freds Team',
        role: 'Director',
      }]

      const actual = teamMembers.map(formattingService.transformTeamMembersForView)
      expect(actual).to.deep.equal(expected)
    })
  })
})
