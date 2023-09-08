const {
  assertBreadcrumbs,
  assertErrorSummary,
  assertFieldInput,
  assertFieldRadios,
  assertFieldUneditable,
  assertLocalHeader,
} = require('../../support/assertions')
const { investments } = require('../../../../../src/lib/urls')

const projectWithValue = require('../../fixtures/investment/investment-has-existing-value.json')
const projectNoValue = require('../../fixtures/investment/investment-no-value.json')
const projectLandingBeforeApril = require('../../fixtures/investment/investment-land-date-before-April-2020.json')
const projectLandingAfterApril = require('../../fixtures/investment/investment-land-date-after-April-2020.json')
const projectNoLandingDates = require('../../fixtures/investment/investment-no-landing-dates.json')
const projectBothDatesBeforeApril = require('../../fixtures/investment/investment-both-land-dates-before-April-2020.json')
const projectBothDatesAfterApril = require('../../fixtures/investment/investment-both-land-dates-after-April-2020.json')
const projectOneLandDateEitherSideApril = require('../../fixtures/investment/investment-one-land-date-before-April-one-after.json')
const projectNotFDI = require('../../fixtures/investment/investment-no-existing-requirements.json')
const projectWithNoSectorOrCapital = require('../../fixtures/investment/investment-no-sector.json')
const projectWithCapitalButNoSector = require('../../fixtures/investment/investment-has-capital-expenditure-but-no-sector.json')
const projectCreatedBefore = require('../../fixtures/investment/investment-created-before.json')
const projectCreatedSame = require('../../fixtures/investment/investment-created-same-date.json')
const projectCreatedAfter = require('../../fixtures/investment/investment-created-after.json')

const convertBoolToYesNo = (valueToCheck) => (valueToCheck ? 'Yes' : 'No')
const convertBoolToInvertedYesNo = (valueToCheck) =>
  valueToCheck ? 'No' : 'Yes'

