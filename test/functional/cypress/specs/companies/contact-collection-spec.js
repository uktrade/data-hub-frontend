const qs = require('qs')

const { assertBreadcrumbs } = require('../../support/assertions')
const { contactFaker } = require('../../fakers/contacts')
const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')

describe('Company Contacts Collections', () => {
  const ukContact = contactFaker({
    id: '1',
    first_name: 'Hanna',
    last_name: 'Reinger',
    name: 'Hanna Reinger',
    job_title: 'Dynamic Accountability Administrator',
    email: 'gloria33@gmail.com',
    archived: false,
    company: {
      name: 'Murray, Price and Hodkiewicz',
    },
    company_uk_region: {
      name: 'London',
    },
    company_sector: {
      name: 'Advanced Engineering',
    },
    primary: true,
    telephone_number: '02071234567',
    full_telephone_number: '+44 02071234567',
    modified_on: '2020-08-10T19:09:35.276Z',
  })

  const foreignContact = contactFaker({
    id: '2',
    first_name: 'Ted',
    last_name: 'Woods',
    name: 'Ted Woods',
    job_title: 'Legacy Branding Agent',
    company: {
      name: 'Murray, Price and Hodkiewicz',
    },
    company_uk_region: null,
    company_sector: {
      name: 'Creative and Media',
    },
    address_country: {
      name: 'United States',
    },
    primary: false,
    telephone_countrycode: '',
    telephone_number: '',
    full_telephone_number: '(0045) 48770000',
    modified_on: '2020-01-25T19:09:35.276Z',
  })

  const contacts = [ukContact, foreignContact]

  const buildQueryString = () =>
    qs.stringify({
      archived: ['false'],
      sortby: 'modified_on:desc',
    })

  context('API payload', () => {
    it('should have the correct payload', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', '/api-proxy/v3/search/contact', {
        body: {
          count: 0,
          results: [],
        },
      }).as('apiRequest')
      cy.visit(
        `${urls.companies.contacts(fixtures.company.dnbCorp.id)}?${queryString}`
      )
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal({
          offset: 0,
          limit: 10,
          archived: false,
          sortby: 'modified_on:desc',
          company: fixtures.company.dnbCorp.id,
        })
      })
    })
  })

  context('Viewing the companies contacts collection list page', () => {
    before(() => {
      cy.intercept('POST', '/api-proxy/v3/search/contact', {
        body: {
          count: contacts.length,
          results: contacts,
        },
      }).as('apiRequest')
      cy.visit(urls.companies.contacts(fixtures.company.dnbCorp.id))
      cy.wait('@apiRequest')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        [fixtures.company.dnbCorp.name]: urls.companies.detail(
          fixtures.company.dnbCorp.id
        ),
        Contacts: null,
      })
    })

    it('should render a title', () => {
      cy.get('h2').should('have.text', '2 contacts')
    })

    it('should not render a "Remove all filters" button', () => {
      cy.get('[data-test="clear-filters"]').should('not.exist')
    })

    it('should render an "Add contact" button', () => {
      cy.get('[data-test="add-collection-item-button"]').should(
        'have.text',
        'Add contact'
      )
    })

    it('should have all sort options', () => {
      cy.get('[data-test="sortby"] option').then((options) => {
        const sortOptions = [...options].map((o) => ({
          value: o.value,
          label: o.label,
        }))
        expect(sortOptions).to.deep.eq([
          { value: 'created_on:desc', label: 'Recently created' },
          { value: 'created_on:asc', label: 'Oldest' },
          { value: 'modified_on:desc', label: 'Recently updated' },
          { value: 'modified_on:asc', label: 'Least recently updated' },
          { value: 'last_name:asc', label: 'Last name A-Z' },
          { value: 'address_country.name:asc', label: 'Country A-Z' },
          { value: 'company.name:asc', label: 'Company A-Z' },
        ])
      })
    })

    it('should display a list of contacts', () => {
      cy.get('[data-test="collection-list"]').should('have.length', 1)
      cy.get('[data-test="collection-item"]').should(
        'have.length',
        contacts.length
      )
    })
  })

  context('UK contact', () => {
    before(() => {
      cy.intercept('POST', '/api-proxy/v3/search/contact', {
        body: {
          count: contacts.length,
          results: contacts,
        },
      }).as('apiRequest')
      cy.visit(urls.companies.contacts(fixtures.company.dnbCorp.id))
      cy.wait('@apiRequest')
    })

    beforeEach(() => {
      cy.get('[data-test="collection-item"]').eq(0).as('firstListItem')
    })

    it('should have a link with the contact name', () => {
      cy.get('@firstListItem')
        .find('h3')
        .children()
        .should('have.text', 'Hanna Reinger')
        .should('have.attr', 'href', '/contacts/1/details')
    })

    it('should contain a primary contact badge', () => {
      cy.get('@firstListItem')
        .find('[data-test="badge"]')
        .should('contain', 'Primary')
    })

    it('should not contain an archived badge', () => {
      cy.get('@firstListItem')
        .find('[data-test="badge"]')
        .should('not.contain', 'Archived')
    })

    it('should render the updated date and time', () => {
      cy.get('@firstListItem')
        .find('h4')
        .should('have.text', 'Updated on 10 Aug 2020, 8:09pm')
    })

    it('should not render the company name', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata-item"]')
        .should('not.contain', 'Company Murray, Price and Hodkiewicz')
    })

    it('should render the job title', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata-item"]')
        .eq(0)
        .should('contain', 'Job title Dynamic Accountability Administrator')
    })

    it('should render the sector', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata-item"]')
        .eq(1)
        .should('contain', 'Sector Advanced Engineering')
    })

    it('should render the country', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata-item"]')
        .eq(2)
        .should('contain', 'Country United Kingdom')
    })

    it('should render the UK region', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata-item"]')
        .eq(3)
        .should('contain', 'UK region London')
    })

    it('should render the UK telephone number', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata-item"]')
        .eq(4)
        .should('contain', 'Phone number +44 02071234567')
    })

    it('should render the email', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata-item"]')
        .eq(5)
        .should('contain', 'Email gloria33@gmail.com')
    })
  })

  context('Foreign contact', () => {
    before(() => {
      cy.intercept('POST', '/api-proxy/v3/search/contact', {
        body: {
          count: contacts.length,
          results: contacts,
        },
      }).as('apiRequest')
      cy.visit(urls.companies.contacts(fixtures.company.dnbCorp.id))
      cy.wait('@apiRequest')
    })

    beforeEach(() => {
      cy.get('[data-test="collection-item"]').eq(1).as('secondListItem')
    })

    it('should have a link with the contact name', () => {
      cy.get('@secondListItem')
        .find('h3')
        .children()
        .should('have.text', 'Ted Woods')
        .should('have.attr', 'href', '/contacts/2/details')
    })

    it('should not contain a primary contact badge', () => {
      cy.get('@secondListItem').find('[data-test="badge"]').should('not.exist')
    })

    it('should render the updated date and time', () => {
      cy.get('@secondListItem')
        .find('h4')
        .should('have.text', 'Updated on 25 Jan 2020, 7:09pm')
    })

    it('should not render the company name', () => {
      cy.get('@secondListItem')
        .find('[data-test="metadata-item"]')
        .should('not.contain', 'Company Murray, Price and Hodkiewicz')
    })

    it('should render the job title', () => {
      cy.get('@secondListItem')
        .find('[data-test="metadata-item"]')
        .eq(0)
        .should('contain', 'Job title Legacy Branding Agent')
    })

    it('should render the sector', () => {
      cy.get('@secondListItem')
        .find('[data-test="metadata-item"]')
        .eq(1)
        .should('contain', 'Sector Creative and Media')
    })

    it('should render the foreign country', () => {
      cy.get('@secondListItem')
        .find('[data-test="metadata-item"]')
        .eq(2)
        .should('contain', 'Country United States')
    })

    it('should not render the UK region', () => {
      cy.get('@secondListItem')
        .find('[data-test="metadata-item"]')
        .should('not.contain', 'UK region')
    })

    it('should render the telephone number', () => {
      cy.get('@secondListItem')
        .find('[data-test="metadata-item"]')
        .eq(3)
        .should('contain', 'Phone number (0045) 48770000')
    })
  })

  context('when viewing contacts for an archived company', () => {
    before(() => {
      cy.visit(urls.companies.contacts(fixtures.company.archivedLtd.id))
    })

    it('should render a meta title', () => {
      cy.title().should(
        'eq',
        'Contacts - Archived Ltd - Companies - DIT Data Hub'
      )
    })

    it('should render the archived summary', () => {
      cy.get('[data-test="archived-details"]').should(
        'contain',
        'Why can I not add a contact?'
      )
    })

    it('should render an archived explanation', () => {
      cy.get('[data-test="archived-details"]').should(
        'contain',
        'Contacts cannot be added to an archived company.'
      )
    })

    it('should render "Click here to unarchive"', () => {
      cy.get('[data-test="archived-details"]')
        .find('a')
        .should('have.text', 'Click here to unarchive')
        .should(
          'have.attr',
          'href',
          `/companies/${fixtures.company.archivedLtd.id}/unarchive`
        )
    })

    it('should not render an "Add contact" button', () => {
      cy.get('[data-test="add-collection-item-button"]').should('not.exist')
    })
  })
})
