const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')
const { assertCompanyBreadcrumbs } = require('../../support/assertions')

const company = fixtures.company.allActivitiesCompany
const company_activities = fixtures.company.activities

/*
 * Parts of this test are being skipped as we aren't pulling in this data from ActivityStream any more
 * We will be able to gradually unskip the individual contexts once we have the new integrations in place.
 */

describe('Company activity feed', () => {
  context('Company interactions', () => {
    beforeEach(() => {
      cy.visit(urls.companies.activity.index(company.id))
    })

    it('displays interaction activities', () => {
      const interaction = company_activities.results[0].interaction
      cy.get('[data-test="collection-item"]').each(() =>
        cy.get('a').contains(interaction.subject)
      )
    })

    it('displays activities which do not have a service name', () => {
      const interaction_with_null_service =
        company_activities.results[1].interaction
      cy.get('[data-test="collection-item"]').each(() =>
        cy.get('a').contains(interaction_with_null_service.subject)
      )
    })

    it('shows the activity count', () => {
      const count = company_activities.count
      cy.get('[data-test="collectionCount"]').each(() =>
        cy.get('span').contains(count)
      )
    })
  })

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

  context('Investment project', () => {
    beforeEach(() => {
      cy.visit(urls.companies.activity.index(company.id))
    })

    it('displays the correct activity type label', () => {
      cy.get('[data-test="investment-service-label"]').contains(
        'New Investment Project',
        {
          matchCase: false,
        }
      )
    })

    it('displays the correct topic label', () => {
      cy.get('[data-test="investment-theme-label"]').contains('Investment', {
        matchCase: false,
      })
    })
    it('displays the investment project name with link', () => {
      cy.get('[data-test="collection-item"]').each(() =>
        cy
          .get('a')
          .contains('Bo Oh O Wa er')
          .should(
            'have.attr',
            'href',
            '/investments/projects/9a824ef8-207e-4f6b-9205-91a42c1c77ef/details'
          )
      )
    })
  })

  context('Referrals project', () => {
    beforeEach(() => {
      cy.visit(urls.companies.activity.index(company.id))
    })

    it('displays the correct referral type label', () => {
      cy.get('[data-test="referral-label"]').contains('Outstanding Referral', {
        matchCase: false,
      })
    })

    it('displays the referral name with link', () => {
      const activity = company_activities.results[2]
      cy.get('[data-test="collection-item"]').each(() =>
        cy
          .get('a')
          .contains(activity.referral.subject)
          .should(
            'have.attr',
            'href',
            `/companies/${activity.company.id}/referrals/${activity.referral.id}`
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
