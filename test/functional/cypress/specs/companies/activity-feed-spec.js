import { collectionListRequest } from '../../support/actions'
import {
  companyActivityOrderListFaker,
  companyActivityGreatListFaker,
} from '../../fakers/company-activity'
import { truncateData } from '../../../../../src/client/utils/truncate'

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
  })

  context('Great Export Enquiry activity feed', () => {
    const greatData = companyActivityGreatListFaker(1)
    beforeEach(() => {
      collectionListRequest(
        'v4/search/company-activity',
        greatData,
        urls.companies.activity.index(company.id)
      )
    })

    const activity = greatData[0]
    const great_subject = truncateData(
      activity.great_export_enquiry.meta_subject,
      35
    )
    const great_comment = truncateData(
      activity.great_export_enquiry.data_enquiry
    )
    it('displays the correct activity type label', () => {
      cy.get('[data-test="great-kind-label"]').contains(
        'great.gov.uk Enquiry',
        {
          matchCase: false,
        }
      )
    })

    it('displays the correct topic label', () => {
      cy.get('[data-test="great-theme-label"]').contains('great.gov.uk', {
        matchCase: false,
      })
    })

    it('displays the correct sub-topic label', () => {
      cy.get('[data-test="great-service-label"]').contains('service', {
        matchCase: false,
      })
    })
    it('displays the Great export enquiry subject', () => {
      cy.get('[data-test="collection-item"]').each(() =>
        cy.get('h4').should('have.text', `Enquiry ${great_subject}`)
      )
    })
    it('displays the Great export enquiry contact', () => {
      cy.get('[data-test="metadata-item"]').contains(
        activity.great_export_enquiry.contact.name
      )
    })
    it('displays the Great export enquiry comment', () => {
      cy.get('[data-test="metadata-item"]').contains(great_comment)
    })
  })

  context('Orders (OMIS)', () => {
    const orderListNoUkRegion = companyActivityOrderListFaker(
      1,
      {},
      { uk_region: null }
    )
    beforeEach(() => {
      cy.visit(urls.companies.activity.index(company.id))
    })

    it('displays the correct activity type label', () => {
      cy.get('[data-test="order-kind-label"]').contains('New Order', {
        matchCase: false,
      })
    })

    it('displays the correct topic label', () => {
      cy.get('[data-test="order-theme-label"]').contains('Orders (OMIS)', {
        matchCase: false,
      })
    })

    it('displays the correct sub-topic label', () => {
      cy.get('[data-test="order-service-label"]').contains('Event', {
        matchCase: false,
      })
    })
    it('displays the order reference with link', () => {
      cy.get('[data-test="collection-item"]').each(() =>
        cy
          .get('a')
          .contains('HAM/100')
          .should(
            'have.attr',
            'href',
            '/omis/4dc401ad-cc6d-4464-8621-0719d403fa59'
          )
      )
    })
    it('displays the order with a uk region', () => {
      cy.get('[data-test="collection-item"]').each(() =>
        cy.get('span').contains('UK region')
      )
    })

    it('should display Data Hub order activity with no uk region', () => {
      collectionListRequest(
        'v4/search/company-activity',
        orderListNoUkRegion,
        urls.companies.activity.index(fixtures.company.venusLtd.id)
      )
      cy.get('[data-test="collection-item"]').each(() =>
        cy.get('span').contains('UK region').should('not.exist')
      )
    })
  })

  context('Investment project', () => {
    beforeEach(() => {
      cy.visit(urls.companies.activity.index(company.id))
    })

    it('displays the correct activity type label', () => {
      cy.get('[data-test="investment-kind-label"]').contains(
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
})
