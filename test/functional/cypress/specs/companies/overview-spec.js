const {} = require('../../support/assertions')
const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

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
  const companyBusinessDetailsUrlAllOverview = urls.companies.businessDetails(
    fixtures.company.allOverviewDetails.id
  )
  const companyAdivsersUrlAllOverview = urls.companies.advisers.index(
    fixtures.company.allOverviewDetails.id
  )
  const companyExportsAllOverview = urls.companies.exports.index(
    fixtures.company.allOverviewDetails.id
  )
  context(
    'when viewing company overview the tab should display Overview',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
        )
      })

      it('tab should contain the text Overview', () => {
        cy.get('[data-test="tabbedLocalNavList"]')
          .children()
          .children()
          .should('contain.text', 'Overview')
      })
    }
  )
  context(
    'when viewing the Business details card for a business that has all information added',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
        )
      })

      it('the card should contain the Business details table including all keys and values for All Overview Details Inc.', () => {
        cy.get('[data-test="businessDetailsContainer"]')
          .children()
          .first()
          .contains('Business details')
          .next()
          .children()
        cy.get('th').contains('Companies House')
        cy.get('[data-test="companies-house-link"]')
          .contains('01261539')
          .invoke('attr', 'href')
          .should('eq', 'https://beta.companieshouse.gov.uk/company/01261539')
        cy.get('th').contains('Trading Address')
        cy.get('td').children()
        cy.get('li')
          .contains('Unit 10 Ockham Drive')
          .parent()
          .parent()
          .parent()
          .next()
        cy.get('th').contains('Website')
        cy.get('td')
          .contains('http://all-the-details.com')
          .parent()
          .parent()
          .next()
        cy.get('th').contains('Turnover')
        cy.get('td').contains('£720,000').parent().next()
        cy.get('th').contains('Number of Employees')
        cy.get('td').contains('260').parent().next()
        cy.get('th').contains('DBT Sector')
        cy.get('td').contains('Retail')
      })

      it('the card should link to the business overview page', () => {
        cy.get('[data-test="business-page-link"]')
          .contains('View full business details')
          .click()
        cy.location('pathname').should(
          'eq',
          companyBusinessDetailsUrlAllOverview
        )
        cy.go('back')
      })
    }
  )
  context(
    'when viewing the Business details card for a business that has no information added',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.noOverviewDetails.id)
        )
      })

      it('the card should contain the Business details table with all values set to "Not set"', () => {
        cy.get('[data-test="businessDetailsContainer"]')
          .children()
          .first()
          .contains('Business details')
          .next()
          .children()
        cy.get('th')
          .contains('Companies House')
          .siblings()
          .contains('td', 'Not set')
        cy.get('th')
          .contains('Trading Address')
          .siblings()
          .contains('td', 'Not set')
        cy.get('th').contains('Website').siblings().contains('td', 'Not set')
        cy.get('th').contains('Turnover').siblings().contains('td', 'Not set')
        cy.get('th')
          .contains('Number of Employees')
          .siblings()
          .contains('td', 'Not set')
        cy.get('th').contains('DBT Sector').siblings().contains('td', 'Not set')
      })
    }
  )
  context(
    'when viewing the Account management card for a business that has all information added',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
        )
      })

      it('the card should contain the Account management table including all keys and values then load 2 more contacts', () => {
        cy.get('[data-test="accountManagementContainer"]')
          .children()
          .first()
          .contains('Account Management')
          .next()
          .children()
        cy.get('th')
          .contains('DBT Region')
          .siblings()
          .contains('td', 'South East')
        cy.get('th')
          .contains('Account Manager')
          .siblings()
          .contains('td', 'Billy Bob')
        cy.get('th')
          .contains('One List')
          .siblings()
          .contains('td', 'Tier A - SRM Programme Accounts')
        cy.get('th')
          .contains('Primary Contact(s)')
          .siblings()
          .contains('li', 'Max Speed')
        cy.get('th')
          .contains('Primary Contact(s)')
          .siblings()
          .contains('li', 'Max Weight')
        cy.get('th')
          .contains('Primary Contact(s)')
          .siblings()
          .contains('li', 'View 2 more contacts')
          .click()
        cy.get('th')
          .contains('Primary Contact(s)')
          .siblings()
          .contains('li', 'Max Height')
        cy.get('th')
          .contains('Primary Contact(s)')
          .siblings()
          .contains('li', 'Baz Slow')
      })

      it('the card should link to the account management overview page', () => {
        cy.get('[data-test="account-management-page-link"]')
          .contains('View full account management')
          .click()
        cy.location('pathname').should('eq', companyAdivsersUrlAllOverview)
        cy.go('back')
      })
    }
  )
  context(
    'when viewing the Account management  card for a business that has no information added',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.noOverviewDetails.id)
        )
      })

      it('the card should contain the Account management table with all values set to "Not set"', () => {
        cy.get('[data-test="accountManagementContainer"]')
          .children()
          .first()
          .contains('Account Management')
          .next()
          .children()
        cy.get('th').contains('DBT Region').siblings().contains('td', 'Not set')
        cy.get('th')
          .contains('Account Manager')
          .siblings()
          .contains('td', 'Not set')
        cy.get('th').contains('One List').siblings().contains('td', 'Not set')
        cy.get('th')
          .contains('Primary Contact(s)')
          .siblings()
          .contains('td', 'Not set')
      })
    }
  )
  context('clicking a primary contact on the account management card', () => {
    before(() => {
      cy.visit(
        urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
      )
    })

    it('should click on a primary contact and take you the contacts page', () => {
      cy.get('[data-test="accountManagementContainer"]')
        .children()
        .first()
        .contains('Account Management')
        .next()
        .children()
      cy.get('th')
        .contains('Primary Contact(s)')
        .siblings()
        .contains('a', 'Max Speed')
        .click()
      cy.location('pathname').should(
        'eq',
        '/contacts/9136dd49-df67-4b2b-b241-6b64a662f1af/details'
      )
      cy.go('back')
    })
  })
  context('clicking on the Lead ITA on the account management card', () => {
    before(() => {
      cy.visit(
        urls.companies.overview.index(fixtures.company.oneListTierDita.id)
      )
    })

    it('should click on the Lead ITA and take you the contacts page', () => {
      cy.get('[data-test="accountManagementContainer"]')
        .children()
        .first()
        .contains('Account Management')
        .next()
        .children()
      cy.get('th')
        .contains('Lead ITA')
        .siblings()
        .contains('a', 'Travis Greene')
        .click()
      cy.location('pathname').should(
        'eq',
        `/companies/${fixtures.company.oneListTierDita.id}/advisers`
      )
      cy.go('back')
    })
  })
  context(
    'clicking on the Account Manager on the account management card',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
        )
      })

      it('should click on the Account Manager and take you the contacts page', () => {
        cy.get('[data-test="accountManagementContainer"]')
          .children()
          .first()
          .contains('Account Management')
          .next()
          .children()
        cy.get('th')
          .contains('Account Manager')
          .siblings()
          .contains('a', 'Billy Bob')
          .click()
        cy.location('pathname').should(
          'eq',
          `/companies/${fixtures.company.allOverviewDetails.id}/advisers`
        )
        cy.go('back')
      })
    }
  )

  context(
    'when viewing the export status card for a business that has all information added',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
        )
      })

      it('the card should contain the export status table including all keys and value', () => {
        cy.get('[data-test="exportStatusContainer"]')
          .children()
          .first()
          .contains('Export status')
          .next()
          .children()
        cy.get('th')
          .contains('Export potential')
          .siblings()
          .contains('td', 'High')
        cy.get('th')
          .contains('Export sub-segment')
          .siblings()
          .contains('td', 'Sustain: Nurture & grow')
        cy.get('th')
          .contains('Currently exporting to')
          .siblings()
          .contains('td', 'Western Sahara')
        cy.get('th')
          .contains('Last export win')
          .siblings()
          .contains('td', '04 Dec 2019, Burkina Faso')
        cy.get('th')
          .contains('Total exports won')
          .siblings()
          .contains('td', '8')
        cy.get('th')
          .contains('Future countries of interest')
          .siblings()
          .contains('td', 'Yemen')
      })

      it('the card should link to the export status overview page', () => {
        cy.get('[data-test="export-status-page-link"]')
          .contains('View full export details')
          .click()
        cy.location('pathname').should('eq', companyExportsAllOverview)
        cy.go('back')
      })
      it('the card should link to the export history page of the specific country', () => {
        cy.get('[data-test="export-status-currently-exporting-to-link"]')
          .contains('Western Sahara')
          .click()
        cy.location('pathname').should(
          'eq',
          `${companyExportsAllOverview}/history/36afd8d0-5d95-e211-a939-e4115bead28a`
        )
        cy.go('back')
      })
      it('the card should link to the future countries of interest', () => {
        cy.get('[data-test="export-status-country-of-interest-link"]')
          .contains('Yemen')
          .click()
        cy.location('pathname').should(
          'eq',
          `${companyExportsAllOverview}/history/37afd8d0-5d95-e211-a939-e4115bead28a`
        )
        cy.go('back')
      })
    }
  )
  context(
    'when viewing the Export Status Card for a business that has no information added',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.noOverviewDetails.id)
        )
      })

      it('the card should contain the Export Status table with all values set to "Not set"', () => {
        cy.get('[data-test="exportStatusContainer"]')
          .children()
          .first()
          .contains('Export status')
          .next()
          .children()
        cy.get('th')
          .contains('Export potential')
          .siblings()
          .contains('td', 'Not set')
        cy.get('th')
          .contains('Export sub-segment')
          .siblings()
          .contains('td', 'Not set')
        cy.get('th')
          .contains('Currently exporting to')
          .siblings()
          .contains('td', 'Not set')

        cy.get('th')
          .contains('Future countries of interest')
          .siblings()
          .contains('td', 'Not set')
        cy.get('th')
          .contains('Last export win')
          .siblings()
          .contains('td', 'No export wins recorded')
        cy.get('th')
          .contains('Total exports won')
          .siblings()
          .contains('td', '0')
      })
    }
  )
  context(
    'when viewing the investment status card for a business that has all information added',
    () => {
      before(() => {
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
          '/companies/ba8fae21-2895-47cf-90ba-9273c94dab88/investments/projects'
        )
        cy.go('back')
      })
    }
  )

  context('when viewing the Recent Activities Card for a business', () => {
    before(() => {
      cy.visit(
        urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
      )
    })

    it('the card should contain the Recent activity heading and add interaction link', () => {
      cy.get('[data-test="Recent activityCardContainer"]')
        .children()
        .first()
        .contains('Recent activity')
        .children()
        .contains('Add interaction')
        .click()
      cy.location('pathname').should('eq', addInteractionUrlAllOverview)
      cy.go('back')
    })
    it('the card should contain three activities', () => {
      cy.get('[data-test="Recent activityCardContainer"]')
        .find('ol')
        .children()
        .should('have.length', 3)
    })
    it('the card should link to the activity overview page', () => {
      cy.get('[data-test="Recent activityCardContainer"]')
        .contains('View all activities')
        .click()
      cy.location('pathname').should('eq', allActivityUrlAllOverview)
      cy.go('back')
    })
  })

  context(
    'when viewing the Recent Activities Card for a business with no activities',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.noOverviewDetails.id)
        )
      })

      it('the card should contain the Recent activity heading and add interaction link', () => {
        cy.get('[data-test="Recent activityCardContainer"]')
          .children()
          .first()
          .contains('Recent activity')
          .children()
          .contains('Add interaction')
          .click()
        cy.location('pathname').should('eq', addInteractionUrlNoOverview)
        cy.go('back')
        cy.get('[data-test="noActivities"]').contains(
          'There are no activities to show.'
        )
      })
    }
  )

  context('when viewing the Upcoming Activities Card for a business', () => {
    before(() => {
      cy.visit(
        urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
      )
    })

    it('the card should contain the Upcoming activity heading and add interaction link', () => {
      cy.get('[data-test="Upcoming activityCardContainer"]')
        .children()
        .first()
        .contains('Upcoming activity')
        .children()
        .contains('Add interaction')
        .click()
      cy.location('pathname').should('eq', addInteractionUrlAllOverview)
      cy.go('back')
    })
    it('the card should contain two activities', () => {
      cy.get('[data-test="Upcoming activityCardContainer"]')
        .find('ol')
        .children()
        .should('have.length', 2)
    })
    it('the card should link to the activity overview page', () => {
      cy.get('[data-test="Recent activityCardContainer"]')
        .contains('View all activities')
        .click()
      cy.location('pathname').should('eq', allActivityUrlAllOverview)
      cy.go('back')
    })
  })

  context(
    'when viewing the Upcoming Activities Card for a business with no activities',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.noOverviewDetails.id)
        )
      })

      it('the card should contain the upcoming activity heading and add interaction link', () => {
        cy.get('[data-test="Upcoming activityCardContainer"]')
          .children()
          .first()
          .contains('Upcoming activity')
          .children()
          .contains('Add interaction')
          .click()
        cy.location('pathname').should('eq', addInteractionUrlNoOverview)
        cy.go('back')
        cy.get('[data-test="noActivities"]').contains(
          'There are no activities to show.'
        )
      })
    }
  )

  context('when viewing all activity cards types', () => {
    before(() => {
      cy.visit(urls.companies.overview.index(fixtures.company.venusLtd.id))
    })

    it('should display aventri event activity,', () => {
      cy.get('[data-test="aventri-event-summary"]')
        .children()
        .first()
        .contains('02 Mar 2021 to 04 May 2022')
        .next()
        .children()
        .contains('Aventri Event')
      cy.get('[data-test="activity-summary-subject"]')
        .children()
        .contains('a', 'EITA Test Event 2022')
    })
    it('should display exporters record activity,', () => {
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
    it('should display company activity,', () => {
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
    it('should display accountss record activity,', () => {
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
    it('should display new order activity,', () => {
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
    it('should display outstanding referral,', () => {
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
    it('should display interaction,', () => {
      cy.get('[data-test="export-support-service-summary"]')
        .children()
        .first()
        .contains('02 Dec 2022')
        .next()
        .children()
        .contains('Interaction')
      cy.get('[data-test="activity-summary-subject"]')
        .children()
        .contains('a', 'Enquiring about Exporting some things')
        .parent()
        .next()
        .contains('Enquirer')
    })
    it('should display data hub event,', () => {
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
  })

  context('no overview details', () => {})
})
