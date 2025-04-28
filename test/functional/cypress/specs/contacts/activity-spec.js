const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')
const {
  interactionFaker,
  interactionsListFaker,
} = require('../../fakers/interactions')
const { collectionListRequest } = require('../../support/actions')
const {
  getCollectionList,
} = require('../../support/collection-list-assertions')

const interaction = interactionFaker({
  kind: 'interaction',
  subject: 'Meeting between Brendan Smith and Tyson Morar',
  dit_participants: [
    {
      adviser: {
        name: 'Puck Head',
        email: 'Puck.Head@example.com',
      },
      team: { name: 'Digital Data Hub - Live Service' },
    },
  ],
  date: '2019-06-10T00:00:00+00:00',
  service: {
    name: 'Export introductions : Someone else in DBT',
  },
  communication_channel: { name: 'Email/Website' },
})

const interactionMissingItems = interactionFaker({
  kind: 'interaction',
  subject: 'Meeting between Brendan Smith and Tyson Morar',
  dit_participants: '',
  date: '2019-06-10T00:00:00+00:00',
  service: '',
  communication_channel: '',
})

const interactionsList = [
  interaction,
  interactionMissingItems,
  ...interactionsListFaker(23),
]

describe('Contact activity', () => {
  const contactId = fixtures.contact.deanCox.id

  context('when viewing a contact with no activity', () => {
    before(() => {
      cy.intercept('POST', '/api-proxy/v3/search/interaction', {
        body: { count: 0, results: [] },
      })
      cy.visit(urls.contacts.contactActivities(contactId))
    })

    it('should display 0 activities', () => {
      cy.get('[data-test="collection-header"]').contains('0 activities')
    })
  })

  context('when viewing a contact with activities', () => {
    beforeEach(() => {
      collectionListRequest(
        'v3/search/interaction',
        interactionsList,
        urls.contacts.contactActivities(contactId)
      )
      getCollectionList()
      cy.get('@collectionItems').eq(1).as('secondListItem')
    })

    it('should display the total number of activites', () => {
      cy.get('[data-test="collection-header"]').contains('25 activities')
      cy.get('[data-test=pagination-summary]').contains('Page 1 of 3')
      cy.get('[data-test=pagination]').should(
        'have.attr',
        'data-total-pages',
        3
      )
    })

    context('when viewing a Contact with Data Hub interaction', () => {
      it('should display interaction activity kind label', () => {
        cy.get('@firstListItem').each(() => {
          cy.get('[data-test=activity-kind-label]').contains('interaction', {
            matchCase: false,
          })
        })
      })

      it.skip('should display interaction activity theme label', () => {
        cy.get('[data-test="interaction-activity"]').each(() => {
          cy.get('[data-test=activity-theme-label]').contains('export', {
            matchCase: false,
          })
        })
      })

      it('should display interaction activity service label', () => {
        cy.get('@firstListItem').each(() => {
          cy.get('[data-test=activity-service-label]').contains(
            'introductions',
            { matchCase: false }
          )
        })
      })
      it('should display the subject', () => {
        cy.get('@firstListItem').contains(
          'Meeting between Brendan Smith and Tyson Morar'
        )
      })

      it('should display the date', () => {
        cy.get('@firstListItem').contains('Date')
        cy.get('@firstListItem').contains('10 Jun 2019')
      })

      it('should display the advisers with email', () => {
        cy.get('@firstListItem').contains('Adviser')
        cy.get('@firstListItem').contains(
          'Puck Head Puck.Head@example.com, Digital Data Hub - Live Service'
        )
      })

      it('should display the service', () => {
        cy.get('@firstListItem').contains('Service')
        cy.get('@firstListItem').contains(
          'Export introductions : Someone else in DBT'
        )
      })

      it('should display the communication channel', () => {
        cy.get('@firstListItem').contains('Communication channel')
        cy.get('@firstListItem').contains('Email/Website')
      })

      context('when optional data is missing', () => {
        it('should render without missing data', () => {
          cy.get('@secondListItem')
            .should('exist')
            .should('not.contain', 'Communication channel')
            .should('not.contain', 'Service')
            .should('not.contain', 'Adviser')
        })
      })
    })
  })

  context.skip('When viewing a Contact with ESS activities', () => {
    it('should display the ESS activity', () => {
      cy.get('[data-test="export-support-service"]').should('exist')
    })

    it('displays the correct activity theme label', () => {
      cy.get('[data-test="export-support-service"]').within(() =>
        cy.get('[data-test="activity-theme-label"]').contains('export', {
          matchCase: false,
        })
      )
    })

    it('displays the correct activity service label', () => {
      cy.get('[data-test="export-support-service"]').within(() =>
        cy
          .get('[data-test="activity-service-label"]')
          .contains('Export Support Service', {
            matchCase: false,
          })
      )
    })

    it('displays the correct export support title', () => {
      cy.get('[data-test="export-support-service"]').within(() =>
        cy
          .get('[data-test="export-support-service-name"]')
          .contains('Test ESS Interaction', {
            matchCase: false,
          })
      )
    })

    it('displays the correct contact', () => {
      cy.get('[data-test="export-support-service"]').within(() =>
        cy
          .get('[data-test="contact-link-0"]')
          .should('exist')
          .should('have.text', 'Joseph Woof')
          .should(
            'have.attr',
            'href',
            '/contacts/5e75d636-1d24-416a-aaf0-3fb220d594ce/details'
          )
      )
    })
  })
})
