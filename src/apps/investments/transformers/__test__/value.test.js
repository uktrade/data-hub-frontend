const { assign } = require('lodash')

const investmentData = require('../../../../../test/unit/data/investment/investment-data.json')

const {
  transformInvestmentValueForView,
  transformInvestmentValueFormBodyToApiRequest,
} = require('../value')

describe('Investment project transformers', () => {
  describe('#transformInvestmentValueForView', () => {
    context('when all fields are not set', () => {
      beforeEach(() => {
        this.actualInvestmentValue = transformInvestmentValueForView({
          client_cannot_provide_total_investment: true,
          total_investment: null,
          client_cannot_provide_foreign_investment: true,
          foreign_equity_investment: null,
          gross_value_added: null,
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
          likelihood_to_land: null,
        })
      })

      it('should correctly format the value view', () => {
        const expectedInvestmentValue = {
          total_investment: 'Client cannot provide this information',
          foreign_equity_investment: 'Client cannot provide this information',
          gross_value_added: null,
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
          associated_non_fdi_r_and_d_project:
            'Not linked to a non-FDI R&D project',
          likelihood_to_land: null,
        }

        expect(this.actualInvestmentValue).to.deep.equal(
          expectedInvestmentValue
        )
      })
    })

    context('when all fields are set', () => {
      beforeEach(() => {
        this.actualInvestmentValue = transformInvestmentValueForView({
          client_cannot_provide_total_investment: false,
          total_investment: 100000,
          client_cannot_provide_foreign_investment: false,
          foreign_equity_investment: 200000,
          gross_value_added: 16500,
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
            one_list_group_tier: {
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
          likelihood_to_land: {
            name: 'Low',
            id: 'b3515282-dc36-487a-a5af-320cde165575',
          },
        })
      })

      it('should correctly format the value view', () => {
        const expectedInvestmentValue = {
          total_investment: {
            type: 'currency',
            name: 100000,
          },
          foreign_equity_investment: {
            type: 'currency',
            name: 200000,
          },
          gross_value_added: {
            name: 16500,
            type: 'currency',
          },
          number_new_jobs: '100 new jobs',
          number_safeguarded_jobs: '200 safeguarded jobs',
          government_assistance: 'Has government assistance',
          r_and_d_budget: 'Has R&D budget',
          average_salary: '£30,000 – £34,000',
          new_tech_to_uk: 'Has new-to-world tech, business model or IP',
          export_revenue: 'Yes, will create significant export revenue',
          sector_name:
            'Renewable Energy : Wind : Renewable energy: Wind: Onshore',
          account_tier: 'New hotel (Non-FDI)',
          business_activities: 'Yes',
          associated_non_fdi_r_and_d_project: {
            name: 'Freds',
            actions: [
              {
                label: 'Edit project',
                url:
                  '/investments/projects/1/edit-associated?term=DHP-00000460',
                test: 'edit-associated-link',
              },
              {
                label: 'Remove association',
                url: '/investments/projects/1/remove-associated',
                test: 'remove-associated-link',
              },
            ],
          },
          likelihood_to_land: {
            name: 'Low',
            id: 'b3515282-dc36-487a-a5af-320cde165575',
          },
        }

        expect(this.actualInvestmentValue).to.deep.equal(
          expectedInvestmentValue
        )
      })
    })

    context(
      'when all fields are set but the client has not supplied investment information',
      () => {
        beforeEach(() => {
          this.actualInvestmentValue = transformInvestmentValueForView({
            client_cannot_provide_total_investment: false,
            total_investment: null,
            client_cannot_provide_foreign_investment: false,
            foreign_equity_investment: null,
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
              one_list_group_tier: {
                name: 'Tier A - Strategic Account',
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
            likelihood_to_land: {
              name: 'Low',
              id: 'b3515282-dc36-487a-a5af-320cde165575',
            },
          })
        })

        it('should correctly format the value view', () => {
          const expectedInvestmentValue = {
            total_investment: null,
            foreign_equity_investment: null,
            gross_value_added: null,
            number_new_jobs: '100 new jobs',
            number_safeguarded_jobs: '200 safeguarded jobs',
            government_assistance: 'Has government assistance',
            r_and_d_budget: 'Has R&D budget',
            average_salary: '£30,000 – £34,000',
            new_tech_to_uk: 'Has new-to-world tech, business model or IP',
            export_revenue: 'Yes, will create significant export revenue',
            sector_name:
              'Renewable Energy : Wind : Renewable energy: Wind: Onshore',
            account_tier: 'Tier A - Strategic Account',
            business_activities: 'Yes',
            associated_non_fdi_r_and_d_project: {
              name: 'Freds',
              actions: [
                {
                  label: 'Edit project',
                  url:
                    '/investments/projects/1/edit-associated?term=DHP-00000460',
                  test: 'edit-associated-link',
                },
                {
                  label: 'Remove association',
                  url: '/investments/projects/1/remove-associated',
                  test: 'remove-associated-link',
                },
              ],
            },
            likelihood_to_land: {
              name: 'Low',
              id: 'b3515282-dc36-487a-a5af-320cde165575',
            },
          }

          expect(this.actualInvestmentValue).to.deep.equal(
            expectedInvestmentValue
          )
        })
      }
    )

    context(
      'when an investment project is associated with a non-FDI R&D project',
      () => {
        context('and has no associated project yet', () => {
          beforeEach(() => {
            this.actualInvestmentValue = transformInvestmentValueForView({
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
                name:
                  'Renewable Energy : Wind : Renewable energy: Wind: Onshore',
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
            expect(
              this.actualInvestmentValue.associated_non_fdi_r_and_d_project
            ).to.deep.equal({
              name: 'Find project',
              url: `/investments/projects/1/edit-associated`,
              test: 'edit-associated-link',
            })
          })
        })
      }
    )

    context(
      'when government assistance is true and all other booleans are false',
      () => {
        beforeEach(() => {
          this.transformedInvestmentValues = transformInvestmentValueForView(
            assign({}, investmentData, {
              government_assistance: true,
              r_and_d_budget: false,
              new_tech_to_uk: false,
              export_revenue: false,
            })
          )
        })

        it('should transform the data correctly', () => {
          expect(
            this.transformedInvestmentValues.government_assistance
          ).to.equal('Has government assistance')
          expect(this.transformedInvestmentValues.r_and_d_budget).to.equal(
            'No R&D budget'
          )
          expect(this.transformedInvestmentValues.new_tech_to_uk).to.equal(
            'No new-to-world tech, business model or IP'
          )
          expect(this.transformedInvestmentValues.export_revenue).to.equal(
            'No, will not create significant export revenue'
          )
        })
      }
    )
  })

  describe('#transformInvestmentValueFormBodyToApiRequest', () => {
    context('when all fields have been filled in', () => {
      beforeEach(() => {
        const formData = {
          client_cannot_provide_total_investment: 'false',
          total_investment: '10000',
          client_cannot_provide_foreign_investment: 'false',
          foreign_equity_investment: '5000',
          number_new_jobs: '10',
          average_salary: '2943bf3d-32dd-43be-8ad4-969b006dee7b',
          number_safeguarded_jobs: '100',
          fdi_value: '38e36c77-61ad-4186-a7a8-ac6a1a1104c6',
          government_assistance: 'false',
          r_and_d_budget: 'false',
          non_fdi_r_and_d_budget: 'false',
          new_tech_to_uk: 'false',
          export_revenue: 'false',
        }
        this.transformedData = transformInvestmentValueFormBodyToApiRequest(
          formData
        )
      })

      it('transforms and returns the entire object', () => {
        expect(this.transformedData).to.deep.equal({
          client_cannot_provide_total_investment: 'false',
          total_investment: '10000',
          client_cannot_provide_foreign_investment: 'false',
          foreign_equity_investment: '5000',
          number_new_jobs: '10',
          average_salary: '2943bf3d-32dd-43be-8ad4-969b006dee7b',
          number_safeguarded_jobs: '100',
          fdi_value: '38e36c77-61ad-4186-a7a8-ac6a1a1104c6',
          government_assistance: 'false',
          r_and_d_budget: 'false',
          non_fdi_r_and_d_budget: 'false',
          new_tech_to_uk: 'false',
          export_revenue: 'false',
        })
      })
    })

    context('when the client cannot provide the total investment value', () => {
      beforeEach(() => {
        const formData = {
          client_cannot_provide_total_investment: 'true',
          total_investment: '10000',
          client_cannot_provide_foreign_investment: 'false',
          foreign_equity_investment: '5000',
          number_new_jobs: '10',
          average_salary: '2943bf3d-32dd-43be-8ad4-969b006dee7b',
          number_safeguarded_jobs: '100',
          fdi_value: '38e36c77-61ad-4186-a7a8-ac6a1a1104c6',
          government_assistance: 'false',
          r_and_d_budget: 'false',
          non_fdi_r_and_d_budget: 'false',
          new_tech_to_uk: 'false',
          export_revenue: 'false',
        }
        this.transformedData = transformInvestmentValueFormBodyToApiRequest(
          formData
        )
      })

      it('sets the total investment value to null', () => {
        expect(this.transformedData).to.deep.equal({
          client_cannot_provide_total_investment: 'true',
          total_investment: null,
          client_cannot_provide_foreign_investment: 'false',
          foreign_equity_investment: '5000',
          number_new_jobs: '10',
          average_salary: '2943bf3d-32dd-43be-8ad4-969b006dee7b',
          number_safeguarded_jobs: '100',
          fdi_value: '38e36c77-61ad-4186-a7a8-ac6a1a1104c6',
          government_assistance: 'false',
          r_and_d_budget: 'false',
          non_fdi_r_and_d_budget: 'false',
          new_tech_to_uk: 'false',
          export_revenue: 'false',
        })
      })
    })

    context(
      'when the client cannot provide the foreign equity investment value',
      () => {
        beforeEach(() => {
          const formData = {
            client_cannot_provide_total_investment: 'false',
            total_investment: '10000',
            client_cannot_provide_foreign_investment: 'true',
            foreign_equity_investment: '5000',
            number_new_jobs: '10',
            average_salary: '2943bf3d-32dd-43be-8ad4-969b006dee7b',
            number_safeguarded_jobs: '100',
            fdi_value: '38e36c77-61ad-4186-a7a8-ac6a1a1104c6',
            government_assistance: 'false',
            r_and_d_budget: 'false',
            non_fdi_r_and_d_budget: 'false',
            new_tech_to_uk: 'false',
            export_revenue: 'false',
          }
          this.transformedData = transformInvestmentValueFormBodyToApiRequest(
            formData
          )
        })

        it('sets the foreign total investment value to null', () => {
          expect(this.transformedData).to.deep.equal({
            client_cannot_provide_total_investment: 'false',
            total_investment: '10000',
            client_cannot_provide_foreign_investment: 'true',
            foreign_equity_investment: null,
            number_new_jobs: '10',
            average_salary: '2943bf3d-32dd-43be-8ad4-969b006dee7b',
            number_safeguarded_jobs: '100',
            fdi_value: '38e36c77-61ad-4186-a7a8-ac6a1a1104c6',
            government_assistance: 'false',
            r_and_d_budget: 'false',
            non_fdi_r_and_d_budget: 'false',
            new_tech_to_uk: 'false',
            export_revenue: 'false',
          })
        })
      }
    )

    context('when no fields are filled in', () => {
      beforeEach(() => {
        const formData = {
          total_investment: '',
          foreign_equity_investment: '',
          number_new_jobs: '',
          number_safeguarded_jobs: '',
          fdi_value: '',
        }
        this.transformedData = transformInvestmentValueFormBodyToApiRequest(
          formData
        )
      })

      it('sets numerical fields to null', () => {
        expect(this.transformedData).to.deep.equal({
          total_investment: null,
          foreign_equity_investment: null,
          number_new_jobs: null,
          number_safeguarded_jobs: null,
          fdi_value: '',
        })
      })
    })
  })
})
