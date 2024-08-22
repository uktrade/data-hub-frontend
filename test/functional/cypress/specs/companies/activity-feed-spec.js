const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')
const { assertCompanyBreadcrumbs } = require('../../support/assertions')

const company = fixtures.company.allActivitiesCompany

/*
 * Parts of this test are being skipped as we aren't pulling in this data from ActivityStream any more
 * We will be able to gradually unskip the individual contexts once we have the new integrations in place.
 */

describe('Company activity feed', () => {
  context('Companies House Company', () => {
    beforeEach(() => {
      cy.visit(urls.companies.activity.index(company.id))
    })

    assertCompanyBreadcrumbs(
      company.name,
      urls.companies.detail(company.id),
      'Activity Feed'
    )

    it.skip('displays the correct activity type label', () => {
      cy.get('[data-test="companies-house-company-activity"]').within(() =>
        cy
          .get('[data-test="activity-kind-label"]')
          .contains('Companies House Update', {
            matchCase: false,
          })
      )
    })

    it('displays activities which do not have a service name', () => {
      cy.get('[data-test="collection-item"]').each(() =>
        cy.get('a').contains('Interaction with null service')
      )
    })
  })

  context.skip('Export Support Service', () => {
    beforeEach(() => {
      cy.visit(urls.companies.activity.index(company.id))
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
          .contains('Enquiring about Exporting some things', {
            matchCase: false,
          })
      )
    })

    it('displays the correct contact', () => {
      cy.get('[data-test="export-support-service"]').within(() =>
        cy
          .get('[data-test="contact-link-0"]')
          .should('exist')
          .should('have.text', 'Super Glue')
          .should(
            'have.attr',
            'href',
            '/contacts/67ecb4fc-2db9-4afb-9b7b-e4736b0a2d9d/details'
          )
      )
    })
  })

  context.skip('Companies House Account', () => {
    beforeEach(() => {
      cy.visit(urls.companies.activity.index(company.id))
    })

    it('displays the correct activity type label', () => {
      cy.get('[data-test="companies-house-account-activity"]').within(() =>
        cy
          .get('[data-test="activity-kind-label"]')
          .contains('Companies House Update', {
            matchCase: false,
          })
      )
    })
  })

  context.skip('HMRC Exporter', () => {
    beforeEach(() => {
      cy.visit(urls.companies.activity.index(company.id))
    })

    it('displays the correct activity type label', () => {
      cy.get('[data-test="hmrc-exporter-activity"]').within(() =>
        cy.get('[data-test="activity-kind-label"]').contains('HMRC Update', {
          matchCase: false,
        })
      )
    })
  })

  context.skip('Orders (OMIS)', () => {
    beforeEach(() => {
      cy.visit(urls.companies.activity.index(company.id))
    })

    it('displays the correct activity type label', () => {
      cy.get('[data-test="order-activity"]').within(() =>
        cy.get('[data-test="activity-kind-label"]').contains('New Order', {
          matchCase: false,
        })
      )
    })

    it('displays the correct topic label', () => {
      cy.get('[data-test="order-activity"]').within(() =>
        cy.get('[data-test="activity-theme-label"]').contains('Orders (OMIS)', {
          matchCase: false,
        })
      )
    })

    it('displays the correct sub-topic label', () => {
      cy.get('[data-test="order-activity"]').within(() =>
        cy.get('[data-test="activity-service-label"]').contains('Event', {
          matchCase: false,
        })
      )
    })

    it('displays the order reference with link', () => {
      cy.get('[data-test="order-activity"]').within(() =>
        cy
          .get('[data-test="order-activity-card-subject"]')
          .should('exist')
          .should('have.text', 'HAM100')
          .get('a')
          .should('have.attr', 'href', 'https://www.my-website.com/work-order')
      )
    })
    it('displays the correct sub-topic label', () => {
      cy.get('[data-test="order-activity"]').within(() =>
        cy.get('[data-test="activity-service-label"]').contains('Event', {
          matchCase: false,
        })
      )
    })
  })

  context.skip('Investment project', () => {
    beforeEach(() => {
      cy.visit(urls.companies.activity.index(company.id))
    })

    it('displays the correct activity type label', () => {
      cy.get('[data-test="investment-activity"]').within(() =>
        cy
          .get('[data-test="activity-kind-label"]')
          .contains('New Investment Project', {
            matchCase: false,
          })
      )
    })

    it('displays the correct topic label', () => {
      cy.get('[data-test="investment-activity"]').within(() =>
        cy.get('[data-test="activity-theme-label"]').contains('Investment', {
          matchCase: false,
        })
      )
    })

    it('displays the correct sub-topic label', () => {
      cy.get('[data-test="investment-activity"]').within(() =>
        cy
          .get('[data-test="activity-service-label"]')
          .contains('Project - FDI', {
            matchCase: false,
          })
      )
    })

    it('displays the correct sub-topic label', () => {
      cy.get('[data-test="investment-activity"]').within(() =>
        cy
          .get('[data-test="activity-service-label"]')
          .contains('Project - FDI', {
            matchCase: false,
          })
      )
    })

    it('displays the investment project name with link', () => {
      cy.get('[data-test="investment-activity"]').within(() =>
        cy
          .get('[data-test="investment-activity-card-subject"]')
          .should('exist')
          .should('have.text', 'Marshmellow UK Takeover')
          .get('a')
          .should(
            'have.attr',
            'href',
            'https://www.datahub.trade.gov.uk/investments/projects/d9e25847-6199-e211-a939-e4115bead28a/details'
          )
      )
    })
  })

  context.skip('Referrals project', () => {
    beforeEach(() => {
      cy.visit(urls.companies.activity.index(company.id))
    })

    it('displays the correct referral type label', () => {
      cy.get('[data-test="referral-activity"]').within(() =>
        cy
          .get('[data-test="activity-kind-label"]')
          .contains('Outstanding Referral', {
            matchCase: false,
          })
      )
    })

    it('displays the referral name with link', () => {
      cy.get('[data-test="referral-activity"]').within(() =>
        cy
          .get('[data-test="referral-activity-card-subject"]')
          .should('exist')
          .should('have.text', 'Support needs in the Planet')
          .get('a')
          .should(
            'have.attr',
            'href',
            '/companies/01e3366a-aa2b-40c0-aaf9-9013f714a671/referrals/fd6a151f-90db-41e3-841f-1ca0dd63b674'
          )
      )
    })
  })

  context.skip('Aventri', () => {
    beforeEach(() => {
      cy.visit(urls.companies.activity.index(company.id))
    })

    it('displays the correct activity type label', () => {
      cy.get('[data-test="aventri-event"]').within(() =>
        cy.get('[data-test="activity-kind-label"]').contains('Aventri Event', {
          matchCase: false,
        })
      )
    })

    it('displays the correct sub-topic label', () => {
      cy.get('[data-test="aventri-event"]').within(() =>
        cy.get('[data-test="activity-service-label"]').contains('Event', {
          matchCase: false,
        })
      )
    })

    context(
      'when a company with large number contacts attending aventri events is viewed',
      () => {
        beforeEach(() => {
          cy.visit(
            urls.companies.activity.index(
              fixtures.company.companyWithManyContacts.id
            )
          )
        })

        it('correctly displays contacts for a past event', () => {
          cy.get('[data-test="aventri-event"]')
            .eq(0)
            .within(() => {
              cy.get('[data-test="cancelled-label"]').should('exist')
              cy.get('[data-test="attended-label"]').should('exist')
              cy.get('[data-test="did-not-attend-label"]').should('exist')
              cy.get('[data-test="waiting-list-label"]').should('exist')
              cy.get('[data-test="registered-label"]').should('exist')
            })
        })

        it('correctly displays contacts for a future event', () => {
          cy.get('[data-test="aventri-event"]')
            .eq(1)
            .within(() => {
              cy.get('[data-test="cancelled-label"]').should('exist')
              cy.get('[data-test="attended-label"]').should('exist')
              cy.get('[data-test="did-not-attend-label"]').should('exist')
              cy.get('[data-test="waiting-list-label"]').should('exist')
              cy.get('[data-test="registered-label"]').should('exist')
            })
        })
      }
    )
  })

  context.skip('Email Campaign (Maxemail)', () => {
    before(() => {
      const companyId = fixtures.company.externalActivitiesLtd.id
      const url = urls.companies.activity.index(companyId)
      cy.visit(url)
    })

    it('displays the correct activity type label', () => {
      cy.get('[data-test="maxemail-campaign-activity"]').each(() =>
        cy.get('[data-test="activity-kind-label"]').contains('Email Campaign', {
          matchCase: false,
        })
      )
    })
  })
})

context.skip('Export Support Service No Title', () => {
  before(() => {
    cy.visit(urls.companies.activity.index(fixtures.company.essNoTitle.id))
  })

  it('Displays the ESS Inbound Enquiry support title when no title provided', () => {
    cy.get('[data-test="export-support-service"]').within(() =>
      cy
        .get('[data-test="export-support-service-name"]')
        .contains('ESS Inbound Enquiry', {
          matchCase: false,
        })
    )
  })
})
