const selectors = require('../../../../selectors')
const fixtures = require('../../fixtures')
const {
  assertBreadcrumbs,
  assertErrorDialog,
  assertFieldSelect,
  assertErrorSummary,
  assertFlashMessage,
  assertFieldRadios,
} = require('../../support/assertions')
const urls = require('../../../../../src/lib/urls')

const newRecordForm = selectors.companyAdd.newCompanyRecordForm
const entitySearch = selectors.companyAdd.entitySearch
const entitySearchResults = entitySearch.results

const goToOverseasCompanySearchPage = (country) => {
  cy.visit(urls.companies.create())
  cy.get(selectors.companyAdd.form).find('[type="radio"]').check('overseas')
  cy.get(selectors.companyAdd.form).find('select').select(country)
  cy.get(selectors.companyAdd.continueButton).click()
}

const goToOverseasCompanySearchResultsPage = () => {
  goToOverseasCompanySearchPage('Poland')
}

const goToUKCompanySearchResultsPage = () => {
  cy.visit(urls.companies.create())
  cy.get(selectors.companyAdd.form).find('[type="radio"]').check('GB')
  cy.get(selectors.companyAdd.continueButton).click()
}

const goToAddUKCompanyPage = (listItem) => {
  goToUKCompanySearchResultsPage()
  cy.get(entitySearch.companyNameField).type('some')
  cy.get(listItem).click()
  cy.get(entitySearch.selectCompanyButton).click()
  cy.get(selectors.companyAdd.continueButton).click()
}

const goToManualAddUKCompanyPage = () => {
  goToUKCompanySearchResultsPage()
  cy.get(entitySearch.cannotFind.summary).click()
  cy.get(entitySearch.cannotFind.stillCannotFind).click()
}

const goToUKCompanySectorAndRegionPage = () => {
  goToManualAddUKCompanyPage()
  cy.get('[data-test="business-type-limited-company"]').click()
  cy.get(newRecordForm.companyName).type('INVESTIGATION LIMITED')
  cy.get(newRecordForm.website).type('www.investigationlimited.com')
  cy.get(newRecordForm.telephone).clear().type('0123456789')
  cy.get(newRecordForm.address.postcode).type('SW1H 9AJ')
  cy.get(newRecordForm.address.findUkAddress).click()
  cy.get(newRecordForm.address.options).select('Ministry of Justice')
  cy.get(selectors.companyAdd.continueButton).click()
}

const assertUSOrCanadianCompanyFormFields = () => {
  cy.get('[data-test="field-business_type"]').then((element) => {
    assertFieldRadios({
      element,
      label: 'Organisation type',
      optionsCount: 6,
    })
  })
  cy.get(newRecordForm.companyName).should('be.visible')
  cy.get(newRecordForm.website).should('be.visible')
  cy.get(newRecordForm.telephone).should('be.visible')
  cy.get(newRecordForm.address.postcode).should('be.visible')
}

const assertSummaryContains = (text) => {
  cy.get(selectors.companyAdd.summary).should('contain', text)
}

const assertCompanyCreateRedirect = () => {
  cy.get(selectors.companyAdd.submitButton).click()
  cy.location('pathname').should('eq', urls.companies.create())
}

const assertOverviewRedirect = (companyId) => {
  cy.get(selectors.companyAdd.submitButton).click()
  cy.location('pathname').should('eq', urls.companies.overview.index(companyId))
  assertFlashMessage('Company added to Data Hub')
}

