/**
 * Tests for: ./src/apps/companies/apps/add-company/client/AddCompanyForm.jsx
 */

const selectors = require('../../../../selectors')
const fixtures = require('../../fixtures')
const {
  assertBreadcrumbs,
  assertErrorDialog,
} = require('../../support/assertions')
const urls = require('../../../../../src/lib/urls')

const goToOverseasCompanySearchPage = () => {
  cy.visit(urls.companies.create())
  cy.get(selectors.companyAdd.form).find('[type="radio"]').check('overseas')
  cy.get(selectors.companyAdd.form).find('select').select('Poland')
  cy.get(selectors.companyAdd.continueButton).click()
}

const goToOverseasCompanySearchResultsPage = () => {
  goToOverseasCompanySearchPage()
  cy.get(selectors.companyAdd.entitySearch.companyNameField).type('a company')
  cy.get(selectors.companyAdd.entitySearch.searchButton).click()
}

const goToUSCompanySearchPage = () => {
  cy.visit(urls.companies.create())
  cy.get(selectors.companyAdd.form).find('[type="radio"]').check('overseas')
  cy.get(selectors.companyAdd.form).find('select').select('United States')
  cy.get(selectors.companyAdd.continueButton).click()
}

const goToCanadianCompanySearchPage = () => {
  cy.visit(urls.companies.create())
  cy.get(selectors.companyAdd.form).find('[type="radio"]').check('overseas')
  cy.get(selectors.companyAdd.form).find('select').select('Canada')
  cy.get(selectors.companyAdd.continueButton).click()
}

const goToUKCompanySearchResultsPage = () => {
  cy.visit(urls.companies.create())
  cy.get(selectors.companyAdd.form).find('[type="radio"]').check('GB')
  cy.get(selectors.companyAdd.continueButton).click()
  cy.get(selectors.companyAdd.entitySearch.companyNameField).type('a company')
  cy.get(selectors.companyAdd.entitySearch.searchButton).click()
}

const goToAddUKCompanyPage = (listItem) => {
  goToUKCompanySearchResultsPage()
  cy.get(listItem).click()
  cy.get(selectors.companyAdd.continueButton).click()
}

const goToUSCompanySearchResultsPage = () => {
  goToUSCompanySearchPage()
  cy.get(selectors.companyAdd.entitySearch.companyNameField).type(
    'a US company'
  )
  cy.get(selectors.companyAdd.entitySearch.searchButton).click()
}

const goToCandianCompanySearchResultsPage = () => {
  goToCanadianCompanySearchPage()
  cy.get(selectors.companyAdd.entitySearch.companyNameField).type(
    'a Canadian company'
  )
  cy.get(selectors.companyAdd.entitySearch.searchButton).click()
}

const goToManualAddUKCompanyPage = () => {
  goToUKCompanySearchResultsPage()
  cy.get(selectors.companyAdd.entitySearch.cannotFind.summary).click()
  cy.get(selectors.companyAdd.entitySearch.cannotFind.stillCannotFind).click()
}

const goToUKCompanySectorAndRegionPage = () => {
  goToManualAddUKCompanyPage()
  cy.get(
    selectors.companyAdd.newCompanyRecordForm.organisationType.limitedCompany
  ).click()
  cy.get(selectors.companyAdd.newCompanyRecordForm.companyName).type(
    'INVESTIGATION LIMITED'
  )
  cy.get(selectors.companyAdd.newCompanyRecordForm.website).type(
    'www.investigationlimited.com'
  )
  cy.get(selectors.companyAdd.newCompanyRecordForm.telephone)
    .clear()
    .type('0123456789')
  cy.get(selectors.companyAdd.newCompanyRecordForm.address.postcode).type(
    'SW1H 9AJ'
  )
  cy.get(
    selectors.companyAdd.newCompanyRecordForm.address.findUkAddress
  ).click()
  cy.get(selectors.companyAdd.newCompanyRecordForm.address.options).select(
    'Ministry of Justice'
  )
  cy.get(selectors.companyAdd.continueButton).click()
}

