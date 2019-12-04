const investmentData = require('../../../../../test/unit/data/investment/investment-data.json')

const {
  transformProjectManagementForView,
  transformClientRelationshipManagementForView,
  transformTeamMembersForView,
} = require('../team')

describe('Investment project transformers', () => {
  describe('#transformProjectManagementForView', () => {
    it('should return null if there is no project manager or assurance adviser', () => {
      const data = Object.assign({}, investmentData)
      data.project_manager = null
      data.project_assurance_adviser = null

      const projectManagementData = transformProjectManagementForView(data)
      expect(projectManagementData).to.deep.equal(null)
    })

    it('should return formatted data for the project manager and assurance adviser if there are both', () => {
      const data = Object.assign({}, investmentData)
      const expectedProjectManagementData = [{
        role: 'Project Assurance Adviser',
        adviser: 'John Brown',
        team: 'Team B',
      }, {
        role: 'Project Manager',
        adviser: 'Fred Smith',
        team: 'Team A',
      }]

      const projectManagementData = transformProjectManagementForView(data)
      expect(projectManagementData).to.deep.equal(expectedProjectManagementData)
    })

    it('should return formatted data for project manager, and todo for assurance officer if no assurance officer', () => {
      const data = Object.assign({}, investmentData)
      data.project_assurance_adviser = null
      data.project_assurance_team = null

      const expectedProjectManagementData = [{
        role: 'Project Assurance Adviser',
        adviser: 'To do',
        team: null,
      }, {
        role: 'Project Manager',
        adviser: 'Fred Smith',
        team: 'Team A',
      }]

      const projectManagementData = transformProjectManagementForView(data)
      expect(projectManagementData).to.deep.equal(expectedProjectManagementData)
    })

    it('should return formatted data for assurance adviser and todo for project manager is there is no project manager', () => {
      const data = Object.assign({}, investmentData)
      data.project_manager = null
      data.project_manager_team = null

      const expectedProjectManagementData = [{
        role: 'Project Assurance Adviser',
        adviser: 'John Brown',
        team: 'Team B',
      }, {
        role: 'Project Manager',
        adviser: 'To do',
        team: null,
      }]

      const projectManagementData = transformProjectManagementForView(data)
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
        },
      }

      const expectedResult = [{
        adviser: 'Fred Smith',
        role: 'Client Relationship Manager',
        team: 'Team Fred',
      }]

      const actualResult = transformClientRelationshipManagementForView(data)
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
          one_list_group_global_account_manager: {
            id: '321',
            first_name: 'John',
            last_name: 'Brown',
            dit_team: {
              name: 'Johns Team',
            },
          },
        },
      }

      const expectedResult = [{
        adviser: 'Fred Smith',
        role: 'Client Relationship Manager',
        team: 'Team Fred',
      }, {
        adviser: 'John Brown',
        role: 'Global Account Manager',
        team: 'Johns Team',
      }]

      const actualResult = transformClientRelationshipManagementForView(data)
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

      const actual = teamMembers.map(transformTeamMembersForView)
      expect(actual).to.deep.equal(expected)
    })
  })
})
