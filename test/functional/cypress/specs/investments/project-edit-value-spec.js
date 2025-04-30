import { INVESTMENT_PROJECT_STAGES } from '../../fakers/constants'
import { clickButton } from '../../support/actions'

const {
  assertBreadcrumbs,
  assertErrorSummary,
  assertFieldInput,
  assertFieldRadios,
  assertFieldUneditable,
  assertLocalHeader,
  assertFieldError,
  assertNotExists,
} = require('../../support/assertions')
const { investments } = require('../../../../../src/lib/urls')
const { investmentProjectFaker } = require('../../fakers/investment-projects')

const convertBoolToYesNo = (valueToCheck) => (valueToCheck ? 'Yes' : 'No')
const convertBoolToInvertedYesNo = (valueToCheck) =>
  valueToCheck ? 'No' : 'Yes'

const setup = (project) => {
  cy.intercept('GET', `/api-proxy/v3/investment/${project.id}`, {
    statusCode: 200,
    body: project,
  }).as('getProjectDetails')
  cy.intercept('PATCH', `/api-proxy/v3/investment/${project.id}`).as(
    'editValueSubmissionRequest'
  )
  cy.visit(investments.projects.editValue(project.id))
}

const testNumberOfNewJobs = ({ required, value }) =>
  it('should display the number of new jobs field', () => {
    if (value !== null && value !== undefined) {
      cy.get('#number_new_jobs').should('have.value', value)
    }

    cy.get('label[for="number_new_jobs"]').should(
      'have.text',
      required ? 'Number of new jobs (required)' : 'Number of new jobs'
    )

    required
      ? cy.contains('An expansion project must always have at least 1 new job')
      : cy
          .contains('An expansion project must always have at least 1 new job')
          .should('not.exist')
  })

const setupProjectFaker = (overrides) =>
  investmentProjectFaker({
    stage: INVESTMENT_PROJECT_STAGES.verifyWin,
    created_on: '2020-06-07T10:00:00Z',
    actual_land_date: null,
    estimated_land_date: null,
    investment_type: {
      name: 'FDI',
      id: '3e143372-496c-4d1e-8278-6fdd3da9b48b',
    },
    gva_multiplier: {
      sector_classification_gva_multiplier: 'capital',
      id: '7d2d9757-3287-4501-82f0-37879b7d9081',
    },
    fdi_type: {
      name: 'Acquisition',
      id: '01c19118-325c-4854-8c67-2d6555ee0c1b',
    },
    client_cannot_provide_total_investment: true,
    client_cannot_provide_foreign_investment: true,
    number_new_jobs: null,
    number_safeguarded_jobs: null,
    gross_value_added: null,
    average_salary: null,
    foreign_equity_investment: null,
    ...overrides,
  })