describe('Edit the value details of a project', () => {
  context('When viewing a project with no value fields set', () => {
    before(() => {
      cy.visit(investments.projects.editValue(projectNoValue.id))
    })

    it('should render the header', () => {
      assertLocalHeader(projectNoValue.name)
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Investments: investments.index(),
        Projects: investments.projects.index(),
        [projectNoValue.name]: investments.projects.project(projectNoValue.id),
        'Edit value': null,
      })
    })

    it('should display the cannot provide total field', () => {
      cy.get('[data-test="field-client_cannot_provide_total_investment"]').then(
        (element) => {
          assertFieldRadios({
            element,
            label: 'Can client provide total investment value?',
            hint: 'Includes capital, operational and R&D expenditure',
            optionsCount: 2,
          })
        }
      )
    })

    it('should only display total investment if "Yes" is selected', () => {
      cy.get('[data-test="total_investment]').should('not.exist')
      cy.get('[data-test="client-cannot-provide-total-investment-no"]').click()
      cy.get('[data-test="total_investment]').should('not.exist')
      cy.get('[data-test="client-cannot-provide-total-investment-yes"]').click()
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
      cy.get('[data-test="gross_value_added]').should('not.exist')
      cy.get(
        '[data-test="client-cannot-provide-foreign-investment-no"]'
      ).click()
      cy.get('[data-test="foreign_equity_investment]').should('not.exist')
      cy.get('[data-test="gross_value_added]').should('not.exist')
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
      cy.get('[data-test="field-gross_value_added"]').then((element) => {
        assertFieldUneditable({
          element,
          label: 'Gross value added (GVA)',
          value:
            'Add capital expenditure value and click "Save" to calculate GVA',
        })
      })
    })

    it('should display the number of new jobs field', () => {
      cy.get('[data-test="field-number_new_jobs"]').then((element) => {
        assertFieldInput({
          element,
          label: 'Number of new jobs',
        })
      })
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
      cy.get('[data-test="field-number_safeguarded_jobs"]').then((element) => {
        assertFieldInput({
          element,
          label: 'Number of safeguarded jobs',
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
        })
      })
    })

    it('should display the R&D field', () => {
      cy.get('[data-test="field-r_and_d_budget"]').then((element) => {
        assertFieldRadios({
          element,
          label: 'Does this project have budget for research and development?',
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
      cy.get('[data-test="submit-button"]').click()
      assertErrorSummary([
        'Enter the total investment',
        'Enter the capital expenditure',
      ])
    })
  })
  context('When viewing a project with all value fields set', () => {
    before(() => {
      cy.visit(investments.projects.editValue(projectWithValue.id))
    })

    it('should render the header', () => {
      assertLocalHeader(projectWithValue.name)
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
              projectWithValue.client_cannot_provide_total_investment
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
            projectWithValue.client_cannot_provide_foreign_investment
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

      cy.get('[data-test="field-gross_value_added"]').then((element) => {
        assertFieldUneditable({
          element,
          label: 'Gross value added (GVA)',
          value: '£34,568',
        })
      })
    })

    it('should display the number of new jobs field', () => {
      cy.get('[data-test="field-number_new_jobs"]').then((element) => {
        assertFieldInput({
          element,
          label: 'Number of new jobs',
          value: projectWithValue.number_new_jobs,
        })
      })
    })

    it('should display the average salary field', () => {
      cy.get('[data-test="field-average_salary"]').then((element) => {
        assertFieldRadios({
          element,
          label: 'Average salary of new jobs',
          optionsCount: 3,
          value: projectWithValue.average_salary.name,
        })
      })
    })

    it('should display the number of safeguarded jobs field', () => {
      cy.get('[data-test="field-number_safeguarded_jobs"]').then((element) => {
        assertFieldInput({
          element,
          label: 'Number of safeguarded jobs',
          value: projectWithValue.number_safeguarded_jobs,
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
          value: convertBoolToYesNo(projectWithValue.government_assistance),
        })
      })
    })

    it('should display the R&D field', () => {
      cy.get('[data-test="field-r_and_d_budget"]').then((element) => {
        assertFieldRadios({
          element,
          label: 'Does this project have budget for research and development?',
          optionsCount: 2,
          value: convertBoolToYesNo(projectWithValue.r_and_d_budget),
        })
      })
    })

    it('should display the non-FDI R&D field', () => {
      cy.get('[data-test="field-non_fdi_r_and_d_budget"]').then((element) => {
        assertFieldRadios({
          element,
          label: 'Is this project associated with a non-FDI R&D project?',
          optionsCount: 2,
          value: convertBoolToYesNo(projectWithValue.non_fdi_r_and_d_budget),
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
          value: convertBoolToYesNo(projectWithValue.new_tech_to_uk),
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
          value: convertBoolToYesNo(projectWithValue.export_revenue),
        })
      })
    })
  })
  context('When viewing a project with no sector and no capital value', () => {
    before(() => {
      cy.visit(investments.projects.editValue(projectWithNoSectorOrCapital.id))
    })
    it('should display the correct message in the GVA field', () => {
      cy.get('[data-test="client-cannot-provide-total-investment-yes"]').click()
      cy.get('[data-test="field-gross_value_added"]').then((element) => {
        assertFieldUneditable({
          element,
          label: 'Gross value added (GVA)',
          value:
            'Add capital expenditure value and primary sector (investment project summary) to calculate GVA',
        })
      })
    })
  })
  context('When viewing a project with capital value but no sector', () => {
    before(() => {
      cy.visit(investments.projects.editValue(projectWithCapitalButNoSector.id))
    })
    it('should display the correct message in the GVA field', () => {
      cy.get('[data-test="client-cannot-provide-total-investment-yes"]').click()
      cy.get('[data-test="field-gross_value_added"]').then((element) => {
        assertFieldUneditable({
          element,
          label: 'Gross value added (GVA)',
          value:
            'Add primary sector (investment project summary) to calculate GVA',
        })
      })
    })
  })
  context(
    'When viewing a non-FDI project with a land date before April 2020',
    () => {
      before(() => {
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
        cy.get('[data-test="field-gross_value_added"]').should('not.exist')
      })
    }
  )
  context('When one land date is null and one is before 01/04/2020 ', () => {
    before(() => {
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
  })
  context('When both dates are before 01/04/2020', () => {
    before(() => {
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
    before(() => {
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
    before(() => {
      cy.visit(investments.projects.editValue(projectLandingAfterApril.id))
    })
    it('should not display the Project Value field', () => {
      cy.get('[data-test="field-fdi_value"]').should('not.exist')
    })
  })
  context('When both dates are after 01/04/2020', () => {
    before(() => {
      cy.visit(investments.projects.editValue(projectBothDatesAfterApril.id))
    })
    it('should not display the Project Value field', () => {
      cy.get('[data-test="field-fdi_value"]').should('not.exist')
    })
  })
  context('When both land date fields are empty', () => {
    before(() => {
      cy.visit(investments.projects.editValue(projectNoLandingDates.id))
    })
    it('should not display the Project Value field', () => {
      cy.get('[data-test="field-fdi_value"]').should('not.exist')
    })
  })
  context(
    'When viewing a project created before a salary range is disabled',
    () => {
      before(() => {
        cy.visit(investments.projects.editValue(projectCreatedBefore.id))
      })
      it('should display the salary range for £25,000 – £29,000 when the project was created before the disable date', () => {
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
      before(() => {
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
      before(() => {
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
