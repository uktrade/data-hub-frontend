const {
  assertBreadcrumbs,
  assertErrorSummary,
  assertFieldInput,
  assertFieldRadios,
  assertFieldUneditable,
  assertLocalHeader,
} = require('../../support/assertions')
const { investments } = require('../../../../../src/lib/urls')
const { investmentProjectFaker } = require('../../fakers/investment-projects')

const capitalIntensiveProjectWithValue = require('../../fixtures/investment/capital-investment-has-existing-value.json')
const capitalIntensiveProjectNoValue = require('../../fixtures/investment/capital-investment-no-value.json')
const capitalIntensiveProjectWithNoSectorOrCapitalExp = require('../../fixtures/investment/capital-investment-no-sector.json')
const capitalIntensiveProjectWithCapitalExpButNoSector = require('../../fixtures/investment/capital-investment-has-capital-expenditure-but-no-sector.json')
//const labourIntensiveProjectNoValue = require('../../fixtures/investment/labour-investment-no-value.json')
const labourIntensiveProjectWithValue = require('../../fixtures/investment/labour-investment-has-existing-value.json')
const labourIntensiveProjectWithNoSectorOrNoNewJobs = require('../../fixtures/investment/labour-investment-no-sector-no-jobs.json')
const labourIntensiveProjectWithNewJobsButNoSector = require('../../fixtures/investment/labour-investment-has-new-jobs-but-no-sector.json')
const projectLandingBeforeApril = require('../../fixtures/investment/investment-land-date-before-April-2020.json')
const projectLandingAfterApril = require('../../fixtures/investment/investment-land-date-after-April-2020.json')
const projectNoLandingDates = require('../../fixtures/investment/investment-no-landing-dates.json')
const projectBothDatesBeforeApril = require('../../fixtures/investment/investment-both-land-dates-before-April-2020.json')
const projectBothDatesAfterApril = require('../../fixtures/investment/investment-both-land-dates-after-April-2020.json')
const projectOneLandDateEitherSideApril = require('../../fixtures/investment/investment-one-land-date-before-April-one-after.json')
const projectNotFDI = require('../../fixtures/investment/investment-no-existing-requirements.json')
const projectCreatedBefore = require('../../fixtures/investment/investment-created-before.json')
const projectCreatedSame = require('../../fixtures/investment/investment-created-same-date.json')
const projectCreatedAfter = require('../../fixtures/investment/investment-created-after.json')

const convertBoolToYesNo = (valueToCheck) => (valueToCheck ? 'Yes' : 'No')
const convertBoolToInvertedYesNo = (valueToCheck) =>
  valueToCheck ? 'No' : 'Yes'

