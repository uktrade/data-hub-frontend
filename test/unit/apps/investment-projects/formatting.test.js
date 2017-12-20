const { assign } = require('lodash')

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
    context('when all fields are not set', () => {
      beforeEach(() => {
        this.actualInvestmentValue = formattingService.transformInvestmentValueForView({
          client_cannot_provide_total_investment: true,
          total_investment: null,
          client_cannot_provide_foreign_investment: true,
          foreign_equity_investment: null,
          number_new_jobs: null,
          number_safeguarded_jobs: null,
          government_assistance: false,
          r_and_d_budget: false,
          average_salary: null,
          new_tech_to_uk: false,
          export_revenue: false,
          sector: null,
          investor_company: null,
          business_activities: [],
          non_fdi_r_and_d_budget: false,
          id: 1,
          associated_non_fdi_r_and_d_project: null,
        })
      })

      it('should correctly format the value view', () => {
        const expectedInvestmentValue = {
          total_investment: 'Client cannot provide this information',
          foreign_equity_investment: 'Client cannot provide this information',
          number_new_jobs: null,
          number_safeguarded_jobs: null,
          government_assistance: 'No government assistance',
          r_and_d_budget: 'No R&D budget',
          average_salary: undefined,
          new_tech_to_uk: 'No new-to-world tech, business model or IP',
          export_revenue: 'No, will not create significant export revenue',
          sector_name: undefined,
          account_tier: undefined,
          business_activities: 'No',
          associated_non_fdi_r_and_d_project: 'Not linked to a non-FDI R&D project',
        }

        expect(this.actualInvestmentValue).to.deep.equal(expectedInvestmentValue)
      })
    })

    context('when all fields are set', () => {
      beforeEach(() => {
        this.actualInvestmentValue = formattingService.transformInvestmentValueForView({
          client_cannot_provide_total_investment: false,
          total_investment: 100000,
          client_cannot_provide_foreign_investment: false,
          foreign_equity_investment: 200000,
          number_new_jobs: 100,
          number_safeguarded_jobs: 200,
          government_assistance: true,
          r_and_d_budget: true,
          average_salary: {
            name: '£30,000 – £34,000',
          },
          new_tech_to_uk: true,
          export_revenue: true,
          sector: {
            name: 'Renewable Energy : Wind : Renewable energy: Wind: Onshore',
          },
          investor_company: {
            name: 'Venus Ltd',
            classification: {
              name: 'New hotel (Non-FDI)',
            },
          },
          business_activities: [
            {
              name: 'European headquarters',
            },
          ],
          non_fdi_r_and_d_budget: true,
          id: 1,
          associated_non_fdi_r_and_d_project: {
            name: 'Freds',
            id: 'ac035522-ad0b-4eeb-87f4-0ce964e4b999',
            project_code: 'DHP-00000460',
          },
        })
      })

      it('should correctly format the value view', () => {
        const expectedInvestmentValue = {
          total_investment: '£100,000',
          foreign_equity_investment: '£200,000',
          number_new_jobs: '100 new jobs',
          number_safeguarded_jobs: '200 safeguarded jobs',
          government_assistance: 'Has government assistance',
          r_and_d_budget: 'Has R&D budget',
          average_salary: '£30,000 – £34,000',
          new_tech_to_uk: 'Has new-to-world tech, business model or IP',
          export_revenue: 'Yes, will create significant export revenue',
          sector_name: 'Renewable Energy : Wind : Renewable energy: Wind: Onshore',
          account_tier: 'New hotel (Non-FDI)',
          business_activities: 'Yes',
          associated_non_fdi_r_and_d_project: {
            name: 'Freds',
            actions: [
              {
                label: 'Edit project',
                url: '/investment-projects/1/edit-associated?term=DHP-00000460',
              },
              {
                label: 'Remove association',
                url: '/investment-projects/1/remove-associated',
              },
            ],
          },
        }

        expect(this.actualInvestmentValue).to.deep.equal(expectedInvestmentValue)
      })
    })

    context('when an investment project is associated with a non-FDI R&D project', () => {
      context('and has no associated project yet', () => {
        beforeEach(() => {
          this.actualInvestmentValue = formattingService.transformInvestmentValueForView({
            client_cannot_provide_total_investment: false,
            total_investment: 100000,
            client_cannot_provide_foreign_investment: false,
            foreign_equity_investment: 200000,
            number_new_jobs: 100,
            number_safeguarded_jobs: 200,
            government_assistance: true,
            r_and_d_budget: true,
            average_salary: {
              name: '£30,000 – £34,000',
            },
            new_tech_to_uk: true,
            export_revenue: true,
            sector: {
              name: 'Renewable Energy : Wind : Renewable energy: Wind: Onshore',
            },
            investor_company: {
              name: 'Venus Ltd',
            },
            business_activities: [
              {
                name: 'European headquarters',
              },
            ],
            non_fdi_r_and_d_budget: true,
            id: 1,
            associated_non_fdi_r_and_d_project: null,
          })
        })

        it('should display a link to find the associated investment project', () => {
          expect(this.actualInvestmentValue.associated_non_fdi_r_and_d_project).to.deep.equal({
            name: 'Find project',
            url: `/investment-projects/1/edit-associated`,
          })
        })
      })
    })

    context('when government assistance is true and all other booleans are false', () => {
      beforeEach(() => {
        this.transformedInvestmentValues = formattingService.transformInvestmentValueForView(assign({}, investmentData, {
          government_assistance: true,
          r_and_d_budget: false,
          new_tech_to_uk: false,
          export_revenue: false,
        }))
      })

      it('should transform the data correctly', () => {
        expect(this.transformedInvestmentValues.government_assistance).to.equal('Has government assistance')
        expect(this.transformedInvestmentValues.r_and_d_budget).to.equal('No R&D budget')
        expect(this.transformedInvestmentValues.new_tech_to_uk).to.equal('No new-to-world tech, business model or IP')
        expect(this.transformedInvestmentValues.export_revenue).to.equal('No, will not create significant export revenue')
      })
    })
  })

  describe('#transformBriefInvestmentSummary', () => {
    context('when a project contains data', () => {
      beforeEach(() => {
        this.investmentSummary = formattingService.transformBriefInvestmentSummary(investmentData)
      })

      it('sound contain the properties required of an investment summary', () => {
        expect(Object.keys(this.investmentSummary)).to.deep.equal([
          'sector',
          'investor_company',
          'website',
          'account_tier',
          'uk_region_locations',
          'competitor_countries',
          'estimated_land_date',
          'total_investment',
        ])
      })

      it('should provide the investor company as a link', () => {
        beforeEach(() => {
          const data = assign({}, investmentData, {
            investor_company: {
              id: '1234',
              name: 'test',
            },
          })

          this.investmentSummary = formattingService.transformBriefInvestmentSummary(data)
        })

        it('should include the sector name', () => {
          expect(this.investmentSummary).to.have.deep.property('investment_company', {
            id: '1234',
            name: 'test',
            url: '/companies/1234',
          })
        })
      })
    })

    context('when a sector is provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          sector: {
            id: '1234',
            name: 'test',
          },
        })

        this.investmentSummary = formattingService.transformBriefInvestmentSummary(data)
      })

      it('should include the sector name', () => {
        expect(this.investmentSummary).to.have.property('sector', 'test')
      })
    })

    context('when a sector isn\'t provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          sector: null,
        })

        this.investmentSummary = formattingService.transformBriefInvestmentSummary(data)
      })

      it('should include a null sector', () => {
        expect(this.investmentSummary).to.have.property('sector', null)
      })
    })

    context('when an investor company has a website', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          investor_company: {
            id: '1234',
            name: 'test',
            website: 'http://www.test.com',
          },
        })

        this.investmentSummary = formattingService.transformBriefInvestmentSummary(data)
      })

      it('should include the website and a link', () => {
        expect(this.investmentSummary).to.have.deep.property('website', {
          name: 'http://www.test.com',
          url: 'http://www.test.com',
        })
      })
    })

    context('when an investor company does not have a website', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          investor_company: {
            id: '1234',
            name: 'test',
            website: null,
          },
        })

        this.investmentSummary = formattingService.transformBriefInvestmentSummary(data)
      })

      it('should include the website and a link', () => {
        expect(this.investmentSummary).to.have.property('website', null)
      })
    })

    context('when investor company has no classification', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          investor_company: {
            classification: null,
          },
        })

        this.investmentSummary = formattingService.transformBriefInvestmentSummary(data)
      })

      it('should include the website and a link', () => {
        expect(this.investmentSummary).to.have.property('account_tier', 'None')
      })
    })

    context('when investor company has a malformed classification', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          investor_company: {
            classification: {
              'colour': 'red',
            },
          },
        })

        this.investmentSummary = formattingService.transformBriefInvestmentSummary(data)
      })

      it('should include the website and a link', () => {
        expect(this.investmentSummary).to.have.property('account_tier', 'None')
      })
    })

    context('when investor company has a valid classification', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          investor_company: {
            classification: {
              id: '1321',
              name: 'Test',
            },
          },
        })

        this.investmentSummary = formattingService.transformBriefInvestmentSummary(data)
      })

      it('should include the website and a link', () => {
        expect(this.investmentSummary).to.have.property('account_tier', 'Test')
      })
    })

    context('when uk regions are provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          uk_region_locations: [{
            id: '4321',
            name: 'Region 1',
          }, {
            id: '1234',
            name: 'Region 2',
          }],
        })

        this.investmentSummary = formattingService.transformBriefInvestmentSummary(data)
      })

      it('should include the website and a link', () => {
        expect(this.investmentSummary).to.have.property('uk_region_locations', 'Region 1, Region 2')
      })
    })

    context('when uk regions are not provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          uk_region_locations: null,
        })

        this.investmentSummary = formattingService.transformBriefInvestmentSummary(data)
      })

      it('should include the website and a link', () => {
        expect(this.investmentSummary).to.have.property('uk_region_locations', '')
      })
    })

    context('when competitor countries are provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          competitor_countries: [{
            id: '4321',
            name: 'Country 1',
          }, {
            id: '1234',
            name: 'Country 2',
          }],
        })

        this.investmentSummary = formattingService.transformBriefInvestmentSummary(data)
      })

      it('should include the website and a link', () => {
        expect(this.investmentSummary).to.have.property('competitor_countries', 'Country 1, Country 2')
      })
    })

    context('when competitor countries are not provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          competitor_countries: null,
        })

        this.investmentSummary = formattingService.transformBriefInvestmentSummary(data)
      })

      it('should include the website and a link', () => {
        expect(this.investmentSummary).to.have.property('competitor_countries', '')
      })
    })

    context('when a land date is provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          estimated_land_date: '2017-01-07',
        })

        this.investmentSummary = formattingService.transformBriefInvestmentSummary(data)
      })

      it('should include the website and a link', () => {
        expect(this.investmentSummary).to.have.property('estimated_land_date', 'January 2017')
      })
    })

    context('when a land date is not provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          estimated_land_date: null,
        })

        this.investmentSummary = formattingService.transformBriefInvestmentSummary(data)
      })

      it('should include the website and a link', () => {
        expect(this.investmentSummary).to.have.property('estimated_land_date', null)
      })
    })

    context('when a malformed land date is provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          estimated_land_date: 'dog',
        })

        this.investmentSummary = formattingService.transformBriefInvestmentSummary(data)
      })

      it('should include the website and a link', () => {
        expect(this.investmentSummary).to.have.property('estimated_land_date', null)
      })
    })

    context('when a total investment is provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          total_investment: '100.24',
        })

        this.investmentSummary = formattingService.transformBriefInvestmentSummary(data)
      })

      it('should include the website and a link', () => {
        expect(this.investmentSummary).to.have.property('total_investment', '£100.24')
      })
    })

    context('when a cotal investment is not provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          total_investment: null,
        })

        this.investmentSummary = formattingService.transformBriefInvestmentSummary(data)
      })

      it('should include the website and a link', () => {
        expect(this.investmentSummary).to.have.property('total_investment', null)
      })
    })
  })
})