const assertUSOrCanadianCompanyFormFields = () => {
  cy.get(selectors.companyAdd.newCompanyRecordForm.organisationType.charity)
    .parent()
    .should('be.visible')
  cy.get(
    selectors.companyAdd.newCompanyRecordForm.organisationType
      .governmentDepartmentOrOtherPublicBody
  )
    .parent()
    .should('be.visible')
  cy.get(
    selectors.companyAdd.newCompanyRecordForm.organisationType.limitedCompany
  )
    .parent()
    .should('be.visible')
  cy.get(
    selectors.companyAdd.newCompanyRecordForm.organisationType
      .limitedPartnership
  )
    .parent()
    .should('be.visible')
  cy.get(selectors.companyAdd.newCompanyRecordForm.organisationType.partnership)
    .parent()
    .should('be.visible')
  cy.get(selectors.companyAdd.newCompanyRecordForm.organisationType.soleTrader)
    .parent()
    .should('be.visible')
  cy.get(selectors.companyAdd.newCompanyRecordForm.companyName).should(
    'be.visible'
  )
  cy.get(selectors.companyAdd.newCompanyRecordForm.website).should('be.visible')
  cy.get(selectors.companyAdd.newCompanyRecordForm.telephone).should(
    'be.visible'
  )
  cy.get(selectors.companyAdd.newCompanyRecordForm.address.postcode).should(
    'be.visible'
  )
}

