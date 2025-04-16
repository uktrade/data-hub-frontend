import { contactsListFaker, contactFaker } from '../../fakers/contacts'
import urls from '../../../../../src/lib/urls'
import fixtures from '../../fixtures'
import { assertLocalHeader, assertBreadcrumbs } from '../../support/assertions'
import { collectionListRequest } from '../../support/actions'
import {
  getCollectionList,
  assertBadge,
  assertMetadataItem,
  assertListLength,
  assertItemLink,
  assertUpdatedOn,
  assertMetadataItemNotPresent,
  assertBadgeShouldNotExist,
} from '../../support/collection-list-assertions'

const eventFixtureId = fixtures.event.emptyOneDayExhibition.id

describe('Event attendee search', () => {
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

  const contactsList = [ukContact, foreignContact, ...contactsListFaker(8)]

  beforeEach(() => {
    collectionListRequest(
      'v3/search/contact',
      contactsList,
      urls.events.find(eventFixtureId)
    )
    getCollectionList()
    cy.get('@collectionItems').eq(1).as('secondListItem')
  })

  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: urls.dashboard.index(),
      Events: urls.events.index(),
      'Empty one-day exhibition': urls.events.details(eventFixtureId),
      'Add attendee': null,
    })
  })

  it('should render the header', () => {
    assertLocalHeader('Empty one-day exhibition')
  })

  it('should render the help text', () => {
    cy.get('[data-test="help-panel"]')
      .should('exist')
      .should(
        'have.text',
        "Select the contact to show they attended the event. If you can't find the contact, you should check they have been added to the company record before returning to this event to record their attendance."
      )
  })

  it('should display a list of contacts', () => {
    assertListLength(contactsList)
  })

  context('should render the contact information correctly', () => {
    context('UK contact', () => {
      it('should have a link with the contact name', () => {
        assertItemLink(
          '@firstListItem',
          'Hanna Reinger',
          urls.events.addAttendee(eventFixtureId, 1),
          'h3'
        )
      })

      it('should contain a primary contact badge', () => {
        assertBadge('@firstListItem', 'Primary')
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
        assertItemLink(
          '@secondListItem',
          'Ted Woods',
          urls.events.addAttendee(eventFixtureId, 2),
          'h3'
        )
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
  })

  context('should add an attendee to the event', () => {
    it('should add an attendee to the event', () => {
      cy.contains('Hanna Reinger').click()

      cy.contains(
        'Event attendee added - This has created a service delivery record. If required, you can view or edit the service delivery directly from the attendee record.'
      )
    })
  })
})
