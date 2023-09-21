import {
  assertRole,
  getCollectionList,
  assertCollectionBreadcrumbs,
  assertBadge,
  assertBadgeNotPresent,
  assertMetadataItem,
  assertListLength,
  assertItemLink,
  assertUpdatedOn,
  assertMetadataItemNotPresent,
  assertBadgeShouldNotExist,
} from '../../support/collection-list-assertions'
import { collectionListRequest } from '../../support/actions'
import { contacts } from '../../../../../src/lib/urls'
import { contactsListFaker, contactFaker } from '../../fakers/contacts'

describe('Contacts Collections', () => {
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
    full_telephone_number: '+44 02071234567',
    modified_on: '2020-08-10T19:09:35.276Z',
    valid_email: true,
  })

  const foreignContact = contactFaker({
    id: '2',
    first_name: 'Ted',
    last_name: 'Woods',
    name: 'Ted Woods',
    company_uk_region: null,
    address_country: {
      name: 'United States',
    },
    primary: false,
    telephone_countrycode: '0045',
    telephone_number: '48770000',
    full_telephone_number: '0045 48770000',
  })

  const archivedContact = contactFaker({
    id: '3',
    archived: true,
  })

  const invalidEmail = contactFaker({
    id: '4',
    valid_email: false,
  })

  const contactsList = [
    ukContact,
    foreignContact,
    archivedContact,
    invalidEmail,
    ...contactsListFaker(7),
  ]

  before(() => {
    collectionListRequest('v3/search/contact', contactsList, contacts.index())
  })

  beforeEach(() => {
    getCollectionList()
    cy.get('@collectionItems').eq(1).as('secondListItem')
    cy.get('@collectionItems').eq(2).as('thirdListItem')
    cy.get('@collectionItems').eq(3).as('forthListItem')
  })

  assertCollectionBreadcrumbs('Contacts')

  it('should contain a status role', () => {
    assertRole('status')
  })

  it('should render a title', () => {
    cy.get('h1').should('have.text', 'Contacts')
  })

  it('should display a list of contacts', () => {
    assertListLength(contactsList)
  })

  context('UK contact', () => {
    it('should have a link with the contact name', () => {
      assertItemLink('@firstListItem', 'Hanna Reinger', '/contacts/1/details')
    })

    it('should contain a primary contact badge', () => {
      assertBadge('@firstListItem', 'Primary')
    })

    it('should not contain an archived badge', () => {
      assertBadgeNotPresent('@firstListItem', 'Archived')
    })

    it('should not contain an unknown email badge', () => {
      assertBadgeNotPresent('@firstListItem', 'UNKNOWN EMAIL')
    })

    it('should render the updated date and time', () => {
      assertUpdatedOn('@firstListItem', 'Updated on 10 Aug 2020, 8:09pm')
    })

    it('should render the company name', () => {
      assertMetadataItem(
        '@firstListItem',
        'Company Murray, Price and Hodkiewicz'
      )
    })

    it('should render the job title', () => {
      assertMetadataItem(
        '@firstListItem',
        'Job title Dynamic Accountability Administrator'
      )
    })

    it('should render the sector', () => {
      assertMetadataItem('@firstListItem', 'Sector Advanced Engineering')
    })

    it('should render the country', () => {
      assertMetadataItem('@firstListItem', 'Country United Kingdom')
    })

    it('should render the UK region', () => {
      assertMetadataItem('@firstListItem', 'UK region London')
    })

    it('should render the UK telephone number', () => {
      assertMetadataItem('@firstListItem', 'Phone number +44 02071234567')
    })

    it('should render the email', () => {
      assertMetadataItem('@firstListItem', 'Email gloria33@gmail.com')
    })
  })

  context('Foreign contact', () => {
    it('should have a link with the contact name', () => {
      assertItemLink('@secondListItem', 'Ted Woods', '/contacts/2/details')
    })

    it('should not contain a primary contact badge', () => {
      assertBadgeShouldNotExist('@secondListItem')
    })

    it('should render the foreign country', () => {
      assertMetadataItem('@secondListItem', 'Country United States')
    })
    it('should not render the UK region', () => {
      assertMetadataItemNotPresent('@secondListItem', 'UK region')
    })
    it('should render the telephone number', () => {
      assertMetadataItem('@secondListItem', 'Phone number 0045 48770000')
    })
  })

  context('Archived contact', () => {
    it('should contain an archived badge', () => {
      assertBadge('@thirdListItem', 'Archived')
    })
  })

  context('Contact with invalid email', () => {
    it('should contain an unknown email badge', () => {
      assertBadge('@forthListItem', 'UNKNOWN EMAIL')
    })
  })
})
