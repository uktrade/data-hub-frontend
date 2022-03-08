import urls from '../../../../../src/lib/urls'
import { assertBreadcrumbs } from '../../support/assertions'

const investmentId = 'b30dee70-b2d6-48cf-9ce4-b9264854470c'
const investorCompanyId = '375094ac-f79a-43e5-9c88-059a7caa17f0'
const notificationEndpoint = `/api-proxy/v3/investment/${investmentId}/notification`
const page = `/investments/projects/${investmentId}/notifications/estimated-land-date`

describe('Notifications - Estimated land date', () => {
  before(() => {
    cy.intercept('GET', notificationEndpoint, {
      estimated_land_date: [],
    }).as('apiRequest')
    cy.visit(page)
    cy.wait('@apiRequest')
  })

  context('Local header', () => {
    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Investments: urls.investments.index(),
        Projects: urls.investments.index(),
        'Fancy dress manufacturing': `/investments/projects/${investmentId}/details`,
        Notifications: `/investments/projects/${investmentId}/notifications`,
        'Estimated land date': null,
      })
    })

    it('should render a link to an investor company', () => {
      cy.get('[data-test="heading-link"]').should(
        'have.attr',
        'href',
        `/companies/${investorCompanyId}`
      )
    })

    it('should render a heading', () => {
      cy.get('[data-test="heading"]').should(
        'contain',
        'Fancy dress manufacturing'
      )
    })
  })

  context('Investment details', () => {
    it('should have the correct number of list items', () => {
      cy.get('[data-test="meta-list"] li').should('have.length', 4)
    })

    it('should render a status that is ongoing', () => {
      cy.get('[data-test="meta-list"] li')
        .eq(0)
        .should('contain', 'Status')
        .should('contain', 'Ongoing')
        .find('a')
        .should(
          'have.attr',
          'href',
          '/investments/projects/b30dee70-b2d6-48cf-9ce4-b9264854470c/status'
        )
    })

    it('should render a project code', () => {
      cy.get('[data-test="meta-list"] li')
        .eq(1)
        .should('contain', 'Project code')
        .should('contain', 'DHP-00000005')
    })

    it('should render a valuation', () => {
      cy.get('[data-test="meta-list"] li')
        .eq(2)
        .should('contain', 'Valuation')
        .should('contain', 'Project valued')
    })

    it('should render a Creation on date', () => {
      cy.get('[data-test="meta-list"] li')
        .eq(3)
        .should('contain', 'Created on')
        .should('contain', '17 Mar 2017, 3:12pm')
    })
  })

  context('Stage timeline', () => {
    it('should contain 5 timeline stages', () => {
      cy.get('[data-test="timeline"] li').should('have.length', 5)
    })

    it('should contain Prospect', () => {
      cy.get('[data-test="timeline"] li').eq(0).should('contain', 'Prospect')
    })

    it('should contain Assign PM', () => {
      cy.get('[data-test="timeline"] li').eq(1).should('contain', 'Assign PM')
    })

    it('should contain Active', () => {
      cy.get('[data-test="timeline"] li').eq(2).should('contain', 'Active')
    })

    it('should contain Verify win', () => {
      cy.get('[data-test="timeline"] li').eq(3).should('contain', 'Verify win')
    })

    it('should contain Verify win', () => {
      cy.get('[data-test="timeline"] li').eq(4).should('contain', 'Won')
    })
  })

  context('Estimate land date subheadings', () => {
    it('should render a subheading', () => {
      cy.get('h2').should(
        'have.text',
        'Estimated land date notification preferences'
      )
    })

    it('should render the estimated land date', () => {
      cy.get('[data-test="estimated-land-date"]').should(
        'contain',
        'Estimated land date for this project: 01 Apr 2020'
      )
    })

    it('should have a grey left border', () => {
      cy.get('[data-test="estimated-land-date"]')
        .should('have.css', 'border-left', '10px solid rgb(191, 193, 195)')
        .should('have.css', 'padding', '12px')
    })
  })

  context('Estimated land date form', () => {
    it('should contain a form', () => {
      cy.get('form').should('exist')
    })

    it('should render a legend with a subheading', () => {
      cy.get('form legend h3').should(
        'have.text',
        'When do you want to get an email for this project?'
      )
    })

    it('should render hint text', () => {
      cy.get('[data-test="hint-text"]').should(
        'contain',
        'Select all that apply'
      )
    })

    it('should render three checkboxes', () => {
      cy.get('input[type="checkbox"]').should('have.length', 3)
    })

    it('should render a "60 days before estimated land date" checkbox', () => {
      cy.get('form fieldset label')
        .eq(0)
        .should('have.text', '60 days before estimated land date')
    })

    it('should render a "30 days before estimated land date" checkbox', () => {
      cy.get('form fieldset label')
        .eq(1)
        .should('have.text', '30 days before estimated land date')
    })

    it('should render "or"', () => {
      cy.get('[data-test="exclusive-or"]').should('have.text', 'or')
    })

    it('should render a "None, ..." checkbox', () => {
      cy.get('form fieldset label')
        .eq(2)
        .should(
          'have.text',
          'None, I do not want to get emails for estimated land date'
        )
    })
  })

  context('Exclusive checkbox logic', () => {
    it('should apply the correct logic', () => {
      // The last checkbox by default is checked
      cy.get('[data-test="checkbox-60"]').should('not.be.checked')
      cy.get('[data-test="checkbox-30"]').should('not.be.checked')
      cy.get('[data-test="checkbox-none"]').should('be.checked')

      // Check the first checkbox
      cy.get('[data-test="checkbox-60"]').check()
      cy.get('[data-test="checkbox-30"]').should('not.be.checked')
      cy.get('[data-test="checkbox-none"]').should('not.be.checked')

      // Check the second checkbox
      cy.get('[data-test="checkbox-30"]').check()
      cy.get('[data-test="checkbox-60"]').should('be.checked')
      cy.get('[data-test="checkbox-none"]').should('not.be.checked')

      // Check the last checkbox
      cy.get('[data-test="checkbox-none"]').check()
      cy.get('[data-test="checkbox-60"]').should('not.be.checked')
      cy.get('[data-test="checkbox-30"]').should('not.be.checked')

      // Check the second checkbox
      cy.get('[data-test="checkbox-30"]').check()
      cy.get('[data-test="checkbox-60"]').should('not.be.checked')
      cy.get('[data-test="checkbox-none"]').should('not.be.checked')
    })
  })
})
