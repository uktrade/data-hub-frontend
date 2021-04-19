import { addDays, format, subDays } from 'date-fns'

const assertEstimatedLandDate = ({ index, date, countdown, colour }) => {
  cy.get('@projectListItems')
    .eq(index)
    .find('[data-test="project-details"]')
    .click()
    .find('[data-test="estimated-land-date"]')
    .as('estimatedLandDate')
    .should('have.css', 'background-color', colour)

  cy.get('@estimatedLandDate')
    .find('[data-test="estimated-land-date-countdown"]')
    .should('have.text', countdown)

  cy.get('@estimatedLandDate')
    .find('[data-test="estimated-land-date-date"]')
    .should('have.text', format(date, 'E, dd MMM yyyy'))
}

describe('Dashboard items - estimated land date', () => {
  before(() => {
    cy.setUserFeatures(['personalised-dashboard'])
    cy.visit('/')
  })

  after(() => {
    cy.resetUser()
  })

  beforeEach(() => {
    cy.get('[data-test="projects-list-item"]').as('projectListItems')
  })

  context('My project list items - estimated land date', () => {
    it('should show a grey panel when the project has under 0 days remaining', () => {
      assertEstimatedLandDate({
        index: 0,
        date: subDays(new Date(), 14),
        countdown: '-14 days',
        colour: 'rgba(191, 193, 195, 0.5)',
      })
    })

    it('should show a red panel when the project has 0 days remaining', () => {
      assertEstimatedLandDate({
        index: 1,
        date: new Date(),
        countdown: '0 days',
        colour: 'rgba(212, 53, 28, 0.4)',
      })
    })

    it('should show a red panel when the project has less than 30 days remaining', () => {
      assertEstimatedLandDate({
        index: 3,
        date: addDays(new Date(), 28),
        countdown: '28 days',
        colour: 'rgba(212, 53, 28, 0.4)',
      })
    })

    it('should show an amber panel when the project has between 30 and 89 days remaining', () => {
      assertEstimatedLandDate({
        index: 4,
        date: addDays(new Date(), 42),
        countdown: '42 days',
        colour: 'rgba(255, 221, 0, 0.5)',
      })
    })

    it('should show a green panel when the project has more than 89 days remaining', () => {
      assertEstimatedLandDate({
        index: 8,
        date: addDays(new Date(), 98),
        countdown: '98 days',
        colour: 'rgba(0, 112, 60, 0.3)',
      })
    })
  })
})
