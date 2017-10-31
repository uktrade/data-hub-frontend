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

  describe('#transformInvestmentRequirementsForView', () => {
    context('when no uk company is provided', () => {
      beforeEach(() => {
        this.investmentData = Object.assign({}, investmentData, {
          id: 1,
          uk_company: null,
        })

        this.transformedInvestmentRequirements = formattingService.transformInvestmentRequirementsForView(this.investmentData)
      })

      it('should set the investment details to display a link to find a company', () => {
        expect(this.transformedInvestmentRequirements.uk_company).to.deep.equal({
          name: 'Find company',
          url: `/investment-projects/1/edit-ukcompany`,
        })
      })
    })

    context('when a uk company has previously been set', () => {
      beforeEach(() => {
        this.investmentData = Object.assign({}, investmentData, {
          id: 1,
          uk_company: {
            id: '1234',
            name: 'Freds',
          },
        })

        this.transformedInvestmentRequirements = formattingService.transformInvestmentRequirementsForView(this.investmentData)
      })

      it('should set the investment details to display the company name', () => {
        expect(this.transformedInvestmentRequirements.uk_company.name).to.equal('Freds')
      })

      it('should set the investment details to display an action to edit the company money is going through', () => {
        expect(this.transformedInvestmentRequirements.uk_company.actions[0]).to.deep.equal({
          label: 'Edit company',
          url: `/investment-projects/1/edit-ukcompany?term=Freds`,
        })
      })

      it('should set the investment details to display an action to remove the company the money is going through', () => {
        expect(this.transformedInvestmentRequirements.uk_company.actions[1]).to.deep.equal({
          label: 'Remove company',
          url: `/investment-projects/1/remove-ukcompany`,
        })
      })
    })
  })

  describe('#transformInvestmentValueForView', () => {
    context('when a project says it is associated with a non-fdi r&d project', () => {
      beforeEach(() => {
        this.investmentData = Object.assign({}, investmentData, {
          id: 1,
          non_fdi_r_and_d_budget: true,
        })
      })

      context('and has no associated project yet', () => {
        beforeEach(() => {
          this.investmentData = Object.assign({}, this.investmentData, {
            associated_non_fdi_r_and_d_project: null,
          })

          this.transformedInvestmentValues = formattingService.transformInvestmentValueForView(this.investmentData)
        })

        it('should display a link to find the associated investment project', () => {
          expect(this.transformedInvestmentValues.associated_non_fdi_r_and_d_project).to.deep.equal({
            name: 'Find project',
            url: `/investment-projects/1/edit-associated`,
          })
        })
      })

      context('and has an associated r&d project', () => {
        beforeEach(() => {
          this.investmentData = Object.assign({}, this.investmentData, {
            associated_non_fdi_r_and_d_project: {
              name: 'Freds',
              id: 'ac035522-ad0b-4eeb-87f4-0ce964e4b999',
              project_code: 'DHP-00000460',
            },
          })

          this.transformedInvestmentValues = formattingService.transformInvestmentValueForView(this.investmentData)
        })

        it('should show the name of the project associated with this one', () => {
          expect(this.transformedInvestmentValues.associated_non_fdi_r_and_d_project.name).to.equal('Freds')
        })

        it('should display an action to edit the associated project', () => {
          expect(this.transformedInvestmentValues.associated_non_fdi_r_and_d_project.actions[0]).to.deep.equal({
            label: 'Edit project',
            url: `/investment-projects/1/edit-associated?term=DHP-00000460`,
          })
        })

        it('should display an action to remove the associated project', () => {
          expect(this.transformedInvestmentValues.associated_non_fdi_r_and_d_project.actions[1]).to.deep.equal({
            label: 'Remove association',
            url: `/investment-projects/1/remove-associated`,
          })
        })
      })
    })

    context('when a project says it is not associated with a non-fdi r&d project', () => {
      beforeEach(() => {
        this.investmentData = Object.assign({}, investmentData, {
          id: 1,
          non_fdi_r_and_d_budget: false,
        })

        this.transformedInvestmentValues = formattingService.transformInvestmentValueForView(this.investmentData)
      })

      it('should indicate there is no non-fdi r&d project', () => {
        expect(this.transformedInvestmentValues.associated_non_fdi_r_and_d_project).to.equal('Not linked to a non-FDI R&D project')
      })
    })
  })
})
