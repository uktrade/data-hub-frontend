import {
  assertRole,
  assertCollectionBreadcrumbs,
  assertAddItemButton,
  assertPaginationSummary,
  getCollectionList,
  assertMetadataItem,
  assertItemLink,
  assertMetadataItemNotPresent,
} from '../../support/collection-list-assertions'
import { collectionListRequest } from '../../support/actions'
import { events } from '../../../../../src/lib/urls'
import { eventFaker } from '../../fakers/events'

describe('Event Collection List Page', () => {
  const event1 = eventFaker({
    id: 'e8757618-32a4-440a-b6ed-7e6bee71e9af',
    event_type: {
      id: '771f654d-e6b1-4fad-8a89-b6ac44147830',
      name: 'Seminar',
    },
    organiser: {
      id: '88d3a7a4-9798-e211-a939-e4115bead28a',
      name: 'Abid Sharif\n',
    },
    lead_team: {
      id: '027b1ca4-9698-e211-a939-e4115bead28a',
      name: 'Business Link North Manchester (ChamberLink)',
    },
    service: {
      name: 'Events : UK based',
      id: '9584b82b-3499-e211-a939-e4115bead28a',
    },
    created_on: '2017-09-24T16:29:35.723886',
    modified_on: '2017-09-24T16:29:35.723914',
    name: 'Okuneva - Douglas',
    start_date: '2017-09-24',
    end_date: '2017-10-01',
  })

  const event2 = eventFaker({
    id: 'b93d4273-36fe-4008-ac40-fbc197910791',
    event_type: {
      name: 'Exhibition',
      id: '2fade471-e868-4ea9-b125-945eb90ae5d4',
    },
    lead_team: null,
    name: 'Empty one-day exhibition',
    organiser: null,
    service: {
      name: 'Events : UK based',
      id: '9584b82b-3499-e211-a939-e4115bead28a',
    },
  })

  const stovaEvent = eventFaker({
    id: 'd848746d-e7dd-4bf2-98ce-05f9833be662',
    event_type: {
      name: 'Exhibition',
      id: '2fade471-e868-4ea9-b125-945eb90ae5d4',
    },
    lead_team: null,
    name: 'Empty one-day exhibition',
    organiser: null,
    service: {
      name: 'Stova Event Service',
      id: '8053f984-fac6-4d35-b3df-4ac0eeb3b542',
    },
  })

  const eventsList = [event1, event2, stovaEvent]
  context('when there is not an error', () => {
    beforeEach(() => {
      collectionListRequest('v3/search/event', eventsList, events.index())
      getCollectionList()
      cy.get('@collectionItems').eq(1).as('secondListItem')
      cy.get('@collectionItems').eq(2).as('thirdListItem')
    })

    assertCollectionBreadcrumbs('Events')

    it('should contain a status role', () => {
      assertRole('status')
    })

    it('should display the events result count header', () => {
      cy.get('h2').contains('3 events')
    })

    it('should have a link to add event', () => {
      assertAddItemButton('Add event', '/events/create')
    })

    it('should display the expected number of pages', () => {
      assertPaginationSummary('Page 1 of 1')
    })

    it('should display a datahub event name with link', () => {
      assertItemLink('@firstListItem', event1.name, events.details(event1.id))
    })

    it('should display a data hub event date', () => {
      assertMetadataItem('@firstListItem', 'Event date')
      assertMetadataItem('@firstListItem', '24 Sep to 01 Oct 2017')
    })

    it('should display the event organiser', () => {
      assertMetadataItem('@firstListItem', 'Organiser')
      assertMetadataItem('@firstListItem', `${event1.organiser.name}`)
    })

    it('should display the service type', () => {
      assertMetadataItem('@firstListItem', 'Service type')
      assertMetadataItem('@firstListItem', `${event1.service.name}`)
    })

    it('should display the lead team', () => {
      assertMetadataItem('@firstListItem', 'Lead team')
      assertMetadataItem('@firstListItem', `${event1.lead_team.name}`)
    })

    it('should not display missing metadata items', () => {
      assertMetadataItemNotPresent('@secondListItem', 'Lead team')
      assertMetadataItemNotPresent('@secondListItem', 'Organiser')
    })

    it('should display the stova event service type', () => {
      assertMetadataItem('@thirdListItem', 'Stova Event')
    })
  })
})