describe('Edit the value details of a project', () => {
  context(
    'When viewing a capital intensive project with no value fields set',
    () => {
      const capitalIntensiveProjectNoValue = setupProjectFaker()
      beforeEach(() => {
        setup(capitalIntensiveProjectNoValue)
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
            label: 'Can client provide total investment value? (required)',
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
            label: 'Total investment (required)',
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
            label: 'Can client provide capital expenditure value? (required)',
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

      testNumberOfNewJobs({
        required: true,
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
            label: 'Average salary of new jobs (required)',
            optionsCount: 3,
          })
        })
      })

      it('should display the number of safeguarded jobs field', () => {
        cy.get('[data-test="field-number_safeguarded_jobs"]').then(
          (element) => {
            assertFieldInput({
              element,
              label: 'Number of safeguarded jobs (required)',
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
            label:
              'Is this project receiving government financial assistance? (required)',
            optionsCount: 2,
          })
        })
      })

      it('should display the R&D field', () => {
        cy.get('[data-test="field-r_and_d_budget"]').then((element) => {
          assertFieldRadios({
            element,
            label:
              'Does this project have budget for research and development? (required)',
            optionsCount: 2,
          })
        })
      })

      it('should display the non-FDI R&D field', () => {
        cy.get('[data-test="field-non_fdi_r_and_d_budget"]').then((element) => {
          assertFieldRadios({
            element,
            label:
              'Is this project associated with a non-FDI R&D project? (required)',
            optionsCount: 2,
          })
        })
      })

      it('should display the new tech field', () => {
        cy.get('[data-test="field-new_tech_to_uk"]').then((element) => {
          assertFieldRadios({
            element,
            label:
              'Does the project bring ‘New To World’ Technology, IP or Business Model to the UK site? (required)',
            optionsCount: 2,
          })
        })
      })

      it('should display the export revenue field', () => {
        cy.get('[data-test="field-export_revenue"]').then((element) => {
          assertFieldRadios({
            element,
            label:
              'Will the UK company export a significant proportion of their products and services produced in the UK as a result of the FDI project? (required)',
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
          'Value for number of new jobs is required',
          'Value for average salary of new jobs is required',
          'Value for number of safeguarded jobs is required',
          'Enter the total investment',
          'Enter the capital expenditure',
        ])
      })
    }
  )

  context(
    'When viewing a capital intensive project with all value fields set',
    () => {
      const capitalIntensiveProjectWithValue = setupProjectFaker({
        client_cannot_provide_total_investment: false,
        client_cannot_provide_foreign_investment: false,
        number_new_jobs: 20,
        gross_value_added: 34568,
        total_investment: 1000000,
        foreign_equity_investment: 200000,
        average_salary: {
          name: 'Below £25,000',
          id: '2943bf3d-32dd-43be-8ad4-969b006dee7b',
        },
      })
      beforeEach(() => {
        setup(capitalIntensiveProjectWithValue)
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
            label: 'Can client provide total investment value? (required)',
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
            label: 'Total investment (required)',
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
            label: 'Can client provide capital expenditure value? (required)',
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

      testNumberOfNewJobs({
        required: true,
        value: capitalIntensiveProjectWithValue.number_new_jobs,
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
            label: 'Average salary of new jobs (required)',
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
              label: 'Number of safeguarded jobs (required)',
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
            label:
              'Is this project receiving government financial assistance? (required)',
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
              'Does this project have budget for research and development? (required)',
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
            label:
              'Is this project associated with a non-FDI R&D project? (required)',
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
              'Does the project bring ‘New To World’ Technology, IP or Business Model to the UK site? (required)',
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
              'Will the UK company export a significant proportion of their products and services produced in the UK as a result of the FDI project? (required)',
            optionsCount: 2,
            value: convertBoolToYesNo(
              capitalIntensiveProjectWithValue.export_revenue
            ),
          })
        })
      })
    }
  )

  context('When viewing a capital only FDI project', () => {
    const capitalOnlyFDIProject = setupProjectFaker({
      fdi_type: {
        name: 'Capital only',
        id: '840f62c1-bbcb-44e4-b6d4-a258d2ffa07d',
      },
      client_cannot_provide_total_investment: false,
      client_cannot_provide_foreign_investment: false,
      total_investment: 20000000,
      foreign_equity_investment: 15000000,
    })
    beforeEach(() => {
      setup(capitalOnlyFDIProject)
      cy.get('[data-test="total-investment-input"]')
        .clear()
        .type(`${capitalOnlyFDIProject.total_investment}`)
      cy.get('[data-test="foreign-equity-investment-input"]')
        .clear()
        .type(`${capitalOnlyFDIProject.foreign_equity_investment}`)
    })

    it('should raise an error if total investment is < capital expenditure', () => {
      const totalInvestmentErrorMessage =
        'Total investment must be >= to capital expenditure'
      cy.get('[data-test="total-investment-input"]').clear().type('14000000')
      clickButton('Save')
      assertErrorSummary([totalInvestmentErrorMessage])
      assertFieldError(
        cy.get('[data-test="field-total_investment"]'),
        totalInvestmentErrorMessage
      )
    })

    it('should not raise an error if total investment is >= capital expenditure', () => {
      clickButton('Save')
      cy.wait('@editValueSubmissionRequest')
        .its('request.body')
        .should('include', {
          total_investment: `${capitalOnlyFDIProject.total_investment}`,
        })
    })

    it('should raise an error when entered capital expenditure value is < £15m', () => {
      const capitalExpenditureErrorMessage =
        'Capital expenditure must be >= £15,000,000 for capital only project'
      cy.get('[data-test="foreign-equity-investment-input"]')
        .clear()
        .type('15000')
      clickButton('Save')
      assertErrorSummary([capitalExpenditureErrorMessage])
      assertFieldError(
        cy.get('[data-test="field-foreign_equity_investment"]'),
        capitalExpenditureErrorMessage
      )
    })

    it('should not raise en error when entered capital expenditure value is >= £15m', () => {
      clickButton('Save')
      cy.wait('@editValueSubmissionRequest')
        .its('request.body')
        .should('include', {
          foreign_equity_investment: `${capitalOnlyFDIProject.foreign_equity_investment}`,
        })
    })

    it('should not display the jobs fields', () => {
      cy.get('[data-test="field-number_new_jobs"]').should('not.exist')
      cy.get('[data-test="field-average_salary"]').should('not.exist')
      cy.get('[data-test="field-number_safeguarded_jobs"]').should('not.exist')
    })

    it('should submit the request with zero new and safeguarded jobs, and null for average salary', () => {
      clickButton('Save')
      cy.wait('@editValueSubmissionRequest')
        .its('request.body')
        .should('include', {
          number_new_jobs: 0,
          average_salary: null,
          number_safeguarded_jobs: 0,
        })
    })
  })

  context('When viewing a non capital only FDI project', () => {
    const nonCapitalOnlyFDIProject = setupProjectFaker({
      client_cannot_provide_total_investment: false,
      client_cannot_provide_foreign_investment: false,
      total_investment: 20000000,
      foreign_equity_investment: 15000000,
      number_new_jobs: 120,
      average_salary: {
        name: 'Below £25,000',
        id: '2943bf3d-32dd-43be-8ad4-969b006dee7b',
      },
      number_safeguarded_jobs: 50,
    })
    beforeEach(() => {
      setup(nonCapitalOnlyFDIProject)
      cy.get('[data-test="total-investment-input"]')
        .clear()
        .type(`${nonCapitalOnlyFDIProject.total_investment}`)
      cy.get('[data-test="foreign-equity-investment-input"]')
        .clear()
        .type(`${nonCapitalOnlyFDIProject.foreign_equity_investment}`)
    })

    it('should raise an error if total investment is < capital expenditure', () => {
      const totalInvestmentErrorMessage =
        'Total investment must be >= to capital expenditure'
      cy.get('[data-test="foreign-equity-investment-input"]')
        .clear()
        .type('22000000')
      clickButton('Save')
      assertErrorSummary([totalInvestmentErrorMessage])
      assertFieldError(
        cy.get('[data-test="field-total_investment"]'),
        totalInvestmentErrorMessage
      )
    })

    it('should not raise an error if total investment is >= capital expenditure', () => {
      clickButton('Save')
      cy.wait('@editValueSubmissionRequest')
        .its('request.body')
        .should('include', {
          total_investment: `${nonCapitalOnlyFDIProject.total_investment}`,
        })
    })

    it('should not raise an error when capital expenditure is < £15m', () => {
      const newCapitalExpenditureValue = '2000000'
      cy.get('[data-test="foreign-equity-investment-input"]')
        .clear()
        .type(newCapitalExpenditureValue)
      clickButton('Save')
      cy.wait('@editValueSubmissionRequest')
        .its('request.body')
        .should('include', {
          foreign_equity_investment: newCapitalExpenditureValue,
        })
    })

    it('should display the jobs fields', () => {
      cy.get('[data-test="field-number_new_jobs"]').should('exist')
      cy.get('[data-test="field-average_salary"]').should('exist')
      cy.get('[data-test="field-number_safeguarded_jobs"]').should('exist')
    })

    it('should not overwrite the job fields to the request payload', () => {
      clickButton('Save')
      cy.wait('@editValueSubmissionRequest')
        .its('request.body')
        .should('include', {
          number_new_jobs: nonCapitalOnlyFDIProject.number_new_jobs,
          average_salary: `${nonCapitalOnlyFDIProject.average_salary.id}`,
          number_safeguarded_jobs: `${nonCapitalOnlyFDIProject.number_safeguarded_jobs}`,
        })
    })
  })

  context(
    'When viewing a capital intensive project with no sector and no capital value',
    () => {
      const capitalIntensiveProjectWithNoSectorOrCapitalExp = setupProjectFaker(
        {
          client_cannot_provide_total_investment: false,
          client_cannot_provide_foreign_investment: false,
          sector: null,
        }
      )
      beforeEach(() => {
        setup(capitalIntensiveProjectWithNoSectorOrCapitalExp)
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
      const capitalIntensiveProjectWithCapitalExpButNoSector =
        setupProjectFaker({
          client_cannot_provide_total_investment: false,
          client_cannot_provide_foreign_investment: false,
          sector: null,
          foreign_equity_investment: 200000,
        })
      beforeEach(() => {
        setup(capitalIntensiveProjectWithCapitalExpButNoSector)
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
      const labourIntensiveProjectNoValues = setupProjectFaker({
        gva_multiplier: {
          sector_classification_gva_multiplier: 'labour',
          id: 'ddac03e3-573d-4e2e-9972-ef0aebf7fa23',
        },
        client_cannot_provide_total_investment: true,
        client_cannot_provide_foreign_investment: true,
      })
      beforeEach(() => {
        setup(labourIntensiveProjectNoValues)
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
            label: 'Can client provide total investment value? (required)',
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
            label: 'Total investment (required)',
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
            label: 'Can client provide capital expenditure value? (required)',
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

      testNumberOfNewJobs({
        required: true,
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
            label: 'Average salary of new jobs (required)',
            optionsCount: 3,
          })
        })
      })

      it('should display the number of safeguarded jobs field', () => {
        cy.get('[data-test="field-number_safeguarded_jobs"]').then(
          (element) => {
            assertFieldInput({
              element,
              label: 'Number of safeguarded jobs (required)',
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
            label:
              'Is this project receiving government financial assistance? (required)',
            optionsCount: 2,
          })
        })
      })

      it('should display the R&D field', () => {
        cy.get('[data-test="field-r_and_d_budget"]').then((element) => {
          assertFieldRadios({
            element,
            label:
              'Does this project have budget for research and development? (required)',
            optionsCount: 2,
          })
        })
      })

      it('should display the non-FDI R&D field', () => {
        cy.get('[data-test="field-non_fdi_r_and_d_budget"]').then((element) => {
          assertFieldRadios({
            element,
            label:
              'Is this project associated with a non-FDI R&D project? (required)',
            optionsCount: 2,
          })
        })
      })

      it('should display the new tech field', () => {
        cy.get('[data-test="field-new_tech_to_uk"]').then((element) => {
          assertFieldRadios({
            element,
            label:
              'Does the project bring ‘New To World’ Technology, IP or Business Model to the UK site? (required)',
            optionsCount: 2,
          })
        })
      })

      it('should display the export revenue field', () => {
        cy.get('[data-test="field-export_revenue"]').then((element) => {
          assertFieldRadios({
            element,
            label:
              'Will the UK company export a significant proportion of their products and services produced in the UK as a result of the FDI project? (required)',
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
          'Value for number of new jobs is required',
          'Value for average salary of new jobs is required',
          'Value for number of safeguarded jobs is required',
          'Enter the total investment',
          'Enter the capital expenditure',
        ])
      })
    }
  )

  context('When viewing a labour project with all value fields set', () => {
    const labourIntensiveProjectWithValue = setupProjectFaker({
      gva_multiplier: {
        sector_classification_gva_multiplier: 'labour',
        id: 'ddac03e3-573d-4e2e-9972-ef0aebf7fa23',
      },
      client_cannot_provide_total_investment: false,
      client_cannot_provide_foreign_investment: false,
      number_new_jobs: 20,
      gross_value_added: 56789,
      total_investment: 1000000,
      foreign_equity_investment: 200000,
      average_salary: {
        name: 'Below £25,000',
        id: '2943bf3d-32dd-43be-8ad4-969b006dee7b',
      },
    })
    beforeEach(() => {
      setup(labourIntensiveProjectWithValue)
    })

    it('should render the header', () => {
      assertLocalHeader(labourIntensiveProjectWithValue.name)
    })

    it('should display the cannot provide total field', () => {
      cy.get('[data-test="field-client_cannot_provide_total_investment"]').then(
        (element) => {
          assertFieldRadios({
            element,
            label: 'Can client provide total investment value? (required)',
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
          label: 'Total investment (required)',
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
          label: 'Can client provide capital expenditure value? (required)',
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

    testNumberOfNewJobs({
      required: true,
      value: labourIntensiveProjectWithValue.number_new_jobs,
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
          label: 'Average salary of new jobs (required)',
          optionsCount: 3,
          value: labourIntensiveProjectWithValue.average_salary.name,
        })
      })
    })

    it('should display the number of safeguarded jobs field', () => {
      cy.get('[data-test="field-number_safeguarded_jobs"]').then((element) => {
        assertFieldInput({
          element,
          label: 'Number of safeguarded jobs (required)',
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
          label:
            'Is this project receiving government financial assistance? (required)',
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
          label:
            'Does this project have budget for research and development? (required)',
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
          label:
            'Is this project associated with a non-FDI R&D project? (required)',
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
            'Does the project bring ‘New To World’ Technology, IP or Business Model to the UK site? (required)',
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
            'Will the UK company export a significant proportion of their products and services produced in the UK as a result of the FDI project? (required)',
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
      const labourIntensiveProjectWithNoSectorOrNoNewJobs = setupProjectFaker({
        client_cannot_provide_total_investment: false,
        client_cannot_provide_foreign_investment: false,
        gva_multiplier: {
          sector_classification_gva_multiplier: 'labour',
          id: 'ddac03e3-573d-4e2e-9972-ef0aebf7fa23',
        },
        sector: null,
      })
      beforeEach(() => {
        setup(labourIntensiveProjectWithNoSectorOrNoNewJobs)
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
      const labourIntensiveProjectWithNewJobsButNoSector = setupProjectFaker({
        client_cannot_provide_total_investment: false,
        client_cannot_provide_foreign_investment: false,
        number_new_jobs: 20,
        gva_multiplier: {
          sector_classification_gva_multiplier: 'labour',
          id: 'ddac03e3-573d-4e2e-9972-ef0aebf7fa23',
        },
        sector: null,
      })
      beforeEach(() => {
        setup(labourIntensiveProjectWithNewJobsButNoSector)
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
      const nonFdiProject = setupProjectFaker({
        actual_land_date: '2021-01-01T10:00:00Z',
        fdiType: null,
        investment_type: {
          name: 'non-FDI',
          id: '3d2c94e4-7871-465c-a7f7-45651eeffc64',
        },
        gva_multiplier: null,
      })
      beforeEach(() => {
        setup(nonFdiProject)
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
        cy.get('[data-test="field-gross_value_added_labour"]').should(
          'not.exist'
        )
      })
    }
  )

  context('When an FDI project has a missing land date value', () => {
    it('should display the Project Value field when estimated land date is null and actual land date is before 01/04/2020', () => {
      const project = setupProjectFaker({
        actual_land_date: '2020-01-01',
      })
      setup(project)
      cy.get('[data-test="field-fdi_value"]').then((element) => {
        assertFieldRadios({
          element,
          label: 'Project value',
          optionsCount: 3,
        })
      })
    })

    it('should display the Project Value field when actual land date is null and estimated land date is before 01/04/2020', () => {
      const project = setupProjectFaker({
        estimated_land_date: '2020-01-01',
      })
      setup(project)
      cy.get('[data-test="field-fdi_value"]').then((element) => {
        assertFieldRadios({
          element,
          label: 'Project value',
          optionsCount: 3,
        })
      })
    })

    it('should not display the Project Value field when estimated land date is null and actual land date is after 01/04/2020', () => {
      const project = setupProjectFaker({
        actual_land_date: '2020-04-02',
      })
      setup(project)
      cy.get('[data-test="field-fdi_value"]').should('not.exist')
    })

    it('should not display the Project Value field when actual land date is null and estimated land date is after 01/04/2020', () => {
      const project = setupProjectFaker({
        estimated_land_date: '2020-04-02',
      })
      setup(project)
      cy.get('[data-test="field-fdi_value"]').should('not.exist')
    })
  })

  context(
    'When an FDI project has both land date values before 01/04/2020',
    () => {
      it('should display the Project Value field', () => {
        const project = setupProjectFaker({
          actual_land_date: '2020-01-01',
          estimated_land_date: '2020-02-01',
          fdi_value: {
            id: '38e36c77-61ad-4186-a7a8-ac6a1a1104c6',
            name: 'Higher',
          },
        })
        setup(project)
        cy.get('[data-test="field-fdi_value"]').then((element) => {
          assertFieldRadios({
            element,
            label: 'Project value',
            optionsCount: 3,
            value: project.fdi_value.name,
          })
        })
      })
    }
  )

  context(
    'When an FDI project has a both land date values and one is after 01/04/2020',
    () => {
      it('should display the Project Value field when estimated land date is before 01/04/2020 and actual land date is after 01/04/2020', () => {
        const project = setupProjectFaker({
          estimated_land_date: '2020-01-01',
          actual_land_date: '2020-04-02',
        })
        setup(project)
        cy.get('[data-test="field-fdi_value"]').then((element) => {
          assertFieldRadios({
            element,
            label: 'Project value',
            optionsCount: 3,
          })
        })
      })

      it('should display the Project Value field when actual land date is before 01/04/2020 and estimated land date is after 01/04/2020', () => {
        const project = setupProjectFaker({
          estimated_land_date: '2020-04-02',
          actual_land_date: '2020-01-01',
        })
        setup(project)
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

  context('When an FDI project has both land dates after 01/04/2020', () => {
    it('should not display the Project Value field', () => {
      const project = setupProjectFaker({
        estimated_land_date: '2020-04-02',
        actual_land_date: '2020-04-02',
      })
      setup(project)
      cy.get('[data-test="field-fdi_value"]').should('not.exist')
    })
  })

  context('When an FDI project does not have either land date values', () => {
    it('should not display the Project Value field', () => {
      setup(setupProjectFaker())
      cy.get('[data-test="field-fdi_value"]').should('not.exist')
    })
  })

  context(
    'When viewing a project created before a salary range is disabled',
    () => {
      it('should display the salary range for £25,000 - £29,000 when the project was created before the disable date', () => {
        const project = setupProjectFaker({ created_on: '2016-02-05' })
        setup(project)
        cy.get('[data-test="field-average_salary"]').then((element) => {
          assertFieldRadios({
            element,
            label: 'Average salary of new jobs (required)',
            optionsCount: 4,
          })
        })
      })
    }
  )

  context(
    'When viewing a project created on the same day a salary range is disabled',
    () => {
      it('should not display the salary range for £25,000 – £29,000', () => {
        const project = setupProjectFaker({
          created_on: '2016-03-05T12:00:00Z',
        })
        setup(project)
        cy.get('[data-test="field-average_salary"]').then((element) => {
          assertFieldRadios({
            element,
            label: 'Average salary of new jobs (required)',
            optionsCount: 3,
          })
        })
      })
    }
  )

  context(
    'When viewing a project created after a salary range is disabled',
    () => {
      it('should not display the salary range for £25,000 – £29,000', () => {
        const project = setupProjectFaker({ created_on: '2016-04-02' })
        setup(project)
        cy.get('[data-test="field-average_salary"]').then((element) => {
          assertFieldRadios({
            element,
            label: 'Average salary of new jobs (required)',
            optionsCount: 3,
          })
        })
      })
    }
  )

  context('Number of jobs error handling', () => {
    context('When editing an FDI project', () => {
      context('With involvement', () => {
        const expansionProject = setupProjectFaker({
          stage: INVESTMENT_PROJECT_STAGES.active,
          investment_type: {
            name: 'FDI',
            id: 'foo',
          },
          level_of_involvement: {
            name: 'Foo',
            id: 'bar',
          },
        })
        beforeEach(() => {
          setup(expansionProject)
        })
        testNumberOfNewJobs({
          required: true,
        })
        it('should show an error if the number of new jobs is empty', () => {
          cy.get('[data-test="submit-button"]').click()
          assertErrorSummary(['Value for number of new jobs is required'])
        })
        it('should show an error if the number of new jobs is 0', () => {
          cy.get('[data-test="number-new-jobs-input"]').type(0)
          cy.get('[data-test="submit-button"]').click()
          assertErrorSummary(['Number of new jobs must be greater than 0'])
        })
        it('should not show an error if the number of new jobs is 1', () => {
          cy.get('[data-test="number-new-jobs-input"]').type(1)
          cy.get('[data-test="submit-button"]').click()
          assertNotExists('[data-test="summary-form-errors"]')
        })
      })

      context('With no involvement', () => {
        const expansionProject = setupProjectFaker({
          stage: INVESTMENT_PROJECT_STAGES.active,
          investment_type: {
            name: 'FDI',
            id: 'foo',
          },
          level_of_involvement: null,
        })
        beforeEach(() => {
          setup(expansionProject)
        })

        testNumberOfNewJobs({
          required: false,
        })

        it('should show an error if the number of new jobs is empty', () => {
          cy.get('[data-test="submit-button"]').click()
          cy.contains('Value for number of new jobs is required').should(
            'not.exist'
          )
        })

        it('should not show an error if the number of new jobs is 0', () => {
          cy.get('[data-test="number-new-jobs-input"]').type(0)
          cy.get('[data-test="submit-button"]').click()
          cy.contains('Number of new jobs must be greater than 0').should(
            'not.exist'
          )
        })

        it('should not show an error if the number of new jobs is 1', () => {
          cy.get('[data-test="number-new-jobs-input"]').type(1)
          cy.get('[data-test="submit-button"]').click()
          assertNotExists('[data-test="summary-form-errors"]')
        })
      })
    })

    context('When editing an non expansion project', () => {
      it('should show an error or hint text if number of new jobs is empty and it is a non FDI project', () => {
        const nonFdiProject = setupProjectFaker({
          stage: INVESTMENT_PROJECT_STAGES.active,
          investment_type: {
            name: 'non-FDI',
            id: '3d2c94e4-7871-465c-a7f7-45651eeffc64',
          },
          fdi_type: null,
          gva_multiplier: null,
        })
        setup(nonFdiProject)
        cy.get('[data-test="field-number_new_jobs"]').should(
          'not.contain',
          '[data-test="hint-text"]'
        )
        cy.get('[data-test="submit-button"]').click()
        assertErrorSummary(['Value for number of new jobs is required'])
      })
      it('should show an error or hint text if number of new jobs is empty and it is not an expansion FDI project', () => {
        const nonExpansionFdiProject = setupProjectFaker({
          stage: INVESTMENT_PROJECT_STAGES.active,
        })
        setup(nonExpansionFdiProject)
        cy.get('[data-test="field-number_new_jobs"]').should(
          'not.contain',
          '[data-test="hint-text"]'
        )
        cy.get('[data-test="submit-button"]').click()
        assertErrorSummary(['Value for number of new jobs is required'])
      })
    })
  })
})