describe('Add company form', () => {
  context(
    'when viewing a company in the list thats already in Data Hub',
    () => {
      it('should show that the company is already in Data Hub', () => {
        goToUKCompanySearchResultsPage()
        cy.get(entitySearch.companyNameField).type('some matched company')
        cy.get('[data-test="typeahead-menu-option"]')
          .find('span')
          .should('contain', 'Some matched company')
          .find('[data-test="metadata-label"]')
          .should('contain', 'Trading name(s)')
          .should('contain', 'Location at')
        cy.get('[data-test="typeahead-menu-option"]')
          .find('span')
          .should('contain', 'Some matched company')
          .find('[data-test="metadata-value"]')
          .should('contain', 'Some matched company trading name')
          .should('contain', '123 Fake Street, Brighton, BN1 4SE')
        cy.get('[data-test="company-already-on-datahub"]')
          .should(
            'contain',
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
    beforeEach(() => {
      cy.visit(urls.companies.create())
    })

    it('should render the expected headings and buttons', () => {
      // should render breadcrumbs
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Companies: urls.companies.index(),
        'Add company': null,
      })

      // should display "Where is this company located?" heading
      cy.get(selectors.companyAdd.form).contains(
        'Where is this company located?'
      )

      // should display "Continue" button
      cy.get(selectors.companyAdd.continueButton).should('be.visible')

      // should not display an error message
      cy.get(selectors.companyAdd.form)
        .contains('Specify location of the company')
        .should('not.exist')

      // should display an error message when no location is selected
      cy.get(selectors.companyAdd.continueButton).click()
      assertErrorSummary(['Specify location of the company'])
    })
  })

  context('when "Overseas" is selected for the company location', () => {
    beforeEach(() => {
      cy.visit(urls.companies.create())
      cy.get(selectors.companyAdd.form).find('[type="radio"]').check('overseas')
      cy.get(selectors.companyAdd.continueButton).click()
    })

    it('should render the country field with the expected behaviour', () => {
      // should display "Country" selection
      cy.get(selectors.companyAdd.form).contains('Country')
      cy.get(selectors.companyAdd.form).find('select').should('be.visible')

      // should display an error message when no country is specified
      cy.get(selectors.companyAdd.continueButton).click()
      assertErrorSummary(['Select in which country the company is located'])

      // should include Hong Kong in the "Country" selection'
      cy.get(selectors.companyAdd.form).contains('Country')
      cy.get(selectors.companyAdd.form)
        .find('select option[value="HK"]')
        .should('have.length', 1)
        .should('have.text', 'Hong Kong (SAR)')
    })
  })

  context('when an overseas country is picked', () => {
    beforeEach(() => {
      goToOverseasCompanySearchPage('Poland')
    })

    it('should render the expected fields and buttons', () => {
      // should display the "Find the company" heading
      cy.get(selectors.companyAdd.stepHeader).should(
        'have.text',
        'Find the company'
      )

      // should display the selected country
      cy.get(selectors.companyAdd.form)
        .find('fieldset')
        .contains('CountryPoland Change Country')

      // should display the "Select company" button
      cy.get(entitySearch.selectCompanyButton).should('be.visible')

      // should not display the "Back" button
      cy.get(selectors.companyAdd.backButton).should('not.exist')

      // should not display the "Continue" button
      cy.get(selectors.companyAdd.continueButton).should('not.exist')

      // should display an error message when the "Company name" field is not filled in
      cy.get(entitySearch.selectCompanyButton).click()
      assertErrorSummary(['Search for and select a company.'])
      cy.get(entitySearchResults.someCompanyName).should('not.exist')
      cy.get(entitySearchResults.someOtherCompany).should('not.exist')

      // should display an error message when DnB search fails', () => {
      cy.get(entitySearch.companyNameField).type('Simulate 500 Error')
      cy.get('[data-test="typeahead-menu-option"]')
        .find('span')
        .should('contain', 'Error searching the D&B API')
    })
  })

  context('when an overseas company is searched', () => {
    before(() => {
      goToOverseasCompanySearchResultsPage()
      cy.get(entitySearch.companyNameField).type('some')
    })

    it('should display the entity search results', () => {
      cy.get(entitySearchResults.someCompanyName).should('be.visible')
      cy.get(entitySearchResults.someOtherCompany).should('be.visible')
    })
  })

  context('when a company is picked that does not exist on Data Hub', () => {
    beforeEach(() => {
      goToOverseasCompanySearchResultsPage()
      cy.get(entitySearch.companyNameField).type('some')
      cy.contains('Some unmatched company').click()
      cy.get(entitySearch.selectCompanyButton).click()
    })

    it('should display a confirmation summary', () => {
      cy.get(selectors.companyAdd.stepHeader).should(
        'have.text',
        'Confirm you want to add this company to Data Hub'
      )
      assertSummaryContains('Registered company name')
      assertSummaryContains('Some unmatched company')
      assertSummaryContains('Companies House number')
      assertSummaryContains('00016033')
      assertSummaryContains('Address')
      assertSummaryContains('123 ABC Road, Brighton, BN2 9QB')
      assertSummaryContains('Country')
      assertSummaryContains('Poland')

      // should show back and continue buttons
      cy.get(selectors.companyAdd.backButton).should('be.visible')
      cy.get(selectors.companyAdd.continueButton).should('be.visible')
    })
  })

  context('when adding a company that does not exist on Data Hub', () => {
    beforeEach(() => {
      goToOverseasCompanySearchResultsPage()
      cy.get(entitySearch.companyNameField).type('some')
      cy.contains('Some unmatched company').click()
      cy.get(entitySearch.selectCompanyButton).click()
      cy.get(selectors.companyAdd.continueButton).click()
    })

    it('should render the "Add company" page with a form to add a sector', () => {
      cy.get(selectors.companyAdd.title)
      cy.should('have.text', 'Add company').and('have.prop', 'tagName', 'H1')
      cy.get('#field-sector').then((element) => {
        assertFieldSelect({
          element,
          label: 'DBT sector',
          value: '-- Select DBT sector --',
          optionsCount: 256,
        })
      })
      cy.get(selectors.companyAdd.submitButton).should('be.visible')
      cy.get(selectors.companyAdd.backButton).should('be.visible')

      // should display an error message when no sector is selected
      cy.get(selectors.companyAdd.submitButton).click()
      assertErrorSummary(['Select DBT sector'])

      // should redirect to the company overview when a sector is picked
      cy.get(selectors.companyAdd.sectorSelect).select('Airports')
      assertOverviewRedirect(fixtures.company.someOtherCompany.id)
    })

    it('should not continue when DnB company creation fails', () => {
      // Choosing the water sector simulates a server error
      cy.get(selectors.companyAdd.sectorSelect).select('Water')
      assertCompanyCreateRedirect()
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
      assertCompanyCreateRedirect()

      assertErrorDialog('Create company', apiErrorMessage)
    })
  })

  context('when manually adding a new UK-based company', () => {
    beforeEach(() => {
      goToManualAddUKCompanyPage()
    })

    it('should display the manual entry form', () => {
      cy.get('[data-test="field-business_type"]').then((element) => {
        assertFieldRadios({
          element,
          label: 'Organisation type',
          optionsCount: 6,
        })
      })
      cy.get(newRecordForm.companyName).should('be.visible')
      cy.get(newRecordForm.website).should('be.visible')
      cy.get(newRecordForm.telephone).should('be.visible')
      cy.get(newRecordForm.address.postcode).should('be.visible')
      cy.get(newRecordForm.address.findUkAddress).should('be.visible')
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

      // should not display "Enter a website or phone number" when the website is present
      cy.get(newRecordForm.website).type('www.example.com')
      cy.get(selectors.companyAdd.continueButton).click()
      cy.get(selectors.companyAdd.form).should(
        'not.contain',
        'Enter a website or phone number'
      )

      // should not display "Enter a website or phone number" when the phone number is present
      cy.get(newRecordForm.telephone).type('+01 (23) 456789')
      cy.get(selectors.companyAdd.continueButton).click()
      cy.get(selectors.companyAdd.form).should(
        'not.contain',
        'Enter a website or phone number'
      )

      // should display invalid website URL error when an invalid website URL is entered
      cy.get(newRecordForm.website).clear()
      cy.get(newRecordForm.website).type('hello')
      cy.get(selectors.companyAdd.continueButton).click()

      cy.get(newRecordForm.websiteContainer).contains(
        'Enter a valid website URL'
      )
      cy.get(newRecordForm.telephoneContainer).should(
        'not.contain',
        'Enter a valid website URL'
      )
      // should display invalid telephone number error when an invalid telephone number is entered
      cy.get(newRecordForm.telephone).type('©123123123')
      cy.get(selectors.companyAdd.continueButton).click()
      cy.get(newRecordForm.telephoneContainer).contains(
        'Enter a valid telephone number'
      )
      cy.get(newRecordForm.websiteContainer).should(
        'not.contain',
        'Enter a valid telephone number'
      )

      // should display an error when an invalid organisation name is filled
      cy.get(newRecordForm.companyName).type('=INVESTIGATION LIMITED')
      cy.get(selectors.companyAdd.continueButton).click()
      cy.get(newRecordForm.companyNameContainer).contains('Enter a valid name')
    })
  })

  context('when valid details are submitted for a new UK company', () => {
    beforeEach(() => {
      goToUKCompanySectorAndRegionPage()
    })

    it('should render the region and sector fields', () => {
      cy.get(selectors.companyAdd.form).contains('London')
      cy.get(selectors.companyAdd.form).contains('Select DBT sector')

      // should show errors when continuing without a region or sector
      cy.get(newRecordForm.region).select('-- Select DBT region --')
      cy.get(selectors.companyAdd.submitButton)
        .click()
        .get(selectors.companyAdd.form)
        .contains('Select DBT region')
        .get(selectors.companyAdd.form)
        .contains('Select DBT sector')

      // should not continue when the DnB investigation api call fails', () => {
      cy.get(newRecordForm.region).select('London')
      // Water sector simulates a server error from dnb investigation post
      cy.get(newRecordForm.sector).select('Water')
      assertCompanyCreateRedirect()
    })
  })

  context('when a valid sector and region are submitted', () => {
    beforeEach(() => {
      goToUKCompanySectorAndRegionPage()
      cy.get(newRecordForm.region).select('London')
      cy.get(newRecordForm.sector).select('Advanced Engineering')
    })

    it('should redirect to the company overview and display the correct messages', () => {
      // should redirect to the company overview
      assertOverviewRedirect(fixtures.company.investigationLimited.id)

      // should display the pending D&B investigation message
      cy.get('[data-test="investigation-message"]').should('be.visible')
    })
  })

  context('when manually adding a new overseas company', () => {
    beforeEach(() => {
      goToOverseasCompanySearchResultsPage()
      cy.get(entitySearch.cannotFind.summary).click()
      cy.get(entitySearch.cannotFind.stillCannotFind).click()
    })

    it('should display the manual entry form', () => {
      cy.get('[data-test="field-business_type"]').then((element) => {
        assertFieldRadios({
          element,
          label: 'Organisation type',
          optionsCount: 6,
        })
      })
      cy.get(newRecordForm.companyName).should('be.visible')
      cy.get(newRecordForm.website).should('be.visible')
      cy.get(newRecordForm.telephone).should('be.visible')
      cy.get(newRecordForm.address.postcode).should('be.visible')
      cy.get(selectors.companyAdd.form).contains('Poland')

      // should not show an invalid postal or ZIP code error
      cy.get(newRecordForm.address.postcode).clear()
      cy.get(newRecordForm.address.postcode).type('ABC 123')
      cy.get(selectors.companyAdd.continueButton).click()
      cy.get(selectors.companyAdd.form).should(
        'not.contain',
        'Enter a valid Postal code'
      )
      cy.get(selectors.companyAdd.form).should(
        'not.contain',
        'Enter a valid ZIP code'
      )

      // should hide the UK-related fields
      cy.get(newRecordForm.address.findUkAddress).should('not.exist')
    })
  })

  context('when "UK" is selected for the company location', () => {
    beforeEach(() => {
      goToAddUKCompanyPage(entitySearchResults.someCompanyName)
    })
    it('should render the expected form elements and errors', () => {
      // should render an "Add a company" H1 element
      cy.get(selectors.companyAdd.title).should('have.text', 'Add company')

      // should render a form with both "Region" and "Sector" selects
      cy.get('#field-uk_region').then((element) => {
        assertFieldSelect({
          element,
          label: 'DBT region',
          value: 'South East',
          optionsCount: 16,
        })
      })
      cy.get('#field-sector').then((element) => {
        assertFieldSelect({
          element,
          label: 'DBT sector',
          value: '-- Select DBT sector --',
          optionsCount: 256,
        })
      })
      cy.get(selectors.companyAdd.submitButton).should('be.visible')
      cy.get(selectors.companyAdd.backButton).should('be.visible')

      // should error when attempting to add a company without region or sector
      cy.get(selectors.companyAdd.regionSelect).select(
        '-- Select DBT region --'
      )
      cy.get(selectors.companyAdd.submitButton).click()
      assertErrorSummary(['Select DBT region', 'Select DBT sector'])

      // should add a company after defining both region and sector
      cy.get(selectors.companyAdd.regionSelect)
        .select('South East')
        .get(selectors.companyAdd.sectorSelect)
        .select('Airports')
      assertOverviewRedirect(fixtures.company.someOtherCompany.id)
    })
  })

  context('when a UK company postcode is unknown', () => {
    before(() => {
      goToAddUKCompanyPage(entitySearchResults.companyUnknownPostcode)
    })

    it('should prompt the user to select a "Region"', () => {
      cy.get('#field-uk_region').then((element) => {
        assertFieldSelect({
          element,
          label: 'DBT region',
          value: '-- Select DBT region --',
          optionsCount: 16,
        })
      })
    })
  })

  context('when manually adding a new US company', () => {
    beforeEach(() => {
      goToOverseasCompanySearchPage('United States')
      cy.get(entitySearch.companyNameField).type('a US company')
      cy.get('[data-test="typeahead-no-options"]').should(
        'contain',
        'No company found, try adding postcode or manually create company'
      )
      cy.get(entitySearch.cannotFind.summary).click()
      cy.get(entitySearch.cannotFind.stillCannotFind).click()
    })

    it('should display the manual entry form and errors', () => {
      assertUSOrCanadianCompanyFormFields()
      cy.get(newRecordForm.areaCanada).should('not.exist')
      cy.get(newRecordForm.areaUS).should('be.visible')
      cy.get(selectors.companyAdd.form).contains('United States')

      // should show errors when the form is not completed
      cy.get(selectors.companyAdd.continueButton).click()
      assertErrorSummary([
        'Select organisation type',
        'Enter name',
        'Enter a website or phone number',
        'Enter a website or phone number',
        'Enter an address',
        'Enter a town or city',
        'Enter a ZIP code',
        'Select a state',
      ])

      // should show an invalid ZIP code error
      cy.get(newRecordForm.address.postcode).clear()
      cy.get(newRecordForm.address.postcode).type('A1A 1A1')
      cy.get(selectors.companyAdd.continueButton).click()
      cy.get(selectors.companyAdd.form).contains('Enter a valid ZIP code')

      // should not show an invalid ZIP code error when completed correctly
      cy.get(newRecordForm.address.postcode).clear()
      cy.get(newRecordForm.address.postcode).type('48222')
      cy.get(selectors.companyAdd.continueButton).click()
      cy.get(selectors.companyAdd.form).should(
        'not.contain',
        'Enter a valid ZIP code'
      )
    })
  })

  context('when manually adding a new Canadian company', () => {
    beforeEach(() => {
      goToOverseasCompanySearchPage('Canada')
      cy.get(entitySearch.companyNameField).type('a Canadian company')
      cy.get('[data-test="typeahead-no-options"]').should(
        'contain',
        'No company found, try adding postcode or manually create company'
      )
      cy.get(entitySearch.cannotFind.summary).click()
      cy.get(entitySearch.cannotFind.stillCannotFind).click()
    })

    it('should display the manual entry form and errors', () => {
      assertUSOrCanadianCompanyFormFields()
      cy.get(newRecordForm.areaCanada).should('be.visible')
      cy.get(newRecordForm.areaUS).should('not.exist')
      cy.get(selectors.companyAdd.form).contains('Canada')

      // should show errors when the form is not completed
      cy.get(selectors.companyAdd.continueButton).click()
      assertErrorSummary([
        'Select organisation type',
        'Enter name',
        'Enter a website or phone number',
        'Enter a website or phone number',
        'Enter an address',
        'Enter a town or city',
        'Enter a Postal code',
        'Select a province',
      ])

      // should show an invalid postal code error
      cy.get(newRecordForm.address.postcode).type('12345')
      cy.get(selectors.companyAdd.continueButton).click()
      cy.get(selectors.companyAdd.form).contains('Enter a valid Postal code')

      // should not show an invalid postal code error when completed correctly
      cy.get(newRecordForm.address.postcode).clear()
      cy.get(newRecordForm.address.postcode).type('A1A 1A1')
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
        cy.get(newRecordForm.whyAmISeeingThis.summary).should('be.visible')
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
        cy.get(newRecordForm.whyAmISeeingThis.summary).should('be.visible')
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
        cy.get(newRecordForm.whyAmISeeingThis.summary).should('be.visible')
      })
    })

    context('and a single company is found that is already on datahub', () => {
      before(() => {
        cy.visit(`${urls.companies.create()}?duns_number=222222222`)
      })
      it('should display the already imported message', () => {
        cy.get(entitySearch.alreadyOnDatahub).should('exist')
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
        cy.get(entitySearch.outOfBusiness).should('exist')
      })
    })

    context(
      'and a single company is found that is not on datahub that doesnt match a datahub country',
      () => {
        beforeEach(() => {
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

          // when uk is selected should display both DBT region and sector
          cy.get(newRecordForm.companyLocation).should('exist')
          cy.get(selectors.companyAdd.form).find('[type="radio"]').check('GB')
          cy.get(selectors.companyAdd.continueButton).click()

          cy.get(newRecordForm.dbtRegion).should('exist')
          cy.get(newRecordForm.dbtSector).should('exist')

          // should submit the form and redirect to company overview
          cy.get(newRecordForm.region).select('London')
          cy.get(newRecordForm.sector).select('Advanced Engineering')
          assertOverviewRedirect(fixtures.company.default.id)
        })
      }
    )

    context(
      'and a single company is found that is not on datahub with a matching datahub country',
      () => {
        beforeEach(() => {
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
          assertSummaryContains('Registered company name')
          assertSummaryContains('US company')
          assertSummaryContains('Country')
          assertSummaryContains('United States')
          assertSummaryContains('Address')
          assertSummaryContains('256 Square Street, Austin, 765413')

          cy.get(newRecordForm.companyLocation).should('not.exist')

          // should only show the continue button
          cy.get(selectors.companyAdd.backButton).should('not.exist')
          cy.get(selectors.companyAdd.continueButton).should('be.visible')

          // should display only the DBT sector
          cy.get(selectors.companyAdd.continueButton).click()

          cy.get(newRecordForm.dbtRegion).should('not.exist')
          cy.get(newRecordForm.dbtSector).should('exist')

          // should submit the form and redirect to company overview
          cy.get(newRecordForm.sector).select('Advanced Engineering')
          assertOverviewRedirect(fixtures.company.default.id)
        })
      }
    )
  })
})