describe('Add company form', () => {
  beforeEach(function () {
    Cypress.Cookies.preserveOnce('datahub.sid')
  })

  context(
    'when viewing a company in the list thats already in Data Hub',
    () => {
      it('should show that the company is already in Data Hub', () => {
        goToUKCompanySearchResultsPage()
        cy.get('[data-test="entity-list"] li')
          .eq(1)
          .find('h3')
          .should('have.text', 'Some matched company')
          .next()
          .should(
            'have.text',
            'Trading name(s) Some matched company trading nameLocation at 123 Fake Street, Brighton, BN1 4SE'
          )
          .next()
          .should(
            'have.text',
            'This company is already on Data Hub. You can record activity on the company page.'
          )
          .find('a')
          .should(
            'have.attr',
            'href',
            urls.companies.detail('0fb3379c-341c-4da4-b825-bf8d47b26baa')
          )
          .should(
            'have.attr',
            'aria-label',
            'Go to Some matched company details page to record activity'
          )
      })
    }
  )

  context('when viewing the "Add company form"', () => {
    before(() => {
      cy.visit(urls.companies.create())
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Companies: urls.companies.index(),
        'Add company': null,
      })
    })

    it('should display "Where is this company located?" heading', () => {
      cy.get(selectors.companyAdd.form).contains(
        'Where is this company located?'
      )
    })

    it('should display "Continue" button', () => {
      cy.get(selectors.companyAdd.continueButton).should('be.visible')
    })

    it('should not display an error message', () => {
      cy.get(selectors.companyAdd.form)
        .contains('Specify location of the company')
        .should('not.exist')
    })

    it('should display an error message when no location is selected', () => {
      cy.get(selectors.companyAdd.continueButton).click()
      cy.get(selectors.companyAdd.form).contains(
        'Specify location of the company'
      )
    })
  })

  context('when "Overseas" is selected for the company location', () => {
    before(() => {
      cy.visit(urls.companies.create())
      cy.get(selectors.companyAdd.form).find('[type="radio"]').check('overseas')
      cy.get(selectors.companyAdd.continueButton).click()
    })

    it('should display "Country" selection', () => {
      cy.get(selectors.companyAdd.form).contains('Country')
      cy.get(selectors.companyAdd.form).find('select').should('be.visible')
    })

    it('should include Hong Kong in the "Country" selection', () => {
      cy.get(selectors.companyAdd.form).contains('Country')
      cy.get(selectors.companyAdd.form)
        .find('select option[value="HK"]')
        .should('have.length', 1)
        .should('have.text', 'Hong Kong (SAR)')
    })

    it('should display an error message when no country is specified', () => {
      cy.get(selectors.companyAdd.continueButton).click()
      cy.get(selectors.companyAdd.form).contains(
        'Select in which country the company is located'
      )
    })
  })

  context('when an overseas country is picked', () => {
    before(() => {
      goToOverseasCompanySearchPage()
    })

    it('should display the "Find the company" heading', () => {
      cy.get(selectors.companyAdd.stepHeader).should(
        'have.text',
        'Find the company'
      )
    })

    it('should display the selected country', () => {
      cy.get(selectors.companyAdd.form)
        .find('fieldset')
        .contains('CountryPoland Change Country')
    })

    it('should display the "Find company" button', () => {
      cy.get(selectors.companyAdd.entitySearch.searchButton).should(
        'be.visible'
      )
    })

    it('should not display the"Back" button', () => {
      cy.get(selectors.companyAdd.backButton).should('not.exist')
    })

    it('should not display the "Continue" button', () => {
      cy.get(selectors.companyAdd.continueButton).should('not.exist')
    })

    it('should display an error message when the "Company name" field is not filled in', () => {
      cy.get(selectors.companyAdd.entitySearch.searchButton).click()
      cy.get(selectors.companyAdd.form).should('contain', 'Enter company name')
      cy.get(selectors.companyAdd.entitySearch.results.someCompanyName).should(
        'not.exist'
      )
      cy.get(selectors.companyAdd.entitySearch.results.someOtherCompany).should(
        'not.exist'
      )
    })

    it('should display an error message when DnB search fails', () => {
      cy.get(selectors.companyAdd.entitySearch.companyNameField).type(
        'Simulate 500 Error'
      )
      cy.get(selectors.companyAdd.entitySearch.searchButton).click()
      cy.get('[data-test="status-message"]')
        .should('exist')
        .should('contain.text', 'Error occurred while searching for company.')
        .should('have.attr', 'role', 'alert')
    })
  })

  context('when an overseas company is searched', () => {
    before(() => {
      goToOverseasCompanySearchResultsPage()
    })

    it('should display the entity search results', () => {
      cy.get(selectors.companyAdd.entitySearch.results.someCompanyName).should(
        'be.visible'
      )
      cy.get(selectors.companyAdd.entitySearch.results.someOtherCompany).should(
        'be.visible'
      )
    })
  })

  context('when a company is picked that does not exist on Data Hub', () => {
    before(() => {
      goToOverseasCompanySearchResultsPage()
      cy.contains('Some unmatched company').click()
    })

    it('should display a confirmation summary', () => {
      cy.get(selectors.companyAdd.stepHeader).should(
        'have.text',
        'Confirm you want to add this company to Data Hub'
      )
      cy.get(selectors.companyAdd.summary).should(
        'contain',
        'Registered company name'
      )
      cy.get(selectors.companyAdd.summary).should(
        'contain',
        'Some unmatched company'
      )
      cy.get(selectors.companyAdd.summary).should(
        'contain',
        'Companies House number'
      )
      cy.get(selectors.companyAdd.summary).should('contain', '00016033')
      cy.get(selectors.companyAdd.summary).should('contain', 'Address')
      cy.get(selectors.companyAdd.summary).should(
        'contain',
        '123 ABC Road, Brighton, BN2 9QB'
      )
      cy.get(selectors.companyAdd.summary).should('contain', 'Country')
      cy.get(selectors.companyAdd.summary).should('contain', 'Poland')
    })

    it('should show back and continue buttons', () => {
      cy.get(selectors.companyAdd.backButton).should('be.visible')
      cy.get(selectors.companyAdd.continueButton).should('be.visible')
    })
  })

  context('when adding a company that does not exist on Data Hub', () => {
    beforeEach(() => {
      goToOverseasCompanySearchResultsPage()
      cy.contains('Some unmatched company').click()
      cy.get(selectors.companyAdd.continueButton).click()
    })

    it('should render the "Add company" page with a form to add a sector', () => {
      cy.get(selectors.companyAdd.title)
      cy.should('have.text', 'Add company').and('have.prop', 'tagName', 'H1')
      cy.contains('DBT sector')
        .parent()
        .next()
        .get('select option:selected')
        .should('have.text', '-- Select DBT sector --')
        .parent()
        .parent()
        .parent()
        .parent()
        .next()
        .contains('Add company')
        .and('match', 'button')
        .next()
        .contains('Back')
        .and('match', 'button')
    })

    it('should display an error message when no sector is selected', () => {
      cy.get(selectors.companyAdd.submitButton).click()
      cy.get(selectors.companyAdd.form).contains('Select DBT sector')
    })

    it('should redirect to the company overview when a sector is picked', () => {
      cy.get(selectors.companyAdd.sectorSelect)
        .select('Airports')
        .get(selectors.companyAdd.submitButton)
        .click()
        .location('pathname')
        .should(
          'eq',
          urls.companies.overview.index(fixtures.company.someOtherCompany.id)
        )
      cy.contains('Company added to Data Hub')
    })

    it('should not continue when DnB company creation fails', () => {
      // Choosing the water sector simulates a server error
      cy.get(selectors.companyAdd.sectorSelect).select('Water')
      cy.get(selectors.companyAdd.submitButton).click()
      cy.location('pathname').should('eq', urls.companies.create())
    })

    it('should display error dialog when DnB company creation fails', () => {
      const apiErrorMessage = 'website: Enter a valid URL.'

      cy.intercept('POST', '/companies/create/dnb/company-create*', {
        statusCode: 400,
        body: {
          error: {
            message: [apiErrorMessage],
            status: 400,
          },
        },
      })

      cy.get(selectors.companyAdd.sectorSelect).select('Aerospace')
      cy.get(selectors.companyAdd.submitButton).click()
      cy.location('pathname').should('eq', urls.companies.create())

      assertErrorDialog('Create company', apiErrorMessage)
    })
  })

  context('when manually adding a new UK-based company', () => {
    beforeEach(() => {
      goToManualAddUKCompanyPage()
    })

    it('should display the manual entry form', () => {
      cy.get(selectors.companyAdd.newCompanyRecordForm.organisationType.charity)
        .parent()
        .should('be.visible')
      cy.get(
        selectors.companyAdd.newCompanyRecordForm.organisationType
          .governmentDepartmentOrOtherPublicBody
      )
        .parent()
        .should('be.visible')
      cy.get(
        selectors.companyAdd.newCompanyRecordForm.organisationType
          .limitedCompany
      )
        .parent()
        .should('be.visible')
      cy.get(
        selectors.companyAdd.newCompanyRecordForm.organisationType
          .limitedPartnership
      )
        .parent()
        .should('be.visible')
      cy.get(
        selectors.companyAdd.newCompanyRecordForm.organisationType.partnership
      )
        .parent()
        .should('be.visible')
      cy.get(
        selectors.companyAdd.newCompanyRecordForm.organisationType.soleTrader
      )
        .parent()
        .should('be.visible')
      cy.get(selectors.companyAdd.newCompanyRecordForm.companyName).should(
        'be.visible'
      )
      cy.get(selectors.companyAdd.newCompanyRecordForm.website).should(
        'be.visible'
      )
      cy.get(selectors.companyAdd.newCompanyRecordForm.website).should(
        'be.visible'
      )
      cy.get(selectors.companyAdd.newCompanyRecordForm.telephone).should(
        'be.visible'
      )
      cy.get(selectors.companyAdd.newCompanyRecordForm.address.postcode).should(
        'be.visible'
      )
      cy.get(
        selectors.companyAdd.newCompanyRecordForm.address.findUkAddress
      ).should('be.visible')
      cy.get(selectors.companyAdd.form).contains('United Kingdom')
    })

    it('should display errors when the form is incomplete', () => {
      cy.get(selectors.companyAdd.continueButton).click()

      cy.get(selectors.companyAdd.form).contains('Select organisation type')
      cy.get(selectors.companyAdd.form).contains('Enter name')
      cy.get('#field-website').contains('Enter a website or phone number')
      cy.get('#field-telephone_number').contains(
        'Enter a website or phone number'
      )
      cy.get(selectors.companyAdd.form).contains('Enter an address')
      cy.get(selectors.companyAdd.form).contains('Enter a town or city')
    })

    it('should not display "Enter a website or phone number" when the website is present', () => {
      cy.get(selectors.companyAdd.newCompanyRecordForm.website).type(
        'www.example.com'
      )
      cy.get(selectors.companyAdd.continueButton).click()
      cy.get(selectors.companyAdd.form).should(
        'not.contain',
        'Enter a website or phone number'
      )
    })

    it('should not display "Enter a website or phone number" when the phone number is present', () => {
      cy.get(selectors.companyAdd.newCompanyRecordForm.telephone).type(
        '+01 (23) 456789'
      )
      cy.get(selectors.companyAdd.continueButton).click()
      cy.get(selectors.companyAdd.form).should(
        'not.contain',
        'Enter a website or phone number'
      )
    })

    it('should display invalid website URL error when an invalid website URL is entered', () => {
      cy.get(selectors.companyAdd.newCompanyRecordForm.website).type('hello')
      cy.get(selectors.companyAdd.continueButton).click()

      cy.get(
        selectors.companyAdd.newCompanyRecordForm.websiteContainer
      ).contains('Enter a valid website URL')
      cy.get(
        selectors.companyAdd.newCompanyRecordForm.telephoneContainer
      ).should('not.contain', 'Enter a valid website URL')
    })

    it('should display invalid telephone number error when an invalid telephone number is entered', () => {
      cy.get(selectors.companyAdd.newCompanyRecordForm.telephone).type(
        '©123123123'
      )
      cy.get(selectors.companyAdd.continueButton).click()
      cy.get(
        selectors.companyAdd.newCompanyRecordForm.telephoneContainer
      ).contains('Enter a valid telephone number')
      cy.get(selectors.companyAdd.newCompanyRecordForm.websiteContainer).should(
        'not.contain',
        'Enter a valid telephone number'
      )
    })

    it('should display an error when an invalid organisation name is filled', () => {
      cy.get(selectors.companyAdd.newCompanyRecordForm.companyName).type(
        '=INVESTIGATION LIMITED'
      )
      cy.get(selectors.companyAdd.continueButton).click()
      cy.get(
        selectors.companyAdd.newCompanyRecordForm.companyNameContainer
      ).contains('Enter a valid name')
    })
  })

  context('when valid details are submitted for a new UK company', () => {
    beforeEach(() => {
      goToUKCompanySectorAndRegionPage()
    })

    it('should render the region and sector fields', () => {
      cy.get(selectors.companyAdd.form).contains('London')
      cy.get(selectors.companyAdd.form).contains('Select DBT sector')
    })

    it('should show errors when continuing without a region or sector', () => {
      cy.get(selectors.companyAdd.newCompanyRecordForm.region).select(
        '-- Select DBT region --'
      )
      cy.get(selectors.companyAdd.submitButton)
        .click()
        .get(selectors.companyAdd.form)
        .contains('Select DBT region')
        .get(selectors.companyAdd.form)
        .contains('Select DBT sector')
    })

    it('should not continue when the DnB investigation api call fails', () => {
      cy.get(selectors.companyAdd.newCompanyRecordForm.region).select('London')
      // Water sector simulates a server error from dnb investigation post
      cy.get(selectors.companyAdd.newCompanyRecordForm.sector).select('Water')
      cy.get(selectors.companyAdd.submitButton).click()

      cy.location('pathname').should('eq', urls.companies.create())
    })
  })

  context('when a valid sector and region are submitted', () => {
    before(() => {
      goToUKCompanySectorAndRegionPage()
      cy.get(selectors.companyAdd.newCompanyRecordForm.region).select('London')
      cy.get(selectors.companyAdd.newCompanyRecordForm.sector).select(
        'Advanced Engineering'
      )
      cy.get(selectors.companyAdd.submitButton).click()
    })
    it('should redirect to the company overview', () => {
      cy.location('pathname').should(
        'eq',
        `/companies/${fixtures.company.investigationLimited.id}/overview`
      )
    })
    it('should display the flash message', () => {
      cy.contains('Company added to Data Hub')
    })
    it('should display the pending D&B investigation message', () => {
      cy.get('[data-test="investigation-message"]').should('be.visible')
    })
  })

  context('when manually adding a new overseas company', () => {
    before(() => {
      goToOverseasCompanySearchResultsPage()

      cy.get(selectors.companyAdd.entitySearch.cannotFind.summary).click()
      cy.get(
        selectors.companyAdd.entitySearch.cannotFind.stillCannotFind
      ).click()
    })

    it('should display the manual entry form', () => {
      cy.get(selectors.companyAdd.newCompanyRecordForm.organisationType.charity)
        .parent()
        .should('be.visible')
      cy.get(
        selectors.companyAdd.newCompanyRecordForm.organisationType
          .governmentDepartmentOrOtherPublicBody
      )
        .parent()
        .should('be.visible')
      cy.get(
        selectors.companyAdd.newCompanyRecordForm.organisationType
          .limitedCompany
      )
        .parent()
        .should('be.visible')
      cy.get(
        selectors.companyAdd.newCompanyRecordForm.organisationType
          .limitedPartnership
      )
        .parent()
        .should('be.visible')
      cy.get(
        selectors.companyAdd.newCompanyRecordForm.organisationType.partnership
      )
        .parent()
        .should('be.visible')
      cy.get(
        selectors.companyAdd.newCompanyRecordForm.organisationType.soleTrader
      )
        .parent()
        .should('be.visible')
      cy.get(selectors.companyAdd.newCompanyRecordForm.companyName).should(
        'be.visible'
      )
      cy.get(selectors.companyAdd.newCompanyRecordForm.website).should(
        'be.visible'
      )
      cy.get(selectors.companyAdd.newCompanyRecordForm.telephone).should(
        'be.visible'
      )
      cy.get(selectors.companyAdd.newCompanyRecordForm.address.postcode).should(
        'be.visible'
      )
      cy.get(selectors.companyAdd.form).contains('Poland')
    })

    it('should not show an invalid postal or ZIP code error', () => {
      cy.get(selectors.companyAdd.newCompanyRecordForm.address.postcode).clear()
      cy.get(selectors.companyAdd.newCompanyRecordForm.address.postcode).type(
        'ABC 123'
      )
      cy.get(selectors.companyAdd.continueButton).click()
      cy.get(selectors.companyAdd.form).should(
        'not.contain',
        'Enter a valid Postal code'
      )
      cy.get(selectors.companyAdd.form).should(
        'not.contain',
        'Enter a valid ZIP code'
      )
    })

    it('should hide the UK-related fields', () => {
      cy.get(
        selectors.companyAdd.newCompanyRecordForm.address.findUkAddress
      ).should('not.exist')
    })
  })

  context('when "UK" is selected for the company location', () => {
    beforeEach(() => {
      const { results } = selectors.companyAdd.entitySearch
      goToAddUKCompanyPage(results.someCompanyName)
    })

    it('should render an "Add a company" H1 element', () => {
      cy.get(selectors.companyAdd.title).should('have.text', 'Add company')
    })

    it('should render a form with both "Region" and "Sector" selects', () => {
      cy.contains('DBT region')
        .parent()
        .next()
        .find('select option:selected')
        .should('have.text', 'London')
        .parent()
        .parent()
        .parent()
        .parent()
        .parent()
        .next()
        .contains('DBT sector')
        .parent()
        .next()
        .find('select option:selected')
        .should('have.text', '-- Select DBT sector --')
        .parent()
        .parent()
        .parent()
        .parent()
        .next()
        .contains('Add company')
        .and('match', 'button')
        .next()
        .contains('Back')
        .and('match', 'button')
    })

    it('should error when attempting to add a company without region or sector', () => {
      cy.get(selectors.companyAdd.submitButton)
        .click()
        .get(selectors.companyAdd.form)
        .contains('Select DBT region')
        .get(selectors.companyAdd.form)
        .contains('Select DBT sector')
    })

    it('should add a company after defining both region and sector', () => {
      cy.get(selectors.companyAdd.regionSelect)
        .select('South East')
        .get(selectors.companyAdd.sectorSelect)
        .select('Airports')
        .get(selectors.companyAdd.submitButton)
        .click()
        .location('pathname')
        .should(
          'eq',
          `/companies/${fixtures.company.someOtherCompany.id}/overview`
        )
      cy.contains('Company added to Data Hub')
    })
  })

  context('when a UK company postcode is unknown', () => {
    before(() => {
      const { results } = selectors.companyAdd.entitySearch
      goToAddUKCompanyPage(results.companyUnknownPostcode)
    })

    it('should prompt the user to select a "Region"', () => {
      cy.contains('DBT region')
        .parent()
        .next()
        .find('select option:selected')
        .should('have.text', '-- Select DBT region --')
    })
  })

  context('when manually adding a new US company', () => {
    before(() => {
      goToUSCompanySearchResultsPage()

      cy.get(selectors.companyAdd.entitySearch.cannotFind.summary).click()
      cy.get(
        selectors.companyAdd.entitySearch.cannotFind.stillCannotFind
      ).click()
    })

    it('should display the manual entry form', () => {
      assertUSOrCanadianCompanyFormFields()
      cy.get(selectors.companyAdd.newCompanyRecordForm.areaCanada).should(
        'not.exist'
      )
      cy.get(selectors.companyAdd.newCompanyRecordForm.areaUS).should(
        'be.visible'
      )
      cy.get(selectors.companyAdd.form).contains('United States')
    })

    it('should show errors when the form is not completed', () => {
      cy.get(selectors.companyAdd.continueButton).click()
      cy.get(selectors.companyAdd.form).contains('Select organisation type')
      cy.get(selectors.companyAdd.form).contains('Enter name')
      cy.get(selectors.companyAdd.form).contains(
        'Enter a website or phone number'
      )
      cy.get(selectors.companyAdd.form).contains('Enter an address')
      cy.get(selectors.companyAdd.form).contains('Enter a town or city')
      cy.get(selectors.companyAdd.form).contains('Select a state')
      cy.get(selectors.companyAdd.form).contains('Enter a ZIP code')
    })

    it('should show an invalid ZIP code error', () => {
      cy.get(selectors.companyAdd.newCompanyRecordForm.address.postcode).type(
        'A1A 1A1'
      )
      cy.get(selectors.companyAdd.continueButton).click()
      cy.get(selectors.companyAdd.form).contains('Enter a valid ZIP code')
    })

    it('should not show an invalid ZIP code error when completed correctly', () => {
      cy.get(selectors.companyAdd.newCompanyRecordForm.address.postcode).clear()
      cy.get(selectors.companyAdd.newCompanyRecordForm.address.postcode).type(
        '48222'
      )
      cy.get(selectors.companyAdd.continueButton).click()
      cy.get(selectors.companyAdd.form).should(
        'not.contain',
        'Enter a valid ZIP code'
      )
    })
  })

  context('when manually adding a new Canadian company', () => {
    before(() => {
      goToCandianCompanySearchResultsPage()

      cy.get(selectors.companyAdd.entitySearch.cannotFind.summary).click()
      cy.get(
        selectors.companyAdd.entitySearch.cannotFind.stillCannotFind
      ).click()
    })

    it('should display the manual entry form', () => {
      assertUSOrCanadianCompanyFormFields()
      cy.get(selectors.companyAdd.newCompanyRecordForm.areaCanada).should(
        'be.visible'
      )
      cy.get(selectors.companyAdd.newCompanyRecordForm.areaUS).should(
        'not.exist'
      )

      cy.get(selectors.companyAdd.form).contains('Canada')
    })

    it('should show errors when the form is not completed', () => {
      cy.get(selectors.companyAdd.continueButton).click()
      cy.get(selectors.companyAdd.form).contains('Select organisation type')
      cy.get(selectors.companyAdd.form).contains('Enter name')
      cy.get(selectors.companyAdd.form).contains(
        'Enter a website or phone number'
      )
      cy.get(selectors.companyAdd.form).contains('Enter an address')
      cy.get(selectors.companyAdd.form).contains('Enter a town or city')
      cy.get(selectors.companyAdd.form).contains('Select a province')
      cy.get(selectors.companyAdd.form).contains('Enter a Postal code')
    })

    it('should show an invalid postal code error', () => {
      cy.get(selectors.companyAdd.newCompanyRecordForm.address.postcode).type(
        '12345'
      )
      cy.get(selectors.companyAdd.continueButton).click()
      cy.get(selectors.companyAdd.form).contains('Enter a valid Postal code')
    })

    it('should not show an invalid postal code error when completed correctly', () => {
      cy.get(selectors.companyAdd.newCompanyRecordForm.address.postcode).clear()
      cy.get(selectors.companyAdd.newCompanyRecordForm.address.postcode).type(
        'A1A 1A1'
      )
      cy.get(selectors.companyAdd.continueButton).click()
      cy.get(selectors.companyAdd.form).should(
        'not.contain',
        'Enter a valid Postal code'
      )
    })
  })

  context('when manually adding a company where duns number is known', () => {
    context('and an error occurs getting the company details', () => {
      before(() => {
        cy.intercept('POST', '/companies/create/dnb/company-search*', {
          statusCode: 500,
        })
        cy.visit(`${urls.companies.create()}?duns_number=123456789`)
      })
      it('should forward to the manually add step', () => {
        cy.get(
          selectors.companyAdd.newCompanyRecordForm.whyAmISeeingThis.summary
        ).should('be.visible')
      })
    })

    context('and no company details are returned', () => {
      before(() => {
        cy.intercept('POST', '/companies/create/dnb/company-search*', {
          results: [],
        })
        cy.visit(`${urls.companies.create()}?duns_number=000000000`)
      })
      it('should forward to the manually add step', () => {
        cy.get(
          selectors.companyAdd.newCompanyRecordForm.whyAmISeeingThis.summary
        ).should('be.visible')
      })
    })

    context('and more than 1 company details are returned', () => {
      before(() => {
        cy.intercept('POST', '/companies/create/dnb/company-search*', {
          results: [{ dnb_company: {} }, { dnb_company: {} }],
        })
        cy.visit(`${urls.companies.create()}?duns_number=123456789`)
      })
      it('should forward to the manually add step', () => {
        cy.get(
          selectors.companyAdd.newCompanyRecordForm.whyAmISeeingThis.summary
        ).should('be.visible')
      })
    })

    context('and a single company is found that is already on datahub', () => {
      before(() => {
        cy.visit(`${urls.companies.create()}?duns_number=222222222`)
      })
      it('should display the already imported message', () => {
        cy.get(selectors.companyAdd.entitySearch.alreadyOnDatahub).should(
          'exist'
        )
      })
    })

    context('and a single company is found that is out of business', () => {
      before(() => {
        cy.intercept('POST', '/companies/create/dnb/company-search*', {
          results: [
            {
              dnb_company: { is_out_of_business: true },
              datahub_company: { id: 1 },
            },
          ],
        })
        cy.visit(`${urls.companies.create()}?duns_number=222222222`)
      })

      it('should display the out of business message', () => {
        cy.get(selectors.companyAdd.entitySearch.outOfBusiness).should('exist')
      })
    })

    context(
      'and a single company is found that is not on datahub that doesnt match a datahub country',
      () => {
        before(() => {
          cy.intercept('POST', '/companies/create/dnb/company-search?_csrf=*', {
            results: [
              {
                dnb_company: {
                  duns_number: '111111111',
                  address_country: 'NOT_REAL',
                  registration_numbers: [
                    {
                      registration_type: 'uk_companies_house_number',
                      registration_number: '00016033',
                    },
                  ],
                },
              },
            ],
          })

          cy.visit(`${urls.companies.create()}?duns_number=111111111`)
        })

        it('should display a confirmation summary with the option to select the country', () => {
          cy.get(selectors.companyAdd.stepHeader).should(
            'have.text',
            'Confirm you want to add this company to Data Hub'
          )

          cy.get(
            selectors.companyAdd.newCompanyRecordForm.companyLocation
          ).should('exist')
        })

        it('when uk is selected should display both dbt region and sector', () => {
          cy.get(selectors.companyAdd.form).find('[type="radio"]').check('GB')
          cy.get(selectors.companyAdd.continueButton).click()

          cy.get(selectors.companyAdd.newCompanyRecordForm.dbtRegion).should(
            'exist'
          )
          cy.get(selectors.companyAdd.newCompanyRecordForm.dbtSector).should(
            'exist'
          )
        })

        it('should submit the form', () => {
          cy.get(selectors.companyAdd.newCompanyRecordForm.region).select(
            'London'
          )
          cy.get(selectors.companyAdd.newCompanyRecordForm.sector).select(
            'Advanced Engineering'
          )
          cy.get(selectors.companyAdd.submitButton).click()
        })

        it('should redirect to the company overview', () => {
          cy.location('pathname').should(
            'eq',
            `/companies/${fixtures.company.default.id}/overview`
          )
        })
      }
    )

    context(
      'and a single company is found that is not on datahub with a matching datahub country',
      () => {
        before(() => {
          cy.intercept('POST', '/companies/create/dnb/company-search?_csrf=*', {
            results: [
              {
                dnb_company: {
                  primary_name: 'US company',
                  duns_number: '111111111',
                  address_line_1: '256 Square Street',
                  address_line_2: '',
                  address_town: 'Austin',
                  address_county: '',
                  address_postcode: '765413',
                  address_area: 'Texas',
                  address_country: 'US',
                  registration_numbers: [],
                },
              },
            ],
          })
          cy.visit(`${urls.companies.create()}?duns_number=268435455`)
        })

        it('should display a confirmation summary without the option to select a country', () => {
          cy.get(selectors.companyAdd.stepHeader).should(
            'have.text',
            'Confirm you want to add this company to Data Hub'
          )
          cy.get(selectors.companyAdd.summary).should(
            'contain',
            'Registered company name'
          )
          cy.get(selectors.companyAdd.summary).should('contain', 'US company')

          cy.get(selectors.companyAdd.summary).should('contain', 'Country')
          cy.get(selectors.companyAdd.summary).should(
            'contain',
            'United States'
          )

          cy.get(selectors.companyAdd.summary).should('contain', 'Address')
          cy.get(selectors.companyAdd.summary).should(
            'contain',
            '256 Square Street, Austin, 765413'
          )

          cy.get(
            selectors.companyAdd.newCompanyRecordForm.companyLocation
          ).should('not.exist')
        })

        it('should only show the continue button', () => {
          cy.get(selectors.companyAdd.backButton).should('not.exist')
          cy.get(selectors.companyAdd.continueButton).should('be.visible')
        })

        it('should display only the dbt sector', () => {
          cy.get(selectors.companyAdd.continueButton).click()

          cy.get(selectors.companyAdd.newCompanyRecordForm.dbtRegion).should(
            'not.exist'
          )
          cy.get(selectors.companyAdd.newCompanyRecordForm.dbtSector).should(
            'exist'
          )
        })

        it('should submit the form', () => {
          cy.get(selectors.companyAdd.newCompanyRecordForm.sector).select(
            'Advanced Engineering'
          )
          cy.get(selectors.companyAdd.submitButton).click()
        })

        it('should redirect to the company overview', () => {
          cy.location('pathname').should(
            'eq',
            `/companies/${fixtures.company.default.id}/overview`
          )
        })
      }
    )
  })
})