describe('Edit the value details of a project', () => {
  context(
    'When viewing a capital intensive project with no value fields set',
    () => {
      beforeEach(() => {
        cy.visit(
          investments.projects.editValue(capitalIntensiveProjectNoValue.id)
        )
      })

      it('should render the header', () => {
        assertLocalHeader(capitalIntensiveProjectNoValue.name)
      })

      it('should render breadcrumbs', () => {
        assertBreadcrumbs({
          Home: '/',
          Investments: investments.index(),
          Projects: investments.projects.index(),
          [capitalIntensiveProjectNoValue.name]: investments.projects.details(
            capitalIntensiveProjectNoValue.id
          ),
          'Edit value': null,
        })
      })

      it('should display the cannot provide total field', () => {
        cy.get(
          '[data-test="field-client_cannot_provide_total_investment"]'
        ).then((element) => {
          assertFieldRadios({
            element,
            label: 'Can client provide total investment value?',
            hint: 'Includes capital, operational and R&D expenditure',
            optionsCount: 2,
          })
        })
      })

      it('should only display total investment if "Yes" is selected', () => {
        cy.get('[data-test="total_investment]').should('not.exist')
        cy.get(
          '[data-test="client-cannot-provide-total-investment-no"]'
        ).click()
        cy.get('[data-test="total_investment]').should('not.exist')
        cy.get(
          '[data-test="client-cannot-provide-total-investment-yes"]'
        ).click()
        cy.get('[data-test="field-total_investment"]').then((element) => {
          assertFieldInput({
            element,
            label: 'Total investment',
            hint: 'Enter the total number of GB pounds',
          })
        })
      })

      it('should display the cannot provide foreign investment field', () => {
        cy.get(
          '[data-test="field-client_cannot_provide_foreign_investment"]'
        ).then((element) => {
          assertFieldRadios({
            element,
            label: 'Can client provide capital expenditure value?',
            hint: 'Foreign equity only, excluding operational and R&D expenditure',
            optionsCount: 2,
          })
        })
      })

      it('should only display total investment if "Yes" is selected', () => {
        cy.get('[data-test="foreign_equity_investment]').should('not.exist')
        cy.get(
          '[data-test="client-cannot-provide-foreign-investment-no"]'
        ).click()
        cy.get('[data-test="foreign_equity_investment]').should('not.exist')
        cy.get(
          '[data-test="client-cannot-provide-foreign-investment-yes"]'
        ).click()
        cy.get('[data-test="field-foreign_equity_investment"]').then(
          (element) => {
            assertFieldInput({
              element,
              label: 'Capital expenditure value',
              hint: 'Enter the total number of GB pounds',
            })
          }
        )
        cy.get('[data-test="field-gross_value_added_capital"]').then(
          (element) => {
            assertFieldUneditable({
              element,
              label: 'Gross value added (GVA)',
              value:
                'Add capital expenditure value and click "Save" to calculate GVA',
            })
          }
        )
      })

      it('should display the number of new jobs field', () => {
        cy.get('[data-test="field-number_new_jobs"]').then((element) => {
          assertFieldInput({
            element,
            label: 'Number of new jobs',
          })
        })
      })

      it('should not display the GVA calculation for number of new jobs', () => {
        cy.get('[data-test="field-gross_value_added_labour"]').should(
          'not.exist'
        )
      })

      it('should display the average salary field', () => {
        cy.get('[data-test="field-average_salary"]').then((element) => {
          assertFieldRadios({
            element,
            label: 'Average salary of new jobs',
            optionsCount: 3,
          })
        })
      })

      it('should display the number of safeguarded jobs field', () => {
        cy.get('[data-test="field-number_safeguarded_jobs"]').then(
          (element) => {
            assertFieldInput({
              element,
              label: 'Number of safeguarded jobs',
            })
          }
        )
      })

      it('should not display the project value field', () => {
        cy.get('[data-test="field-fdi_value"]').should('not.exist')
      })

      it('should display the government assistance field', () => {
        cy.get('[data-test="field-government_assistance"]').then((element) => {
          assertFieldRadios({
            element,
            label: 'Is this project receiving government financial assistance?',
            optionsCount: 2,
          })
        })
      })

      it('should display the R&D field', () => {
        cy.get('[data-test="field-r_and_d_budget"]').then((element) => {
          assertFieldRadios({
            element,
            label:
              'Does this project have budget for research and development?',
            optionsCount: 2,
          })
        })
      })

      it('should display the non-FDI R&D field', () => {
        cy.get('[data-test="field-non_fdi_r_and_d_budget"]').then((element) => {
          assertFieldRadios({
            element,
            label: 'Is this project associated with a non-FDI R&D project?',
            optionsCount: 2,
          })
        })
      })

      it('should display the new tech field', () => {
        cy.get('[data-test="field-new_tech_to_uk"]').then((element) => {
          assertFieldRadios({
            element,
            label:
              'Does the project bring ‘New To World’ Technology, IP or Business Model to the UK site?',
            optionsCount: 2,
          })
        })
      })

      it('should display the export revenue field', () => {
        cy.get('[data-test="field-export_revenue"]').then((element) => {
          assertFieldRadios({
            element,
            label:
              'Will the UK company export a significant proportion of their products and services produced in the UK as a result of the FDI project?',
            optionsCount: 2,
          })
        })
      })

      it('should not submit the form if the investment inputs are empty', () => {
        cy.get(
          '[data-test="client-cannot-provide-total-investment-yes"]'
        ).click()
        cy.get(
          '[data-test="client-cannot-provide-foreign-investment-yes"]'
        ).click()

        cy.get('[data-test="submit-button"]').click()
        assertErrorSummary([
          'Enter the total investment',
          'Enter the capital expenditure',
        ])
      })
    }
  )
  context(
    'When viewing a capital intensive project with all value fields set',
    () => {
      beforeEach(() => {
        cy.visit(
          investments.projects.editValue(capitalIntensiveProjectWithValue.id)
        )
      })

      it('should render the header', () => {
        assertLocalHeader(capitalIntensiveProjectWithValue.name)
      })

      it('should display the cannot provide total field', () => {
        cy.get(
          '[data-test="field-client_cannot_provide_total_investment"]'
        ).then((element) => {
          assertFieldRadios({
            element,
            label: 'Can client provide total investment value?',
            hint: 'Includes capital, operational and R&D expenditure',
            optionsCount: 3,
            value: convertBoolToInvertedYesNo(
              capitalIntensiveProjectWithValue.client_cannot_provide_total_investment
            ),
          })
        })
        cy.get('[data-test="field-total_investment"]').then((element) => {
          assertFieldInput({
            element,
            label: 'Total investment',
            hint: 'Enter the total number of GB pounds',
            value: '1,000,000',
          })
        })
      })

      it('should display the cannot provide foreign investment field', () => {
        cy.get(
          '[data-test="field-client_cannot_provide_foreign_investment"]'
        ).then((element) => {
          assertFieldRadios({
            element,
            label: 'Can client provide capital expenditure value?',
            hint: 'Foreign equity only, excluding operational and R&D expenditure',
            optionsCount: 3,
            value: convertBoolToInvertedYesNo(
              capitalIntensiveProjectWithValue.client_cannot_provide_foreign_investment
            ),
          })
        })

        cy.get('[data-test="field-foreign_equity_investment"]').then(
          (element) => {
            assertFieldInput({
              element,
              label: 'Capital expenditure value',
              hint: 'Enter the total number of GB pounds',
              value: '200,000',
            })
          }
        )

        cy.get('[data-test="field-gross_value_added_capital"]').then(
          (element) => {
            assertFieldUneditable({
              element,
              label: 'Gross value added (GVA)',
              value: '£34,568',
            })
          }
        )
      })

      it('should display the number of new jobs field', () => {
        cy.get('[data-test="field-number_new_jobs"]').then((element) => {
          assertFieldInput({
            element,
            label: 'Number of new jobs',
            value: capitalIntensiveProjectWithValue.number_new_jobs,
          })
        })
      })

      it('should not display the GVA calculation for number of new jobs', () => {
        cy.get('[data-test="field-gross_value_added_labour"]').should(
          'not.exist'
        )
      })

      it('should display the average salary field', () => {
        cy.get('[data-test="field-average_salary"]').then((element) => {
          assertFieldRadios({
            element,
            label: 'Average salary of new jobs',
            optionsCount: 3,
            value: capitalIntensiveProjectWithValue.average_salary.name,
          })
        })
      })

      it('should display the number of safeguarded jobs field', () => {
        cy.get('[data-test="field-number_safeguarded_jobs"]').then(
          (element) => {
            assertFieldInput({
              element,
              label: 'Number of safeguarded jobs',
              value: capitalIntensiveProjectWithValue.number_safeguarded_jobs,
            })
          }
        )
      })

      it('should not display the project value field', () => {
        cy.get('[data-test="field-fdi_value"]').should('not.exist')
      })

      it('should display the government assistance field', () => {
        cy.get('[data-test="field-government_assistance"]').then((element) => {
          assertFieldRadios({
            element,
            label: 'Is this project receiving government financial assistance?',
            optionsCount: 2,
            value: convertBoolToYesNo(
              capitalIntensiveProjectWithValue.government_assistance
            ),
          })
        })
      })

      it('should display the R&D field', () => {
        cy.get('[data-test="field-r_and_d_budget"]').then((element) => {
          assertFieldRadios({
            element,
            label:
              'Does this project have budget for research and development?',
            optionsCount: 2,
            value: convertBoolToYesNo(
              capitalIntensiveProjectWithValue.r_and_d_budget
            ),
          })
        })
      })

      it('should display the non-FDI R&D field', () => {
        cy.get('[data-test="field-non_fdi_r_and_d_budget"]').then((element) => {
          assertFieldRadios({
            element,
            label: 'Is this project associated with a non-FDI R&D project?',
            optionsCount: 2,
            value: convertBoolToYesNo(
              capitalIntensiveProjectWithValue.non_fdi_r_and_d_budget
            ),
          })
        })
      })

      it('should display the new tech field', () => {
        cy.get('[data-test="field-new_tech_to_uk"]').then((element) => {
          assertFieldRadios({
            element,
            label:
              'Does the project bring ‘New To World’ Technology, IP or Business Model to the UK site?',
            optionsCount: 2,
            value: convertBoolToYesNo(
              capitalIntensiveProjectWithValue.new_tech_to_uk
            ),
          })
        })
      })

      it('should display the export revenue field', () => {
        cy.get('[data-test="field-export_revenue"]').then((element) => {
          assertFieldRadios({
            element,
            label:
              'Will the UK company export a significant proportion of their products and services produced in the UK as a result of the FDI project?',
            optionsCount: 2,
            value: convertBoolToYesNo(
              capitalIntensiveProjectWithValue.export_revenue
            ),
          })
        })
      })
    }
  )
  context(
    'When viewing a capital intensive project with no sector and no capital value',
    () => {
      beforeEach(() => {
        cy.visit(
          investments.projects.editValue(
            capitalIntensiveProjectWithNoSectorOrCapitalExp.id
          )
        )
      })
      it('should display the correct message in the GVA field', () => {
        cy.get(
          '[data-test="client-cannot-provide-total-investment-yes"]'
        ).click()
        cy.get('[data-test="field-gross_value_added_capital"]').then(
          (element) => {
            assertFieldUneditable({
              element,
              label: 'Gross value added (GVA)',
              value:
                'Add capital expenditure value and primary sector (investment project summary) to calculate GVA',
            })
          }
        )
      })
      it('should not display the GVA calculation for number of new jobs', () => {
        cy.get('[data-test="field-gross_value_added_labour"]').should(
          'not.exist'
        )
      })
    }
  )
  context(
    'When viewing a capital intensive project with capital value but no sector',
    () => {
      beforeEach(() => {
        cy.visit(
          investments.projects.editValue(
            capitalIntensiveProjectWithCapitalExpButNoSector.id
          )
        )
      })
      it('should display the correct message in the GVA field', () => {
        cy.get(
          '[data-test="client-cannot-provide-total-investment-yes"]'
        ).click()
        cy.get('[data-test="field-gross_value_added_capital"]').then(
          (element) => {
            assertFieldUneditable({
              element,
              label: 'Gross value added (GVA)',
              value:
                'Add primary sector (investment project summary) to calculate GVA',
            })
          }
        )
      })
      it('should not display the GVA calculation for number of new jobs', () => {
        cy.get('[data-test="field-gross_value_added_labour"]').should(
          'not.exist'
        )
      })
    }
  )

  context(
    'When viewing a labour intensive project with no value fields set',
    () => {
      const labourIntensiveProjectNoValues = investmentProjectFaker({
        created_on: '2020-06-07T10:00:00Z',
        actual_land_date: null,
        investment_type: {
          name: 'FDI',
          id: '3e143372-496c-4d1e-8278-6fdd3da9b48b',
        },
        gva_multiplier: {
          sector_classification_gva_multiplier: 'labour',
          id: 'ccac03e3-573d-4e2e-9972-ef0aebf7fa14',
        },
        client_cannot_provide_total_investment: true,
        client_cannot_provide_foreign_investment: true,
        number_new_jobs: null,
        number_safeguarded_jobs: null,
        gross_value_added: null,
        average_salary: null,
      })
      beforeEach(() => {
        cy.intercept(
          'GET',
          `/api-proxy/v3/investment/${labourIntensiveProjectNoValues.id}`,
          {
            statusCode: 200,
            body: labourIntensiveProjectNoValues,
          }
        ).as('getProjectDetails')
        cy.intercept(
          'PATCH',
          `/api-proxy/v3/investment/${labourIntensiveProjectNoValues.id}`
        ).as('editValueSubmissionRequest')
        cy.visit(
          investments.projects.editValue(labourIntensiveProjectNoValues.id)
        )
        cy.wait('@getProjectDetails')
      })

      it('should render the header', () => {
        assertLocalHeader(labourIntensiveProjectNoValues.name)
      })

      it('should render breadcrumbs', () => {
        assertBreadcrumbs({
          Home: '/',
          Investments: investments.index(),
          Projects: investments.projects.index(),
          [labourIntensiveProjectNoValues.name]: investments.projects.details(
            labourIntensiveProjectNoValues.id
          ),
          'Edit value': null,
        })
      })

      it('should display the cannot provide total field', () => {
        cy.get(
          '[data-test="field-client_cannot_provide_total_investment"]'
        ).then((element) => {
          assertFieldRadios({
            element,
            label: 'Can client provide total investment value?',
            hint: 'Includes capital, operational and R&D expenditure',
            optionsCount: 2,
          })
        })
      })

      it('should only display total investment if "Yes" is selected', () => {
        cy.get('[data-test="total_investment]').should('not.exist')
        cy.get(
          '[data-test="client-cannot-provide-total-investment-no"]'
        ).click()
        cy.get('[data-test="total_investment]').should('not.exist')
        cy.get(
          '[data-test="client-cannot-provide-total-investment-yes"]'
        ).click()
        cy.get('[data-test="field-total_investment"]').then((element) => {
          assertFieldInput({
            element,
            label: 'Total investment',
            hint: 'Enter the total number of GB pounds',
          })
        })
      })

      it('should display the cannot provide foreign investment field', () => {
        cy.get(
          '[data-test="field-client_cannot_provide_foreign_investment"]'
        ).then((element) => {
          assertFieldRadios({
            element,
            label: 'Can client provide capital expenditure value?',
            hint: 'Foreign equity only, excluding operational and R&D expenditure',
            optionsCount: 2,
          })
        })
      })

      it('should only display total investment if "Yes" is selected', () => {
        cy.get('[data-test="foreign_equity_investment]').should('not.exist')
        cy.get(
          '[data-test="client-cannot-provide-foreign-investment-no"]'
        ).click()
        cy.get('[data-test="foreign_equity_investment]').should('not.exist')
        cy.get(
          '[data-test="client-cannot-provide-foreign-investment-yes"]'
        ).click()
        cy.get('[data-test="field-foreign_equity_investment"]').then(
          (element) => {
            assertFieldInput({
              element,
              label: 'Capital expenditure value',
              hint: 'Enter the total number of GB pounds',
            })
          }
        )
      })

      it('should not display the GVA calculation for capital expenditure', () => {
        cy.get('[data-test="field-gross_value_added_capital"]').should(
          'not.exist'
        )
      })

      it('should display the number of new jobs field', () => {
        cy.get('[data-test="field-number_new_jobs"]').then((element) => {
          assertFieldInput({
            element,
            label: 'Number of new jobs',
          })
        })
      })

      it('should display message to add number of new jobs to calculate GVA', () => {
        cy.get('[data-test="field-gross_value_added_labour"]').then(
          (element) => {
            assertFieldUneditable({
              element,
              label: 'Gross value added (GVA)',
              value: 'Add number of new jobs and click "Save" to calculate GVA',
            })
          }
        )
      })

      it('should display the average salary field', () => {
        cy.get('[data-test="field-average_salary"]').then((element) => {
          assertFieldRadios({
            element,
            label: 'Average salary of new jobs',
            optionsCount: 3,
          })
        })
      })

      it('should display the number of safeguarded jobs field', () => {
        cy.get('[data-test="field-number_safeguarded_jobs"]').then(
          (element) => {
            assertFieldInput({
              element,
              label: 'Number of safeguarded jobs',
            })
          }
        )
      })

      it('should not display the project value field', () => {
        cy.get('[data-test="field-fdi_value"]').should('not.exist')
      })

      it('should display the government assistance field', () => {
        cy.get('[data-test="field-government_assistance"]').then((element) => {
          assertFieldRadios({
            element,
            label: 'Is this project receiving government financial assistance?',
            optionsCount: 2,
          })
        })
      })

      it('should display the R&D field', () => {
        cy.get('[data-test="field-r_and_d_budget"]').then((element) => {
          assertFieldRadios({
            element,
            label:
              'Does this project have budget for research and development?',
            optionsCount: 2,
          })
        })
      })

      it('should display the non-FDI R&D field', () => {
        cy.get('[data-test="field-non_fdi_r_and_d_budget"]').then((element) => {
          assertFieldRadios({
            element,
            label: 'Is this project associated with a non-FDI R&D project?',
            optionsCount: 2,
          })
        })
      })

      it('should display the new tech field', () => {
        cy.get('[data-test="field-new_tech_to_uk"]').then((element) => {
          assertFieldRadios({
            element,
            label:
              'Does the project bring ‘New To World’ Technology, IP or Business Model to the UK site?',
            optionsCount: 2,
          })
        })
      })

      it('should display the export revenue field', () => {
        cy.get('[data-test="field-export_revenue"]').then((element) => {
          assertFieldRadios({
            element,
            label:
              'Will the UK company export a significant proportion of their products and services produced in the UK as a result of the FDI project?',
            optionsCount: 2,
          })
        })
      })

      it('should not submit the form if the investment inputs are empty', () => {
        cy.get(
          '[data-test="client-cannot-provide-total-investment-yes"]'
        ).click()
        cy.get(
          '[data-test="client-cannot-provide-foreign-investment-yes"]'
        ).click()

        cy.get('[data-test="submit-button"]').click()
        assertErrorSummary([
          'Enter the total investment',
          'Enter the capital expenditure',
        ])
      })
    }
  )

  context('When viewing a labour project with all value fields set', () => {
    beforeEach(() => {
      cy.visit(
        investments.projects.editValue(labourIntensiveProjectWithValue.id)
      )
    })

    it('should render the header', () => {
      assertLocalHeader(labourIntensiveProjectWithValue.name)
    })

    it('should display the cannot provide total field', () => {
      cy.get('[data-test="field-client_cannot_provide_total_investment"]').then(
        (element) => {
          assertFieldRadios({
            element,
            label: 'Can client provide total investment value?',
            hint: 'Includes capital, operational and R&D expenditure',
            optionsCount: 3,
            value: convertBoolToInvertedYesNo(
              labourIntensiveProjectWithValue.client_cannot_provide_total_investment
            ),
          })
        }
      )
      cy.get('[data-test="field-total_investment"]').then((element) => {
        assertFieldInput({
          element,
          label: 'Total investment',
          hint: 'Enter the total number of GB pounds',
          value: '1,000,000',
        })
      })
    })

    it('should display the cannot provide foreign investment field', () => {
      cy.get(
        '[data-test="field-client_cannot_provide_foreign_investment"]'
      ).then((element) => {
        assertFieldRadios({
          element,
          label: 'Can client provide capital expenditure value?',
          hint: 'Foreign equity only, excluding operational and R&D expenditure',
          optionsCount: 3,
          value: convertBoolToInvertedYesNo(
            labourIntensiveProjectWithValue.client_cannot_provide_foreign_investment
          ),
        })
      })

      cy.get('[data-test="field-foreign_equity_investment"]').then(
        (element) => {
          assertFieldInput({
            element,
            label: 'Capital expenditure value',
            hint: 'Enter the total number of GB pounds',
            value: '200,000',
          })
        }
      )
    })

    it('should not display the GVA calculation for capital expenditure', () => {
      cy.get('[data-test="field-gross_value_added_capital"]').should(
        'not.exist'
      )
    })

    it('should display the number of new jobs field', () => {
      cy.get('[data-test="field-number_new_jobs"]').then((element) => {
        assertFieldInput({
          element,
          label: 'Number of new jobs',
          value: labourIntensiveProjectWithValue.number_new_jobs,
        })
      })
    })

    it('should display the GVA calculation for number of new jobs', () => {
      cy.get('[data-test="field-gross_value_added_labour"]').then((element) => {
        assertFieldUneditable({
          element,
          label: 'Gross value added (GVA)',
          value: '£56,789',
        })
      })
    })

    it('should display the average salary field', () => {
      cy.get('[data-test="field-average_salary"]').then((element) => {
        assertFieldRadios({
          element,
          label: 'Average salary of new jobs',
          optionsCount: 3,
          value: labourIntensiveProjectWithValue.average_salary.name,
        })
      })
    })

    it('should display the number of safeguarded jobs field', () => {
      cy.get('[data-test="field-number_safeguarded_jobs"]').then((element) => {
        assertFieldInput({
          element,
          label: 'Number of safeguarded jobs',
          value: labourIntensiveProjectWithValue.number_safeguarded_jobs,
        })
      })
    })

    it('should not display the project value field', () => {
      cy.get('[data-test="field-fdi_value"]').should('not.exist')
    })

    it('should display the government assistance field', () => {
      cy.get('[data-test="field-government_assistance"]').then((element) => {
        assertFieldRadios({
          element,
          label: 'Is this project receiving government financial assistance?',
          optionsCount: 2,
          value: convertBoolToYesNo(
            labourIntensiveProjectWithValue.government_assistance
          ),
        })
      })
    })

    it('should display the R&D field', () => {
      cy.get('[data-test="field-r_and_d_budget"]').then((element) => {
        assertFieldRadios({
          element,
          label: 'Does this project have budget for research and development?',
          optionsCount: 2,
          value: convertBoolToYesNo(
            labourIntensiveProjectWithValue.r_and_d_budget
          ),
        })
      })
    })

    it('should display the non-FDI R&D field', () => {
      cy.get('[data-test="field-non_fdi_r_and_d_budget"]').then((element) => {
        assertFieldRadios({
          element,
          label: 'Is this project associated with a non-FDI R&D project?',
          optionsCount: 2,
          value: convertBoolToYesNo(
            labourIntensiveProjectWithValue.non_fdi_r_and_d_budget
          ),
        })
      })
    })

    it('should display the new tech field', () => {
      cy.get('[data-test="field-new_tech_to_uk"]').then((element) => {
        assertFieldRadios({
          element,
          label:
            'Does the project bring ‘New To World’ Technology, IP or Business Model to the UK site?',
          optionsCount: 2,
          value: convertBoolToYesNo(
            labourIntensiveProjectWithValue.new_tech_to_uk
          ),
        })
      })
    })

    it('should display the export revenue field', () => {
      cy.get('[data-test="field-export_revenue"]').then((element) => {
        assertFieldRadios({
          element,
          label:
            'Will the UK company export a significant proportion of their products and services produced in the UK as a result of the FDI project?',
          optionsCount: 2,
          value: convertBoolToYesNo(
            labourIntensiveProjectWithValue.export_revenue
          ),
        })
      })
    })
  })

  context(
    'When viewing a labour intensive project with no sector and no number of new jobs',
    () => {
      beforeEach(() => {
        cy.visit(
          investments.projects.editValue(
            labourIntensiveProjectWithNoSectorOrNoNewJobs.id
          )
        )
      })

      it('should not display the GVA calculation for capital expenditure', () => {
        cy.get('[data-test="field-gross_value_added_capital"]').should(
          'not.exist'
        )
      })

      it('should display the correct message in the GVA field for number of new jobs', () => {
        cy.get('[data-test="field-gross_value_added_labour"]').then(
          (element) => {
            assertFieldUneditable({
              element,
              label: 'Gross value added (GVA)',
              value:
                'Add number of new jobs and primary sector (investment project summary) to calculate GVA',
            })
          }
        )
      })
    }
  )

  context(
    'When viewing a labour intensive project with new jobs but no sector',
    () => {
      beforeEach(() => {
        cy.visit(
          investments.projects.editValue(
            labourIntensiveProjectWithNewJobsButNoSector.id
          )
        )
      })

      it('should not display the GVA calculation for capital expenditure', () => {
        cy.get('[data-test="field-gross_value_added_capital"]').should(
          'not.exist'
        )
      })

      it('should display the correct message in the GVA field for number of new jobs', () => {
        cy.get('[data-test="field-gross_value_added_labour"]').then(
          (element) => {
            assertFieldUneditable({
              element,
              label: 'Gross value added (GVA)',
              value:
                'Add primary sector (investment project summary) to calculate GVA',
            })
          }
        )
      })
    }
  )

  context(
    'When viewing a non-FDI project with a land date before April 2020',
    () => {
      beforeEach(() => {
        cy.visit(investments.projects.editValue(projectNotFDI.id))
      })
      it('should not display the Project Value field', () => {
        cy.get('[data-test="field-fdi_value"]').should('not.exist')
      })
      it('should not display the GVA field', () => {
        cy.get(
          '[data-test="client-cannot-provide-foreign-investment-yes"]'
        ).click()
        cy.get('[data-test="field-foreign_equity_investment"]').should('exist')
        cy.get('[data-test="field-gross_value_added_capital"]').should(
          'not.exist'
        )
      })
    }
  )

  context(
    'When one land date is null and one is beforeEach 01/04/2020 ',
    () => {
      beforeEach(() => {
        cy.visit(investments.projects.details(projectLandingBeforeApril.id))
        cy.contains('Edit value').click()
      })

      it('should display the Project Value field', () => {
        cy.get('[data-test="field-fdi_value"]').then((element) => {
          assertFieldRadios({
            element,
            label: 'Project value',
            optionsCount: 3,
          })
        })
      })
    }
  )

  context('When both dates are before 01/04/2020', () => {
    beforeEach(() => {
      cy.visit(investments.projects.editValue(projectBothDatesBeforeApril.id))
    })

    it('should display the Project Value field', () => {
      cy.get('[data-test="field-fdi_value"]').then((element) => {
        assertFieldRadios({
          element,
          label: 'Project value',
          optionsCount: 3,
          value: projectBothDatesBeforeApril.fdi_value.name,
        })
      })
    })
  })

  context('When one date is before 01/04/2020 and one is after', () => {
    beforeEach(() => {
      cy.visit(
        investments.projects.editValue(projectOneLandDateEitherSideApril.id)
      )
      cy.contains('Edit value').click()
    })

    it('should display the Project Value field', () => {
      cy.get('[data-test="field-fdi_value"]').then((element) => {
        assertFieldRadios({
          element,
          label: 'Project value',
          optionsCount: 3,
        })
      })
    })
  })

  context('When one date is null and one date is after 01/04/2020', () => {
    beforeEach(() => {
      cy.visit(investments.projects.editValue(projectLandingAfterApril.id))
    })

    it('should not display the Project Value field', () => {
      cy.get('[data-test="field-fdi_value"]').should('not.exist')
    })
  })

  context('When both dates are after 01/04/2020', () => {
    beforeEach(() => {
      cy.visit(investments.projects.editValue(projectBothDatesAfterApril.id))
    })

    it('should not display the Project Value field', () => {
      cy.get('[data-test="field-fdi_value"]').should('not.exist')
    })
  })

  context('When both land date fields are empty', () => {
    beforeEach(() => {
      cy.visit(investments.projects.editValue(projectNoLandingDates.id))
    })

    it('should not display the Project Value field', () => {
      cy.get('[data-test="field-fdi_value"]').should('not.exist')
    })
  })

  context(
    'When viewing a project created before a salary range is disabled',
    () => {
      beforeEach(() => {
        cy.visit(investments.projects.editValue(projectCreatedBefore.id))
      })

      it('should display the salary range for £25,000 - £29,000 when the project was created before the disable date', () => {
        cy.get('[data-test="field-average_salary"]').then((element) => {
          assertFieldRadios({
            element,
            label: 'Average salary of new jobs',
            optionsCount: 4,
          })
        })
      })
    }
  )

  context(
    'When viewing a project created on the same day a salary range is disabled',
    () => {
      beforeEach(() => {
        cy.visit(investments.projects.editValue(projectCreatedSame.id))
      })

      it('should not display the salary range for £25,000 – £29,000', () => {
        cy.get('[data-test="field-average_salary"]').then((element) => {
          assertFieldRadios({
            element,
            label: 'Average salary of new jobs',
            optionsCount: 3,
          })
        })
      })
    }
  )

  context(
    'When viewing a project created after a salary range is disabled',
    () => {
      beforeEach(() => {
        cy.visit(investments.projects.editValue(projectCreatedAfter.id))
      })

      it('should not display the salary range for £25,000 – £29,000', () => {
        cy.get('[data-test="field-average_salary"]').then((element) => {
          assertFieldRadios({
            element,
            label: 'Average salary of new jobs',
            optionsCount: 3,
          })
        })
      })
    }
  )
})
