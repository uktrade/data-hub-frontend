import { events } from '../../../../../src/lib/urls'
import { eventFaker } from '../../fakers/events'
import { collectionListRequest } from '../../support/actions'

describe('Event Collections Sort', () => {
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
      id: '771f654d-e6b1-4fad-8a89-b6ac44147830',
      name: 'Seminar',
    },
    lead_team: null,
    name: 'Empty one-day exhibition',
    organiser: null,
    service: {
      name: 'Events : UK based',
      id: '9584b82b-3499-e211-a939-e4115bead28a',
    },
  })

  const eventList = [event1, event2]

  context('Default sort', () => {
    beforeEach(() => {
      cy.intercept('POST', '/api-proxy/v3/search/event', {
        body: {
          count: eventList.length,
          results: eventList,
        },
      }).as('apiRequest')

      cy.visit(events.index())
    })

    it('should apply the default sort', () => {
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('modified_on:desc')
      })
    })
  })
  context('When the user sorts the list', () => {
    beforeEach(() => {
      collectionListRequest('v3/search/event', eventList, events.index())
    })

    it('should have all sort options', () => {
      cy.get('[data-test="sortby"] option').then((options) => {
        const sortOptions = [...options].map((o) => [o.value, o.text])
        expect(sortOptions).to.deep.eq([
          ['modified_on:desc', 'Recently updated'],
          ['modified_on:asc', 'Least recently updated'],
          ['name:asc', 'Event name A-Z'],
          ['start_date:asc', 'Earliest start date'],
          ['start_date:desc', 'Latest start date'],
        ])
      })
    })
  })
})
