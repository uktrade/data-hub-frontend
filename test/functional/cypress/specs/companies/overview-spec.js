import { company } from '../../fixtures'
import {
  companyGlobalUltimateAllDetails,
  companyNoDetails,
} from '../../fakers/companies'
import { getCollectionList } from '../../support/collection-list-assertions'
import { collectionListRequest } from '../../support/actions'
import companyActivityListFaker, {
  companyActivityEYBListFaker,
  companyActivityGreatListFaker,
  companyActivityInvestmentListFaker,
  companyActivityOrderListFaker,
} from '../../fakers/company-activity'
import { truncateData } from '../../../../../src/client/utils/truncate'
import { assertSummaryTable } from '../../support/assertions'

const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

const { usCompany } = company

describe('Company overview page', () => {
  const addInteractionUrlAllOverview = urls.companies.interactions.create(
    fixtures.company.allOverviewDetails.id
  )
  const addInteractionUrlNoOverview = urls.companies.interactions.create(
    fixtures.company.noOverviewDetails.id
  )
  const allActivityUrlAllOverview = urls.companies.activity.index(
    fixtures.company.allOverviewDetails.id
  )

  context(
    'when viewing the Overview page a Business details card should be displayed',
    () => {
      beforeEach(() => {
        cy.visit(
          urls.companies.overview.index(companyGlobalUltimateAllDetails.id)
        )
      })

      it('the card should contain the Business details table', () => {
        cy.get('[data-test="business-details-container"]')
          .as('bd-table')
          .first()
          .contains('Business details')
        cy.get('@bd-table').find('tbody').should('exist')
      })
    }
  )

  context(
    'when viewing the Overview page an Account Management card should be displayed',
    () => {
      beforeEach(() => {
        cy.visit(
          urls.companies.overview.index(companyGlobalUltimateAllDetails.id)
        )
      })

      it('the card should contain the Account management table', () => {
        cy.get('[data-test="account-management-container"]')
          .as('am-table')
          .first()
          .contains('Account management')
        cy.get('@am-table').find('tbody').should('exist')
      })
    }
  )

  context(
    'when viewing the export status card for a business that has all information added',
    () => {
      beforeEach(() => {
        cy.visit(
          urls.companies.overview.index(companyGlobalUltimateAllDetails.id)
        )
      })

      it('the card should contain the Export status table', () => {
        cy.get('[data-test="export-status-container"]')
          .as('es-table')
          .first()
          .contains('Export status')
        cy.get('@es-table').find('tbody').should('exist')
      })

      it('should display the correct export status information', () =>
        cy.get('[data-test="export-status-container"]').within(() =>
          Object.entries({
            'Export potential': 'No score given',
            'Export sub-segment': 'Not set',
            'Currently exporting to': 'Not set',
            'Future countries of interest': 'Not set',
            'Last export win': '01 Jan 2024, Egypt',
            'Total exports won': '11',
          }).forEach(([label, expectedValue]) => {
            cy.contains('th', label)
              .next('td')
              .should('have.text', expectedValue)
          })
        ))
    }
  )
  context(
    'when viewing the Export Status Card and an error occurs during the Export Wins lookup',
    () => {
      beforeEach(() => {
        cy.intercept('GET', urls.company.exportWin(companyNoDetails.id), {
          statusCode: 500,
          body: {
            detail:
              "('The Company matching service returned an error status: 401',)",
          },
        })
        cy.visit(urls.companies.overview.index(companyNoDetails.id))
      })

      it('the card should contain the Export Status table', () => {
        cy.get('[data-test="export-status-container"]')
        cy.get('th')
          .contains('Total exports won')
          .siblings()
          .contains('td', 'Unable to load export wins')
      })
    }
  )

  context(
    'when viewing the investment status card for a business that has all information added',
    () => {
      beforeEach(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
        )
      })

      it('the card should contain the investment status table including all keys and accurate totals', () => {
        cy.get('[data-test="investmentsStatusContainer"]')
          .children()
          .first()
          .contains('Investment status')
          .next()
          .children()
        cy.get('th')
          .contains('Last Project won')
          .siblings()
          .contains('td', '07 Jun 2022')
        cy.get('[data-test="latest-won-project-link"]').click()
        cy.location('pathname').should(
          'eq',
          urls.investments.projects.details(
            '945ea6d1-eee3-4f5b-9144-84a75b71b8e6'
          )
        )
        cy.go('back')
        cy.get('[data-test="investmentsStatusContainer"]')
        cy.get('th')
          .contains('Total projects won')
          .siblings()
          .contains('td', '0')
        cy.get('th').contains('Active projects').siblings().contains('td', '4')
        cy.get('th')
          .contains('Prospect projects')
          .siblings()
          .contains('td', '3')
        cy.get('th')
          .contains('Verify win projects')
          .siblings()
          .contains('td', '1')
        cy.get('th')
          .contains('Abandoned projects')
          .siblings()
          .contains('td', '1')
      })
      it('the card should link to the investment page', () => {
        cy.get('[data-test="investment-page-link"]')
          .contains('View all investments')
          .click()
        cy.location('pathname').should(
          'eq',
          urls.companies.investments.companyInvestmentProjects(
            'ba8fae21-2895-47cf-90ba-9273c94dab88'
          )
        )
        cy.go('back')
      })
    }
  )

  context(
    'when viewing the investment status card with different stages and statuses of investment projects',
    () => {
      beforeEach(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
        )
      })

      it('the card should link to the latest won project', () => {
        cy.get('[data-test="latest-won-project-link"]')
          .contains('07 Jun 2022')
          .click()
        cy.location('pathname').should(
          'eq',
          urls.investments.projects.details(
            '945ea6d1-eee3-4f5b-9144-84a75b71b8e6'
          )
        )
      })
    }
  )

  context(
    'when viewing the investment status card the "add investment project button" should not show',
    () => {
      beforeEach(() => {
        cy.visit(
          urls.companies.investments.companyInvestmentProjects(
            fixtures.company.allOverviewDetails.id
          )
        )
      })

      it('Inactive / UK based Active projects should not include an "Add investment project" button', () => {
        getCollectionList() // This ensures the collection list has loaded before checking for the presence of the button
        cy.get('add-collection-item-button').should('not.exist')
      })
    }
  )

  context(
    'Active projects should include an Add investment project button with the current company pre selected',
    () => {
      beforeEach(() => {
        cy.visit(
          urls.companies.investments.companyInvestmentProjects(usCompany.id)
        )
        cy.get('[data-test=add-collection-item-button]').click()
      })
      it('should take us to create investment page', () => {
        cy.location('pathname').should(
          'eq',
          urls.investments.projects.create(
            'b2c34b41-1d5a-4b4b-9249-7c53ff2868ab'
          )
        )
      })
    }
  )

  context('when viewing the Recent Activity Card for a business', () => {
    const companyActivitiesList = companyActivityListFaker(3)
    beforeEach(() => {
      collectionListRequest(
        'v4/search/company-activity',
        companyActivitiesList,
        urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
      )
    })

    it('the card should contain the Recent activity heading and add interaction link', () => {
      cy.get('[data-test="recent-activity-card-container"]')
        .children()
        .first()
        .contains('Recent activity')
        .children()
        .contains('Add interaction')
        .click()
      cy.location('pathname').should('eq', addInteractionUrlAllOverview)
    })
    it('the card should contain three activities', () => {
      cy.get('[data-test="recent-activity-card-container"]')
        .find('ul')
        .children()
        .should('have.length', 3)
    })
    it('the card should link to the activity overview page', () => {
      cy.get('[data-test="recent-activity-card-container"]')
        .contains('View all activities')
        .click()
      cy.location('pathname').should('eq', allActivityUrlAllOverview)
    })
  })

  context('when viewing the Upcoming Activity Card for a business', () => {
    const interactionsList = companyActivityListFaker(2)
    beforeEach(() => {
      collectionListRequest(
        'v4/search/company-activity',
        interactionsList,
        urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
      )
    })

    it('the card should contain the Upcoming activity heading and add interaction link', () => {
      cy.get('[data-test="upcoming-activity-card-container"]')
        .children()
        .first()
        .contains('Upcoming activity')
        .children()
        .contains('Add interaction')
        .click()
      cy.location('pathname').should('eq', addInteractionUrlAllOverview)
    })
    it('the card should contain two activities', () => {
      cy.get('[data-test="upcoming-activity-card-container"]')
        .find('ul')
        .children()
        .should('have.length', 2)
    })
    it('the card should link to the activity overview page', () => {
      cy.get('[data-test="upcoming-activity-card-container"]')
        .contains('View all activities')
        .click()
      cy.location('pathname').should('eq', allActivityUrlAllOverview)
    })
  })

  context(
    'when viewing the activity cards for a business with no activities',
    () => {
      const interactionsList = companyActivityListFaker(0)
      beforeEach(() => {
        collectionListRequest(
          'v4/search/company-activity',
          interactionsList,
          urls.companies.overview.index(fixtures.company.noOverviewDetails.id)
        )
      })

      it('the card should contain the Recent activity heading and add interaction link', () => {
        cy.get('[data-test="recent-activity-card-container"]').contains(
          'There are no recent activities to show.'
        )
        cy.get('[data-test="recent-activity-card-container"]')
          .children()
          .first()
          .contains('Recent activity')
          .children()
          .contains('Add interaction')
          .click()
        cy.location('pathname').should('eq', addInteractionUrlNoOverview)
      })

      it('the card should contain the upcoming activity heading and add interaction link', () => {
        cy.get('[data-test="upcoming-activity-card-container"]').contains(
          'There are no upcoming activities to show.'
        )
        cy.get('[data-test="upcoming-activity-card-container"]')
          .children()
          .first()
          .contains('Upcoming activity')
          .children()
          .contains('Add interaction')
          .click()
        cy.location('pathname').should('eq', addInteractionUrlNoOverview)
      })
    }
  )

  // TODO - Unskip relevant parts of this test when we have the associated DAGs in place
  context('when viewing all activity cards types', () => {
    const interactionsList = companyActivityListFaker(1)
    const investmentsListWithJobsNoEYBLead =
      companyActivityInvestmentListFaker(1)
    const investmentsListNullJobsNoEYBLead = companyActivityInvestmentListFaker(
      1,
      {},
      { number_new_jobs: null }
    )
    const investmentsListWithJobsHasEYBLead =
      companyActivityInvestmentListFaker(1, {}, { eyb_leads: [{ id: '1' }] })
    const investmentsListNullJobsHasEYBLead =
      companyActivityInvestmentListFaker(
        1,
        {},
        { number_new_jobs: null, eyb_leads: [{ id: '1' }] }
      )
    const orderList = companyActivityOrderListFaker(1)
    const orderListNoPrimaryMarket = companyActivityOrderListFaker(
      1,
      {},
      { primary_market: null }
    )
    const greatList = companyActivityGreatListFaker(1)
    beforeEach(() => {
      collectionListRequest(
        'v4/search/company-activity',
        interactionsList,
        urls.companies.overview.index(fixtures.company.venusLtd.id)
      )
    })
    const EYBListHighValue = companyActivityEYBListFaker(
      1,
      {},
      { is_high_value: true }
    )
    const EYBListLowValue = companyActivityEYBListFaker(
      1,
      {},
      { is_high_value: false }
    )
    const EYBListUnknownValue = companyActivityEYBListFaker(
      1,
      {},
      { is_high_value: null }
    )

    it.skip('should display HMRC exporters record activity', () => {
      cy.get('[data-test="hmrc-exporter-activity-summary"]')
        .children()
        .first()
        .contains('01 Oct 2019')
        .next()
        .children()
        .contains('Exporters Record')
      cy.get('[data-test="activity-summary-subject"]')
        .contains('Export of goods outside the EU')
        .next()
        .contains('HMRC Update')
    })
    it.skip('should display Companies House activity', () => {
      cy.get('[data-test="companies-house-company-activity"]')
        .children()
        .first()
        .contains('11 Jan 1865')
        .next()
        .children()
        .contains('Company Record')
      cy.get('[data-test="activity-summary-subject"]')
        .contains('Company officially incorporated in Companies House')
        .next()
        .contains('Companies House Updated')
    })
    it.skip('should display Companies House account activity', () => {
      cy.get('[data-test="companies-house-account-activity-summary"]')
        .children()
        .first()
        .contains('30 Jun 2011')
        .next()
        .children()
        .contains('Accounts Record')
      cy.get('[data-test="activity-summary-subject"]')
        .contains('Company accounts made up')
        .next()
        .contains('Companies House Updated')
    })
    it.skip('should display OMIS activity', () => {
      cy.get('[data-test="omis-activity-summary"]')
        .children()
        .first()
        .contains('25 Mar 2013')
        .next()
        .children()
        .contains('New Order')
      cy.get('[data-test="activity-summary-subject"]')
        .children()
        .contains('a', 'HAM100')
        .parent()
        .next()
        .contains('Export to United States added by Angelica Schuyler')
    })
    it.skip('should display outstanding referral', () => {
      cy.get('[data-test="referral-summary"]')
        .children()
        .first()
        .contains('21 May 2020')
        .next()
        .children()
        .contains('Outstanding referral')
      cy.get('[data-test="activity-summary-subject"]')
        .children()
        .contains('a', 'Support needs in the Planet')
        .parent()
        .next()
        .contains(
          'Completed sending adviser John Doe, Planet Consulate General receiving adviser John Taylorme, Planet Embassy'
        )
    })
    it.skip('should display ESS interaction', () => {
      cy.get('[data-test="export-support-service-summary"]')
        .children()
        .first()
        .contains('02 Dec 2022')
        .next()
        .children()
        .contains('Interaction')
    })
    it('should display Data Hub interaction', () => {
      const activity = interactionsList[0]
      cy.get('[data-test="activity-subject"]').contains(
        'a',
        activity.interaction.subject
      )
    })
    it('should display Data Hub investment activity with jobs and no link to EYB leads', () => {
      collectionListRequest(
        'v4/search/company-activity',
        investmentsListWithJobsNoEYBLead,
        urls.companies.overview.index(fixtures.company.venusLtd.id)
      )
      const activity = investmentsListWithJobsNoEYBLead[0]
      cy.get('[data-test="investment-kind-label"]').contains(
        'New Investment Project'
      )
      cy.get('[data-test="activity-summary"]').contains(
        `${activity.investment.investment_type.name} investment for ${activity.investment.number_new_jobs} new jobs added by ${activity.investment.created_by.name}`
      )
      cy.get('[data-test="activity-summary"]').should(
        'not.include.text',
        'from EYB lead'
      )
    })

    it('should display Data Hub investment activity with empty number of new jobs and no link to an EYB lead', () => {
      collectionListRequest(
        'v4/search/company-activity',
        investmentsListNullJobsNoEYBLead,
        urls.companies.overview.index(fixtures.company.venusLtd.id)
      )
      const activity = investmentsListNullJobsNoEYBLead[0]
      cy.get('[data-test="investment-kind-label"]').contains(
        'New Investment Project'
      )
      cy.get('[data-test="activity-summary"]').contains(
        `${activity.investment.investment_type.name} investment added by ${activity.investment.created_by.name}`
      )
      cy.get('[data-test="activity-summary"]').should(
        'not.include.text',
        'from EYB lead'
      )
    })

    it('should display Data Hub investment activity with jobs and link to an EYB lead', () => {
      collectionListRequest(
        'v4/search/company-activity',
        investmentsListWithJobsHasEYBLead,
        urls.companies.overview.index(fixtures.company.venusLtd.id)
      )
      const activity = investmentsListWithJobsHasEYBLead[0]
      cy.get('[data-test="investment-kind-label"]').contains(
        'New Investment Project'
      )
      cy.get('[data-test="activity-summary"]').contains(
        `${activity.investment.investment_type.name} investment for ${activity.investment.number_new_jobs} new jobs added by ${activity.investment.created_by.name} from EYB lead`
      )
    })

    it('should display Data Hub investment activity with empty number of new jobs and link to an EYB lead', () => {
      collectionListRequest(
        'v4/search/company-activity',
        investmentsListNullJobsHasEYBLead,
        urls.companies.overview.index(fixtures.company.venusLtd.id)
      )
      const activity = investmentsListNullJobsHasEYBLead[0]
      cy.get('[data-test="investment-kind-label"]').contains(
        'New Investment Project'
      )
      cy.get('[data-test="activity-summary"]').contains(
        `${activity.investment.investment_type.name} investment added by ${activity.investment.created_by.name} from EYB lead`
      )
    })

    it('should display Data Hub order activity', () => {
      collectionListRequest(
        'v4/search/company-activity',
        orderList,
        urls.companies.overview.index(fixtures.company.venusLtd.id)
      )
      const activity = orderList[0]
      cy.get('[data-test="order-kind-label"]').contains('New Order')
      cy.get('[data-test="activity-summary"]').contains(
        `Export to ${activity.order.primary_market.name} added by ${activity.order.created_by.name}`
      )
    })

    it('should display Data Hub order with no summary', () => {
      collectionListRequest(
        'v4/search/company-activity',
        orderListNoPrimaryMarket,
        urls.companies.overview.index(fixtures.company.venusLtd.id)
      )
      cy.get('[data-test="order-kind-label"]').contains('New Order')
      cy.get('[data-test="activity-summary"]').should('have.value', '')
    })

    it.skip('should display Data Hub event', () => {
      cy.get('[data-test="data-hub-event-summary"]')
        .children()
        .first()
        .contains('30 May to 14 Jun 2022')
        .next()
        .children()
        .contains('Account management')
      cy.get('[data-test="activity-summary-subject"]')
        .children()
        .contains('a', 'Holiday to the Seaside')
        .parent()
        .next()
        .contains('Joe Bloggs organised Best service')
    })

    it('should display Data Hub great activity', () => {
      collectionListRequest(
        'v4/search/company-activity',
        greatList,
        urls.companies.overview.index(fixtures.company.venusLtd.id)
      )
      const activity = greatList[0]
      const subject = truncateData(
        activity.great_export_enquiry.meta_subject,
        35
      )
      cy.get('[data-test="great-kind-label"]').contains('great.gov.uk')
      cy.get('[data-test="activity-subject"]').contains(subject)
      cy.get('[data-test="activity-summary"]').contains(
        `Enquirer ${activity.great_export_enquiry.contact.first_name} ${activity.great_export_enquiry.contact.last_name}`
      )
    })

    it('should display Data Hub EYB lead activity with high value', () => {
      collectionListRequest(
        'v4/search/company-activity',
        EYBListHighValue,
        urls.companies.overview.index(fixtures.company.venusLtd.id)
      )
      cy.get('[data-test="eyb-kind-label"]').contains('EYB')
      cy.get('[data-test="activity-summary"]').contains(
        'A high-value EYB lead associated with this company has been added to Data Hub'
      )
    })

    it('should display Data Hub EYB lead activity with low value', () => {
      collectionListRequest(
        'v4/search/company-activity',
        EYBListLowValue,
        urls.companies.overview.index(fixtures.company.venusLtd.id)
      )
      cy.get('[data-test="eyb-kind-label"]').contains('EYB')
      cy.get('[data-test="activity-summary"]').contains(
        'A low-value EYB lead associated with this company has been added to Data Hub'
      )
    })

    it('should display Data Hub EYB lead activity with unknown value', () => {
      collectionListRequest(
        'v4/search/company-activity',
        EYBListUnknownValue,
        urls.companies.overview.index(fixtures.company.venusLtd.id)
      )
      cy.get('[data-test="eyb-kind-label"]').contains('EYB')
      cy.get('[data-test="activity-summary"]').contains(
        'An unknown-value EYB lead associated with this company has been added to Data Hub'
      )
    })
  })

  context(
    'when viewing the active investment projects card for a business that has all information added',
    () => {
      beforeEach(() => {
        cy.intercept(
          'GET',
          `/api-proxy/v4/company/${fixtures.company.allOverviewDetails.id}`
        ).as('companyApi')
        cy.visit(
          urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
        )
        cy.wait('@companyApi')
      })

      it('the card should link to the investment page', () => {
        cy.get('[data-test="active-investments-page-link"]')
          .contains('View 1 more active investment')
          .click()
        cy.location('pathname').should(
          'eq',
          `${urls.companies.investments.companyInvestmentProjects(
            'ba8fae21-2895-47cf-90ba-9273c94dab88'
          )}`
        )
        cy.go('back')
      })
    }
  )
  context(
    'when viewing the active investment projects card for a business that has an investment but no status',
    () => {
      beforeEach(() => {
        cy.intercept('POST', '/api-proxy/v3/search/investment_project', {
          body: {
            count: 1,
            results: [
              {
                likelihood_to_land: null,
                stage: {
                  id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
                  name: 'Active',
                },
                estimated_land_date: '2025-10-13',
                latest_interaction: {
                  date: '2021-03-16T00:00:00+00:00',
                  subject: 'A project interaction',
                  id: '3fd90013-4bcb-4c39-b8df-df264471ea85',
                },
                name: 'New restaurant',
                status: 'ongoing',
              },
            ],
          },
        }).as('apiRequest')
        cy.visit(
          urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
        )
      })
      it('the card should contain that the status of the investment is Not set', () => {
        cy.get('[data-test="activeInvestmentProjectsContainer"]')
          .children()
          .first()
          .contains('Active investment projects')
        cy.get('[data-test="likelihood-of-landing-new-restaurant-header"]')
          .next()
          .contains('Not set')
      })
    }
  )
  context(
    'when viewing the active investment projects card only ongoing or delayed investments are viewable',
    () => {
      beforeEach(() => {
        cy.intercept('POST', '/api-proxy/v3/search/investment_project', {
          body: {
            count: 4,
            results: [
              {
                likelihood_to_land: null,
                stage: {
                  id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
                  name: 'Active',
                },
                estimated_land_date: '2025-10-13',
                name: 'Active Ongoing',
                status: 'ongoing',
              },
              {
                likelihood_to_land: null,
                stage: {
                  id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
                  name: 'Active',
                },
                estimated_land_date: '2025-10-13',
                name: 'Active Delayed',
                status: 'delayed',
              },
              {
                likelihood_to_land: null,
                stage: {
                  id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
                  name: 'Active',
                },
                estimated_land_date: '2025-10-13',
                name: 'Active Lost',
                status: 'lost',
              },
              {
                likelihood_to_land: null,
                stage: {
                  id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
                  name: 'Active',
                },
                estimated_land_date: '2025-10-13',
                name: 'Active Won',
                status: 'won',
              },
              {
                likelihood_to_land: null,
                stage: {
                  id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
                  name: 'Active',
                },
                estimated_land_date: '2025-10-13',
                name: 'Active Abandoned',
                status: 'abandoned',
              },
              {
                likelihood_to_land: null,
                stage: {
                  id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
                  name: 'Active',
                },
                estimated_land_date: '2025-10-13',
                name: 'Active Dormant',
                status: 'dormant',
              },
            ],
          },
        }).as('apiRequest')
        cy.visit(
          urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
        )
      })
      it('the card should contact two active investments only', () => {
        cy.get(
          '[data-test="active-investment-page-active-ongoing-link"]'
        ).contains('Active Ongoing')
        cy.get(
          '[data-test="active-investment-page-active-delayed-link"]'
        ).contains('Active Delayed')
      })
      it('the card should contain a link stating 4 more active investments', () => {
        cy.get('[data-test="active-investments-page-link"]').contains(
          'View 4 more active investments'
        )
      })
    }
  )
  context(
    'when viewing the active investment projects card for a business that has no investment projects',
    () => {
      beforeEach(() => {
        cy.intercept('POST', '/api-proxy/v3/search/investment_project', {
          body: {
            count: 0,
            results: [],
          },
        }).as('apiRequest')
        cy.visit(
          urls.companies.overview.index(fixtures.company.noOverviewDetails.id)
        )
      })
      it('the card should contain a message outling there are no active investments', () => {
        cy.get('[data-test="activeInvestmentProjectsContainer"]')
          .children()
          .first()
          .contains('Active investment projects')
          .next()
          .children()
          .contains('There are no active investments')
      })
      it('the card should link to the investment page', () => {
        cy.get('[data-test="investments-page-link"]')
          .contains('View all investments')
          .click()
        cy.location('pathname').should(
          'eq',
          `${urls.companies.investments.companyInvestmentProjects(
            '1111ae21-2895-47cf-90ba-9273c94dab88'
          )}`
        )
        cy.go('back')
      })
    }
  )
  context('Accolades card', () => {
    const KINGS_AWARDS_ENDPOINT = `/api-proxy/v4/company/${companyGlobalUltimateAllDetails.id}/kings-awards`
    const COMPANY_ENDPOINT = `/api-proxy/v4/company/${companyGlobalUltimateAllDetails.id}`
    const OVERVIEW_URL = urls.companies.overview.index(
      companyGlobalUltimateAllDetails.id
    )

    const noAwards = []

    const singleAward = [
      {
        id: 'award-1',
        yearAwarded: 2025,
        category: 'International Trade',
        citation: 'For outstanding achievement in international trade.',
        yearExpired: 2030,
      },
    ]

    const multipleAwards = [
      {
        id: 'award-1',
        yearAwarded: 2025,
        category: 'International Trade',
        citation: 'For outstanding achievement in international trade.',
        yearExpired: 2030,
      },
      {
        id: 'award-2',
        yearAwarded: 2024,
        category: 'Innovation',
        citation: 'For groundbreaking innovation in widget technology.',
        yearExpired: 2029,
      },
    ]

    context("when the company has no King's Awards", () => {
      beforeEach(() => {
        cy.intercept(
          'GET',
          COMPANY_ENDPOINT,
          companyGlobalUltimateAllDetails
        ).as('getCompany')
        cy.intercept('GET', KINGS_AWARDS_ENDPOINT, {
          statusCode: 200,
          body: noAwards,
        }).as('getKingsAwards')
        cy.visit(OVERVIEW_URL)
        cy.wait(['@getCompany', '@getKingsAwards'])
      })

      it('should not display the Accolades card', () => {
        cy.get('[data-test="accolades-container"]').should('not.exist')
      })
    })

    context("when the company has one King's Award", () => {
      beforeEach(() => {
        cy.intercept(
          'GET',
          COMPANY_ENDPOINT,
          companyGlobalUltimateAllDetails
        ).as('getCompany')
        cy.intercept('GET', KINGS_AWARDS_ENDPOINT, {
          statusCode: 200,
          body: singleAward,
        }).as('getKingsAwards')
        cy.visit(OVERVIEW_URL)
        cy.wait(['@getCompany', '@getKingsAwards'])
      })

      it('should display the Accolades card', () => {
        cy.get('[data-test="accolades-container"]').should('exist')
      })

      it('should display the Accolades summary table with the correct number of accolades', () => {
        assertSummaryTable({
          dataTest: 'accolades-container',
          content: {
            'Number of accolades': '1',
          },
        })
      })

      it("should display the King's Award details table correctly", () => {
        cy.get('[data-test="kings-award-container"]').should('exist')
        assertSummaryTable({
          dataTest: 'kings-award-container',
          content: {
            'Year awarded': singleAward[0].yearAwarded.toString(),
            'Award category': singleAward[0].category,
            Reason: singleAward[0].citation,
            'Award expiry year': singleAward[0].yearExpired.toString(),
          },
        })
      })
    })

    context("when the company has multiple King's Awards", () => {
      const award1 = multipleAwards[0]
      const award2 = multipleAwards[1]
      beforeEach(() => {
        cy.intercept(
          'GET',
          COMPANY_ENDPOINT,
          companyGlobalUltimateAllDetails
        ).as('getCompany')
        cy.intercept('GET', KINGS_AWARDS_ENDPOINT, {
          statusCode: 200,
          body: multipleAwards,
        }).as('getKingsAwards')
        cy.visit(OVERVIEW_URL)
        cy.wait(['@getCompany', '@getKingsAwards'])
      })

      it('should display the Accolades card', () => {
        cy.get('[data-test="accolades-container"]').should('exist')
      })

      it('should display the Accolades summary table with the correct number of accolades', () => {
        assertSummaryTable({
          dataTest: 'accolades-container',
          content: {
            'Number of accolades': multipleAwards.length.toString(),
          },
        })
      })

      it("should display details tables for all King's Awards", () => {
        cy.get('[data-test="kings-award-container"]').should(
          'have.length',
          multipleAwards.length
        )

        cy.get('[data-test="kings-award-container"]')
          .eq(0)
          .within(() => {
            cy.contains('Year awarded')
              .parent()
              .contains(award1.yearAwarded.toString())
            cy.contains('Award category').parent().contains(award1.category)
            cy.contains('Reason').parent().contains(award1.citation)
            cy.contains('Award expiry year')
              .parent()
              .contains(award1.yearExpired.toString())
          })

        cy.get('[data-test="kings-award-container"]')
          .eq(1)
          .within(() => {
            cy.contains('Year awarded')
              .parent()
              .contains(award2.yearAwarded.toString())
            cy.contains('Award category').parent().contains(award2.category)
            cy.contains('Reason').parent().contains(award2.citation)
            cy.contains('Award expiry year')
              .parent()
              .contains(award2.yearExpired.toString())
          })
      })
    })
  })
})
