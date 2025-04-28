const qs = require('qs')

const {
  assertCompanyCollectionBreadcrumbs,
  assertRemoveAllFiltersNotPresent,
  assertAddItemButton,
  assertAddItemButtonNotPresent,
  assertListLength,
  assertTag,
  assertTagNotPresent,
  assertMetadataItem,
  assertMetadataItemNotPresent,
  assertItemLink,
  assertArchiveMessage,
  assertArchiveSummary,
  assertUnarchiveLink,
  assertUpdatedOn,
  assertRole,
  assertTitle,
} = require('../../support/collection-list-assertions')
const { collectionListRequest } = require('../../support/actions')
const { contactFaker } = require('../../fakers/contacts')
const { companies } = require('../../../../../src/lib/urls')
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

  const dnbFixture = fixtures.company.dnbCorp
  const archivedFixture = fixtures.company.archivedLtd.id

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
      cy.visit(`${companies.contacts(dnbFixture.id)}?${queryString}`)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal({
          offset: 0,
          limit: 10,
          archived: false,
          sortby: 'modified_on:desc',
          company: dnbFixture.id,
        })
      })
    })
  })

  context('Viewing the companies contacts collection list page', () => {
    beforeEach(() => {
      collectionListRequest(
        'v3/search/contact',
        contacts,
        companies.contacts(dnbFixture.id)
      )
    })

    assertCompanyCollectionBreadcrumbs(dnbFixture, 'Contacts')
    assertTitle('2 contacts')
    assertRemoveAllFiltersNotPresent()

    it('should contain a status role', () => {
      assertRole('status')
    })

    it('should render an "Add contact" button', () => {
      assertAddItemButton(
        'Add contact',
        `/contacts/create?company=${dnbFixture.id}`
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
      assertListLength(contacts)
    })
  })

  context('UK contact', () => {
    beforeEach(() => {
      collectionListRequest(
        'v3/search/contact',
        contacts,
        companies.contacts(dnbFixture.id)
      )
      cy.get('[data-test="collection-item"]').eq(0).as('firstListItem')
    })

    it('should have a link with the contact name', () => {
      assertItemLink(
        '@firstListItem',
        'Hanna Reinger',
        '/contacts/1/details',
        'h3'
      )
    })

    it('should contain a primary contact tag', () => {
      assertTag('@firstListItem', 'Primary')
    })

    it('should not contain an archived tag', () => {
      assertTagNotPresent('@firstListItem', 'Archived')
    })

    it('should render the updated date and time', () => {
      assertUpdatedOn('@firstListItem', 'Updated on 10 Aug 2020, 8:09pm')
    })

    it('should not render the company name', () => {
      assertMetadataItemNotPresent(
        '@firstListItem',
        'Company Murray, Price and Hodkiewicz'
      )
    })

    it('should render the job title', () => {
      assertMetadataItem('@firstListItem', 'Job title')
      assertMetadataItem(
        '@firstListItem',
        'Dynamic Accountability Administrator'
      )
    })

    it('should render the sector', () => {
      assertMetadataItem('@firstListItem', 'Sector')
      assertMetadataItem('@firstListItem', 'Advanced Engineering')
    })

    it('should render the country', () => {
      assertMetadataItem('@firstListItem', 'Country')
      assertMetadataItem('@firstListItem', 'United Kingdom')
    })

    it('should render the UK region', () => {
      assertMetadataItem('@firstListItem', 'UK region')
      assertMetadataItem('@firstListItem', 'London')
    })

    it('should render the UK telephone number', () => {
      assertMetadataItem('@firstListItem', 'Phone number')
      assertMetadataItem('@firstListItem', '+44 02071234567')
    })

    it('should render the email', () => {
      assertMetadataItem('@firstListItem', 'Email')
      assertMetadataItem('@firstListItem', 'gloria33@gmail.com')
    })
  })

  context('Foreign contact', () => {
    beforeEach(() => {
      collectionListRequest(
        'v3/search/contact',
        contacts,
        companies.contacts(dnbFixture.id)
      )
      cy.get('[data-test="collection-item"]').eq(1).as('secondListItem')
    })

    it('should have a link with the contact name', () => {
      assertItemLink(
        '@secondListItem',
        'Ted Woods',
        '/contacts/2/details',
        'h3'
      )
    })

    it('should not contain a primary contact badge', () => {
      cy.get('@secondListItem').find('[data-test="badge"]').should('not.exist')
    })

    it('should render the updated date and time', () => {
      assertUpdatedOn('@secondListItem', 'Updated on 25 Jan 2020, 7:09pm')
    })

    it('should not render the company name', () => {
      assertMetadataItemNotPresent(
        '@secondListItem',
        'Company Murray, Price and Hodkiewicz'
      )
    })

    it('should render the job title', () => {
      assertMetadataItem('@secondListItem', 'Job title')
      assertMetadataItem('@secondListItem', 'Legacy Branding Agent')
    })

    it('should render the sector', () => {
      assertMetadataItem('@secondListItem', 'Sector')
      assertMetadataItem('@secondListItem', 'Creative and Media')
    })

    it('should render the foreign country', () => {
      assertMetadataItem('@secondListItem', 'Country')
      assertMetadataItem('@secondListItem', 'United States')
    })

    it('should not render the UK region', () => {
      assertMetadataItemNotPresent('@secondListItem', 'UK region')
    })

    it('should render the telephone number', () => {
      assertMetadataItem('@secondListItem', 'Phone number')
      assertMetadataItem('@secondListItem', '(0045) 48770000')
    })
  })

  context('when viewing contacts for an archived company', () => {
    beforeEach(() => {
      cy.visit(companies.contacts(archivedFixture))
    })

    it('should render a meta title', () => {
      cy.title().should(
        'eq',
        'Contacts - Archived Ltd - Companies - DBT Data Hub'
      )
    })

    assertArchiveSummary('contact')
    assertArchiveMessage('Contacts')
    assertUnarchiveLink(`/companies/${archivedFixture}/unarchive`)

    it('should not render an "Add contact" button', () => {
      assertAddItemButtonNotPresent()
    })
  })
})
