import {
  assertRole,
  getCollectionList,
  assertCollectionBreadcrumbs,
  assertTag,
  assertTagNotPresent,
  assertMetadataItem,
  assertListLength,
  assertItemLink,
  assertUpdatedOn,
  assertMetadataItemNotPresent,
  assertTagShouldNotExist,
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

  beforeEach(() => {
    collectionListRequest('v3/search/contact', contactsList, contacts.index())
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
    it('should render the correct elements', () => {
      assertItemLink('@firstListItem', 'Hanna Reinger', '/contacts/1/details')
      assertTag('@firstListItem', 'Primary')
      assertTagNotPresent('@firstListItem', 'Archived')
      assertTagNotPresent('@firstListItem', 'UNKNOWN EMAIL')
      assertUpdatedOn('@firstListItem', 'Updated on 10 Aug 2020, 8:09pm')
      assertMetadataItem('@firstListItem', 'Company')
      assertMetadataItem('@firstListItem', 'Murray, Price and Hodkiewicz')
      assertMetadataItem('@firstListItem', 'Job title')
      assertMetadataItem(
        '@firstListItem',
        'Dynamic Accountability Administrator'
      )
      assertMetadataItem('@firstListItem', 'Sector')
      assertMetadataItem('@firstListItem', 'Advanced Engineering')
      assertMetadataItem('@firstListItem', 'Country')
      assertMetadataItem('@firstListItem', 'United Kingdom')
      assertMetadataItem('@firstListItem', 'UK region')
      assertMetadataItem('@firstListItem', 'London')
      assertMetadataItem('@firstListItem', 'Phone number')
      assertMetadataItem('@firstListItem', '+44 02071234567')
      assertMetadataItem('@firstListItem', 'Email')
      assertMetadataItem('@firstListItem', 'gloria33@gmail.com')
    })
  })

  context('Foreign contact', () => {
    it('should render the correct elements', () => {
      assertItemLink('@secondListItem', 'Ted Woods', '/contacts/2/details')
      assertTagShouldNotExist('@secondListItem')
      assertMetadataItem('@secondListItem', 'Country')
      assertMetadataItem('@secondListItem', 'United States')
      assertMetadataItemNotPresent('@secondListItem', 'UK region')
      assertMetadataItem('@secondListItem', 'Phone number')
      assertMetadataItem('@secondListItem', '0045 48770000')
    })
  })

  context('Archived contact', () => {
    it('should contain an archived tag', () => {
      assertTag('@thirdListItem', 'Archived')
    })
  })

  context('Contact with invalid email', () => {
    it('should contain an unknown email tag', () => {
      assertTag('@forthListItem', 'UNKNOWN EMAIL')
    })
  })
})
